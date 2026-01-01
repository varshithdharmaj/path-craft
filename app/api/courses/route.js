/**
 * API Route: /api/courses
 * 
 * Requires: 
 * - DATABASE_URL or NEON_DATABASE_URL (Neon Postgres connection string)
 * - CLERK_SECRET_KEY (for authenticated requests)
 * - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (for Clerk authentication)
 * 
 * FIX: Added comprehensive error handling to prevent 500 errors:
 * - Validates DATABASE_URL before any DB operations
 * - Handles Clerk auth errors gracefully
 * - Returns proper JSON error responses instead of crashing
 * - Returns empty array [] when no courses found (not an error)
 * - Client-side now reads JSON error responses for better UX
 */
import { db } from "@/integrations/db";
import { CourseList } from "@/integrations/schema";
import { desc, eq } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserEmailFromClerk } from "@/lib/clerk-utils";

// GET - Get all courses for the authenticated user or published courses
export async function GET(request) {
  try {
    // Validate database connection
    if (!process.env.DATABASE_URL && !process.env.NEON_DATABASE_URL) {
      console.error("DATABASE_URL is not set");
      return NextResponse.json(
        { error: "Database configuration error", details: "DATABASE_URL is not set" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    // If requesting published courses (for showcase), return all published courses
    if (published === "true") {
      try {
        // Validate database is accessible before querying
        if (!db || typeof db.select !== "function") {
          throw new Error("Database client is not properly initialized");
        }

        const result = await db
          .select()
          .from(CourseList)
          .where(eq(CourseList.publish, true))
          .orderBy(desc(CourseList.id));

        // Return empty array if no courses found (not an error)
        // Ensure result is always an array
        const courses = Array.isArray(result) ? result : [];
        return NextResponse.json(courses, { status: 200 });
      } catch (dbError) {
        console.error("Database error fetching published courses:", dbError);
        const errorMessage = dbError?.message || "Unknown database error";
        return NextResponse.json(
          { 
            error: "Failed to fetch published courses", 
            details: process.env.NODE_ENV === "development" ? errorMessage : "Database connection error"
          },
          { status: 500 }
        );
      }
    }

    // Otherwise, get courses for authenticated user
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

    // Fetch user's courses
    try {
      // Validate database is accessible before querying
      if (!db || typeof db.select !== "function") {
        throw new Error("Database client is not properly initialized");
      }

      const result = await db
        .select()
        .from(CourseList)
        .where(eq(CourseList.createdBy, userEmail))
        .orderBy(desc(CourseList.id));

      // Return empty array if no courses found (not an error)
      // Ensure result is always an array
      const courses = Array.isArray(result) ? result : [];
      return NextResponse.json(courses, { status: 200 });
    } catch (dbError) {
      console.error("Database error fetching user courses:", dbError);
      const errorMessage = dbError?.message || "Unknown database error";
      return NextResponse.json(
        { 
          error: "Failed to fetch courses", 
          details: process.env.NODE_ENV === "development" ? errorMessage : "Database connection error"
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("GET /api/courses error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: process.env.NODE_ENV === "development" ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}

// POST - Create a new course
export async function POST(request) {
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

    const { courseId, name, level, category, courseOutput, includeVideo, userName, userProfileImage, courseBanner } = body;

    // Validate required fields
    if (!courseId || !name || !level || !category || !courseOutput) {
      return NextResponse.json(
        { error: "Missing required fields", details: "courseId, name, level, category, and courseOutput are required" },
        { status: 400 }
      );
    }

    // Get user email from Clerk
    let userEmail;
    let userData = null;
    try {
      userEmail = await getUserEmailFromClerk(userId);
      
      // Also get full user data for fallback values
      const user = await currentUser();
      userData = user;
    } catch (emailError) {
      console.error("Error getting user email:", emailError);
      return NextResponse.json(
        { error: "Failed to get user information", details: emailError.message },
        { status: 500 }
      );
    }

    // Insert course into database
    try {
      const result = await db.insert(CourseList).values({
        courseId,
        name,
        level,
        category,
        courseOutput,
        createdBy: userEmail,
        userName: userName || userData?.fullName || userData?.firstName || null,
        includeVideo: includeVideo || "Yes",
        userProfileImage: userProfileImage || userData?.imageUrl || null,
        courseBanner: courseBanner || "/placeholder.png",
      }).returning();

      if (!result || result.length === 0) {
        throw new Error("Course creation returned no result");
      }

      return NextResponse.json(result[0], { status: 201 });
    } catch (dbError) {
      console.error("Database error creating course:", dbError);
      return NextResponse.json(
        { error: "Failed to create course", details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("POST /api/courses error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: process.env.NODE_ENV === "development" ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}

