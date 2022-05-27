import type { IChartApi, ISeriesApi, SeriesType } from 'lightweight-charts';
import { createContext, RefObject } from 'react';

export interface ChartContextValue {
  chart?: IChartApi;
  containerRef: RefObject<HTMLDivElement>;
}

export const ChartContext = createContext<ChartContextValue>({
  containerRef: { current: null },
});

export const SeriesContext = createContext<ISeriesApi<SeriesType> | undefined>(
  undefined,
);
