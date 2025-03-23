"use client";

import { useEffect, useState } from "react";
import DashBoard from "./Dashboard";

export default function AdminScreen() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isGottenAdminData, setIsGottenAdminData] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
    }

    const fetchAdminData = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/secret/get_dashboard_data`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );
      const result = await response.json();
      if (result.status === 400) {
        window.location.href = "/login";
      }
      console.log(result);
      setIsGottenAdminData(result);
    };

    fetchAdminData();
  }, []);

  return isGottenAdminData === null ? (
    <div className="flex h-screen items-center justify-center">
      <span className="loading loading-bars loading-lg"></span>
    </div>
  ) : (
    <div>
      <DashBoard
        pages={isGottenAdminData.pages}
        projects={isGottenAdminData.projects}
        published_books={isGottenAdminData.published_books}
        users={isGottenAdminData.users}
      />
    </div>
  );
}
