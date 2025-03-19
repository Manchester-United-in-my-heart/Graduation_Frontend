"use client";

import { IProject } from "@/app/common/interfaces/interfaces";
import { useEffect, useState } from "react";
import { convertBackendProjectToFrontendProject } from "@/app/common/helpers/convert_data";
import Image from "next/image";
import ModalButton from "./ModalButton";

export default function ProjectGallery() {
  const [projects, setProjects] = useState<IProject[] | null>(null);
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      window.location.href = "/login";
    }
    const fetchProjects = async () => {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify({ accessToken }),
      });
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
