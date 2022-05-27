import { useContext } from 'react';

import { ChartContext } from '../context';

/**
 * Get the `lightweight-charts` chart api object and the container `<div />` referrence.
 * Only available inside `<Chart />`.
 */
export function useChart() {
  return useContext(ChartContext);
}
