"use client";

import FlyonuiScript from "@/app/common/components/FlyonuiScript";
import { useState, useEffect } from "react";
import {
  detectWhichLineDoesTheBoxBelongTo,
  getPreviewText,
  getThePositionOfWordGroupByLine,
} from "../helpers/utils";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  word?: string;
  inParagraph?: number;
  inLine?: number;
  positionInLine?: number;
}

interface PredictedWord {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  word: string;
}

const PageInProject = ({ imageUrl, boxes, projectId, pageId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const listOfExistedBoxesFromProps = [];
  const paragraphPositions = boxes.map((paragraph) => {
    const { bbox } = paragraph;
    return {
      x: bbox[0],
      y: bbox[1],
      width: bbox[2] - bbox[0],
      height: bbox[3] - bbox[1],
    };
  });
  const linePositions = boxes.map((paragraph) => {
    return paragraph.lines.map((line) => {
      const { position } = line;
      return {
        x: position.x,
        y: position.y,
        width: position.w,
        height: position.h,
      };
    });
  });

  boxes.map((part, paragraphIndex) => {
    part.lines.forEach((line, lineIndex) => {
      line.words.forEach((word, wordIndex) => {
        const { position, texts } = word;
        listOfExistedBoxesFromProps.push({
          x: position.x,
          y: position.y,
          width: position.w,
          height: position.h,
          word: texts,
          inParagraph: paragraphIndex,
          inLine: lineIndex,
          positionInLine: wordIndex,
        });
      });
    });
  });

  const listOfPictureTypeElements = [];
  for (let i = 0; i < boxes.length; i++) {
    const element = boxes[i];
    if (element.label === "Picture") {
      listOfPictureTypeElements.push(element);
    }
  }

  const [listOfExistedBoxes, setListOfExistedBoxes] = useState<Rect[]>(
    listOfExistedBoxesFromProps,
  );
  const [listOfNewBoxes, setListOfNewBoxes] = useState<Rect[]>([]);
  const [rect, setRect] = useState<Rect | null>(null);
  const [currentHighlightBox, setCurrentHighlightBox] = useState<int | null>(
    null,
  );
  const [isExistingWordChanged, setIsExistingWordChanged] =
    useState<boolean>(false);
  const initialPreviewText = getPreviewText(boxes, listOfExistedBoxes, []);
  const [previewText, setPreviewText] = useState<string | any[]>(
    initialPreviewText,
  );
  const [isClickedUpdate, setIsClickedUpdate] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    setAccessToken(localStorage.getItem("access_token"));
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);

      // Function to redraw everything, including hovered text
      const redraw = (hoveredBox = null) => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);

        // Draw existing boxes
        listOfExistedBoxes.forEach((box) => {
          context.strokeStyle = "red";
          context.lineWidth = 2;
          context.strokeRect(box.x, box.y, box.width, box.height);
        });

        // Draw new boxes
        listOfNewBoxes.forEach((box) => {
          context.strokeStyle = "blue";
          context.lineWidth = 2;
          context.strokeRect(box.x, box.y, box.width, box.height);
        });

        // If a box is hovered, display the word
        if (hoveredBox) {
          context.font = "16px Arial";
          context.fillStyle = "black";
          context.fillText(hoveredBox.word, hoveredBox.x, hoveredBox.y - 5); // Display above the box
        }
      };

      // Initial draw
      redraw();

      // Attach a single mousemove listener to the canvas
      canvas.addEventListener("mousemove", (event) => {
        const { clientX, clientY } = event;
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Find the hovered box
        const hoveredBox = listOfExistedBoxes.find(
          (box) =>
            x >= box.x &&
            x <= box.x + box.width &&
            y >= box.y &&
            y <= box.y + box.height,
        );

        if (hoveredBox !== null) {
          if (currentHighlightBox !== -1) {
            listOfExistedBoxes.forEach((box, index) => {
              const input = document.getElementById(`existed-box-${index}`);
              if (input) {
                input.style.backgroundColor = "white";
              }
            });
          }
          // remove the highlight from the input box
          setCurrentHighlightBox(hoveredBox);
          // highlight the input box with the id `existed-box-${index}`
          const index = listOfExistedBoxes.indexOf(hoveredBox);
          const input = document.getElementById(`existed-box-${index}`);
          if (input) {
            input.style.backgroundColor = "yellow";
          }
        } else {
          setCurrentHighlightBox(null);
        }

        // Redraw and display hovered word if hovering over a box
        redraw(hoveredBox);
      });
    };
  }, [imageUrl, listOfExistedBoxes, listOfNewBoxes]);

  useEffect(() => {
    const previewArea = document.getElementById("preview");
    previewArea.innerHTML = previewText;
  }, [previewText]);

  // useEffect(() => {
  //   const accessToken = localStorage.getItem("access_token");
  //   const linesWillSendToServer = getThePositionOfWordGroupByLine(
  //     boxes,
  //     listOfExistedBoxes,
  //     listOfNewBoxes,
  //   );
  //   const sendUpdateRequestToServer = async () => {
  //     const response = await fetch(`/api/pages/update`, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         projectId: projectId,
  //         pageId: pageId,
  //         accessToken: accessToken,
  //         updatedText: linesWillSendToServer,
  //       }),
  //     });
  //     const result = await response.json();
  //     console.log(result);
  //   };
  //   sendUpdateRequestToServer();
  // }, [isClickedUpdate]);

  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setRect({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (event) => {
    if (rect) {
      const { clientX, clientY } = event;
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const rectBounding = canvas.getBoundingClientRect();
      const x = clientX - rectBounding.left;
      const y = clientY - rectBounding.top;
      const width = x - rect.x;
      const height = y - rect.y;

      // Draw the current rectangle without clearing the canvas
      const context = canvas.getContext("2d");
      const image = new Image();
      image.src = imageUrl;

      image.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);

        // Redraw existing boxes
        listOfExistedBoxes.forEach((box) => {
          context.strokeStyle = "red";
          context.lineWidth = 2;
          context.strokeRect(box.x, box.y, box.width, box.height);
        });

        listOfNewBoxes.forEach((box) => {
          context.strokeStyle = "blue";
          context.lineWidth = 2;
          context.strokeRect(box.x, box.y, box.width, box.height);
        });

        // Draw the temporary rectangle
        context.strokeStyle = "green"; // Temporary box color
        context.lineWidth = 2;
        context.strokeRect(rect.x, rect.y, width, height);
      };

      setRect({ ...rect, width, height });
    }
  };

  const handleMouseUp = () => {
    if (rect) {
      setListOfNewBoxes((prevBoxes) => [...prevBoxes, { ...rect, word: "" }]);
      const line = detectWhichLineDoesTheBoxBelongTo(rect, linePositions);
      console.log("Line:", line);
      setRect(null); // Clear the temporary rectangle
    }
  };

  const handleDeleteNewlyDrawnBox = (index) => {
    setListOfNewBoxes((prevBoxes) => prevBoxes.filter((box, i) => i !== index));
  };

  const handleDeleteExistedBox = (index) => {
    setListOfExistedBoxes((prevBoxes) =>
      prevBoxes.filter((box, i) => i !== index),
    );
  };

  const handleSaveAllNewBoxes = () => {
    // This is a dummy function to demonstrate how to save all new boxes
    // In real-world application, you may need to send a request to the server to save the boxes
    setPreviewText(getPreviewText(boxes, listOfExistedBoxes, listOfNewBoxes));

    const linesWillSendToServer = getThePositionOfWordGroupByLine(
      boxes,
      listOfExistedBoxes,
      listOfNewBoxes,
    );
    console.log(linesWillSendToServer);
  };

  const handleSaveAllExistingBoxes = () => {
    // This is a dummy function to demonstrate how to save all existing boxes
    // In real-world application, you may need to send a request to the server to save the boxes
    setPreviewText(getPreviewText(boxes, listOfExistedBoxes, listOfNewBoxes));
    const linesWillSendToServer = getThePositionOfWordGroupByLine(
      boxes,
      listOfExistedBoxes,
      listOfNewBoxes,
    );
    console.log(linesWillSendToServer);
  };

  useEffect(() => {}, [isLoading]);

  const handleUpdate = () => {
    setIsLoading(true);
    const linesWillSendToServer = getThePositionOfWordGroupByLine(
      boxes,
      listOfExistedBoxes,
      listOfNewBoxes,
    );
    const sendUpdateRequestToServer = async () => {
      const response = await fetch(`/api/pages/update`, {
        method: "POST",
        body: JSON.stringify({
          projectId: projectId,
          pageId: pageId,
          accessToken: accessToken,
          updatedText: linesWillSendToServer,
        }),
      });
      const result = await response.json();
      setIsLoading(false);
      if (result.message && result.message === "Updated successfully") {
        alert("Updated successfully");
        window.location.reload();
      } else {
        alert("Failed to update");
      }
      // console.log(result);
    };
    sendUpdateRequestToServer();
    setIsClickedUpdate(true);
  };

  const handleExistingWordChange = (index) => {
    const input = document.getElementById(`existed-box-${index}`)?.children[0];
    if (input) {
      setIsExistingWordChanged(true);
      const word = input.value;
      console.log(word);
      setListOfExistedBoxes((prevBoxes) =>
        prevBoxes.map((box, i) => {
          if (i === index) {
            return { ...box, word };
          }
          return box;
        }),
      );
    }
  };

  const handleNewlyDrawnWordChange = (index) => {
    console.log(index);
    const input = document.getElementById(`new-box-${index}`)?.children[0];
    console.log(input);
    if (input) {
      const word = input.value;
      console.log(word);
      setListOfNewBoxes((prevBoxes) =>
        prevBoxes.map((box, i) => {
          if (i === index) {
            return { ...box, word };
          }
          return box;
        }),
      );
    }
  };

  return (
    <>
      <div className="flex gap-20">
        <div className="basis-[70%]">
          <canvas
            id="canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ border: "1px solid black" }}
          />
          <div className="flex justify-center">
            <p className="text-center text-3xl">Preview</p>
          </div>
          <div id="preview">Preview</div>
          <div>
            <button
              className="btn btn-info btn-gradient"
              onClick={() => handleUpdate()}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : null}
              Cập nhật
            </button>
          </div>
        </div>
        <div className="basis-[30%]">
          <div className="accordion-shadow accordion w-[300px]">
            <div
              className="active accordion-item transition-transform duration-300 ease-in accordion-item-active:mb-3"
              id="payment-popout"
            >
              <button
                className="accordion-toggle inline-flex w-full items-center gap-x-4 px-5 py-4 text-start"
                aria-controls="payment-popout-collapse"
                aria-expanded="true"
              >
                <span className="icon-[tabler--plus] block size-4.5 shrink-0 text-base-content accordion-item-active:hidden"></span>
                <span className="icon-[tabler--minus] hidden size-4.5 shrink-0 text-base-content accordion-item-active:block"></span>
                Danh sách gốc
              </button>
              <div
                id="payment-popout-collapse"
                className="accordion-content max-h-[300px] overflow-y-scroll transition-[height] duration-300"
                aria-labelledby="payment-popout"
                role="region"
              >
                <div className="px-5 pb-4">
                  <div>
                    <ul>
                      {listOfExistedBoxes.map((box, index) => (
                        <li key={index}>
                          <p>
                            x: {box.x}, y: {box.y}, width: {box.width}, height:{" "}
                            {box.height}{" "}
                          </p>
                          <div className="flex gap-4">
                            <div id={`existed-box-${index}`}>
                              <input
                                className="w-32 border border-black p-2"
                                onChange={() => {
                                  handleExistingWordChange(index);
                                }}
                                type="text"
                                value={listOfExistedBoxes[index].word}
                              />
                            </div>
                            <div>
                              <button
                                className="btn btn-error btn-outline"
                                onClick={() => {
                                  handleDeleteExistedBox(index);
                                }}
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {isExistingWordChanged && (
                      <button
                        className="btn btn-success btn-gradient my-4"
                        onClick={() =>
                          handleSaveAllExistingBoxes(listOfExistedBoxes)
                        }
                      >
                        Lưu
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="accordion-item transition-transform duration-300 ease-in accordion-item-active:my-3"
              id="delivery-popout"
            >
              <button
                className="accordion-toggle inline-flex items-center gap-x-4 px-5 py-4 text-start"
                aria-controls="delivery-popout-collapse"
                aria-expanded="false"
              >
                <span className="icon-[tabler--plus] block size-4.5 shrink-0 text-base-content accordion-item-active:hidden"></span>
                <span className="icon-[tabler--minus] hidden size-4.5 shrink-0 text-base-content accordion-item-active:block"></span>
                Danh sách thêm mới
              </button>
              <div
                id="delivery-popout-collapse"
                className="accordion-content hidden max-h-[300px] w-full overflow-hidden transition-[height] duration-300"
                aria-labelledby="delivery-popout"
                role="region"
              >
                <div className="px-5 pb-4">
                  <div>
                    <ul>
                      {listOfNewBoxes.map((box, index) => (
                        <li key={index}>
                          <div>
                            <p>
                              x: {box.x}, y: {box.y}, width: {box.width},
                              height: {box.height}
                            </p>
                            <div className="flex gap-4">
                              <div id={`new-box-${index}`}>
                                <input
                                  className="w-32 border border-black p-2"
                                  type="text"
                                  onChange={() => {
                                    handleNewlyDrawnWordChange(index);
                                  }}
                                  value={box.word}
                                />
                              </div>

                              <div>
                                <button
                                  className="btn btn-error btn-outline"
                                  onClick={() => {
                                    handleDeleteNewlyDrawnBox(index);
                                  }}
                                >
                                  Xóa
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                      {listOfNewBoxes.length > 0 && (
                        <button
                          className="btn btn-success btn-gradient my-4"
                          onClick={() => handleSaveAllNewBoxes()}
                        >
                          Save All New Boxes
                        </button>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FlyonuiScript />
    </>
  );
};

export default PageInProject;
