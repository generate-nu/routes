import React from "react";
import BranchRow from "./BranchRow";
import Link from "next/link";
import { DeleteButton, PauseButton, PlayButton } from "./Button";
import { api } from "~/trpc/react";
import Image from "next/image";

interface Branch {
  creator: string;
  name: string;
}

interface ProjectCardProps {
  projectName: string;
  route: string;
  branchesCount: number;
  databasesCount: number;
  instanceStatus: string;
  branches: Branch[];
  creator: string;
  createdOn: Date;
  isOpen: boolean;
  baseConnection?: string | null;
  onToggle: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectName,
  route,
  branchesCount,
  databasesCount,
  instanceStatus,
  branches,
  creator,
  createdOn,
  isOpen,
  baseConnection,
  onToggle,
}) => {
  const pauseProjectMutation = api.database.stop.useMutation();
  const startProjectMutation = api.database.start.useMutation();
  const deleteProjectMutation = api.database.delete.useMutation();

  const handlePause = () => {
    pauseProjectMutation.mutate({ repoUrl: projectName });
  };

  const handleStart = () => {
    startProjectMutation.mutate({ repoUrl: projectName });
  };

  const handleDelete = () => {
    deleteProjectMutation.mutate({ repoUrl: projectName });
  };
  return (
    <div className="bg-white text-black shadow-md">
      <div
        className={` pr-8 py-3 flex flex-row justify-between transition-colors duration-300 ${isOpen ? "bg-generate-sw" : "bg-white"}`}
      >
        <div className=" flex flex-row items-center">
          <button className=" px-12" onClick={onToggle}>
            <Image
              src="./images/ChevronIcon.svg"
              alt="Expand Project"
              width={32}
              height={32}
              className={`${isOpen && " rotate-180"} w-8 transition duration-300`}
            />
          </button>
          <span>
            <Link
              className=" underline"
              rel="noopener noreferrer"
              target="_blank"
              href={projectName.split("/").slice(0, -1).join("/")}
            >
              {projectName.split("/").slice(-2)[0]}
            </Link>{" "}
            /{" "}
            <Link
              className=" underline"
              rel="noopener noreferrer"
              target="_blank"
              href={route}
            >
              {route.split("/").slice(-1)[0]}
            </Link>{" "}
            - {branchesCount} branches - {databasesCount} databases (
            {instanceStatus})
          </span>
        </div>
        <div className="flex flex-row items-center">
          {instanceStatus.toLowerCase() !== "available" ? (
            <PlayButton onClick={handleStart} />
          ) : (
            <PauseButton onClick={handlePause} />
          )}
          <DeleteButton onClick={handleDelete} />
        </div>
      </div>
      <div
        className={`bg-gray-100 rounded-b-xl transition-all duration-300 overflow-hidden ${isOpen ? " h-max-fit h-auto" : "h-0"}`}
      >
        <div className="bg-project-row">
          {branches.map((branch, index) => (
            <BranchRow
              key={index}
              creator={branch.creator}
              name={branch.name}
              baseConnection={baseConnection}
            />
          ))}
        </div>
        <div className="flex flex-col gap-3 py-3 px-12 shadow-inner bg-white">
          <p>Created by: {creator}</p>
          <p>Created on: {createdOn.toDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
