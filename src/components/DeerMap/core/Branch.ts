import { SVG } from '@svgdotjs/svg.js';
import { BRANCH_BLOCK_SIZE, T } from './config';
import { CPos, randomColor } from './utils';

let uid = 0;
export default class Branch {
  private _branch: import('@svgdotjs/svg.js').G;
  _data: any; // TODO: check
  _parent: any;
  cPos: CPos;
  private _chldren: import('@svgdotjs/svg.js').G;
  private _rect: import('@svgdotjs/svg.js').Rect;
  constructor(cPos: CPos) {
    this._branch = SVG().group();
    this._init();
  }
  static of(cPos: CPos) {
    return new Branch(cPos);
  }
  _init() {
    const branch = this._branch;
    branch.addClass('deer-map__branch-ltr');
    this._chldren = branch.group().addClass('deer-map__branch-children');
    this._rect = branch
      // --
      .rect(...BRANCH_BLOCK_SIZE)
      .fill(randomColor());
    this._bind();
  }
  bbox() {
    return this._branch.bbox();
  }
  pos([x, y]: number[]) {
    const reactBbox = this._rect.bbox();
    this.cPos = new CPos(x + reactBbox.width, y + reactBbox.height / 2);
    this._branch.x(x).y(y);
  }
  inject(parentNode: any) {
    this._branch.insertBefore(parentNode);
  }
  _justifyBranches(childrens: any[], parent: any) {
    let totolHeight = 0;
    let top = 0;
    childrens.forEach(item => {
      const { $ele } = item;
      const cBbox = $ele.bbox();
      const cH = cBbox.height;
      item.bbox = cBbox;
      totolHeight += cH;
    });
    top = totolHeight / 2;
    const xPos = 40;
    childrens.forEach(item => {
      const { $ele, bbox } = item;
      item.pos = [xPos, -top];
      top = top - bbox.height;
      $ele.pos(this.cPos.pos(item.pos));
      if (!$ele.injected) {
        this._chldren.add($ele._branch);
      }
    });
    if (parent) {
      this._justifyBranches();
    }
  }
  _bind() {
    this._branch.on('click', e => {
      e.stopPropagation();
      e.preventDefault();
      const $subBranch = Branch.of({ cPos: this.cPos });
      const subData = {
        uid,
        pos: { x: 0, y: 0 },
        $ele: $subBranch,
        injected: false,
        subBranches: [],
      };
      this._data.subBranches.push(subData);
      $subBranch._data = subData;
      this._justifyBranches(this._data.subBranches, this._data._parent);
    });
    // remove
    //     this._branch.on('click', e => {
    //       this._parent.forEach((item, idx) => {
    //         if (item === this._data) {
    //           this._parent.splice(idx, 1);
    //           this._branch.remove();
    //         }
    //       });
    //     });
  }
}
