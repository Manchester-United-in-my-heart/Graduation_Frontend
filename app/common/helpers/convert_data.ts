import { IProject, IPage } from "../interfaces/interfaces";
// Purpose: Convert data from backend to frontend

interface IBackendProject {
  id: string;
  name: string;
  description: string;
  username: string;
  is_public: boolean;
  date_created: string;
  pdf_download_link: string | null;
  epub_download_link: string | null;
  is_allow_to_train: boolean;
  cover_image: string;
}

interface IBackendPage {
  id: string;
  project_id: string;
  page_number: number;
  image_link: string;
  is_used_to_train: boolean;
}

export function convertBackendProjectToFrontendProject(
  project: IBackendProject,
): IProject {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    username: project.username,
    isPublic: project.is_public,
    createdAt: new Date(project.date_created),
    pdfDownloadLink: project.pdf_download_link,
    epubDownloadLink: project.epub_download_link,
    isAllowToTrain: project.is_allow_to_train,
    coverImage: project.cover_image,
  };
}

export function convertBackendPageToFrontendPage(page: IBackendPage): IPage {
  return {
    id: page.id,
    projectId: page.project_id,
    pageNumber: page.page_number,
    imageLink: page.image_link,
    isUsedToTrain: page.is_used_to_train,
  };
}
