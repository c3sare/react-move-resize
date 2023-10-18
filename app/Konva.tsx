"use client";

import type { Stage as StageType } from "konva/lib/Stage";

import React, { useRef } from "react";
import useImage from "use-image";
import { KonvaEventObject } from "konva/lib/Node";
import { Stage, Layer } from "react-konva";

import Image from "./Image";
import { ImgParamsType } from "./types/ImgParamsType";

export default function Konva() {
  const [selectedId, selectShape] = React.useState<string | null>(null);
  const stage = useRef<StageType>(null);
  const [image] = useImage("https://konvajs.org/assets/lion.png");
  const [img, setImg] = React.useState<ImgParamsType>({
    id: "1",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    rotation: 0,
    isDragging: false,
  });

  const checkDeselect = (e: KonvaEventObject<TouchEvent | MouseEvent>) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const isSelected = selectedId === img.id;

  return (
    <div className="w-[300px] h-[400px] mx-auto border">
      <Stage
        width={300}
        height={400}
        ref={stage}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          <Image
            img={img}
            image={image!}
            setImg={setImg}
            onSelect={() => selectShape(img.id)}
            stage={stage.current!}
            isSelected={isSelected}
          />
        </Layer>
      </Stage>
      <button onClick={() => console.log(img)}>get data</button>
    </div>
  );
}
