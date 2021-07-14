import React, { useEffect } from 'react';
import DeepMapEditor from './core';
import ss from './index.less';

type DeerMapProps = {};

const config = {
  mapSize: [2000, 1080],
  circleRadius: 50,
};

const mapWidth = config.mapSize[0];
const mapHeight = config.mapSize[1];

const DeerMap: React.FC<DeerMapProps> = () => {
  const createDeerMap = (ref: HTMLDivElement) => {
    new DeepMapEditor(ref);
  };
  return <div className={ss['editor-container']} ref={createDeerMap}></div>;
};

export default DeerMap;
