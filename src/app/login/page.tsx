import React from "react";
import { login, signup } from "./actions";
import { LoginForm } from "@/components/AuthComponents/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex h-screen items-center justify-center w-full">
      <LoginForm login={login} signup={signup} />
    </div>
  );
};

export default LoginPage;
