import Project from "./components/Project";
import NavigationBar from "@/app/common/components/NavigationBar";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = await params;
  return (
    <div className="flex min-h-screen items-start justify-center gap-2 dark:bg-gray-800">
      <NavigationBar />
      <div className="relative top-20 mx-auto w-full max-w-screen-xl p-4">
        <Project projectId={id.id} />
      </div>
    </div>
  );
}
