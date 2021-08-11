import { SVG } from '@svgdotjs/svg.js';

interface IEditorMap {
  width: number;
  height: number;
}
export default class EditorMap {
  drawer: import('@svgdotjs/svg.js').Svg;
  constructor(opt: IEditorMap) {
    this.drawer = this.init(opt);
  }
  static of(opt: IEditorMap) {
    return new EditorMap(opt);
  }
  init({ width, height }: IEditorMap) {
    return SVG()
      .size(width, height)
      .viewbox(`0 0 ${width} ${height}`)
      .addClass('deer-map')
      .css({
        background: '#e0e0e0',
      });
  }
}
