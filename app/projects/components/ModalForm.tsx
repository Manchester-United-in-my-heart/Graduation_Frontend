"use client";
import { useEffect, useState } from "react";

export default function ModalForm() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverImage: null,
    isPublic: false,
    isAllowedToTrain: false,
  });

  const handleTextAndCheckboxChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // Handle checkbox state
    });
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      window.location.href = "/login";
    }
    setAccessToken(accessToken);
  }, []);

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    console.log("Prevented");
    const formDataToSend = new FormData();
    formDataToSend.append("accessToken", accessToken);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("isPublic", formData.isPublic);
    formDataToSend.append("isAllowedToTrain", formData.isAllowedToTrain);
    formDataToSend.append("coverImage", formData.coverImage);
    const response = await fetch("/api/projects/create", {
      method: "POST",
      body: formDataToSend,
    });
    const result = await response.json();
    setIsLoading(false);
    if (result.id) {
      alert("Project created successfully");
      window.location.reload();
    } else {
      alert("Failed to create project");
    }
  };
  return (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="form-modal"
        data-overlay="#form-modal"
      >
        Dự án mới
      </button>

      <div
        id="form-modal"
        className="overlay modal hidden overlay-open:opacity-100"
        role="dialog"
        tabIndex="-1"
      >
        <div className="modal-dialog overlay-open:opacity-100">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Tạo dự án mới</h3>
              <button
                type="button"
                className="btn btn-circle btn-text btn-sm absolute end-3 top-3"
                aria-label="Close"
                data-overlay="#form-modal"
              >
                <span className="icon-[tabler--x] size-4"></span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body pt-0">
                <div className="mb-4">
                  <label className="label label-text" htmlFor="name">
                    Tên dự án
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleTextAndCheckboxChange}
                    className="input"
                    id="name"
                    name="name"
                  />
                </div>
                <div className="mb-0.5 flex gap-4 max-sm:flex-col">
                  <div className="w-full">
                    <label className="label label-text" htmlFor="description">
                      Mô tả
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={handleTextAndCheckboxChange}
                      className="input"
                      id="description"
                      name="description"
                    />
                  </div>
                </div>
                <div className="my-0.5 flex gap-4 max-sm:flex-col">
                  <div className="w-full">
                    <label className="label label-text" htmlFor="coverImage">
                      Ảnh bìa
                    </label>
                    <input
                      type="file"
                      className="input"
                      id="coverImage"
                      onChange={handleFileChange}
                      name="coverImage"
                    />
                  </div>
                </div>
                <div className="mb-0.5 mt-2 flex gap-4 max-sm:flex-col">
                  <input
                    type="checkbox"
                    className="checkbox"
                    id="isPublic"
                    onChange={handleTextAndCheckboxChange}
                    name={"isPublic"}
                  />
                  <label
                    className="label label-text text-base"
                    htmlFor="isPublic"
                  >
                    Tôi đồng ý để dự án này được công khai
                  </label>
                </div>
                <div className="mb-0.5 flex gap-4 max-sm:flex-col">
                  <input
                    type="checkbox"
                    className="checkbox"
                    id="isAllowedToTrain"
                    onChange={handleTextAndCheckboxChange}
                    name={"isAllowedToTrain"}
                  />
                  <label
                    className="label label-text text-base"
                    htmlFor="isAllowedToTrain"
                  >
                    Tôi đồng ý để dự án này được dùng để cải thiện độ chính xác
                    của mô hình
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-soft"
                  data-overlay="#form-modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  {isLoading && (
                    <span className="loading loading-spinner"></span>
                  )}
                  Tạo mới
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
