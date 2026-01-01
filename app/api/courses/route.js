import { db } from "@/integrations/db";
import { CourseList } from "@/integrations/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET - Get all courses for the authenticated user or published courses
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    // If requesting published courses (for showcase), return all published courses
    if (published === "true") {
      const result = await db
        .select()
        .from(CourseList)
        .where(eq(CourseList.publish, true))
        .orderBy(desc(CourseList.id));

      return NextResponse.json(result, { status: 200 });
    }

    // Otherwise, get courses for authenticated user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user email from Clerk
    const user = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then((res) => res.json());

    const userEmail = user?.email_addresses?.[0]?.email_address;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList.createdBy, userEmail))
      .orderBy(desc(CourseList.id));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new course
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
    const { courseId, name, level, category, courseOutput, includeVideo, userName, userProfileImage, courseBanner } = body;

    // Get user email from Clerk
    const user = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then((res) => res.json());

    const userEmail = user?.email_addresses?.[0]?.email_address;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    const result = await db.insert(CourseList).values({
      courseId,
      name,
      level,
      category,
      courseOutput,
      createdBy: userEmail,
      userName: userName || user?.full_name || user?.first_name,
      includeVideo: includeVideo || "Yes",
      userProfileImage: userProfileImage || user?.image_url,
      courseBanner: courseBanner || "/placeholder.png",
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

