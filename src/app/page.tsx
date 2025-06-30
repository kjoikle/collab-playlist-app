import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-indigo-500 mb-8 text-center">
        Welcome to Project Meow
      </h1>
      <div className="flex justify-center">
        <Link href="/login">
          <button className="cursor-pointer bg-indigo-500 text-white rounded-lg px-8 py-3 text-lg shadow-md hover:bg-indigo-600 transition-colors">
            Go to Login
          </button>
        </Link>
      </div>
    </div>
  );
}
