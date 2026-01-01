import { db } from "@/integrations/db";
import { CourseList, Chapters } from "@/integrations/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserEmailFromClerk } from "@/lib/clerk-utils";

// GET - Get a specific course by courseId
export async function GET(request, { params }) {
  try {
    // Validate database connection
    if (!process.env.DATABASE_URL && !process.env.NEON_DATABASE_URL) {
      console.error("DATABASE_URL is not set");
      return NextResponse.json(
        { error: "Database configuration error", details: "DATABASE_URL is not set" },
        { status: 500 }
      );
    }

    const { courseId } = await params;

    // Try to get user, but allow public access to published courses
    let userId;
    let userEmail = null;
    
    try {
      const authResult = await auth();
      userId = authResult?.userId;
      
      if (userId) {
        try {
          userEmail = await getUserEmailFromClerk(userId);
        } catch (emailError) {
          console.warn("Could not get user email, allowing public access:", emailError.message);
        }
      }
    } catch (authError) {
      // Allow public access if auth fails
      console.warn("Auth check failed, allowing public access:", authError.message);
    }

    // Query course - if userEmail exists, filter by it, otherwise allow public access
    let result;
    try {
      if (userEmail) {
        result = await db
          .select()
          .from(CourseList)
          .where(
            and(
              eq(CourseList.courseId, courseId),
              eq(CourseList.createdBy, userEmail)
            )
          );
      } else {
        // Public access - only published courses
        result = await db
          .select()
          .from(CourseList)
          .where(
            and(
              eq(CourseList.courseId, courseId),
              eq(CourseList.publish, true)
            )
          );
      }
    } catch (dbError) {
      console.error("Database error fetching course:", dbError);
      return NextResponse.json(
        { error: "Failed to fetch course", details: dbError.message },
        { status: 500 }
      );
    }

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Course not found", details: "Course does not exist or you don't have access" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error("GET /api/courses/[courseId] error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: process.env.NODE_ENV === "development" ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}

// PUT - Update a course
export async function PUT(request, { params }) {
  try {
    // Validate database connection
    if (!process.env.DATABASE_URL && !process.env.NEON_DATABASE_URL) {
      console.error("DATABASE_URL is not set");
      return NextResponse.json(
        { error: "Database configuration error", details: "DATABASE_URL is not set" },
        { status: 500 }
      );
    }

    // Authenticate user
    let userId;
    try {
      const authResult = await auth();
      userId = authResult?.userId;
    } catch (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Authentication error", details: authError.message },
        { status: 401 }
      );
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", details: "User not authenticated" },
        { status: 401 }
      );
    }

    const { courseId } = await params;

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return NextResponse.json(
        { error: "Invalid request body", details: "JSON parsing failed" },
        { status: 400 }
      );
    }

    // Get user email from Clerk
    let userEmail;
    try {
      userEmail = await getUserEmailFromClerk(userId);
    } catch (emailError) {
      console.error("Error getting user email:", emailError);
      return NextResponse.json(
        { error: "Failed to get user information", details: emailError.message },
        { status: 500 }
      );
    }

    // Update course
    try {
      const result = await db
        .update(CourseList)
        .set(body)
        .where(
          and(
            eq(CourseList.courseId, courseId),
            eq(CourseList.createdBy, userEmail)
          )
        )
        .returning();

      if (result.length === 0) {
        return NextResponse.json(
          { error: "Course not found or unauthorized", details: "Course does not exist or you don't have permission" },
          { status: 404 }
        );
      }

      return NextResponse.json(result[0], { status: 200 });
    } catch (dbError) {
      console.error("Database error updating course:", dbError);
      return NextResponse.json(
        { error: "Failed to update course", details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("PUT /api/courses/[courseId] error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: process.env.NODE_ENV === "development" ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a course and its chapters
export async function DELETE(request, { params }) {
  try {
    // Validate database connection
    if (!process.env.DATABASE_URL && !process.env.NEON_DATABASE_URL) {
      console.error("DATABASE_URL is not set");
      return NextResponse.json(
        { error: "Database configuration error", details: "DATABASE_URL is not set" },
        { status: 500 }
      );
    }

    // Authenticate user
    let userId;
    try {
      const authResult = await auth();
      userId = authResult?.userId;
    } catch (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Authentication error", details: authError.message },
        { status: 401 }
      );
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", details: "User not authenticated" },
        { status: 401 }
      );
    }

    const { courseId } = await params;

    // Get user email from Clerk
    let userEmail;
    try {
      userEmail = await getUserEmailFromClerk(userId);
    } catch (emailError) {
      console.error("Error getting user email:", emailError);
      return NextResponse.json(
        { error: "Failed to get user information", details: emailError.message },
        { status: 500 }
      );
    }

    // First, get the course to check ownership
    let course;
    try {
      course = await db
        .select()
        .from(CourseList)
        .where(
          and(
            eq(CourseList.courseId, courseId),
            eq(CourseList.createdBy, userEmail)
          )
        );
    } catch (dbError) {
      console.error("Database error checking course ownership:", dbError);
      return NextResponse.json(
        { error: "Failed to verify course ownership", details: dbError.message },
        { status: 500 }
      );
    }

    if (course.length === 0) {
      return NextResponse.json(
        { error: "Course not found or unauthorized", details: "Course does not exist or you don't have permission" },
        { status: 404 }
      );
    }

    // Delete chapters first
    try {
      await db
        .delete(Chapters)
        .where(eq(Chapters.courseId, courseId));
    } catch (dbError) {
      console.error("Database error deleting chapters:", dbError);
      // Continue with course deletion even if chapter deletion fails
    }

    // Delete course
    try {
      const result = await db
        .delete(CourseList)
        .where(
          and(
            eq(CourseList.courseId, courseId),
            eq(CourseList.createdBy, userEmail)
          )
        )
        .returning();

      return NextResponse.json({ success: true, deleted: result[0] }, { status: 200 });
    } catch (dbError) {
      console.error("Database error deleting course:", dbError);
      return NextResponse.json(
        { error: "Failed to delete course", details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("DELETE /api/courses/[courseId] error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: process.env.NODE_ENV === "development" ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}

