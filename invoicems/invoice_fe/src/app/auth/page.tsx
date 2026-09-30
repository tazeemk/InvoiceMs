"use client";

import { useState } from "react";
import { setAuthCookies } from "@/lib/cookies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [token, setToken] = useState("");
  const router = useRouter();

  const handleSaveToken = () => {
    if (token) {
      // The setAuthCookies function expects an object.
      // We will set a dummy refresh token and role for now.
      setAuthCookies({
        accessToken: token,
        refreshToken: "dummy-refresh-token",
        role: "ADMIN",
        user: { username: "dev-user" },
      });
      alert("Token saved! You will be redirected to the user list.");
      router.push("/user/all");
    } else {
      alert("Please enter a token.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Set Auth Token</h1>
        <p className="mb-6 text-center text-gray-600">
          This is a developer-only page to manually set the authentication token for API testing.
        </p>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Paste your Bearer token here"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <Button onClick={handleSaveToken} className="w-full bg-emerald-600 hover:bg-emerald-700">
            Save Token
          </Button>
        </div>
      </div>
    </div>
  );
}
