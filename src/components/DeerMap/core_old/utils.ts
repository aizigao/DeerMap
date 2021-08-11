export class CPos {
  cx: number;
  cy: number;
  constructor(cx: number, cy: number) {
    this.cx = cx;
    this.cy = cy;
  }
  x(x: number) {
    return this.cx + x;
  }
  y(y: number) {
    return this.cy + y;
  }
  pos([xx, yy]: number[]) {
    return [this.x(xx), this.y(yy)];
  }
}

export const randomColor = () =>
  '#' +
  Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
