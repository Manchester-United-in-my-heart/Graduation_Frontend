import { IPage } from "@/app/common/interfaces/interfaces";

interface Props {
  page: IPage;
}

export default function PageCard(props: Props) {
  const { page } = props;
  return (
    <a
      href={`/projects/${page.projectId}/${page.id}`}
      className="card sm:max-w-sm"
    >
      <div className="card-body">
        {/* <h5 className="card-title mb-2.5">Featured Update</h5> */}
        <p>{page.pageNumber}</p>
      </div>
      {/* <div className="card-footer text-center text-base-content/50">2 days ago</div> */}
    </a>
  );
}
