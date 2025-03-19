export interface IProject {
  id: string;
  name: string;
  description: string;
  username: string;
  isPublic: boolean;
  createdAt: Date;
  pdfDownloadLink: string | null;
  epubDownloadLink: string | null;
  isAllowToTrain: boolean;
  coverImage: string;
}

export interface IPage {
  id: string;
  projectId: string;
  pageNumber: number;
  imageLink: string;
  isUsedToTrain: boolean;
}
