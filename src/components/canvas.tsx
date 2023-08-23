import Konva from "konva";
import React, { useState, useRef } from "react";
import { Stage, Layer, Line, Text, Image } from "react-konva";
import useImage from "use-image";

const Canvas: React.FC = () => {
  /* The code snippet is using the `useState` and `useRef` hooks from React to manage state in a
  functional component. */
  const [tool, setTool] = useState<string>("pen");
  const [lines, setLines] = useState<{ tool: string; points: number[] }[]>([]);
  const [uploadedImage, setUploadedImage] = useState("");
  const [lineColor, setLineColor] = useState<string>("#000");
  const [lineWidth, setLineWidth] = useState<number>(5);
  const isDrawing = useRef<boolean>(false);
  const stageRef = useRef<Konva.Stage | null>(null);
  const imageRef = useRef<Konva.Image | null>(null);
  const [image, status] = useImage(uploadedImage);
  /**
   * The handleMouseDown function updates the lines state with a new line object containing the tool and
   * the starting position of the mouse pointer.
   * @param {any} e - The parameter "e" is an event object that is passed to the "handleMouseDown"
   * function. It represents the mouse down event that occurred.
   */

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos!.x, pos!.y] }]);
  };

  /**
   * The function handles mouse movement to draw lines on a canvas.
   * @param {any} e - The parameter `e` is an event object that contains information about the mouse move
   * event. It is of type `any`, which means it can be any type of event object.
   * @returns The function `handleMouseMove` returns nothing (undefined).
   */
  const handleMouseMove = (e: any) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point!.x, point!.y]);

    // replace last
    const updatedLines = [...lines];
    updatedLines.splice(lines.length - 1, 1, lastLine);
    setLines(updatedLines);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  /**
   * The `downloadURI` function creates a link element, sets the download attribute and href attribute,
   * appends it to the document body, triggers a click event on the link, and removes the link from the
   * document body.
   * @param {string} uri - The `uri` parameter is a string that represents the URI (Uniform Resource
   * Identifier) of the file you want to download. It could be a URL pointing to a file on the internet
   * or a data URI representing the file content directly.
   * @param {string} name - The `name` parameter is a string that represents the desired name of the
   * downloaded file.
   */
  const downloadURI = (uri: string, name: string) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * The function `handleExport` exports the content of a canvas element as a PNG image file.
   */
  const handleExport = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      downloadURI(uri, "canvas.png");
    }
  };

  /**
   * The function `handleImageUpload` is used to handle the upload of an image file and display the
   * uploaded image.
   * @param e - The parameter `e` is of type `React.ChangeEvent<HTMLInputElement>`. This is an event
   * object that is triggered when the value of an input element of type "file" changes. It contains
   * information about the selected file(s) in the `target.files` property.
   */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const canvas = stageRef.current;
  const img = imageRef.current;

  const setImageDimensions = (status: "loaded" | "loading" | "failed") => {
    if ((status = "loaded")) {
    }
  };

  return (
    <div className="z-10 max-w-7xl w-full font-mono text-sm">
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
        className="mt-4 p-2 border rounded-md shadow-sm bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="pen" className="bg-gray-800">
          Pen
        </option>
        <option value="eraser" className="bg-gray-800">
          Eraser
        </option>
      </select>

      <div className="flex  items-center justify-between my-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />
        <button onClick={handleExport} className="rounded-md bg-blue-600 p-2">
          Download Image
        </button>
      </div>

      <div className="flex  items-center gap-8 my-4">
        <div className="mb-4">
          <label htmlFor="lineColor">Line Color: </label>
          <input
            type="color"
            id="lineColor"
            value={lineColor}
            onChange={(e) => setLineColor(e.target.value)}
            className="p-1 rounded-md outline-none"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lineWidth">Line Width: </label>
          <input
            type="number"
            id="lineWidth"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            min="1"
            max="10"
            className="text-black p-2 rounded-md outline-none"
          />
        </div>
      </div>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={stageRef}
        style={{ backgroundColor: "#f2f2f2" }}
        className={isDrawing ? "cursor-crosshair" : ""}
      >
        <Layer>
          {uploadedImage && (
            <Image
              image={image}
              alt={"Image uploaded"}
              width={window.innerWidth}
              height={window.innerHeight}
              scaleX={window.innerWidth / 2200}
              scaleY={window.innerHeight / 800}
              ref={imageRef}
            />
          )}

          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={lineColor}
              strokeWidth={lineWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
