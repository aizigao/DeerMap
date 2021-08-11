export type Direction = 'ltr' | 'rtl';

export interface Bbox {
  x: number;
  y: number;
  w: number;
  h: number;
  // container size
  cW: number;
  cH: number;
}

export interface OptType {
  width: number;
  height: number;
  className: string;
  intialPos: number[];
  theme: string; // TODO: check
}
