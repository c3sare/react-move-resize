import type { Image as ImageCanvasType } from "konva/lib/shapes/Image";
import type { Stage as StageType } from "konva/lib/Stage";
import type {
  Box,
  Transformer as TransformerType,
} from "konva/lib/shapes/Transformer";

import { Image as ImageCanvas, Transformer } from "react-konva";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { ImgParamsType } from "./types/ImgParamsType";
import getClientRect from "./utils/getClientRect";

type ImageProps = {
  onSelect: () => void;
  image: HTMLImageElement;
  isSelected: boolean;
  img: ImgParamsType;
  setImg: Dispatch<SetStateAction<ImgParamsType>>;
  stage: StageType;
};

const Image: React.FC<ImageProps> = ({
  onSelect,
  image,
  isSelected,
  img,
  setImg,
  stage,
}) => {
  const imageRef = useRef<ImageCanvasType>(null);
  const trRef = useRef<TransformerType>(null);

  useEffect(() => {
    if (isSelected) {
      trRef.current!.nodes([imageRef.current!]);
      trRef.current!.getLayer()!.batchDraw();
    }
  }, [isSelected]);

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    const id = e.target.id();
    setImg((prev) => {
      return {
        ...prev,
        isDragging: id === prev.id,
      };
    });
  };
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    setImg((prev) => {
      return {
        ...prev,
        isDragging: false,
      };
    });
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const box = e.currentTarget.getClientRect();
    const absPos = e.currentTarget.getAbsolutePosition();
    // where are shapes inside bounding box of all shapes?
    const offsetX = box.x - absPos.x;
    const offsetY = box.y - absPos.y;

    // we total box goes outside of viewport, we need to move absolute position of shape
    const newAbsPos = { ...absPos };
    if (box.x < 0) {
      newAbsPos.x = -offsetX;
    }
    if (box.y < 0) {
      newAbsPos.y = -offsetY;
    }
    if (box.x + box.width > stage.width()) {
      newAbsPos.x = stage.width() - box.width - offsetX;
    }
    if (box.y + box.height > stage.height()) {
      newAbsPos.y = stage.height() - box.height - offsetY;
    }
    e.currentTarget.setAbsolutePosition(newAbsPos);
  };

  return (
    <>
      <ImageCanvas
        ref={imageRef}
        onClick={onSelect}
        onTap={onSelect}
        alt="Mockup"
        image={image}
        id={img.id}
        x={img.x}
        y={img.y}
        draggable
        rotation={img.rotation}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox: Box, newBox: Box) => {
            const box = getClientRect(newBox);
            const isOut =
              box.x < 0 ||
              box.y < 0 ||
              box.x + box.width > stage.width() ||
              box.y + box.height > stage.height();

            if (isOut) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default Image;
