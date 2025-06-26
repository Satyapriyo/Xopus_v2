import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/openai";
import { getSupabaseAdmin } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const { query, walletAddress } = await request.json();

    if (!query || !walletAddress) {
      return NextResponse.json(
        { error: "Query and wallet address are required" },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Get or create user
    let { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();

    if (userError && userError.code === "PGRST116") {
      // User doesn't exist, create new user
      const { data: newUser, error: createError } = await supabaseAdmin
        .from("users")
        .insert({
          id: uuidv4(),
          wallet_address: walletAddress,
          credits: 0,
          total_spent: 0,
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }
      user = newUser;
    } else if (userError) {
      throw userError;
    }

    const queryPrice = parseFloat(process.env.QUERY_PRICE_USD || "0.10");

    // Check if user has sufficient credits
    if (user.credits < queryPrice) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    // Generate AI response
    let answer;
    try {
      answer = await generateAIResponse(query);
    } catch (aiError: any) {
      console.error("❌ AI generation failed:", aiError);
      return NextResponse.json(
        {
          error: "AI service error",
          details: aiError.message,
          type: "ai_error",
        },
        { status: 503 }
      );
    }

    // Deduct credits and update user
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        credits: user.credits - queryPrice,
        total_spent: user.total_spent + queryPrice,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      throw updateError;
    }

    // Save query to database
    const { error: queryError } = await supabaseAdmin.from("queries").insert({
      id: uuidv4(),
      user_id: user.id,
      question: query,
      answer: answer,
      cost: queryPrice,
      created_at: new Date().toISOString(),
    });

    if (queryError) {
      console.error("Failed to save query:", queryError);
      // Don't fail the request if we can't save to DB
    }

    return NextResponse.json({
      answer,
      cost: queryPrice,
      remainingCredits: user.credits - queryPrice,
    });
  } catch (error: any) {
    console.error("❌ Query API error:", {
      message: error.message,
      stack: error.stack?.substring(0, 500),
      code: error.code,
    });

    // Return more specific error messages
    if (error.message?.includes("AI service error")) {
      return NextResponse.json(
        {
          error: error.message,
          type: "ai_error",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
        type: "server_error",
      },
      { status: 500 }
    );
  }
}
