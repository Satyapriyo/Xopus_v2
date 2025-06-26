import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
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

    return NextResponse.json(user);
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, credits } = await request.json();

    if (!walletAddress || credits === undefined) {
      return NextResponse.json(
        { error: "Wallet address and credits are required" },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Update user credits
    const { data, error } = await supabaseAdmin
      .from("users")
      .update({
        credits: credits,
        updated_at: new Date().toISOString(),
      })
      .eq("wallet_address", walletAddress)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("User update API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
