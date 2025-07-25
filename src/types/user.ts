enum LoginMethod {
  EMAIL = "email",
  SPOTIFY = "spotify",
}

export interface User {
  id: string;
  email?: string;
  displayName?: string;
  createdAt: string;
  profilePicture?: string;
  loginMethod?: LoginMethod;
}

export interface SupabaseUser {
  id: string;
  email?: string;
  created_at: string;
  display_name?: string;
  profile_picture?: string;
  login_method?: LoginMethod;
}
