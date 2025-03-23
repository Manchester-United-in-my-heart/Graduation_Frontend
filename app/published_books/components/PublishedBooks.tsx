"use client";
import { IProject } from "@/app/common/interfaces/interfaces";
import { useEffect, useState } from "react";
import PublishedBooksGallery from "./PublishedBookGallery";
import { convertBackendProjectToFrontendProject } from "@/app/common/helpers/convert_data";

export default function PublishedBooks() {
  const [projects, setProjects] = useState<IProject[] | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/published_books`,
        { cache: "no-store" },
      );
      const result = await response.json();
      if (result.published_books) {
        setProjects(
          result.published_books.map((project: any) =>
            convertBackendProjectToFrontendProject(project),
          ),
        );
      } else {
        setProjects([]);
      }
    };
    fetchData();
  }, []);
  return projects && projects?.length > 0 ? (
    <PublishedBooksGallery projects={projects} />
  ) : (
    <div className="flex h-screen items-center justify-center">
      <span className="loading loading-bars loading-lg"></span>
    </div>
  );
}
