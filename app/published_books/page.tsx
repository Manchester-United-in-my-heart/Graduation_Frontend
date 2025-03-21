"use client";

import { IProject } from "../common/interfaces/interfaces";
import { useEffect, useState } from "react";
import NavigationBar from "../common/components/NavigationBar";
import PublishedBooksGallery from "./components/PublishedBookGallery";
import { convertBackendProjectToFrontendProject } from "../common/helpers/convert_data";
import PublishedBooks from "./components/PublishedBooks";

interface IPublishedBooksProps {
  projects: IProject[] | null;
}

const PublishedBooksPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/published_books`);
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
  return (
    <div className="flex min-h-screen items-start justify-center gap-2 dark:bg-gray-800">
      <NavigationBar />
      <div className="relative top-20 mx-auto w-full max-w-screen-xl p-4">
        <PublishedBooks />
      </div>
    </div>
  );
};

export default PublishedBooksPage;
