import { SVG } from '@svgdotjs/svg.js';
import { ChangeEvent } from 'react';
import './index.less';

window.SVG = SVG;

type Pos = number[];
const BRANCH_SIZE_BASES = [80, 120];

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
  drawer: any; // TODO: fix type
  size: Pos = [800, 400];
  branches: any[] = [];
  _rootNode: any;
  constructor(container: HTMLElement) {
    this.drawer = SVG()
      .size(...this.size)
      .viewbox('0 0 800 400')
      .addClass('deer-map--editor');
    if (container) {
      this._init(container);
    }
  }
  _init(container: HTMLElement) {
    this.drawer.addTo(container);
    const rootPos = [
      (this.size[0] - T.rootNode.size[0]) / 2,
      (this.size[1] - T.rootNode.size[1]) / 2,
    ];
    this._rootNode = this.drawer
      .rect(...T.rootNode.size)
      .x(rootPos[0])
      .y(rootPos[1])
      .fill(T.rootNode.bg);

    this._rootNode.on('click', () => {
      this._addBranch(this.size.map(i => i / 2));
    });
  }
  _addBranch(startPos: Pos) {
    const branchGroup = this.drawer.group();
    branchGroup.addClass('deer-map__branch-ltr');
    let rect = branchGroup
      .rect(200 + T.branch.width + 32, 40 + T.branch.width + 32)
      .x(startPos[0] - T.branch.width / 2 - 16)
      .y(startPos[1] - T.branch.width / 2 - 16)
      .fill('rgba(0,0,0,0)');
    let path = branchGroup.path(
      `M ${startPos.join()} c 0,30 40,40 ${BRANCH_SIZE_BASES[0]},40 h ${BRANCH_SIZE_BASES[1]}`,
    );

    path
      //--
      .fill('none')
      .stroke(T.branch);
    path.addClass('deer-map__branch');

    let pathBg = path.clone(false);
    pathBg.stroke({ width: 32, color: 'rgba(0,0,0,.1)' }).addClass('deer-map__branch_bg');
    branchGroup.add(pathBg);
    const pathText = path.text('请输入');
    pathText
      .attr({ startOffset: 100, side: 'right', dy: -T.branch.width / 2, tabindex: -1 })
      .font({ fontSize: 16 });

    branchGroup.on('mouseover', () => {
      rect.stroke({ color: 'red', width: 1, dasharray: [2, 2] });
    });
    branchGroup.on('mouseout', () => {
      rect.stroke('none');
    });

    const onEditor = () => {
      let foreignObject = this.drawer.foreignObject(200, 32);
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
    };
    pathText.on('dblclick', onEditor);
    pathBg.on('dblclick', onEditor);
    uid += 1;
    this.branches.push({
      uid,
      diretion: 'ltr',
      pos: [0, 0],
      ele: branchGroup,
    });
    console.log('braches:', this.branches);
  }
}
