"use client";
import { DarkThemeToggle } from "flowbite-react";
import { Alert } from "flowbite-react";
import { useEffect, useState } from "react";

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
    console.log(result);
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
      <h1 className="text-2xl dark:text-white">Flowbite React + Next.js</h1>
      <DarkThemeToggle />
      <Alert color={"info"}>This is a blue alert</Alert>
    </main>
  );
}
