"use client";

import React, { useRef } from "react";
import useImage from "use-image";
import { KonvaEventObject } from "konva/lib/Node";
import { Stage, Layer } from "react-konva";

import ImgKonva from "./_components/ImgKonva";
import { ImgParamsType } from "./_types/ImgParamsType";
import Konva from "konva";

export default function Canvas() {
  const [selectedId, selectShape] = React.useState<string | null>(null);
  const stage = useRef<Konva.Stage>(null);
  const layer = useRef<Konva.Layer>(null);
  const [image] = useImage("https://konvajs.org/assets/lion.png");
  const [data, setData] = React.useState<ImgParamsType>({
    id: "mockup",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    rotation: 0,
    isDragging: false,
  });

  const checkDeselect = (e: KonvaEventObject<TouchEvent | MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const isSelected = selectedId === data.id;

  return (
    <div className="w-[300px] h-[400px] mx-auto border">
      <Stage
        width={300}
        height={400}
        ref={stage}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer ref={layer}>
          <ImgKonva
            data={data}
            image={image!}
            setData={setData}
            onSelect={() => selectShape(data.id)}
            stage={stage.current!}
            isSelected={isSelected}
            layer={layer.current!}
          />
        </Layer>
      </Stage>
      <button onClick={() => console.log(data)}>get data</button>
    </div>
  );
}
