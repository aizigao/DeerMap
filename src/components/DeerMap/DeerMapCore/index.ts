import { SVG } from '@svgdotjs/svg.js';
import { ChangeEvent } from 'react';
import { T, BRANCH_BLOCK_SIZE } from './config';
import Branch from './Branch';

import './index.less';
import { CPos } from './utils';

window.SVG = SVG;

type Pos = number[];

let uid = 0;
export default class DeepMapEditor {
  drawer: any; // TODO: fix type
  size: Pos = [800, 400];
  branches: any[] = [];
  branchesLeft: any[] = [];
  branchesRight: any[] = [];
  _rootNode: any;
  _curDirection: 'ltr' | 'rtl' = 'rtl';
  _changeDirectionSize: number = 3;
  cPos: CPos;
  constructor(container: HTMLElement) {
    this.drawer = SVG()
      .size(...this.size)
      .viewbox('0 0 800 400')
      .addClass('deer-map--editor')
      .css({
        background: 'rgb(217 236 235 / 34%)',
      });
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

    this.cPos = new CPos(400, 200);
    this.branches = this.branchesRight;
    this._rootNode.on('click', () => {
      this._addBranch(this.size.map(i => i / 2));
    });
    window.test = this;
  }

  _justifyBranches() {
    let totolHeight = 0;
    let top = 0;
    this.branches.forEach(item => {
      const { $ele } = item;
      const cBbox = $ele.bbox();
      const cH = cBbox.height;
      item.bbox = cBbox;
      totolHeight += cH;
    });
    top = totolHeight / 2;
    const xPos = this._curDirection === 'rtl' ? 80 : -80 - BRANCH_BLOCK_SIZE[0];
    this.branches.forEach(item => {
      const { $ele, bbox } = item;
      item.pos = [xPos, -top];
      top = top - bbox.height;
      $ele.pos(this.cPos.pos(item.pos));
      if (!$ele.injected) {
        $ele.inject(this._rootNode);
      }
    });
    console.log(this.branches);
  }

  _addBranch(startPos: Pos) {
    /**
     * 左右切换 添加
     */
    if (this.branches.length >= this._changeDirectionSize) {
      if (this._curDirection === 'ltr') {
        this._curDirection = 'rtl';
        this.branches = this.branchesRight;
      } else {
        this._curDirection = 'ltr';
        this.branches = this.branchesLeft;
      }
    }

    const $branch = Branch.of({
      cPos: this.cPos,
    });

    uid = uid + 1;
    const data = {
      uid: uid,
      diretion: this._curDirection,
      pos: { x: 0, y: 0 },
      $ele: $branch,
      injected: false,
      subBranches: [],
    };
    this.branches.push(data);
    $branch._data = data;
    $branch._parent = this.branches;

    this._justifyBranches();

    // branchGroup.addClass('deer-map__branch-ltr');
    // let rect = branchGroup
    //   .rect(200 + T.branch.width + 32, 40 + T.branch.width + 32)
    //   .x(startPos[0] - T.branch.width / 2 - 16)
    //   .y(startPos[1] - T.branch.width / 2 - 16)
    //   .fill('rgba(0,0,0,0)');
    // let path = branchGroup.path(
    //   `M ${startPos.join()} c 0,30 40,40 ${BRANCH_BLOCK_SIZE[0]},40 h ${BRANCH_BLOCK_SIZE[1]}`,
    // );

    // path
    //   //--
    //   .fill('none')
    //   .stroke(T.branch);
    // path.addClass('deer-map__branch');

    // let pathBg = path.clone(false);
    // pathBg.stroke({ width: 32, color: 'rgba(0,0,0,.1)' }).addClass('deer-map__branch_bg');
    // branchGroup.add(pathBg);
    // const pathText = path.text('请输入');
    // pathText
    //   .attr({ startOffset: 100, side: 'right', dy: -T.branch.width / 2, tabindex: -1 })
    //   .font({ fontSize: 16 });

    // branchGroup.on('mouseover', () => {
    //   rect.stroke({ color: 'red', width: 1, dasharray: [2, 2] });
    // });
    // branchGroup.on('mouseout', () => {
    //   rect.stroke('none');
    // });

    // const onEditor = () => {
    //   let foreignObject = this.drawer.foreignObject(200, 32);
    //   // 抽离输入框，之后上富文件编辑器
    //   let inputEle = document.createElement('input'); // replaced by
    //   foreignObject.add(inputEle, true);
    //   foreignObject.move(startPos[0] + 80, startPos[1] + 15);
    //   inputEle.focus();
    //   inputEle.addEventListener('blur', (e: FocusEvent) => {
    //     const ele = e.currentTarget as HTMLInputElement;
    //     const val = ele.value;
    //     pathText.plain(val);
    //     foreignObject.remove();
    //   });
    // };
    // pathText.on('dblclick', onEditor);
    // pathBg.on('dblclick', onEditor);
    // uid += 1;
    // console.log('braches:', this.branches);
  }
}
