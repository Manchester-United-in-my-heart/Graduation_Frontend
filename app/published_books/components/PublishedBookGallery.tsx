"use client";

import { IProject } from "@/app/common/interfaces/interfaces";
import { useEffect, useState } from "react";
import FlyonuiScript from "@/app/common/components/FlyonuiScript";
import HoveringLabel from "@/app/projects/components/HoveringLabel";

interface IPublishedBooksProps {
  projects: IProject[] | null;
}

export default function PublishedBooksGallery(props: IPublishedBooksProps) {
  const projects = props.projects;
  const numberOfProjects = projects !== null ? projects.length : 0;
  const carouselProjects =
    numberOfProjects > 4 ? projects?.slice(0, 4) : projects;
  const listProjects = numberOfProjects > 4 ? projects?.slice(4) : [];

  const numberOfListProjectPages = Math.ceil(listProjects.length / 6);

  const listProjectsDividedByPages = [];
  for (let i = 0; i < numberOfListProjectPages; i++) {
    listProjectsDividedByPages.push(listProjects.slice(i * 6, i * 6 + 6));
  }

  const [currentPage, setCurrentPage] = useState(0);

  const nextPageHandler = () => {
    if (currentPage < numberOfListProjectPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPageHandler = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (index: number) => {
    setCurrentPage(index);
  };

  return projects !== null ? (
    <>
      <div className="my-4">
        <h1 className="text-center text-4xl font-bold">
          Danh sách dự án chia sẻ hiện có
        </h1>
      </div>
      <div
        id="image"
        data-carousel='{ "loadingClasses": "opacity-0" }'
        className="relative w-full"
      >
        <div className="carousel">
          <div className="carousel-body h-full opacity-0">
            {carouselProjects?.map((project, index) => (
              <div className="carousel-slide" key={index}>
                <a
                  href={`./published_books/${project.id}`}
                  className="relative flex h-full justify-center"
                >
                  <img
                    src={`${project.coverImage === null ? "https://i.fbcd.co/products/resized/resized-750-500/da14e415f7efb0c05bcf258aed12153dd6f4e530248b6c16d27d547a0562d146.jpg" : `data:image/png;base64,${project.coverImage}`}`}
                    className="h-96 object-cover"
                    alt="game"
                  />
                  <HoveringLabel project={project} />
                </a>
              </div>
            ))}
          </div>
        </div>
        <button type="button" className="carousel-prev">
          <span className="flex size-9.5 items-center justify-center rounded-full bg-base-100 shadow">
            <span className="icon-[tabler--chevron-left] size-5 cursor-pointer rtl:rotate-180"></span>
          </span>
          <span className="sr-only">Previous</span>
        </button>
        <button type="button" className="carousel-next">
          <span className="sr-only">Next</span>
          <span className="flex size-9.5 items-center justify-center rounded-full bg-base-100 shadow">
            <span className="icon-[tabler--chevron-right] size-5 cursor-pointer rtl:rotate-180"></span>
          </span>
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {listProjectsDividedByPages[currentPage]?.length > 0
          ? listProjectsDividedByPages[currentPage]?.map((project, index) => (
              <a
                href={`./projects/${project.id}`}
                className="relative"
                key={index}
              >
                <img
                  src={`${project.coverImage === null ? "https://i.fbcd.co/products/resized/resized-750-500/da14e415f7efb0c05bcf258aed12153dd6f4e530248b6c16d27d547a0562d146.jpg" : `data:image/png;base64,${project.coverImage}`}`}
                  className="relative h-96 object-cover"
                  alt="game"
                />
                <HoveringLabel project={project} />
              </a>
            ))
          : null}
      </div>
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
              {listProjectsDividedByPages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`btn btn-square btn-soft aria-[current='page']:text-bg-soft-primary`}
                  aria-current={currentPage === index ? "page" : undefined}
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
      <FlyonuiScript />
    </>
  ) : (
    <div>Loading ...</div>
  );
}
