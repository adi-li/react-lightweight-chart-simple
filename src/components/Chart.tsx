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
import { ChartAutoResizer } from './utils/ChartAutoResizer';
import { ChartFitContentTrigger } from './utils/ChartFitContentTrigger';
import {
  ChartOnClickSubscriber,
  ChartOnCrosshairMoveSubscriber,
  TimeScaleOnSizeChangeSubscriber,
  TimeScaleOnVisibleLogicalRangeChangeSubscriber,
  TimeScaleOnVisibleTimeRangeChangeSubscriber,
} from './utils/ChartSubscribers';

export interface ChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /**
   * The width of chart in pixel, and it is merged into `options`.
   *
   * If both `width` and `height` provided and > 0, will call `chart.resize(width, height)` automatically.
   */
  width?: number;
  /**
   * The height of chart in pixel, and it is merged into `options`.
   *
   * If both `width` and `height` provided and > 0, will call `chart.resize(width, height)` automatically.
   */
  height?: number;
  /**
   * The chart options, please refer to `lightweight-charts` documents.
   *
   * Memoization is recommended to prevent calling `chart.applyOptions()` multiple times.
   */
  options?: DeepPartial<ChartOptions>;
  /**
   * `true` to disable nesting `<ChartAutoResizer />` automatically.
   */
  disableAutoResize?: boolean;
  /**
   * `true` to disable nesting `<ChartFitContentTrigger />` automatically.
   */
  disableAutoContentFitOnInit?: boolean;
  /**
   * Handler for click event (related API: `chart.subscribeClick()`).
   * Or use `<ChartOnClickSubscriber />` instead.
   */
  onClick?: MouseEventHandler;
  /**
   * Handler for crosshair move event (related API: `chart.subscribeCrosshairMove()`).
   * Or use `<ChartOnCrosshairMoveSubscriber />` instead.
   */
  onCrosshairMove?: MouseEventHandler;
  /**
   * Handler for time scale size change event (related API: `chart.timeScale().subscribeSizeChange()`).
   * Or use `<TimeScaleOnSizeChangeSubscriber />` instead.
   */
  onTimeScaleSizeChange?: SizeChangeEventHandler;
  /**
   * Handler for visible time range change event (related API: `chart.timeScale().subscribeVisibleTimeRangeChange()`).
   * Or use `<TimeScaleOnVisibleTimeRangeChangeSubscriber />` instead.
   */
  onVisibleTimeRangeChange?: TimeRangeChangeEventHandler;
  /**
   * Handler for visible logical range change event (related API: `chart.timeScale().subscribeVisibleLogicalRangeChange()`).
   * Or use `<TimeScaleOnVisibleLogicalRangeChangeSubscriber />` instead.
   */
  onVisibleLogicalRangeChange?: LogicalRangeChangeEventHandler;
  /**
   * Handler for chart initialized
   */
  onInit?: (chart: IChartApi, container?: HTMLDivElement) => void;
}

export type ChartObject =
  | {
      chart: IChartApi | undefined;
      container: HTMLDivElement | undefined;
    }
  | undefined;

/**
 * The main wrapper for the series.
 */
export const Chart = React.forwardRef<ChartObject, ChartProps>(function Chart(
  {
    width,
    height,
    options,
    disableAutoResize,
    disableAutoContentFitOnInit,
    onClick,
    onCrosshairMove,
    onTimeScaleSizeChange,
    onVisibleTimeRangeChange,
    onVisibleLogicalRangeChange,
    onInit,
    children,
    style,
    ...rest
  },
  ref,
) {
  const divRef = React.useRef<HTMLDivElement>();
  const [chart, setChart] = React.useState<IChartApi | undefined>();
  const chartRef = React.useRef(chart);

  React.useImperativeHandle(ref, () => ({
    chart: chartRef.current,
    container: divRef.current,
  }));

  const mergedOptions = React.useMemo(
    () => ({ width, height, ...options }),
    [width, height, options],
  );

  // create or update chart by options
  React.useEffect(() => {
    if (!divRef.current) return;
    if (!chartRef.current) {
      const chart = createChart(divRef.current, mergedOptions);
      chartRef.current = chart;
      setChart(chart);
    } else {
      chartRef.current.applyOptions(mergedOptions);
    }
  }, [mergedOptions]);

  // resize if width or height option provided
  React.useEffect(() => {
    if (mergedOptions.width && mergedOptions.height) {
      chart?.resize(mergedOptions.width, mergedOptions.height);
    }
  }, [chart, mergedOptions.width, mergedOptions.height]);

  // remove chart when unmount
  React.useEffect(() => {
    return () => {
      chartRef.current?.remove();
      chartRef.current = undefined;
    };
  }, []);

  // trigger onInit when chart is created
  React.useEffect(() => {
    if (!chart) return;
    onInit?.(chart, divRef.current);
  }, [chart, onInit]);

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
        {!disableAutoResize && <ChartAutoResizer />}
        {!disableAutoContentFitOnInit && <ChartFitContentTrigger />}
        {onClick && <ChartOnClickSubscriber handler={onClick} />}
        {onCrosshairMove && (
          <ChartOnCrosshairMoveSubscriber handler={onCrosshairMove} />
        )}
        {onTimeScaleSizeChange && (
          <TimeScaleOnSizeChangeSubscriber handler={onTimeScaleSizeChange} />
        )}
        {onVisibleTimeRangeChange && (
          <TimeScaleOnVisibleTimeRangeChangeSubscriber
            handler={onVisibleTimeRangeChange}
          />
        )}
        {onVisibleLogicalRangeChange && (
          <TimeScaleOnVisibleLogicalRangeChangeSubscriber
            handler={onVisibleLogicalRangeChange}
          />
        )}
      </div>
    </ChartContext.Provider>
  );
});
