import { useContext } from 'react';

import { ChartContext } from '../context';

export function useChart() {
  return useContext(ChartContext);
}
