"use client";

import React, { useRef, useState } from "react";
import useImage from "use-image";
import { KonvaEventObject } from "konva/lib/Node";
import { Stage, Layer } from "react-konva";

import ImgKonva from "./_components/ImgKonva";
import { ImgParamsType } from "./_types/ImgParamsType";
import Konva from "konva";
import Shirt from "./_components/Shirt";
import Button from "./_components/Button";

const imageUrl =
  "https://lh3.googleusercontent.com/u/0/drive-viewer/AK7aPaBeXyyD6O-3We-k_1DfjN5imdR_8nVBkZIcZu6FiHSHMfggZ21pz5NQE5Pr_XLb05mTiaqBOTR9az1BYAYrYOmBMuaICw=w1920-h931";

export default function Canvas() {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [selectedId, selectShape] = React.useState<string | null>(null);
  const stage = useRef<Konva.Stage>(null);
  const layer = useRef<Konva.Layer>(null);
  const [image] = useImage(imageUrl);
  const [data, setData] = React.useState<ImgParamsType>({
    id: "mockup",
    x: 50,
    y: 70,
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

  const handleGetImageData = () => {
    const { x, y, width, height, rotation } = data;
    return {
      width: 15 * Math.round(width),
      height: 15 * Math.round(height),
      x: Math.round(x) * 15,
      y: Math.round(y) * 15,
      rotation,
    };
  };

  const handleSendParams = () => {
    const data = handleGetImageData();
    fetch("/api/create-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        variant_ids: [16790],
        format: "jpg",
        width: 1024,
        files: [
          {
            placement: "front",
            image_url: imageUrl,
            position: {
              area_width: 3000,
              area_height: 4000,
              width: data.width,
              height: data.height,
              top: data.y,
              left: data.x,
            },
          },
        ],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.result.status === "pending") setTaskId(data.result.task_key);
      });
  };

  const getTaskResult = () => {
    fetch(`/api/get-task`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId,
      }),
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        const href = data.result?.mockups?.[0]?.mockup_url;
        if (href) {
          const link = document.createElement("a");
          link.href = data.result.mockups[0].mockup_url;
          link.target = "_blank";
          document.body.append(link);
          link.click();
          link.remove();
          setTaskId(null);
        } else console.log(data);
      });
  };

  const isSelected = selectedId === data.id;
  const isDragging = data.isDragging;

  return (
    <>
      <Shirt isDragging={isDragging}>
        <Stage
          width={200}
          height={240}
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
      </Shirt>
      {taskId === null && <Button onClick={handleSendParams}>Send Data</Button>}
      {taskId !== null && <Button onClick={getTaskResult}>Get Mockup</Button>}
    </>
  );
}
