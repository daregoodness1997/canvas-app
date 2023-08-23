import React, { useState, useEffect, useRef } from "react";
import { Image } from "react-konva";

const URLImage: React.FC<{ src: string; x: number; y: number }> = ({
  src,
  x,
  y,
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  //@ts-ignore
  const imageRef = useRef<Image | null>(null);

  useEffect(() => {
    loadImage();
    return () => {
      if (image) {
        image.removeEventListener("load", handleLoad);
      }
    };
  }, [src]);

  const loadImage = () => {
    const img = new window.Image();
    img.src = src;
    img.addEventListener("load", handleLoad);
    setImage(img);
  };

  const handleLoad = () => {
    setImage(image);
  };

  return (
    <Image
      x={x}
      y={y}
      //@ts-ignore
      image={image}
      alt={"image uploaded"}
      ref={(node) => {
        imageRef.current = node;
      }}
    />
  );
};

export default URLImage;
