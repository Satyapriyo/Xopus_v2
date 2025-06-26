import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Get all messages for the conversation
    const { data: messages, error } = await supabaseAdmin
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(messages || []);
  } catch (error) {
    console.error("Messages API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { conversationId, type, content, cost, metadata } =
      await request.json();

    if (!conversationId || !type || !content) {
      return NextResponse.json(
        { error: "Conversation ID, type, and content are required" },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Create new message
    const { data: message, error } = await supabaseAdmin
      .from("messages")
      .insert({
        id: uuidv4(),
        conversation_id: conversationId,
        type,
        content,
        cost: cost || null,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Create message API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { messageId, updates } = await request.json();

    if (!messageId || !updates) {
      return NextResponse.json(
        { error: "Message ID and updates are required" },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Update message
    const { data: message, error } = await supabaseAdmin
      .from("messages")
      .update(updates)
      .eq("id", messageId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Update message API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
