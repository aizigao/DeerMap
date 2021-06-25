import React from 'react';
import { formatMessage } from 'umi-plugin-locale';
import DeerMap from '@/components/DeerMap';
import styles from './index.less';

export default function() {
  return (
    <div className={styles.app}>
      <DeerMap></DeerMap>
    </div>
  );
}
