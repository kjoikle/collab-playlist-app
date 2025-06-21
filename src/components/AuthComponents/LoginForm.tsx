"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SpotifyLoginButton from "./SpotifyLoginButton";

// TODO: rework this to use a form? look at this example:
// "use client";
// import { useState } from "react";
// import { login } from "./actions";

// export default function LoginForm() {
//   const [error, setError] = useState<string | null>(null);

//   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setError(null);

//     const formData = new FormData(event.currentTarget);
//     const email = formData.get("email") as string;
//     const password = formData.get("password") as string;

//     const result = await login(email, password);

//     if (result.success) {
//       // Redirect on success (client-side)
//       window.location.href = "/";
//     } else {
//       setError(result.message);
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="email" type="email" required />
//       <input name="password" type="password" required />
//       <button type="submit">Login</button>
//       {error && <div style={{ color: "red" }}>{error}</div>}
//     </form>
//   );
// }

interface LoginFormProps extends React.ComponentProps<"div"> {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
}

export function LoginForm({
  className,
  login,
  signup,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSignup = async () => {
    try {
      await signup(email, password);
    } catch (error) {
      console.error("Sign Up failed:", error);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 w-full md:w-1/2 sm:w-3/4 lg:w-1/3",
        className
      )}
      {...props}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Spotify account</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <SpotifyLoginButton />
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Button
                    type="submit"
                    className="w-full"
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                  <Button
                    type="submit"
                    className="w-full"
                    onClick={handleSignup}
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  );
}
