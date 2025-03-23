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
  const [isRequesting, setIsRequesting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const projectId = props.projectId;
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [currentPageOfPages, setCurrentPageOfPages] = useState(0);
  const pagesPerPage = 10;
  const [listOfPagesDivided, setListOfPagesDivided] = useState<IPage[][]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

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
    setIsRequesting(true);
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch(`/api/projects/${projectId}/request`, {
      method: "POST",
      body: JSON.stringify({ accessToken }),
    });
    const result = await response.json();
    setIsRequesting(false);
    if (result.download_link) {
      window.open(result.download_link, "_blank");
    } else {
      alert("Lỗi");
    }
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

  const handleUploadModal = () => {
    setShowUploadModal(!showUploadModal);
  };

  const handleUploadFile = async (event: any) => {
    event.preventDefault();
    setIsUploading(true);
    const accessToken = localStorage.getItem("access_token");
    const formData = new FormData();
    if (accessToken) {
      formData.append("accessToken", accessToken);
    }
    formData.append("projectId", projectId);
    if (file) {
      formData.append("file", file);
    }
    const response = await fetch(`/api/projects/${projectId}/upload`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    setIsUploading(false);
    if (result.filenames) {
      alert("Tải lên thành công");
      window.location.reload();
    } else {
      alert("Lỗi");
    }
  };

  return projectData === null ? (
    <div className="flex h-screen items-center justify-center">
      <span className="loading loading-bars loading-lg"></span>
    </div>
  ) : (
    <div>
      <div className="flex justify-center text-4xl">
        {projectData?.project?.name}
      </div>
      <blockquote className="relative my-4 p-4">
        <span className="icon-[tabler--quote] absolute -start-3 -top-3 size-16 rotate-180 text-base-300/80 rtl:rotate-0"></span>
        <div className="relative z-[1]">
          <p className="text-lg text-base-content">
            <em>{projectData?.project?.description}</em>
          </p>
        </div>
      </blockquote>
      <div>Ngày tạo: {projectData?.project?.createdAt.toDateString()}</div>
      <div>Người tạo: {projectData?.project?.username}</div>
      <div className="flex justify-around">
        <button
          onClick={() => {
            handleRequestFile();
          }}
          className="btn btn-primary btn-soft"
        >
          {isRequesting && <span className="loading loading-spinner"></span>}
          Yêu cầu File Epub{" "}
          <span className="icon-[material-symbols--cloud-download]"></span>
        </button>
        <div className="flex-col items-center">
          <button
            onClick={handleUploadModal}
            className="btn btn-primary btn-soft w-60"
          >
            Tải lên ảnh
            <span className="icon-[material-symbols--cloud-upload]"></span>
          </button>
          {showUploadModal && (
            <form
              onSubmit={handleUploadFile}
              className="mt-4 w-60 flex-col"
              id="form"
            >
              <input
                type="file"
                className="input max-w-sm"
                aria-label="file-input"
                onChange={handleFileChange}
              />
              <button type="submit" className="btn btn-primary btn-soft w-60">
                {isUploading && (
                  <span className="loading loading-spinner"></span>
                )}
                Tải lên
              </button>
            </form>
          )}
        </div>
      </div>
      {
        <div className="my-4 grid h-[500px] grid-cols-2  justify-center gap-4">
          {listOfPagesDivided[currentPageOfPages]?.map((page) => (
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
