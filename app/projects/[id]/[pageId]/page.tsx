"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PageInProject from "./components/Page";
import Paginator from "./components/Paginator";

const Page = () => {
  const params = useParams();
  const { id, pageId } = params;
  const [imageLink, setImageLink] = useState<string | null>(null);
  const [otherPages, setOtherPages] = useState<any[] | null>(null);
  const [rawResult, setRawResult] = useState<any[] | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const fetchData = async () => {
      const response = await fetch(`/api/pages`, {
        method: "POST",
        body: JSON.stringify({
          accessToken: accessToken,
          projectId: id,
          pageId: pageId,
        }),
      });
      const result = await response.json();
      setImageLink(result.image_link);
      setOtherPages(result.other_pages);
      setRawResult(result.raw_result);
      console.log(imageLink);
      console.log(otherPages);
      console.log(rawResult);
    };
    fetchData();
  }, []);

  return (
    <>
      {imageLink && otherPages && rawResult ? (
        <div>
          <Paginator
            projectId={parseInt(id)}
            currentPage={parseInt(pageId)}
            listOfPagesAndId={otherPages}
          />
          <PageInProject
            imageUrl={imageLink}
            boxes={rawResult}
            projectId={parseInt(id)}
            pageId={parseInt(pageId)}
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default Page;
