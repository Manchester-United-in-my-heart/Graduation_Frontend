interface PaginatorProps {
  projectId: number;
  currentPage: number;
  listOfPagesAndId: any[];
}
const Paginator = (props: PaginatorProps) => {
  const { currentPage, listOfPagesAndId } = props;
  const summary = JSON.parse(JSON.stringify(listOfPagesAndId));
  for (let i = 0; i < summary.length; i++) {
    if (summary[i].id === currentPage) {
      summary[i].isCurrent = true;
    } else {
      summary[i].isCurrent = false;
    }
  }
  // sort summary by the page number in ascending order
  summary.sort((a: any, b: any) => a.page_number - b.page_number);
  return (
    <div className="flex">
      {summary.map((page: any) => (
        <div key={page.id}>
          {page.isCurrent ? (
            <span>{page.page_number}</span>
          ) : (
            <a href={`/projects/${props.projectId}/${page.id}`}>
              {page.page_number}
            </a>
          )}
        </div>
      ))}
    </div>
  );
};
export default Paginator;
