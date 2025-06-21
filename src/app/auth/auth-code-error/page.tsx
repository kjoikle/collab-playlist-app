import React from "react";

const AuthErrorPage = () => {
  return (
    <div>
      Sorry, there was an error with OAuth login :/
      <a href="/login" className="text-blue-500 hover:underline">
        Go back to login{" "}
      </a>
    </div>
  );
};

export default AuthErrorPage;
