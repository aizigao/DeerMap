import RootNode from './RootNode';
import { branchType, rootNodeType, theme } from './constant';
import { Bbox, Direction } from './typing';
import { SVG, withWindow } from '@svgdotjs/svg.js';
import { randomColor } from './utils';
import BranchPath from './components/branchPath';

type ParentType = RootNode | Branch;
interface Opt {
  parent: ParentType;
  direction: Direction;
}

const BranchTheme = theme['branch'];

/**
 * TODO:
 * - branch 拖拽
 * -子组件:
 *   * 线
 *   * text
 */
export default class Branch {
  type = branchType;
  children: Branch[] = [];
  _parent: ParentType;
  bbox: Bbox = { x: 0, y: 0, w: 0, h: 0, cW: 0, cH: 0 };
  private _level = 0;
  private _drawerNode: import('@svgdotjs/svg.js').G;
  private _ractBg: import('@svgdotjs/svg.js').Rect;
  direction: Direction;
  private _pathNode: BranchPath;
  static of(opt: Opt) {
    return new Branch(opt);
  }
  constructor({ parent, direction }: Opt) {
    this._parent = parent;
    this._drawerNode = SVG().group();
    this.direction = direction;
    this._level = this._parent.level + 1;
    const parentBbox = this._parent.bbox;
    const [w, h] = BranchTheme.intialSize;
    const [x, y] = [
      // -- x
      this.direction === 'ltr' ? parentBbox.x + parentBbox.w : parentBbox.x - w,
      // -- y
      parentBbox.y - (h - parentBbox.h) / 2,
    ];
    Object.assign(this.bbox, { x, y, w, h });
    this._drawerNode.addClass('deep-map-branch');
    this._ractBg = this._drawerNode
      .rect(w, h)
      .x(x)
      .y(y)
      .fill(randomColor());
    this._pathNode = BranchPath.of({ level: this._level, direction: this.direction });
    this._pathNode.insertInto(this._drawerNode);
    this._ractBg.on('click', () => {
      this._addSubBranch();
    });
  }
  get level() {
    return this._level;
  }

  insertTo(parentDom: import('@svgdotjs/svg.js').Element) {
    this._drawerNode.insertBefore(parentDom);
    this.justifyBboxSize(this.direction);
  }

  justifyBboxPos(partialBbox: Partial<Bbox>) {
    const { x, y, w, h, cW, cH } = { ...this.bbox, ...partialBbox };
    this._ractBg.x(x).y(y);
    Object.assign(this.bbox, { x, y, w, h, cW: Math.max(cW, w), cH: Math.max(cH, h) });
    const parentbbox = this._parent.bbox;
    this.justifyChidrenPos();
    this._pathNode
      .start({
        x:
          this._parent.type === rootNodeType
            ? parentbbox.x + parentbbox.w / 2
            : parentbbox.x + (this.direction === 'ltr' ? parentbbox.w : 0),
        y: parentbbox.h / 2 + parentbbox.y,
      })
      .curvesTo({
        x: this.bbox.x + 80,
        y: this.bbox.y + this.bbox.h / 2,
      })
      .end({
        x: this.bbox.x + (this.direction === 'ltr' ? this.bbox.w : 0),
        y: this.bbox.y + this.bbox.h / 2,
      });
    this._drawerNode.attr({ 'data-bbox': JSON.stringify(this.bbox) });
  }

  justifyBboxSize(dirtion: Direction) {
    const chilrenH = this.children.reduce((assem, item) => {
      return item.bbox.cH + assem;
    }, 0);
    this.bbox.cH = Math.max(chilrenH, this.bbox.h);

    this._parent.justifyBboxSize(dirtion);
    this._drawerNode.attr({ 'data-bbox': JSON.stringify(this.bbox) });
  }

  justifyChidrenPos() {
    let totalH = 0;
    const children = this.children;
    children.forEach(branch => {
      totalH += branch.bbox.cH;
    });
    let lastY = this.bbox.y - (totalH / 2 - this.bbox.h / 2);
    children.forEach(branch => {
      branch.justifyBboxPos({ y: lastY + (branch.bbox.cH - branch.bbox.h) / 2 });
      lastY += branch.bbox.cH;
    });
  }

  private _addSubBranch() {
    const direction = this.direction;
    const children = this.children;
    const branch = Branch.of({ parent: this, direction });
    children.push(branch);
    branch.insertTo(this._ractBg);
  }
}
