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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/users/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const result = await response.json();
    if (result.detail == "Invalid token") {
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
