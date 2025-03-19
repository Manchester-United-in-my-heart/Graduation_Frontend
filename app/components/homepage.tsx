"use client";
import { useEffect, useState } from "react";
import NavigationBar from "../common/components/NavigationBar";

export function Homepage() {
  const [accessToken, setAccessToken] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setAccessToken(token || "notfound");
  }, []);
  const getMe = async (accessToken: string) => {
    const response = await fetch("/api/me", {
      method: "POST",
      body: JSON.stringify({ accessToken }),
    });
    const result = await response.json();
    if (result.error) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
  };
  useEffect(() => {
    if (accessToken) {
      getMe(accessToken);
    }
  }, [accessToken]);
  if (accessToken === "notfound") {
    window.location.href = "/login";
  }
  return (
    <main className="flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
      <NavigationBar />
    </main>
  );
}
