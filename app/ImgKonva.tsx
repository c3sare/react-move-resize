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

type ImgKonvaProps = {
  onSelect: () => void;
  image: HTMLImageElement;
  isSelected: boolean;
  img: ImgParamsType;
  setImg: Dispatch<SetStateAction<ImgParamsType>>;
  stage: StageType;
};

const ImgKonva: React.FC<ImgKonvaProps> = ({
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
        x: Math.floor(e.target.x()),
        y: Math.floor(e.target.y()),
        isDragging: false,
      };
    });
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const box = e.currentTarget.getClientRect();
    const absPos = e.currentTarget.getAbsolutePosition();

    const offsetX = box.x - absPos.x;
    const offsetY = box.y - absPos.y;

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

  const onTransformEnd = (e: KonvaEventObject<Event>) => {
    const node = imageRef.current!;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    setImg((prev) => ({
      ...prev,
      x: Math.floor(node.x()),
      y: Math.floor(node.y()),
      rotation: Math.round(node.rotation()),
      width: Math.ceil(Math.max(5, node.width() * scaleX)),
      height: Math.ceil(Math.max(node.height() * scaleY)),
    }));
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
        width={img.width}
        height={img.height}
        draggable
        rotation={img.rotation}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
        onTransformEnd={onTransformEnd}
      />
      {isSelected && (
        <Transformer
          keepRatio
          flipEnabled={false}
          rotationSnapTolerance={5}
          rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
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

export default ImgKonva;