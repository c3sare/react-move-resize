import Konva from "konva";
import getGuides from "./getGuides";

const drawGuides = (
  guides: ReturnType<typeof getGuides>,
  layer: Konva.Layer
) => {
  guides.forEach((lg) => {
    if (lg.orientation === "H") {
      const line = new Konva.Line({
        points: [-6000, 0, 6000, 0],
        stroke: "rgb(0, 161, 255)",
        strokeWidth: 1,
        name: "guid-line",
        dash: [4, 6],
      });
      layer.add(line);
      line.absolutePosition({
        x: 0,
        y: lg.lineGuide,
      });
    } else if (lg.orientation === "V") {
      const line = new Konva.Line({
        points: [0, -6000, 0, 6000],
        stroke: "rgb(0, 161, 255)",
        strokeWidth: 1,
        name: "guid-line",
        dash: [4, 6],
      });
      layer.add(line);
      line.absolutePosition({
        x: lg.lineGuide,
        y: 0,
      });
    }
  });
};

export default drawGuides;
