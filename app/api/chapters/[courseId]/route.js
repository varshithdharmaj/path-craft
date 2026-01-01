import { db } from "@/integrations/db";
import { Chapters } from "@/integrations/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// DELETE - Delete all chapters for a course
export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId } = await params;

    const result = await db
      .delete(Chapters)
      .where(eq(Chapters.courseId, courseId))
      .returning();

    return NextResponse.json({ success: true, deleted: result }, { status: 200 });
  } catch (error) {
    console.error("Error deleting chapters:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

