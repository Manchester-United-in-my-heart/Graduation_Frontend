// components/DrawRectangle.js
import React, { useEffect, useRef } from "react";

interface Props {
  imageUrl: any;
  rect: any;
}

const DrawRectangle = (props: Props) => {
  const { imageUrl, rect } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      if (canvas && context) {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        if (rect) {
          context.strokeStyle = "red";
          context.lineWidth = 2;
          context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        }
      }
    };
  }, [imageUrl, rect]);

  return <canvas ref={canvasRef} />;
};

export default DrawRectangle;
