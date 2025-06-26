import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    console.log("🧪 Testing AI with query:", query);

    const response = await generateAIResponse(query);

    return NextResponse.json({
      query,
      response,
      model: process.env.AI_MODEL || "deepseek/deepseek-chat",
      baseURL: process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ AI test failed:", error);

    return NextResponse.json(
      {
        error: error.message,
        details: {
          status: error.status,
          code: error.code,
          type: error.type,
        },
        config: {
          model: process.env.AI_MODEL || "deepseek/deepseek-chat",
          baseURL:
            process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
          hasApiKey: !!process.env.OPENAI_API_KEY,
          apiKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 20) + "...",
        },
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Test API - Use POST with { "query": "your question" }',
    config: {
      model: process.env.AI_MODEL || "deepseek/deepseek-chat",
      baseURL: process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
      hasApiKey: !!process.env.OPENAI_API_KEY,
      apiKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 20) + "...",
    },
  });
}
