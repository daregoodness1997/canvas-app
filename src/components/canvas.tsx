import React, { useState, useRef } from "react";
import { Stage, Layer, Line, Text } from "react-konva";

const Canvas: React.FC = () => {
  const [tool, setTool] = useState<string>("pen");
  const [lines, setLines] = useState<{ tool: string; points: number[] }[]>([]);
  const isDrawing = useRef<boolean>(false);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos!.x, pos!.y] }]);
  };

  const handleMouseMove = (e:any) => {
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

  return (
    <div className="z-10 max-w-5xl w-full font-mono text-sm">
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

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <Text text="Just start drawing" x={5} y={30} />
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
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
