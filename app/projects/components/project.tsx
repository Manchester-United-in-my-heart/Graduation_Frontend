"use client";

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

const Project = ({ imageUrl, boxes }) => {
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

  useEffect(() => {
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
    <div className="flex items-start gap-20">
      <canvas
        id="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: "1px solid black" }}
      />
      <div>
        <div>
          List of Boxes in Props:
          <ul>
            {listOfExistedBoxes.map((box, index) => (
              <li key={index}>
                <p>
                  x: {box.x}, y: {box.y}, width: {box.width}, height:{" "}
                  {box.height}{" "}
                </p>
                <div id={`existed-box-${index}`}>
                  <input
                    onChange={() => {
                      handleExistingWordChange(index);
                    }}
                    type="text"
                    value={listOfExistedBoxes[index].word}
                  />
                </div>
                <div>
                  <button
                    onClick={() => {
                      handleDeleteExistedBox(index);
                    }}
                  >
                    Delete Box
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {isExistingWordChanged && (
            <button
              onClick={() => handleSaveAllExistingBoxes(listOfExistedBoxes)}
            >
              Save All Existing Boxes
            </button>
          )}
        </div>
        <div>
          List of New Boxes:
          <ul>
            {listOfNewBoxes.map((box, index) => (
              <li key={index}>
                <div>
                  <p>
                    x: {box.x}, y: {box.y}, width: {box.width}, height:{" "}
                    {box.height}
                  </p>
                  <div id={`new-box-${index}`}>
                    <input
                      type="text"
                      onChange={() => {
                        handleNewlyDrawnWordChange(index);
                      }}
                      value={box.word}
                    />
                  </div>

                  <div>
                    <button
                      onClick={() => {
                        handleDeleteNewlyDrawnBox(index);
                      }}
                    >
                      Delete Box
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {listOfNewBoxes.length > 0 && (
              <button onClick={() => handleSaveAllNewBoxes()}>
                Save All New Boxes
              </button>
            )}
          </ul>
        </div>
        <div>
          Preview
          <textarea
            name="preview"
            rows="10"
            cols="50"
            value={previewText}
            readOnly={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Project;
