import { useContext } from 'react';

import { ChartContext } from '../context';

/**
 * Get the `lightweight-charts` chart api object and the container `<div />` referrence.
 *
 * ❗Only use inside `<Chart />`.
 *
 * @returns object.chart: `IChartApi`
 * @returns object.containerRef: `React.Ref<HTMLDivElement>`
 */
export function useChart() {
  return useContext(ChartContext);
}
