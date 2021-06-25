import { SVG } from '@svgdotjs/svg.js';
import { ChangeEvent } from 'react';
import './index.less';

window.SVG = SVG;

type Pos = number[];
const theme = {
  rootNode: {
    bg: '#f0f',
    size: [100, 50],
  },
  branch: {
    color: '#f06',
    width: 8,
    linecap: 'round',
    linejoin: 'round',
  },
};
const T = theme;

let uid = 0;
export default class DeepMapEditor {
  draw: any; // TODO: fix type
  size: Pos = [800, 400];
  branches: any[] = [];
  _rootNode: any;
  constructor(container: HTMLElement) {
    this.draw = SVG()
      .size(...this.size)
      .viewbox('0 0 800 400')
      .addClass('deer-map--editor');
    if (container) {
      this._init(container);
    }
  }
  _init(container: HTMLElement) {
    this.draw.addTo(container);
    const rootPos = [
      (this.size[0] - T.rootNode.size[0]) / 2,
      (this.size[1] - T.rootNode.size[1]) / 2,
    ];
    this._rootNode = this.draw
      .rect(...T.rootNode.size)
      .x(rootPos[0])
      .y(rootPos[1])
      .fill(T.rootNode.bg);

    this._rootNode.on('click', () => {
      this._addBranch(this.size.map(i => i / 2));
    });
  }
  _addBranch(startPos: Pos) {
    let group = this.draw.group();
    group.addClass('deer-map__branch-ltr');
    let rect = group
      .rect(200 + T.branch.width, 40 + T.branch.width)
      .x(startPos[0] - T.branch.width / 2)
      .y(startPos[1] - T.branch.width / 2)
      .fill('rgba(0,0,0,0)');
    let path = group.path(`M ${startPos.join()} c 0,30 40,40 80,40 h 120`);

    path
      //--
      .fill('none')
      .stroke(T.branch);
    path.addClass('deer-map__branch');

    let pathBg = path.clone(false);
    pathBg.stroke({ width: 32, color: 'rgba(0,0,0,.1)' }).addClass('deer-map__branch_bg');
    group.add(pathBg);
    const pathText = path.text('请输入');
    pathText
      .attr({ startOffset: 100, side: 'right', dy: -T.branch.width / 2, tabindex: -1 })
      .font({ fontSize: 16 });

    group.on('mouseover', () => {
      rect.stroke({ color: 'red', width: 1, dasharray: [2, 2] });
    });
    group.on('mouseout', () => {
      rect.stroke('none');
    });
    pathBg.on('dblclick', () => {
      let foreignObject = this.draw.foreignObject(200, 32);
      // 抽离输入框，之后上富文件编辑器
      let inputEle = document.createElement('input'); // replaced by
      foreignObject.add(inputEle, true);
      foreignObject.move(startPos[0] + 80, startPos[1] + 15);
      inputEle.focus();
      inputEle.addEventListener('blur', (e: FocusEvent) => {
        const ele = e.currentTarget as HTMLInputElement;
        const val = ele.value;
        pathText.plain(val);
        foreignObject.remove();
      });
    });
    uid += 1;
    this.branches.push({
      uid,
      pos: 'left',
    });
  }
}
