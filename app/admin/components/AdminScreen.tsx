"use client";

import { useEffect, useState } from "react";

export default function AdminScreen() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isGottenAdminData, setIsGottenAdminData] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
    }

    const fetchAdminData = async () => {
      const response = await fetch("/api/admin", {
        method: "POST",
        body: JSON.stringify({ accessToken: token }),
      });
      const result = await response.json();
      if (result.status === 400) {
        window.location.href = "/login";
      }
      setIsGottenAdminData(result);
    };

    fetchAdminData();
  }, []);

  return isGottenAdminData === null ? (
    <div className="flex h-screen items-center justify-center">
      <span className="loading loading-bars loading-lg"></span>
    </div>
  ) : (
    <div></div>
  );
}
