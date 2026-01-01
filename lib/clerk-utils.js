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

  try {
    // Try using currentUser first (more efficient)
    const user = await currentUser();
    if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress;
    }

    // Fallback to API call if currentUser doesn't have email
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Clerk API error (${response.status}):`, errorText);
      throw new Error(`Failed to fetch user from Clerk: ${response.status}`);
    }

    const userData = await response.json();
    const userEmail = userData?.email_addresses?.[0]?.email_address;

    if (!userEmail) {
      throw new Error("User email not found in Clerk response");
    }

    return userEmail;
  } catch (error) {
    console.error("Error getting user email from Clerk:", error);
    throw error;
  }
}

