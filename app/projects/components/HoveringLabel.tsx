"use client";
import { IProject } from "@/app/common/interfaces/interfaces";

interface IHoveringLabelProps {
  project: IProject;
}

export default function HoveringLabel(props: IHoveringLabelProps) {
  const project = props.project;
  return (
    <div className="absolute bottom-0 left-0 h-48 w-full bg-base-100 opacity-0 transition-opacity duration-300 hover:opacity-50">
      <div className="flex h-full flex-col items-center justify-center">
        <h2 className="text-xl font-bold">{project.name}</h2>
        <p className="text-sm">{project.description}</p>
        <p className="text-sm">{project.createdAt.toDateString()}</p>
      </div>
    </div>
  );
}
