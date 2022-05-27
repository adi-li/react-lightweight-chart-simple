import type {
  IChartApi,
  MouseEventHandler,
  MouseEventParams,
} from 'lightweight-charts';
import * as React from 'react';

import { useChart } from '../hooks/useChart';
import { useTransition } from '../hooks/useTransition';

export type MakeTransform = (
  chart: IChartApi | undefined,
  event: MouseEventParams | undefined,
  container: HTMLDivElement | null,
  tooltipSize: { width: number; height: number },
) => string | undefined;

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Should return a react node which can be varied base on the crosshair event.
   */
  content?: (event: MouseEventParams) => React.ReactNode;

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

const DEFAULT_SIZE = { width: 0, height: 0 };

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
  const paddingX = chart?.priceScale('left').width() ?? 0;
  const { width: containerWidth } = container.getBoundingClientRect();
  const adjustedStartingX = point.x + paddingX;
  const x = Math.max(
    paddingX,
    Math.min(adjustedStartingX - size.width / 2, containerWidth - size.width),
  );
  const y = point.y - size.height - 8;
  return `translate(${x}px, ${y < 0 ? point.y + 20 : y}px)`;
};

/**
 * A tooltip will be flow in front of the chart and follow the crosshair movement.
 * Shoule only be placed inside `<Chart />`.
 */
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip({ content, makeTransform, style, ...rest }, ref) {
    const { chart, containerRef } = useChart();
    const divRef = React.useRef<HTMLDivElement>();
    const [eventState, setEventState] = React.useState<
      MouseEventParams | undefined
    >();
    const [size, setSize] = React.useState<{ width: number; height: number }>(
      DEFAULT_SIZE,
    );
    const [, startTransition] = useTransition();

    React.useImperativeHandle<
      HTMLDivElement | undefined,
      HTMLDivElement | undefined
    >(ref, () => divRef.current);

    // listern crosshair move event
    React.useEffect(() => {
      const handler: MouseEventHandler = (event) => {
        if (!divRef.current) return;
        // allow setting event state in a deferred way if possible
        startTransition(() => {
          setEventState(event);
        });
      };

      chart?.subscribeCrosshairMove(handler);
      return () => chart?.unsubscribeCrosshairMove(handler);
    }, [chart]);

    // used to keep the previous transform string
    const previousTransformRef = React.useRef('');

    // make a merged css style for tooltip wrapper
    const mergedStyle: React.CSSProperties = React.useMemo(() => {
      const shouldHide = typeof eventState?.time !== 'number';
      const opacity = shouldHide ? 0 : 1;
      const transform = shouldHide
        ? previousTransformRef.current
        : (makeTransform ?? DEFAULT_TOOLTIP_MAKE_TRANSFORM)(
            chart,
            eventState,
            containerRef.current,
            size,
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

    // observe size change
    React.useEffect(() => {
      const element = divRef.current;
      if (!element) return;

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        const size = { width: 0, height: 0 };
        if (entry.contentBoxSize) {
          if (entry.contentBoxSize[0]) {
            size.width = entry.contentBoxSize[0].inlineSize;
            size.height = entry.contentBoxSize[0].blockSize;
          } else {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            size.width = (entry.contentBoxSize as any).inlineSize;
            size.height = (entry.contentBoxSize as any).blockSize;
            /* eslint-enable @typescript-eslint/no-explicit-any */
          }
        } else {
          size.width = entry.contentRect.width;
          size.height = entry.contentRect.height;
        }
        setSize((prev) =>
          size.width === prev.width && size.height === prev.height
            ? prev
            : size,
        );
      });

      observer.observe(element);
      return () => observer.unobserve(element);
    }, []);

    return (
      <div
        {...rest}
        style={mergedStyle}
        ref={divRef as React.LegacyRef<HTMLDivElement>}
      >
        {eventState && content?.(eventState)}
      </div>
    );
  },
);
