import {
  ChartOptions,
  createChart,
  DeepPartial,
  IChartApi,
  LogicalRangeChangeEventHandler,
  MouseEventHandler,
  SizeChangeEventHandler,
  TimeRangeChangeEventHandler,
} from 'lightweight-charts';
import * as React from 'react';

import { ChartContext } from '../context';

interface ChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /**
   * The width of chart in pixel.
   */
  width?: number;
  /**
   * The height of chart in pixel.
   */
  height?: number;
  /**
   * The chart options, please refer to `lightweight-charts` documents.
   * Memoization is recommended to prevent calling `chart.applyOptions()` multiple times.
   */
  options?: Omit<DeepPartial<ChartOptions>, 'width' | 'height'>;
  /**
   * Handler for chart click event (related API: `chart.subscribeClick()`).
   */
  onClick?: MouseEventHandler;
  /**
   * Handler for crosshair move event (related API: `chart.subscribeCrosshairMove()`).
   */
  onCrosshairMove?: MouseEventHandler;
  /**
   * Handler for time scale size change event (related API: `chart.timeScale().subscribeSizeChange()`).
   */
  onTimeScaleSizeChange?: SizeChangeEventHandler;
  /**
   * Handler for visible time range change event (related API: `chart.timeScale().subscribeVisibleTimeRangeChange()`).
   */
  onVisibleTimeRangeChange?: TimeRangeChangeEventHandler;
  /**
   * Handler for visible logical range change event (related API: `chart.timeScale().subscribeVisibleLogicalRangeChange()`).
   */
  onVisibleLogicalRangeChange?: LogicalRangeChangeEventHandler;
  /**
   * `ref` for getting chart container, which is a `<div />` element.
   */
  containerRef?: React.Ref<HTMLDivElement>;
}

/**
 * The main wrapper for the series.
 */
export const Chart = React.forwardRef<IChartApi | undefined, ChartProps>(
  function Chart(
    {
      width,
      height,
      options,
      onClick,
      onCrosshairMove,
      onTimeScaleSizeChange,
      onVisibleTimeRangeChange,
      onVisibleLogicalRangeChange,
      containerRef,
      children,
      style,
      ...rest
    },
    ref,
  ) {
    const divRef = React.useRef<HTMLDivElement>();
    const [chart, setChart] = React.useState<IChartApi | undefined>();

    React.useImperativeHandle(ref, () => chart, [chart]);
    React.useImperativeHandle<
      HTMLDivElement | undefined,
      HTMLDivElement | undefined
    >(containerRef, () => divRef.current);

    const mergedOptions = React.useMemo(
      () => ({ width, height, ...options }),
      [width, height, options],
    );

    // create or update chart by options
    React.useEffect(() => {
      if (!divRef.current) return;
      if (!chart) {
        const chart = createChart(divRef.current, mergedOptions);
        setChart(chart);
      } else if (mergedOptions) {
        chart.applyOptions(mergedOptions);
      }
    }, [chart, mergedOptions]);

    // resize
    React.useEffect(() => {
      if (!divRef.current) return;
      if (mergedOptions.width != null && mergedOptions.height != null) {
        chart?.resize(mergedOptions.width, mergedOptions.height);
        return;
      }

      const handler = () => {
        const width =
          (mergedOptions.width == null
            ? divRef.current?.parentElement?.clientWidth
            : mergedOptions.width) ?? 0;
        const height =
          (mergedOptions.height == null
            ? divRef.current?.parentElement?.clientHeight
            : mergedOptions.height) ?? 0;
        chart?.resize(width, height);
      };

      handler();
      window.addEventListener('resize', handler);
      return () => window.removeEventListener('resize', handler);
    }, [chart, mergedOptions.width, mergedOptions.height]);

    // fit content when chart init
    React.useEffect(() => {
      setTimeout(() => chart?.timeScale().fitContent(), 0);
    }, [chart]);

    // click listerning
    React.useEffect(() => {
      if (!onClick) return;
      chart?.subscribeClick(onClick);
      return () => chart?.unsubscribeClick(onClick);
    }, [chart, onClick]);

    // crosshair move listerning
    React.useEffect(() => {
      if (!onCrosshairMove) return;
      chart?.subscribeCrosshairMove(onCrosshairMove);
      return () => chart?.unsubscribeClick(onCrosshairMove);
    }, [chart, onCrosshairMove]);

    // visible time range change listerning
    React.useEffect(() => {
      if (!onVisibleTimeRangeChange) return;
      chart
        ?.timeScale()
        .subscribeVisibleTimeRangeChange(onVisibleTimeRangeChange);
      return () =>
        chart
          ?.timeScale()
          .unsubscribeVisibleTimeRangeChange(onVisibleTimeRangeChange);
    }, [chart, onVisibleTimeRangeChange]);

    // visible logical range change listerning
    React.useEffect(() => {
      if (!onVisibleLogicalRangeChange) return;
      chart
        ?.timeScale()
        .subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChange);
      return () =>
        chart
          ?.timeScale()
          .unsubscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChange);
    }, [chart, onVisibleLogicalRangeChange]);

    // time scale size change listerning
    React.useEffect(() => {
      if (!onTimeScaleSizeChange) return;
      chart?.timeScale().subscribeSizeChange(onTimeScaleSizeChange);
      return () =>
        chart?.timeScale().unsubscribeSizeChange(onTimeScaleSizeChange);
    }, [chart, onTimeScaleSizeChange]);

    // remove chart when unmount
    React.useEffect(() => {
      return () => {
        chart?.remove();
      };
    }, [chart]);

    const contextValue = React.useMemo(
      () => ({
        chart,
        containerRef: divRef as React.RefObject<HTMLDivElement>,
      }),
      [chart],
    );

    return (
      <ChartContext.Provider value={contextValue}>
        <div
          {...rest}
          style={{ ...style, position: 'relative' }}
          ref={divRef as React.LegacyRef<HTMLDivElement>}
        >
          {children}
        </div>
      </ChartContext.Provider>
    );
  },
);
