"use client";

import { IProject } from "@/app/common/interfaces/interfaces";
import { useEffect, useState } from "react";
import { convertBackendProjectToFrontendProject } from "@/app/common/helpers/convert_data";
import ModalButton from "./ModalButton";

export default function ProjectGallery() {
  const [projects, setProjects] = useState<IProject[] | null>(null);
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      window.location.href = "/login";
    }
    const fetchProjects = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/projects/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        },
      );
      const result = await response.json();
      setProjects(
        result.map((project: any) =>
          convertBackendProjectToFrontendProject(project),
        ),
      );
    };
    fetchProjects();
  }, []);
  return (
    <div>
      <ModalButton projects={projects} />
    </div>
  );
}
