"use client";

import { useEffect, useState } from "react";

interface Props {
  projectId: string;
}

export default function PublishedBookPage(props: Props) {
  const projectId = props.projectId;
  const [book, setBook] = useState<any | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/published_books/${projectId}`);
      const result = await response.json();
      setBook(result);
    };
    fetchData();
  }, []);
  return book ? (
    <div>
      <h1>{book.project_id}</h1>
      <p>{book.project_description}</p>
      <p>{book.project_name}</p>
      <div>{book.project_belongs_to}</div>
      <div>
        <a href={book.epub_download_link}> Download EPUB </a>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
