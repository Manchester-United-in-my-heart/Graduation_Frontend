"use client";

import { useEffect, useState } from "react";
import { IProject, IPage } from "@/app/common/interfaces/interfaces";
import {
  convertBackendPageToFrontendPage,
  convertBackendProjectToFrontendProject,
} from "@/app/common/helpers/convert_data";
import PageCard from "./PageCard";

interface Props {
  projectId: string;
}

interface ProjectData {
  project: IProject;
  pages: IPage[];
}

export default function Project(props: Props) {
  const projectId = props.projectId;
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [currentPageOfPages, setCurrentPageOfPages] = useState(0);
  const pagesPerPage = 10;
  const [listOfPagesDivided, setListOfPagesDivided] = useState<IPage[][]>([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    const fetchData = async () => {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "POST",
        body: JSON.stringify({ accessToken }),
      });
      const result = await response.json();
      setProjectData(
        result.project
          ? {
              project: convertBackendProjectToFrontendProject(result.project),
              pages: result.pages.map((page: any) =>
                convertBackendPageToFrontendPage(page),
              ),
            }
          : null,
      );

      // Divide list of pages into pagesPerPage
      const listOfPages = result.pages.map((page: any) =>
        convertBackendPageToFrontendPage(page),
      );

      const listOfPagesDivided: IPage[][] = [];
      for (let i = 0; i < listOfPages.length; i += pagesPerPage) {
        listOfPagesDivided.push(listOfPages.slice(i, i + pagesPerPage));
      }
      setListOfPagesDivided(listOfPagesDivided);
      console.log(result);
    };
    fetchData();
  }, []);

  const handleRequestFile = async () => {
    console.log("Will request file");
  };

  const nextPageHandler = () => {
    if (currentPageOfPages < listOfPagesDivided.length - 1) {
      setCurrentPageOfPages(currentPageOfPages + 1);
    }
  };

  const previousPageHandler = () => {
    if (currentPageOfPages > 0) {
      setCurrentPageOfPages(currentPageOfPages - 1);
    }
  };

  const handlePageChange = (index: number) => {
    setCurrentPageOfPages(index);
  };

  return projectData === null ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div className="flex justify-center text-4xl">
        {projectData?.project?.name}
      </div>
      <div className="text-2xl">Mô tả: {projectData?.project?.description}</div>
      <div>Ngày tạo: {projectData?.project?.createdAt.toDateString()}</div>
      <div>Người tạo: {projectData?.project?.username}</div>
      <div>
        <button
          onClick={() => {
            handleRequestFile();
          }}
          className="btn btn-primary btn-soft"
        >
          Yêu cầu File Epub{" "}
          <span className="icon-[material-symbols--cloud-download]"></span>
        </button>
      </div>
      {
        <div className="my-4 grid h-[500px] grid-cols-2  justify-center gap-4">
          {listOfPagesDivided[currentPageOfPages].map((page) => (
            <div className="w-full justify-self-center px-20" key={page.id}>
              <PageCard page={page} />
            </div>
          ))}
        </div>
      }
      <div>
        <div>
          <div>
            <nav className="flex items-center justify-center gap-x-1">
              <button
                type="button"
                onClick={previousPageHandler}
                className="btn btn-soft"
              >
                Previous
              </button>
              <div className="flex items-center gap-x-1">
                {listOfPagesDivided.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`btn btn-square btn-soft aria-[current='page']:text-bg-soft-primary`}
                    aria-current={
                      currentPageOfPages === index ? "page" : undefined
                    }
                    onClick={() => handlePageChange(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={nextPageHandler}
                type="button"
                className="btn btn-soft"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
