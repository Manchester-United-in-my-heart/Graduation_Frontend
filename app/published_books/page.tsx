"use client";

import { useEffect, useState } from "react";

const PublishedBooksPage = () => {
  const [books, setBooks] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/published_books`);
      const result = await response.json();
      setBooks(result.published_books);
    };
    fetchData();
  }, []);
  return books.length > 0 ? (
    <div>
      <h1>Published Books</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <a href={`/published_books/${book.project_id}`}>
              {book.project_name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default PublishedBooksPage;
