"use client";

import { useEffect, useState } from "react";
import { IProject } from "@/app/common/interfaces/interfaces";
import PublishedBookDetail from "./PublicBookDetail";
import { convertBackendProjectToFrontendProject } from "@/app/common/helpers/convert_data";

interface Props {
  projectId: string;
}

export default function PublishedBookPage(props: Props) {
  const projectId = props.projectId;
  const [book, setBook] = useState<any | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/published_books/${parseInt(projectId)}`,
        { cache: "no-store" },
      );
      const result = await response.json();
      if (result.published_book) {
        setBook(convertBackendProjectToFrontendProject(result.published_book));
      }
    };
    fetchData();
  }, []);
  return book ? (
    <PublishedBookDetail project={book} />
  ) : (
    <div className="flex h-screen items-center justify-center">
      <span className="loading loading-bars loading-lg"></span>
    </div>
  );
}
