export default function getCorner(
  pivotX: number,
  pivotY: number,
  diffX: number,
  diffY: number,
  angle: number
) {
  const distance = Math.sqrt(diffX * diffX + diffY * diffY);

  angle += Math.atan2(diffY, diffX);

  const x = pivotX + distance * Math.cos(angle);
  const y = pivotY + distance * Math.sin(angle);

  return { x: x, y: y };
}
