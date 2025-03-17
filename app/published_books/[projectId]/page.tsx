import PublishedBookPage from "./components/PublishedBookPage";
export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return (
    <div>
      <PublishedBookPage projectId={projectId} />
    </div>
  );
}
