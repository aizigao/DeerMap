import EditorMap from './EditorMap';
import RootNode from './RootNode';

import './index.less';
import { OptType } from './typing';

const defaultOpt = {
  width: 1200,
  height: 800,
  className: 'deer-map-wrap',
  intialPos: [1200 / 2, 800 / 2],
  theme: 'default',
};

export default class DeepMapEditor {
  private _rootNode: RootNode | null = null;
  private _opt: OptType;
  private _mountEle: HTMLElement;
  private _editFieldDrawer: import('@svgdotjs/svg.js').Svg | undefined;
  constructor(mountEle: HTMLElement, opt: Partial<OptType>) {
    // TODO: check opt validate
    this._opt = { ...defaultOpt, ...opt };
    this._mountEle = mountEle;
    this.createDeerMap();
  }
  createDeerMap() {
    this._editFieldDrawer = this._createEditField();
    this._rootNode = RootNode.of(this._opt, this._editFieldDrawer);
  }
  _createEditField() {
    const editFiled = EditorMap.of({ width: this._opt.width, height: this._opt.height });
    editFiled.drawer.addTo(this._mountEle);
    return editFiled.drawer;
  }
}
