import { randomColor } from './utils';

export const branchType = Symbol('branch');
export const rootNodeType = Symbol('rootNode');

const colors = {};

// themes config
export const theme = {
  // https://www.materialpalette.com/
  rootNode: {
    intialSize: [150, 60],
    colors: {
      bgc: '#004d40',
      text: '#e0f2f1',
      border: '#004d40',
    },
  },
  branch: {
    intialSize: [240, 106],
    bendingW: 76,
    colors: {
      bgc: randomColor(),
      text: '#e0f2f1',
      border: '#004d40',
    },
  },
};
