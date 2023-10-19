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
        stroke: "#0e5e8e",
        strokeWidth: 2,
        name: "guid-line",
      });
      layer.add(line);
      line.absolutePosition({
        x: 0,
        y: lg.lineGuide,
      });
    } else if (lg.orientation === "V") {
      const line = new Konva.Line({
        points: [0, -6000, 0, 6000],
        stroke: "#0e5e8e",
        strokeWidth: 2,
        name: "guid-line",
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
