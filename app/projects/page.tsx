import NavigationBar from "../common/components/NavigationBar";
import ProjectGallery from "./components/ProjectGallery";
import ModalForm from "./components/ModalForm";
export default function Projects() {
  return (
    <div className="flex min-h-screen items-start justify-center gap-2 dark:bg-gray-800">
      <NavigationBar />
      <div className="relative top-20 mx-auto w-full max-w-screen-xl p-4">
        <div className="flex justify-end">
          <ModalForm />
        </div>
        <div className="mx-auto max-w-screen-xl p-4">
          <ProjectGallery />
        </div>
      </div>
    </div>
  );
}