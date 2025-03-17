// components/DrawRectangle.js
import React, { useEffect, useRef } from "react";

const DrawRectangle = ({ imageUrl, rect }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);

      if (rect) {
        context.strokeStyle = "red";
        context.lineWidth = 2;
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      }
    };
  }, [imageUrl, rect]);

  return <canvas ref={canvasRef} />;
};

export default DrawRectangle;
