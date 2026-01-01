/**
 * API Route: /api/ai/generate-content
 * 
 * Requires: GEMINI_API_KEY (from Google AI Studio)
 * 
 * Generates chapter content using Gemini AI.
 * Returns structured JSON error responses if API key is missing or generation fails.
 */
import { NextResponse } from "next/server";
import { GenerateChapterContent_AI } from "@/integrations/model";

// POST - Generate chapter content using AI
export async function POST(request) {
  try {
    // Validate GEMINI_API_KEY before processing
    if (!process.env.GEMINI_API_KEY && !process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        { error: "Gemini API key not configured", details: "GEMINI_API_KEY is required. Please add it to your environment variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required", details: "The 'prompt' field is required in the request body" },
        { status: 400 }
      );
    }

    const result = await GenerateChapterContent_AI.sendMessage(prompt);
    const responseText = result.response?.text();

    if (!responseText) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Try to parse JSON from the response
    let chapterContent;
    try {
      // Remove markdown code blocks if present
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      chapterContent = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return NextResponse.json(
        { error: "Failed to parse AI response", rawResponse: responseText },
        { status: 500 }
      );
    }

    return NextResponse.json(chapterContent, { status: 200 });
  } catch (error) {
    console.error("POST /api/ai/generate-content error:", error);
    
    // Handle specific error cases
    if (error.message?.includes("GEMINI_API_KEY")) {
      return NextResponse.json(
        { error: "Gemini API key not configured", details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Failed to generate chapter content", 
        details: process.env.NODE_ENV === "development" ? error.message : "AI generation failed. Please try again." 
      },
      { status: 500 }
    );
  }
}

