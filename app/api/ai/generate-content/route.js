import { NextResponse } from "next/server";
import { GenerateChapterContent_AI } from "@/integrations/model";

// POST - Generate chapter content using AI
export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
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
    console.error("Error generating chapter content:", error);
    return NextResponse.json(
      { error: "Failed to generate chapter content", details: error.message },
      { status: 500 }
    );
  }
}

