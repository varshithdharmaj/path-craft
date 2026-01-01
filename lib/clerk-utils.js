import { currentUser } from "@clerk/nextjs/server";

/**
 * Get user email from Clerk
 * Tries currentUser first (more efficient), falls back to API call if needed
 * @param {string} userId - Clerk user ID
 * @returns {Promise<string>} User email address
 * @throws {Error} If email cannot be retrieved
 */
export async function getUserEmailFromClerk(userId) {
  // Validate CLERK_SECRET_KEY exists
  if (!process.env.CLERK_SECRET_KEY) {
    console.error("CLERK_SECRET_KEY is not set in environment variables");
    throw new Error("CLERK_SECRET_KEY is not configured");
  }

  if (!userId) {
    throw new Error("User ID is required to fetch email");
  }

  try {
    // Try using currentUser first (more efficient)
    try {
      const user = await currentUser();
      if (user?.emailAddresses?.[0]?.emailAddress) {
        return user.emailAddresses[0].emailAddress;
      }
    } catch (currentUserError) {
      // currentUser() might fail in some contexts, fall through to API call
      console.warn("currentUser() failed, falling back to API call:", currentUserError.message);
    }

    // Fallback to API call if currentUser doesn't have email or fails
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = `HTTP ${response.status}`;
      }
      console.error(`Clerk API error (${response.status}):`, errorText);
      throw new Error(`Failed to fetch user from Clerk: ${response.status} - ${errorText.substring(0, 100)}`);
    }

    const userData = await response.json();
    const userEmail = userData?.email_addresses?.[0]?.email_address;

    if (!userEmail) {
      throw new Error("User email not found in Clerk response");
    }

    return userEmail;
  } catch (error) {
    console.error("Error getting user email from Clerk:", error);
    // Re-throw with more context
    if (error.message.includes("CLERK_SECRET_KEY")) {
      throw new Error("Clerk authentication is not properly configured. Please check your environment variables.");
    }
    throw error;
  }
}

