import type { Image as ImageCanvasType } from "konva/lib/shapes/Image";
import type { Stage as StageType } from "konva/lib/Stage";
import type {
  Box,
  Transformer as TransformerType,
} from "konva/lib/shapes/Transformer";

import { Image as ImageCanvas, Transformer } from "react-konva";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { ImgParamsType } from "../_types/ImgParamsType";
import getClientRect from "../_utils/getClientRect";
import Konva from "konva";
import getLineGuideStops from "../_utils/getLineGuideStops";
import getObjectSnappingEdges from "../_utils/getObjectSnappingEdges";
import getGuides from "../_utils/getGuides";
import drawGuides from "../_utils/drawGuides";

type ImgKonvaProps = {
  onSelect: () => void;
  image: HTMLImageElement;
  isSelected: boolean;
  data: ImgParamsType;
  setData: Dispatch<SetStateAction<ImgParamsType>>;
  stage: StageType;
  layer: Konva.Layer;
};

const ImgKonva: React.FC<ImgKonvaProps> = ({
  onSelect,
  image,
  isSelected,
  data,
  setData,
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
    onSelect();
    setData((prev) => {
      return {
        ...prev,
        isDragging: id === prev.id,
      };
    });
  };
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    setData((prev) => {
      return {
        ...prev,
        x: e.target.x(),
        y: e.target.y(),
        isDragging: false,
      };
    });

    const layer = e.target.getLayer()!;
    layer.find(".guid-line").forEach((l) => l.destroy());
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const layer = e.target.getLayer()!;

    layer.find(".guid-line").forEach((l) => l.destroy());

    const lineGuideStops = getLineGuideStops(e.target as Konva.Shape);
    const itemBounds = getObjectSnappingEdges(e.target as Konva.Shape);

    const guides = getGuides(lineGuideStops, itemBounds);

    drawGuides(guides, layer);

    const box = e.currentTarget.getClientRect();
    const absPos = e.currentTarget.getAbsolutePosition();

    const offsetX = box.x - absPos.x;
    const offsetY = box.y - absPos.y;

    guides.forEach((lg) => {
      switch (lg.snap) {
        case "start": {
          switch (lg.orientation) {
            case "V": {
              absPos.x = lg.lineGuide + lg.offset;
              break;
            }
            case "H": {
              absPos.y = lg.lineGuide + lg.offset;
              break;
            }
          }
          break;
        }
        case "center": {
          switch (lg.orientation) {
            case "V": {
              absPos.x = lg.lineGuide + lg.offset;
              break;
            }
            case "H": {
              absPos.y = lg.lineGuide + lg.offset;
              break;
            }
          }
          break;
        }
        case "end": {
          switch (lg.orientation) {
            case "V": {
              absPos.x = lg.lineGuide + lg.offset;
              break;
            }
            case "H": {
              absPos.y = lg.lineGuide + lg.offset;
              break;
            }
          }
          break;
        }
      }
    });

    if (box.x < 0) {
      absPos.x = -offsetX;
    }
    if (box.y < 0) {
      absPos.y = -offsetY;
    }
    if (box.x + box.width > stage.width()) {
      absPos.x = stage.width() - box.width - offsetX;
    }
    if (box.y + box.height > stage.height()) {
      absPos.y = stage.height() - box.height - offsetY;
    }
    e.currentTarget.setAbsolutePosition(absPos);
  };

  const onTransformEnd = (e: KonvaEventObject<Event>) => {
    const node = imageRef.current!;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    setData((prev) => ({
      ...prev,
      x: node.x(),
      y: node.y(),
      rotation: Math.round(node.rotation()),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(node.height() * scaleY),
      isDragging: false,
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
        id={data.id}
        x={data.x}
        y={data.y}
        width={data.width}
        height={data.height}
        draggable
        rotation={data.rotation}
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
            setData((prev) => ({
              ...prev,
              isDragging: true,
            }));
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
