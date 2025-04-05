export const detectWhichLineDoesTheBoxBelongTo = (box: any, lines: any) => {
  const areaPercentage: any[] = [];
  // Calculate the percentage of the area of the box that is covered by each line
  lines.forEach((paragraph: any) => {
    paragraph.forEach((line: any) => {
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

const detectWhichLineAndParagraphDoesTheBoxBelongTo = (
  box: any,
  paragraphs: any,
) => {
  const areaPercentage: any[] = [];
  // Calculate the percentage of the area of the box that is covered by each line
  paragraphs.forEach((paragraph: any, paragraphIndex: any) => {
    const areaPercentagesOfAParagraph: any[] = [];
    paragraph.lines.forEach((line: any) => {
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
    paragraph.forEach((line: any, lineIndex: any) => {
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

export const getPreviewText = (
  boxes: any,
  existingBoxes: any,
  newlyAddedBoxes: any,
) => {
  const deepCopyOfExistingBoxes = JSON.parse(JSON.stringify(existingBoxes));

  newlyAddedBoxes.forEach((box: any, index: any) => {
    const { paragraphIndex, lineIndex } =
      detectWhichLineAndParagraphDoesTheBoxBelongTo(box, boxes);
    // find all existing boxes that belong to the same line
    const existingBoxesInSameLine = deepCopyOfExistingBoxes.filter(
      (existingBox: any) => {
        return (
          existingBox.inParagraph === paragraphIndex &&
          existingBox.inLine === lineIndex
        );
      },
    );

    // find the position of the newly added box in the line
    let indexInLine = 0;
    existingBoxesInSameLine.forEach((existingBox: any) => {
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
  deepCopyOfExistingBoxes.sort((a: any, b: any) => {
    if (a.inParagraph === b.inParagraph) {
      if (a.inLine === b.inLine) {
        return a.positionInLine - b.positionInLine;
      }
      return a.inLine - b.inLine;
    }
    return a.inParagraph - b.inParagraph;
  });

  // group the boxes by paragraph
  const paragraphs: any[] = [];
  let currentParagraph: any[] = [];
  let currentParagraphIndex = 0;
  deepCopyOfExistingBoxes.forEach((box: any) => {
    if (box.inParagraph === currentParagraphIndex) {
      currentParagraph.push(box);
    } else {
      paragraphs.push(currentParagraph);
      currentParagraph = [box];
      currentParagraphIndex = box.inParagraph;
    }
  });
  paragraphs.push(currentParagraph);

  // group elements in the same line in paragraphs
  paragraphs.forEach((paragraph) => {
    const lines = [];
    let currentLine: any[] = [];
    let currentLineIndex = 0;
    paragraph.forEach((box: any) => {
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
    paragraph.lines.forEach((line: any) => {
      line.sort((a: any, b: any) => a.positionInLine - b.positionInLine);
    });
  });

  // create the preview text

  let previewText = "";

  let textTypeParagraphIterator = 0;
  boxes.forEach((paragraph: any) => {
    if (
      paragraph.label === "Text" ||
      paragraph.label === "SectionHeader" ||
      paragraph.label === "Caption"
    ) {
      let paragraphText = "";
      paragraphs[textTypeParagraphIterator].forEach((word: any) => {
        paragraphText += word.word + " ";
      });
      textTypeParagraphIterator++;
      previewText += `<div>${paragraphText}</div>` + "\n";
    } else if (paragraph.label === "Picture") {
      previewText += `<div><img src="data:image/png;base64,${paragraph.base64}" /></div>`;
    }
  });

  return previewText;
};

export const getThePositionOfWordGroupByLine = (
  boxes: any,
  existingBoxes: any,
  newlyAddedBoxes: any,
) => {
  const deepCopyOfExistingBoxes = JSON.parse(JSON.stringify(existingBoxes));

  newlyAddedBoxes.forEach((box: any, index: any) => {
    const { paragraphIndex, lineIndex } =
      detectWhichLineAndParagraphDoesTheBoxBelongTo(box, boxes);
    // find all existing boxes that belong to the same line
    const existingBoxesInSameLine = deepCopyOfExistingBoxes.filter(
      (existingBox: any) => {
        return (
          existingBox.inParagraph === paragraphIndex &&
          existingBox.inLine === lineIndex
        );
      },
    );

    // find the position of the newly added box in the line
    let indexInLine = 0;
    existingBoxesInSameLine.forEach((existingBox: any) => {
      if (box.x >= existingBox.x) {
        indexInLine++;
      }
    });
    box.positionInLine = indexInLine;
    box.inParagraph = paragraphIndex;
    box.inLine = lineIndex;
    deepCopyOfExistingBoxes.push(box);
  });

  const lines: any[] = [];
  boxes.forEach((paragraph: any, paragraphIndex: any) => {
    paragraph.lines.forEach((line: any, lineIndex: any) => {
      const { position } = line;
      const lineBoxes = deepCopyOfExistingBoxes.filter((box: any) => {
        return box.inParagraph === paragraphIndex && box.inLine === lineIndex;
      });
      lines.push({
        position: position,
        boxes: lineBoxes,
      });
    });
  });

  const words: any[] = [];
  lines.forEach((line) => {
    words.push(...line.boxes);
  });

  return {
    lines: lines,
    words: words,
  };
};
