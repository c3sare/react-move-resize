import { Snap } from "../_types/SnapType";
import { SnappingEdges } from "../_types/SnappingEdgesType";
import getLineGuideStops from "./getLineGuideStops";

const GUIDELINE_OFFSET = 5;

const getGuides = (
  lineGuideStops: ReturnType<typeof getLineGuideStops>,
  itemBounds: SnappingEdges
) => {
  const resultV: Array<{
    lineGuide: number;
    diff: number;
    snap: Snap;
    offset: number;
  }> = [];

  const resultH: Array<{
    lineGuide: number;
    diff: number;
    snap: Snap;
    offset: number;
  }> = [];

  lineGuideStops.vertical.forEach((lineGuide) => {
    itemBounds.vertical.forEach((itemBound) => {
      const diff = Math.abs(lineGuide - itemBound.guide);
      if (diff < GUIDELINE_OFFSET) {
        resultV.push({
          lineGuide: lineGuide,
          diff: diff,
          snap: itemBound.snap,
          offset: itemBound.offset,
        });
      }
    });
  });

  lineGuideStops.horizontal.forEach((lineGuide) => {
    itemBounds.horizontal.forEach((itemBound) => {
      const diff = Math.abs(lineGuide - itemBound.guide);
      if (diff < GUIDELINE_OFFSET) {
        resultH.push({
          lineGuide: lineGuide,
          diff: diff,
          snap: itemBound.snap,
          offset: itemBound.offset,
        });
      }
    });
  });

  const guides: Array<{
    lineGuide: number;
    offset: number;
    orientation: "V" | "H";
    snap: "start" | "center" | "end";
  }> = [];

  const minV = resultV.sort((a, b) => a.diff - b.diff)[0];
  const minH = resultH.sort((a, b) => a.diff - b.diff)[0];

  if (minV) {
    guides.push({
      lineGuide: minV.lineGuide,
      offset: minV.offset,
      orientation: "V",
      snap: minV.snap,
    });
  }

  if (minH) {
    guides.push({
      lineGuide: minH.lineGuide,
      offset: minH.offset,
      orientation: "H",
      snap: minH.snap,
    });
  }

  return guides;
};

export default getGuides;
