"use client";

import { IProject } from "@/app/common/interfaces/interfaces";

interface IPublishedBook {
  project: IProject;
}

export default function PublishedBookDetail(props: IPublishedBook) {
  const project = props.project;
  return (
    <div>
      <h1 className="text-center text-3xl font-bold">{project.name}</h1>

      <h1 className="text-2xl font-bold">Người tạo: {project.username}</h1>
      <h1 className="text-2xl font-bold">
        Ngày tạo: {project.createdAt.toDateString()}
      </h1>
      <blockquote className="relative my-4 p-4">
        <span className="icon-[tabler--quote] absolute -start-3 -top-3 size-16 rotate-180 text-base-300/80 rtl:rotate-0"></span>

        <div className="relative z-[1]">
          <p className="text-lg text-base-content">
            <em>{project.description}</em>
          </p>
        </div>    
      </blockquote>
      <div className="flex justify-center">
        <img
          src={`${project.coverImage === null ? "https://i.fbcd.co/products/resized/resized-750-500/da14e415f7efb0c05bcf258aed12153dd6f4e530248b6c16d27d547a0562d146.jpg" : `data:image/png;base64,${project.coverImage}`}`}
          className="h-96 object-cover"
          alt="game"
        />
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => {
            window.open(project.epubDownloadLink, "_blank");
          }}
          className="btn btn-primary btn-soft"
        >
          Tải xuống File Epub
          <span className="icon-[material-symbols--cloud-download]"></span>
        </button>
      </div>
    </div>
  );
}
