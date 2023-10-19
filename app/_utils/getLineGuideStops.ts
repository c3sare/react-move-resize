import Konva from "konva";

const getLineGuideStops = (skipShape: Konva.Shape) => {
  const stage = skipShape.getStage();
  if (!stage) return { vertical: [], horizontal: [] };

  const vertical = [0, stage.width() / 2, stage.width()];
  const horizontal = [0, stage.height() / 2, stage.height()];

  stage.find(".object").forEach((guideItem) => {
    if (guideItem === skipShape) {
      return;
    }
    const box = guideItem.getClientRect();

    vertical.push(box.x, box.x + box.width, box.x + box.width / 2);
    horizontal.push(box.y, box.y + box.height, box.y + box.height / 2);
  });
  return {
    vertical,
    horizontal,
  };
};

export default getLineGuideStops;
