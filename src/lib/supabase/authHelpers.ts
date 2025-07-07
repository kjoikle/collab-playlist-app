import { createClient } from "@/lib/supabase/server";

/**
 * Checks for a valid authenticated user in Supabase.
 * Returns `{ user }` if authenticated, or `{ error, status }` for error responses.
 */
export async function requireAuthenticatedUser() {
  const supabase = await createClient();

  // Check user authentication
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return {
      error: {
        error: "Not authenticated. Please log in.",
      },
      status: 401,
    };
  }

  return { user: userData.user };
}

// TODO: verify that this is okay because accessing session from server side

/**
 * Checks for a valid authenticated user and session in Supabase.
 * Returns `{ user, session }` if authenticated, or `{ error, status }` for error responses.
 */
export async function getAuthenticatedUserAndSession() {
  const supabase = await createClient();

  // Check user authentication
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return {
      error: {
        error: "Not authenticated. Please log in.",
      },
      status: 401,
    };
  }

  // Get the session to access the provider token
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError || !sessionData?.session) {
    return {
      error: {
        error: "No session found. Please re-authenticate.",
      },
      status: 401,
    };
  }

  return { user: userData.user, session: sessionData.session };
}
