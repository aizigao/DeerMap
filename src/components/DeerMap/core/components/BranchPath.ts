import { theme } from '../constant';
import { Direction } from '../typing';
import { SVG, TextPath, Path, Element, Text } from '@svgdotjs/svg.js';

interface Opt {
  level: number;
  direction: Direction;
}

const BranchTheme = theme['branch'];

const formatPos = (prefix: string, { x, y }: { x: number; y: number }) => {
  return prefix + ' ' + x + ' ' + y + ' ';
};

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
  private _drawerNode: Path;
  private _reverseDrawerNode: Path;
  private _branchNode?: Element;
  private _path: string = '';
  private _reversePath: string = '';
  private _startPos: { x: number; y: number };
  private _endPos: { x: number; y: number };
  private _curvePos: { x: number; y: number };
  private _curvePosArr: { x: number; y: number }[];
  private _direction: string;
  static of(opt: Opt) {
    return new BranchPath(opt);
  }
  constructor(opt: Opt) {
    const { level, direction } = opt;
    this._direction = direction;
    this._startPos = { x: 0, y: 0 };
    this._endPos = { x: 0, y: 0 };
    this._curvePos = { x: 0, y: 0 };
    this._curvePosArr = [];
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
    this._reverseDrawerNode = SVG()
      .path()
      .addClass('deer-map__branch__path--reverse')
      // .stroke({ color: 'blue', width: 2 })
      .fill('none');
  }

  insertInto(branchNode: import('@svgdotjs/svg.js').Element) {
    this._branchNode = branchNode;
    this._drawerNode.addTo(this._branchNode);
    this._reverseDrawerNode.addTo(this._branchNode);
    if (this._direction === 'ltr') {
      this._drawerNode
        .text(((add: Text) => {
          add.tspan('请输入分支').dy(-10);
        }) as any)
        .addClass('deer-map__branch__path__text');
    } else {
      this._reverseDrawerNode
        .text(((add: Text) => {
          add.tspan('请输入分支').dy(-10);
        }) as any)
        .addClass('deer-map__branch__path__text');
    }
  }

  start({ x, y }: Pos) {
    this._startPos = { x, y };
    // this._path = `M ${this._startPos.x} ${this._startPos.y} `;
    return this;
  }

  curvesTo({ x, y }: Pos) {
    this._curvePos = { x, y };
    this._curvePosArr = [
      {
        x: this._startPos.x,
        y: (y - this._startPos.y) * (1 / 2) + this._startPos.y,
      },
      {
        x: (x - this._startPos.x) * (3 / 5) + this._startPos.x,
        y: y,
      },
      { x: x, y: y },
    ];
    return this;
  }
  end({ x, y }: Pos) {
    this._endPos = { x, y };

    this._path = formatPos('M', this._startPos);
    this._path += 'C' + this._curvePosArr.map(item => formatPos('', item)).join('');
    this._path += formatPos('L', this._endPos);

    const curvePosReverse = this._curvePosArr.reverse();
    this._reversePath = formatPos('M', this._endPos);
    this._reversePath += formatPos('L', curvePosReverse.splice(0, 1)[0]);
    this._reversePath +=
      'C' +
      curvePosReverse.map(item => formatPos('', item)).join('') +
      formatPos('', this._startPos);

    this._drawerNode.attr('d', this._path);
    this._reverseDrawerNode.attr('d', this._reversePath);

    if (this._direction === 'ltr') {
      let textPathNode: null | TextPath = null;

      const siblings = this._drawerNode.siblings();
      for (const ele of siblings) {
        if (ele.type === 'text') {
          textPathNode = ele.findOne('textPath') as TextPath;
        }
      }

      if (textPathNode) {
        const offset = this._drawerNode.length() - (this._endPos.x - this._curvePos.x);
        textPathNode.attr({
          startOffset: Math.round(offset),
        });
      }
    } else {
      const textPathNode = this._reverseDrawerNode.next().findOne('textPath');
      if (textPathNode) {
        textPathNode.attr({
          startOffset: 12,
        });
      }
    }

    return this;
  }
}
