import type { IChartApi, ISeriesApi, SeriesType } from 'lightweight-charts';
import { createContext, RefObject } from 'react';

export interface ChartContextValue {
  /**
   * The chart api object.
   */
  chart?: IChartApi;
  /**
   * The chart container `<div />` element.
   */
  containerRef: RefObject<HTMLDivElement>;
}

export const ChartContext = createContext<ChartContextValue>({
  containerRef: { current: null },
});

export const SeriesContext = createContext<ISeriesApi<SeriesType> | undefined>(
  undefined,
);
