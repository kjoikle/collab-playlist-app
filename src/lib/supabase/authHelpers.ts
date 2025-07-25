import { createClient } from "@/lib/supabase/server";

// TODO: be more rigid about permissions system

/**
 * Checks for a valid authenticated user in Supabase.
 * Returns the user if authenticated, or throws an error if not.
 */
export async function requireAuthenticatedUser() {
  const supabase = await createClient();

  // Check user authentication
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    throw new Error("Not authenticated. Please log in.");
  }

  return { user: userData.user };
}

// TODO: verify that this is okay because accessing session from server side

/**
 * Checks for a valid authenticated user and session in Supabase.
 * Returns { user, session } if authenticated, or throws an error if not.
 */
export async function getAuthenticatedUserAndSession() {
  const supabase = await createClient();

  // Check user authentication
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    throw new Error("Not authenticated. Please log in.");
  }

  // Get the session to access the provider token
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError || !sessionData?.session) {
    throw new Error("No session found. Please re-authenticate.");
  }

  return { user: userData.user, session: sessionData.session };
}
