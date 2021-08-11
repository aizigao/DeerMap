import RootNode from './RootNode';
import { branchType, theme } from './constant';
import { Bbox, Direction } from './typing';
import { SVG } from '@svgdotjs/svg.js';

interface Opt {}
export default class BranchGroup {
  bbox: Bbox = { x: 0, y: 0, w: 0, h: 0, cW: 0, cH: 0 };
  static of(opt: Opt) {
    return new BranchGroup(opt);
  }
  constructor({}: Opt) {
    Object.assign(this.bbox, { x: 0 });
  }
}
