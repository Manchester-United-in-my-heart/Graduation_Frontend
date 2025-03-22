import { useState, useEffect } from "react";
import Chart from "./Chart";

interface DashboardProps {
  pages: {
    data_by_days: number[];
    data_by_weeks: number[];
    data_by_months: number[];
  };
  projects: {
    data_by_days: number[];
    data_by_weeks: number[];
    data_by_months: number[];
  };
  published_books: {
    data_by_days: number[];
    data_by_weeks: number[];
    data_by_months: number[];
  };
  users: {
    data_by_days: number[];
    data_by_weeks: number[];
    data_by_months: number[];
  };
}

export default function DashBoard(props: DashboardProps) {
  const { pages, projects, published_books, users } = props;
  const [currentTimeRange, setCurrentTimeRange] = useState<string>("days");
  const [currentFigure, setCurrentFigure] = useState<string>("users");
  const handleSelectTimeRange = (event) => {
    setCurrentTimeRange(event.target.value);
  };

  const [isSending, setIsSending] = useState(false);

  const handleSelectFigure = (event) => {
    setCurrentFigure(event.target.value);
  };

  const prepareData = () => {
    const raw =
      currentTimeRange === "days" && currentFigure === "users"
        ? users.data_by_days
        : currentTimeRange === "days" && currentFigure === "projects"
          ? projects.data_by_days
          : currentTimeRange === "days" && currentFigure === "pages"
            ? pages.data_by_days
            : currentTimeRange === "days" && currentFigure === "published_books"
              ? published_books.data_by_days
              : currentTimeRange === "weeks" && currentFigure === "users"
                ? users.data_by_weeks
                : currentTimeRange === "weeks" && currentFigure === "projects"
                  ? projects.data_by_weeks
                  : currentTimeRange === "weeks" && currentFigure === "pages"
                    ? pages.data_by_weeks
                    : currentTimeRange === "weeks" &&
                        currentFigure === "published_books"
                      ? published_books.data_by_weeks
                      : currentTimeRange === "months" &&
                          currentFigure === "users"
                        ? users.data_by_months
                        : currentTimeRange === "months" &&
                            currentFigure === "projects"
                          ? projects.data_by_months
                          : currentTimeRange === "months" &&
                              currentFigure === "pages"
                            ? pages.data_by_months
                            : currentTimeRange === "months" &&
                                currentFigure === "published_books"
                              ? published_books.data_by_months
                              : [];
    const data = raw.map((value, index) => {
      return {
        name: `${index + 1} ${currentTimeRange === "days" ? "ngày" : currentTimeRange === "weeks" ? "tuần" : "tháng"}`,
        [currentFigure]: value,
      };
    });

    // reverse data
    data.reverse();
    return data;
  };

  const [data, setData] = useState(prepareData());

  const handleGetTrainData = async () => {
    setIsSending(true);
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      window.location.href = "/login";
    }
    const response = await fetch("/api/admin/train", {
      method: "POST",
      body: JSON.stringify({ accessToken }),
    });
    const result = await response.json();
    if (result.status === 400) {
      alert("Lỗi");
    } else {
      alert("Lấy Data Train Thành Công");
    }
    setIsSending(false);
  };

  useEffect(() => {
    setData(prepareData());
  }, [currentTimeRange, currentFigure]);

  return (
    <div>
      <div>
        <form>
          <div className="flex w-full flex-wrap items-start gap-3 sm:flex-nowrap">
            <label className="custom-option flex flex-col items-center gap-3 sm:w-1/2">
              <input
                type="radio"
                name="radio-19"
                className="radio radio-primary radio-sm"
                value="days"
                defaultChecked
                onChange={handleSelectTimeRange}
              />
              Ngày
            </label>

            <label className="custom-option flex flex-col items-center gap-3 sm:w-1/2">
              <input
                type="radio"
                name="radio-19"
                className="radio radio-primary radio-sm"
                value="weeks"
                onChange={handleSelectTimeRange}
              />
              Tuần
            </label>

            <label className="custom-option flex flex-col items-center gap-3 sm:w-1/2">
              <input
                type="radio"
                name="radio-19"
                className="radio radio-primary radio-sm"
                value="months"
                onChange={handleSelectTimeRange}
              />
              Tháng
            </label>
          </div>
        </form>
      </div>
      <div className="mt-10">
        <form>
          <div className="flex w-full flex-wrap items-start gap-3 sm:flex-nowrap">
            <label className="custom-option flex flex-col items-center gap-3 sm:w-1/2">
              <input
                type="radio"
                name="radio-20"
                className="radio radio-primary radio-sm"
                value="users"
                defaultChecked
                onChange={handleSelectFigure}
              />
              Số Người Đăng Ký Mới
            </label>

            <label className="custom-option flex flex-col items-center gap-3 sm:w-1/2">
              <input
                type="radio"
                name="radio-20"
                className="radio radio-primary radio-sm"
                value="projects"
                onChange={handleSelectFigure}
              />
              Số Dự Án Mới
            </label>

            <label className="custom-option flex flex-col items-center gap-3 sm:w-1/2">
              <input
                type="radio"
                name="radio-20"
                className="radio radio-primary radio-sm"
                value="pages"
                onChange={handleSelectFigure}
              />
              Số Trang Mới
            </label>
            <label className="custom-option flex flex-col items-center gap-3 sm:w-1/2">
              <input
                type="radio"
                name="radio-20"
                className="radio radio-primary radio-sm"
                value="published_books"
                onChange={handleSelectFigure}
              />
              Số Dự Án Đã Chia Sẻ Mới
            </label>
          </div>
        </form>
      </div>

      <div className="mt-20">
        <Chart data={data} type={currentFigure} />
      </div>

      <div className="mt-20 flex justify-center">
        <button onClick={handleGetTrainData} className="btn btn-primary w-full">
          {isSending && <span className="loading loading-spinner"></span>}
          Lấy Data Train
        </button>
      </div>
    </div>
  );
}
