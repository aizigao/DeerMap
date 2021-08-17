import { SVG } from '@svgdotjs/svg.js';

interface IEditorMap {
  width: number;
  height: number;
  viewPort: number[];
}

/**
 * TODO:
 * 1. 自动扩展
 * 2. 小地图
 * 3. 数据存储
 */
export default class EditorMap {
  drawer: import('@svgdotjs/svg.js').Svg;
  constructor(opt: IEditorMap) {
    this.drawer = this.init(opt);
  }
  static of(opt: IEditorMap) {
    return new EditorMap(opt);
  }
  init({ width, height, viewPort }: IEditorMap) {
    return SVG()
      .size(width, height)
      .viewbox(viewPort.join(' '))
      .addClass('deer-map')
      .css({
        // background: '#e0e0e0',
      });
  }
}
