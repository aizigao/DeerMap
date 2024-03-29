import Branch from './Branch';
import { rootNodeType, theme } from './constant';
import { Bbox, Direction, OptType } from './typing';

type Drawer = import('@svgdotjs/svg.js').Svg;

// TODO: inject it
const rootNodeTheme = theme['rootNode'];

export default class RootNode {
  leftChildren: Branch[] = [];
  rightChildren: Branch[] = [];
  private _level = 0;
  bbox: Bbox = { x: 0, y: 0, w: 0, h: 0, cW: 0, cH: 0 };
  private _maxSideNumInital = 3;
  private _drawerNode: import('@svgdotjs/svg.js').Rect;
  type = rootNodeType;
  public static of(opt: OptType, drawer: Drawer) {
    return new RootNode(opt, drawer);
  }

  constructor(opt: OptType, drawer: Drawer) {
    const [w, h] = rootNodeTheme.intialSize;
    const [x, y] = [(opt.width - w) / 2, (opt.height - h) / 2];
    this._drawerNode = drawer
      .rect(...rootNodeTheme.intialSize)
      .x(x)
      .y(y)
      .fill(rootNodeTheme.colors.bgc);
    this.bbox = { x, y, w, h, cW: 0, cH: 0 };
    this.bindEvents();
  }

  get level() {
    return this._level;
  }
  bindEvents() {
    this._drawerNode.on('click', () => {
      this._addBranch();
    });
  }

  justifyBboxSize(direction: Direction) {
    const curChildren = direction === 'ltr' ? this.rightChildren : this.leftChildren;
    let totalH = 0;
    curChildren.forEach(branch => {
      totalH += branch.bbox.cH;
    });
    let lastY = this.bbox.y - (totalH / 2 - this.bbox.h / 2);
    curChildren.forEach(branch => {
      branch.justifyBboxPos({ y: lastY + (branch.bbox.cH - branch.bbox.h) / 2 });
      lastY += branch.bbox.cH;
    });
  }

  private _addBranch() {
    let curChildren = null;
    let direction: Direction = 'ltr';
    if (this.rightChildren.length < this._maxSideNumInital) {
      curChildren = this.rightChildren;
      direction = 'ltr';
    } else if (this.rightChildren.length <= this.leftChildren.length) {
      curChildren = this.rightChildren;
      direction = 'ltr';
    } else {
      curChildren = this.leftChildren;
      direction = 'rtl';
    }
    const branch = Branch.of({ parent: this, direction });
    curChildren.push(branch);
    branch.insertTo(this._drawerNode);
  }
}
