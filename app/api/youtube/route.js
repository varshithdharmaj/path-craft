import { NextResponse } from "next/server";
import axios from "axios";

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";

// GET - Search for YouTube videos
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const maxResults = searchParams.get("maxResults") || "3";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    if (!process.env.YOUTUBE_API_KEY) {
      return NextResponse.json(
        { error: "YouTube API key not configured" },
        { status: 500 }
      );
    }

    const params = {
      part: "snippet",
      maxResults: parseInt(maxResults),
      key: process.env.YOUTUBE_API_KEY,
      q: query,
      type: "video",
      videoEmbeddable: true,
      relevanceLanguage: "en",
    };

    const result = await axios.get(YOUTUBE_BASE_URL + "/search", { params });

    return NextResponse.json(result.data.items, { status: 200 });
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch YouTube videos", details: error.message },
      { status: 500 }
    );
  }
}

