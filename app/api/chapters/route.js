import { db } from "@/integrations/db";
import { Chapters } from "@/integrations/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET - Get chapters for a course
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const chapterId = searchParams.get("chapterId");

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    let query = db
      .select()
      .from(Chapters)
      .where(eq(Chapters.courseId, courseId));

    if (chapterId !== null) {
      query = query.where(and(
        eq(Chapters.courseId, courseId),
        eq(Chapters.chapterId, chapterId)
      ));
    }

    const result = await query;

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new chapter
export async function POST(request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { courseId, chapterId, content, videoId } = body;

    if (!courseId || chapterId === undefined || !content) {
      return NextResponse.json(
        { error: "courseId, chapterId, and content are required" },
        { status: 400 }
      );
    }

    const result = await db.insert(Chapters).values({
      courseId,
      chapterId: String(chapterId),
      content: typeof content === 'string' ? content : JSON.stringify(content),
      videoId: videoId || [],
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating chapter:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

