import { DependencyList, useEffect } from 'react';

import { useChart } from '../../hooks/useChart';

export interface ChartFitContentTriggerProps {
  /**
   * Dependency list for retriggering the `chart.timeScale().fitContent()` function.
   *
   * ❗Should not change the array length since it will be used like
   * ```js
   * useEffect(effect, [...deps])
   * ```
   */
  deps?: DependencyList | undefined;
}

/**
 * Utility component for triggering `chart.timeScale().fitContent()` depends on dependency list `deps`.
 *
 * ❗Only use inside `<Chart />`.
 * Turn chart option `disableAutoContentFitOnInit = true` to prevent multiple fit content called.
 * @example
 * ```js
 * const App = () => {
 *   const data = useMemo(() => getData(), []);
 *   return (
 *     <Chart disableAutoContentFitOnInit>
 *       <AreaSeries data={data} />
 *       <ChartFitContentTrigger deps={[data]}>
 *     </Chart>
 *   );
 * }
 * ```
 */
export const ChartFitContentTrigger = ({
  deps = [],
}: ChartFitContentTriggerProps) => {
  const { chart } = useChart();

  useEffect(() => {
    if (!chart) return;

    // fit content in next runloop cycle to make sure the data changed if the data is in the `deps` list
    setTimeout(() => chart.timeScale().fitContent(), 0);
  }, [chart, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};
