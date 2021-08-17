import { theme } from '../constant';
import { Direction } from '../typing';
import { SVG } from '@svgdotjs/svg.js';

interface Opt {
  level: number;
  direction: Direction;
}

const BranchTheme = theme['branch'];

type Pos = {
  x: number;
  y: number;
};

const levelWidthMap = {
  1: 12,
  2: 8,
  other: 5,
};

export default class BranchPath {
  private _drawerNode: import('@svgdotjs/svg.js').Path;
  private _branchNode?: import('@svgdotjs/svg.js').Element;
  private _path: string = '';
  private _startPos: { x: number; y: number };
  private _endPos: { x: number; y: number };
  private _curvePos: { x: number; y: number };
  private _direction: string;
  static of(opt: Opt) {
    return new BranchPath(opt);
  }
  constructor(opt: Opt) {
    const { level, direction } = opt;
    // TODO: direction
    this._direction = direction;
    this._startPos = { x: 0, y: 0 };
    this._endPos = { x: 0, y: 0 };
    this._curvePos = { x: 0, y: 0 };
    this._drawerNode = SVG()
      .path()
      .addClass('deer-map__branch__path')
      .fill('none')
      .stroke({
        //--
        color: '#f06',
        width:
          level in levelWidthMap
            ? levelWidthMap[level as keyof typeof levelWidthMap]
            : levelWidthMap.other,
        linecap: 'round',
        linejoin: 'round',
      });
  }

  insertInto(branchNode: import('@svgdotjs/svg.js').Element) {
    this._branchNode = branchNode;
    this._drawerNode.addTo(this._branchNode);
  }

  start({ x, y }: Pos) {
    this._startPos = { x, y };
    this._path = `M ${this._startPos.x} ${this._startPos.y}, `;
    return this;
  }

  curvesTo({ x, y }: Pos) {
    this._curvePos = { x, y };

    const curvesEnds = [
      `${this._startPos.x} ${(this._curvePos.y - this._startPos.y) * (1 / 2) + this._startPos.y}`,
      `${(this._curvePos.x - this._startPos.x) * (3 / 5) + this._startPos.x} ${this._curvePos.y}`,
    ];
    this._path += `C ${curvesEnds.join(', ')}, ${this._curvePos.x} ${this._curvePos.y}, `;
    return this;
  }
  end({ x, y }: Pos) {
    this._endPos = { x, y };

    this._path += `L ${x - (this._direction === 'ltr' ? 2 : -2)} ${y}`;
    this._drawerNode.attr('d', this._path);
    return this;
  }
}
