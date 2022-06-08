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
   * Memoization is recommended to prevent setting multiple times.
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
    const seriesRef = React.useRef(series);

    React.useImperativeHandle(ref, () => seriesRef.current);

    // create or update series by its options
    React.useEffect(() => {
      if (!chart) return;

      if (!seriesRef.current) {
        const series = create(chart, options);
        seriesRef.current = series;
        setSeries(series);
      } else if (options) {
        seriesRef.current.applyOptions(
          options as SeriesPartialOptionsMap[TSeriesType],
        );
      }
    }, [chart, options]);

    // remove series on unmount
    React.useEffect(() => {
      return () => {
        if (!seriesRef.current || !chart) return;
        // suppress error when chart is trying remove a removed series or the chart is already removed in parent lifecycle
        try {
          chart.removeSeries(seriesRef.current);
        } catch {} // eslint-disable-line no-empty
        seriesRef.current = undefined;
      };
    }, [chart]);

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

    return (
      <SeriesContext.Provider value={series}>{children}</SeriesContext.Provider>
    );
  }

  BaseSeries.displayName = displayName;

  return BaseSeries;
}

type SeriesRender<TSeriesType extends SeriesType> = SeriesProps<TSeriesType> &
  React.RefAttributes<ISeriesApi<TSeriesType> | undefined>;

export type Series<TSeriesType extends SeriesType> =
  React.ForwardRefExoticComponent<SeriesRender<TSeriesType>>;

/**
 * Create an area series for the chart
 *
 * ❗Only use inside `<Chart />`.
 */
export const AreaSeries: Series<'Area'> = React.forwardRef(
  makeSeries('AreaSeries', (chart, options) => chart.addAreaSeries(options)),
);

/**
 * Create a bar series for the chart.
 *
 * ❗Only use inside `<Chart />`.
 */
export const BarSeries: Series<'Bar'> = React.forwardRef(
  makeSeries('BarSeries', (chart, options) => chart.addBarSeries(options)),
);

/**
 * Create a baseline series for the chart.
 *
 * ❗Only use inside `<Chart />`.
 */
export const BaselineSeries: Series<'Baseline'> = React.forwardRef(
  makeSeries('BaselineSeries', (chart, options) =>
    chart.addBaselineSeries(options),
  ),
);

/**
 * Create a candlestick series for the chart.
 *
 * ❗Only use inside `<Chart />`.
 */
export const CandlestickSeries: Series<'Candlestick'> = React.forwardRef(
  makeSeries('CandlestickSeries', (chart, options) =>
    chart.addCandlestickSeries(options),
  ),
);

/**
 * Create a histogram series for the chart.
 *
 * ❗Only use inside `<Chart />`.
 */
export const HistogramSeries: Series<'Histogram'> = React.forwardRef(
  makeSeries('HistogramSeries', (chart, options) =>
    chart.addHistogramSeries(options),
  ),
);

/**
 * Create a line series for the chart.
 *
 * ❗Only use inside `<Chart />`.
 */
export const LineSeries: Series<'Line'> = React.forwardRef(
  makeSeries('LineSeries', (chart, options) => chart.addLineSeries(options)),
);
