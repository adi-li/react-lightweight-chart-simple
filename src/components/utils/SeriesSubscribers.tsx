import {
  IChartApi,
  ISeriesApi,
  MouseEventParams,
  SeriesOptionsMap,
} from 'lightweight-charts';
import { useEffect } from 'react';

import { useChart } from '../../hooks/useChart';
import { useSeries } from '../../hooks/useSeries';

type MapValueType<T> = T extends Map<unknown, infer V> ? V : never;

export type SeriesHoverDataHandler = (
  value: MapValueType<MouseEventParams['seriesPrices']> | undefined,
  event: MouseEventParams,
  series: ISeriesApi<keyof SeriesOptionsMap>,
  chart: IChartApi,
) => void;

/**
 * Call `handler` when hovering the chart, with current pointed time and value.
 *
 * ❗Only use inside `<Series />`.
 */
export const SeriesHoverDataSubscriber = ({
  handler,
}: {
  handler: SeriesHoverDataHandler;
}) => {
  const { chart } = useChart();
  const series = useSeries();

  useEffect(() => {
    if (!series || !chart) return;

    const subscriber = (event: MouseEventParams) => {
      handler(event.seriesPrices.get(series), event, series, chart);
    };

    chart.subscribeCrosshairMove(subscriber);
    return () => chart.unsubscribeCrosshairMove(subscriber);
  }, [chart, series, handler]);

  return null;
};
