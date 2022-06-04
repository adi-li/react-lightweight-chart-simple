import type {
  IChartApi,
  ISeriesApi,
  MouseEventHandler,
  MouseEventParams,
  SeriesOptionsMap,
} from 'lightweight-charts';
import * as React from 'react';

import { useChart } from '../hooks/useChart';
import { useSeries } from '../hooks/useSeries';
import { getSizeFromEntry } from '../utils/getSizeFromEntry';
import { ChartOnCrosshairMoveSubscriber } from './utils/ChartSubscribers';

export type MakeTransform = (
  chart: IChartApi | undefined,
  event: MouseEventParams | undefined,
  container: HTMLDivElement | null,
  tooltipSize: { width: number; height: number },
) => string | undefined;

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * A render function for creating `ReactNode` base on the crosshair event.
   */
  content?: (props: {
    /**
     * crosshair event object.
     */
    event: MouseEventParams;
    /**
     * chart api object.
     */
    chart: IChartApi | undefined;
    /**
     * series api object, exist only when the component is placed inside `<Series />`.
     */
    series?: ISeriesApi<keyof SeriesOptionsMap> | undefined;
  }) => React.ReactNode;

  /**
   * Should return a transform string for the tooltip wrapper, return `undefined` to keep unchanged.
   * Useful for changing the tooltip position.
   */
  makeTransform?: MakeTransform;
}

export const DEFAULT_TOOLTIP_STYLE: React.CSSProperties = {
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 10,

  transitionDuration: '150ms',
  transitionTimingFunction: 'ease-out',
};

const DEFAULT_SIZE: [number, number] = [0, 0];

/**
 * Default transform makes tooltip to be horizontally centered with cursor, and above the cursor.
 * Tooltip is also bounded inside the chart box and may be below the cursor if not enough vertical space.
 */
export const DEFAULT_TOOLTIP_MAKE_TRANSFORM: MakeTransform = (
  chart,
  event,
  container,
  size,
) => {
  const { point } = event ?? {};
  if (container == null || point == null) return undefined;
  const paddingLeft = chart?.priceScale('left').width() ?? 0;
  const paddingRight = chart?.priceScale('right').width() ?? 0;
  const { width: containerWidth } = container.getBoundingClientRect();
  const adjustedStartingX = point.x + paddingLeft;
  const x = Math.max(
    paddingLeft,
    Math.min(
      adjustedStartingX - size.width / 2,
      containerWidth - paddingRight - size.width,
    ),
  );
  const y = point.y - size.height - 8;
  return `translate(${x}px, ${y < 0 ? point.y + 20 : y}px)`;
};

/**
 * A tooltip will be flow in front of the chart and follow the crosshair movement.
 *
 * ❗Only use inside `<Chart />` or `<Series />`.
 */
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip({ content, makeTransform, style, ...rest }, ref) {
    const { chart, containerRef } = useChart();
    const series = useSeries();

    // container ref
    const divRef = React.useRef<HTMLDivElement>();

    // used to keep the previous transform string
    const previousTransformRef = React.useRef('');

    const [eventState, setEventState] = React.useState<
      MouseEventParams | undefined
    >();

    const [size, setSize] = React.useState<[number, number]>(DEFAULT_SIZE);

    React.useImperativeHandle<
      HTMLDivElement | undefined,
      HTMLDivElement | undefined
    >(ref, () => divRef.current);

    // make a merged css style for tooltip wrapper
    const mergedStyle: React.CSSProperties = React.useMemo(() => {
      const shouldHide = typeof eventState?.time !== 'number';
      const opacity = shouldHide ? 0 : 1;
      const [width, height] = size;
      const transform = shouldHide
        ? previousTransformRef.current
        : (makeTransform ?? DEFAULT_TOOLTIP_MAKE_TRANSFORM)(
            chart,
            eventState,
            containerRef.current,
            { width, height },
          ) ?? previousTransformRef.current;
      const transitionProperty = previousTransformRef.current
        ? 'transform,opacity'
        : 'opacity';
      previousTransformRef.current = transform;
      return {
        ...DEFAULT_TOOLTIP_STYLE,
        opacity,
        transform,
        transitionProperty,
        ...style,
      };
    }, [eventState, makeTransform, chart, containerRef, size, style]);

    // crosshair move event handler
    const handler: MouseEventHandler = React.useCallback((event) => {
      if (!divRef.current) return;
      setEventState(event);
    }, []);

    // observe self content size change
    React.useEffect(() => {
      const element = divRef.current;
      if (!element) return;

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        const size = getSizeFromEntry(entry);
        setSize((prev) =>
          size[0] === prev[0] && size[1] === prev[1] ? prev : size,
        );
      });

      observer.observe(element);
      return () => observer.unobserve(element);
    }, []);

    const children = React.useMemo(
      () =>
        eventState &&
        content?.({
          event: eventState,
          chart,
          series,
        }),
      [chart, content, eventState, series],
    );

    return (
      <div
        {...rest}
        style={mergedStyle}
        ref={divRef as React.LegacyRef<HTMLDivElement>}
      >
        <ChartOnCrosshairMoveSubscriber handler={handler} />
        {children}
      </div>
    );
  },
);
