import PublishedBookPage from "./components/PublishedBookPage";
import NavigationBar from "@/app/common/components/NavigationBar";
export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <div className="flex min-h-screen items-start justify-center gap-2 dark:bg-gray-800">
      <NavigationBar />
      <div className="relative top-20 mx-auto w-full max-w-screen-xl p-4">
        <PublishedBookPage projectId={projectId} />
      </div>
    </div>
  );
}
