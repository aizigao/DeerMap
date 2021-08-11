type DeerBranchTheme = 'type1' | 'type2';

export type DeerMapBranch = {
  type: 'branch';
  __parent: DeerMapBranch | DeerMapRootNode;
  children: DeerMapBranch[];
  conf: {
    text: string;
    img?: string;
  };
  theme: DeerBranchTheme;
};

export type DeerMapRootNode = {
  type: 'root';
  lChildren: DeerMapBranch[];
  rChildren: DeerMapBranch[];
  conf: {
    text: string;
    img?: string;
  };
  theme: DeerBranchTheme;
};

const tree: DeerMapRootNode = {
  type: 'root',
  lChildren: [],
  rChildren: [],
  conf: {
    text: 'xxx',
  },
  theme: 'type1',
};
