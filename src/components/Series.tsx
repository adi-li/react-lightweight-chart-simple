import {
  DeepPartial,
  IChartApi,
  ISeriesApi,
  SeriesDataItemTypeMap,
  SeriesMarker,
  SeriesOptionsMap,
  SeriesPartialOptionsMap,
  SeriesType,
  Time,
} from 'lightweight-charts';
import * as React from 'react';

import { SeriesContext } from '../context';
import { useChart } from '../hooks/useChart';

export interface SeriesProps<TSeriesType extends SeriesType> {
  /**
   * Data for display, used for `series.setData()`.
   * Memoized is recommended to prevent setting multiple times.
   */
  data?: SeriesDataItemTypeMap[TSeriesType][];
  /**
   * Used to pass the incremental data, used for `series.update()`.
   */
  latestItem?: SeriesDataItemTypeMap[TSeriesType];
  /**
   * Series options, please refer to `lightweight-charts` documents.
   * Memoization is recommended to prevent calling `series.applyOptions()` multiple times.
   */
  options?: DeepPartial<SeriesOptionsMap[TSeriesType]>;
  /**
   * Used to display series marker via `series.setMarkers()`
   * Memoization is recommended to prevent calling `series.setMarkers()` multiple times.
   */
  markers?: SeriesMarker<Time>[];
  /**
   * Only `<PriceLine />` is accepted, unknown behavior may occurs otherwise.
   */
  children?: React.ReactNode;
}

function makeSeries<TSeriesType extends SeriesType>(
  displayName: string,
  create: (
    chart: IChartApi,
    options?: DeepPartial<SeriesOptionsMap[TSeriesType]>,
  ) => ISeriesApi<TSeriesType>,
) {
  function BaseSeries(
    props: SeriesProps<TSeriesType>,
    ref: React.Ref<ISeriesApi<TSeriesType> | undefined>,
  ) {
    const { data, latestItem, options, markers, children } = props;
    const { chart } = useChart();
    const [series, setSeries] = React.useState<
      ISeriesApi<TSeriesType> | undefined
    >(undefined);

    React.useImperativeHandle(ref, () => series, [series]);

    // create or update series by its options
    React.useEffect(() => {
      if (!chart) return;

      if (!series) {
        const series = create(chart, options);
        setSeries(series);
      } else if (options) {
        series.applyOptions(options as SeriesPartialOptionsMap[TSeriesType]);
      }
    }, [chart, series, options]);

    // update data
    React.useEffect(() => {
      series?.setData(data ?? []);
    }, [series, data]);

    // new data for update
    React.useEffect(() => {
      latestItem && series?.update(latestItem);
    }, [latestItem, series]);

    // update markers
    React.useEffect(() => {
      series?.setMarkers(markers ?? []);
    }, [series, markers]);

    // remove series on unmount
    React.useEffect(() => {
      return () => {
        if (!series) return;
        // suppress error when chart is trying remove a removed series
        try {
          chart?.removeSeries(series);
        } catch {} // eslint-disable-line no-empty
        setSeries(undefined);
      };
    }, [chart, series]);

    return (
      <SeriesContext.Provider value={series}>{children}</SeriesContext.Provider>
    );
  }

  BaseSeries.displayName = displayName;

  return BaseSeries;
}

/**
 * Create an area series for the chart, should only be nested inside `<Chart />`.
 */
export const AreaSeries = React.forwardRef(
  makeSeries<'Area'>('AreaSeries', (chart, options) =>
    chart.addAreaSeries(options),
  ),
);

/**
 * Create a bar series for the chart, should only be nested inside `<Chart />`.
 */
export const BarSeries = React.forwardRef(
  makeSeries<'Bar'>('BarSeries', (chart, options) =>
    chart.addBarSeries(options),
  ),
);

/**
 * Create a baseline series for the chart, should only be nested inside `<Chart />`.
 */
export const BaselineSeries = React.forwardRef(
  makeSeries<'Baseline'>('BaselineSeries', (chart, options) =>
    chart.addBaselineSeries(options),
  ),
);

/**
 * Create a candlestick series for the chart, should only be nested inside `<Chart />`.
 */
export const CandlestickSeries = React.forwardRef(
  makeSeries<'Candlestick'>('CandlestickSeries', (chart, options) =>
    chart.addCandlestickSeries(options),
  ),
);

/**
 * Create a histogram series for the chart, should only be nested inside `<Chart />`.
 */
export const HistogramSeries = React.forwardRef(
  makeSeries<'Histogram'>('HistogramSeries', (chart, options) =>
    chart.addHistogramSeries(options),
  ),
);

/**
 * Create a line series for the chart, should only be nested inside `<Chart />`.
 */
export const LineSeries = React.forwardRef(
  makeSeries<'Line'>('LineSeries', (chart, options) =>
    chart.addLineSeries(options),
  ),
);
