"use client";

import { useEffect, useState } from "react";

interface Props {
  projectId: string;
}

interface ProjectData {
  project: any;
  pages: any[];
}

export default function Project(props: Props) {
  const projectId = props.projectId;
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    const fetchData = async () => {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "POST",
        body: JSON.stringify({ accessToken }),
      });
      const result = await response.json();
      setProjectData(result);
      console.log(result);
    };
    fetchData();
  }, []);
  const handleRequestFile = async () => {
    console.log("Will request file");
  };
  return (
    <div>
      <h1>Project {projectId}</h1>
      <div>{projectData?.project?.name}</div>
      <div>
        <button
          onClick={() => {
            handleRequestFile();
          }}
        >
          REQUEST FOR A TEXT FILE
        </button>
      </div>
      <div>
        {projectData?.pages.map((page) => (
          <div key={page.id}>
            <a href={`/projects/${projectId}/${page.id}`}>{page.id}</a>
          </div>
        ))}
      </div>
    </div>
  );
}
