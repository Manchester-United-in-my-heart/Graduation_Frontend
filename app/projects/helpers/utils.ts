export const detectWhichLineDoesTheBoxBelongTo = (box, lines) => {
  const areaPercentage = [];
  // Calculate the percentage of the area of the box that is covered by each line
  lines.forEach((paragraph) => {
    paragraph.forEach((line) => {
      const position = line;
      const x1 = Math.max(box.x, position.x);
      const y1 = Math.max(box.y, position.y);
      const x2 = Math.min(box.x + box.width, position.x + position.width);
      const y2 = Math.min(box.y + box.height, position.y + position.height);
      const areaIntersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
      const areaBox = box.width * box.height;
      const areaPercentageOfLine = areaIntersection / areaBox;
      areaPercentage.push(areaPercentageOfLine);
    });
  });
  // Find the line that covers the most area of the box
  const maxAreaPercentage = Math.max(...areaPercentage);
  const indexOfMaxAreaPercentage = areaPercentage.indexOf(maxAreaPercentage);
  return indexOfMaxAreaPercentage;
};

const detectWhichLineAndParagraphDoesTheBoxBelongTo = (box, paragraphs) => {
  const areaPercentage = [];
  // Calculate the percentage of the area of the box that is covered by each line
  paragraphs.forEach((paragraph, paragraphIndex) => {
    const areaPercentagesOfAParagraph = [];
    paragraph.lines.forEach((line) => {
      const { position } = line;
      const x1 = Math.max(box.x, position.x);
      const y1 = Math.max(box.y, position.y);
      const x2 = Math.min(box.x + box.width, position.x + position.w);
      const y2 = Math.min(box.y + box.height, position.y + position.h);
      const areaIntersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
      const areaBox = box.width * box.height;
      const areaPercentageOfLine = areaIntersection / areaBox;
      areaPercentagesOfAParagraph.push(areaPercentageOfLine);
    });
    areaPercentage.push(areaPercentagesOfAParagraph);
  });
  // Find the paragraph and line that covers the most area of the box
  let maxAreaPercentage = 0;
  let indexOfMaxAreaPercentage = 0;
  let indexOfMaxAreaPercentageOfLine = 0;
  areaPercentage.forEach((paragraph, paragraphIndex) => {
    paragraph.forEach((line, lineIndex) => {
      if (line > maxAreaPercentage) {
        maxAreaPercentage = line;
        indexOfMaxAreaPercentage = paragraphIndex;
        indexOfMaxAreaPercentageOfLine = lineIndex;
      }
    });
  });

  return {
    paragraphIndex: indexOfMaxAreaPercentage,
    lineIndex: indexOfMaxAreaPercentageOfLine,
  };
};

export const getPreviewText = (boxes, existingBoxes, newlyAddedBoxes) => {
  const deepCopyOfExistingBoxes = JSON.parse(JSON.stringify(existingBoxes));

  newlyAddedBoxes.forEach((box, index) => {
    const { paragraphIndex, lineIndex } =
      detectWhichLineAndParagraphDoesTheBoxBelongTo(box, boxes);
    // find all existing boxes that belong to the same line
    const existingBoxesInSameLine = deepCopyOfExistingBoxes.filter(
      (existingBox) => {
        return (
          existingBox.inParagraph === paragraphIndex &&
          existingBox.inLine === lineIndex
        );
      },
    );

    // find the position of the newly added box in the line
    let indexInLine = 0;
    existingBoxesInSameLine.forEach((existingBox) => {
      if (box.x >= existingBox.x) {
        indexInLine++;
      }
    });
    box.positionInLine = indexInLine;
    box.inParagraph = paragraphIndex;
    box.inLine = lineIndex;
    deepCopyOfExistingBoxes.push(box);
  });

  // sort the boxes by paragraph and line and position in line
  deepCopyOfExistingBoxes.sort((a, b) => {
    if (a.inParagraph === b.inParagraph) {
      if (a.inLine === b.inLine) {
        return a.positionInLine - b.positionInLine;
      }
      return a.inLine - b.inLine;
    }
    return a.inParagraph - b.inParagraph;
  });

  // group the boxes by paragraph
  const paragraphs = [];
  let currentParagraph = [];
  let currentParagraphIndex = 0;
  deepCopyOfExistingBoxes.forEach((box) => {
    if (box.inParagraph === currentParagraphIndex) {
      currentParagraph.push(box);
    } else {
      paragraphs.push(currentParagraph);
      currentParagraph = [box];
      currentParagraphIndex++;
    }
  });
  paragraphs.push(currentParagraph);

  // group elements in the same line in paragraphs
  paragraphs.forEach((paragraph) => {
    const lines = [];
    let currentLine = [];
    let currentLineIndex = 0;
    paragraph.forEach((box) => {
      if (box.inLine === currentLineIndex) {
        currentLine.push(box);
      } else {
        lines.push(currentLine);
        currentLine = [box];
        currentLineIndex++;
      }
    });
    lines.push(currentLine);
    paragraph.lines = lines;
  });

  // sort the lines in each line in each paragraph by position in line
  paragraphs.forEach((paragraph) => {
    paragraph.lines.forEach((line) => {
      line.sort((a, b) => a.positionInLine - b.positionInLine);
    });
  });

  // create the preview text

  let previewText = "";

  boxes.forEach((paragraph, paragraphIndex) => {
    if (paragraph.label === "Text") {
      let paragraphText = "";
      paragraphs[paragraphIndex].forEach((word) => {
        paragraphText += word.word + " ";
      });
      previewText += paragraphText + "\n";
    }
  });

  return previewText;
};

export const getThePositionOfWordGroupByLine = (
  boxes,
  existingBoxes,
  newlyAddedBoxes,
) => {
  const deepCopyOfExistingBoxes = JSON.parse(JSON.stringify(existingBoxes));

  newlyAddedBoxes.forEach((box, index) => {
    const { paragraphIndex, lineIndex } =
      detectWhichLineAndParagraphDoesTheBoxBelongTo(box, boxes);
    // find all existing boxes that belong to the same line
    const existingBoxesInSameLine = deepCopyOfExistingBoxes.filter(
      (existingBox) => {
        return (
          existingBox.inParagraph === paragraphIndex &&
          existingBox.inLine === lineIndex
        );
      },
    );

    // find the position of the newly added box in the line
    let indexInLine = 0;
    existingBoxesInSameLine.forEach((existingBox) => {
      if (box.x >= existingBox.x) {
        indexInLine++;
      }
    });
    box.positionInLine = indexInLine;
    box.inParagraph = paragraphIndex;
    box.inLine = lineIndex;
    deepCopyOfExistingBoxes.push(box);
  });

  const lines = [];
  boxes.forEach((paragraph, paragraphIndex) => {
    paragraph.lines.forEach((line, lineIndex) => {
      const { position } = line;
      const lineBoxes = deepCopyOfExistingBoxes.filter((box) => {
        return box.inParagraph === paragraphIndex && box.inLine === lineIndex;
      });
      lines.push({
        position: position,
        boxes: lineBoxes,
      });
    });
  });

  const words = [];
  lines.forEach((line) => {
    words.push(...line.boxes);
  });

  return {
    lines: lines,
    words: words,
  };
};
