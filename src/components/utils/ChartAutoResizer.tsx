import { ChartOptions, DeepPartial, IChartApi } from 'lightweight-charts';
import { useEffect } from 'react';

import { useChart } from '../../hooks/useChart';
import { getSizeFromEntry } from '../../utils/getSizeFromEntry';

export enum ChartAutoResizerTriggerSource {
  /**
   * Indicate to use `window.addEventListener('resize', handler)`.
   */
  windowResize = 1 << 0,
  /**
   * Indicate to use `new ResizeObserver(handler).observe(parentElement)`.
   */
  parentResize = 1 << 1,
}

const DEFAULT_TRIGGER_SOURCE =
  typeof window !== 'undefined' && 'ResizeObserver' in window
    ? ChartAutoResizerTriggerSource.parentResize
    : ChartAutoResizerTriggerSource.windowResize;

export interface ChartAutoResizerProps {
  /**
   * Source to trigger, from window's `resize` event or use `ResizeObserver`
   *
   * Default is `.parentResize` if `ResizeObserver` exists,
   * use `.windowResize` otherwise.
   */
  triggerSource?: ChartAutoResizerTriggerSource;
  /**
   * Callback when resize triggered.
   */
  onResize?: (chart: IChartApi | undefined) => void;
}

/**
 * Utility component for resizing the chart when window size changed.
 *
 * ❗Only use inside `<Chart />`.
 * Turn chart option `disableAutoResize = true` to prevent multiple resizer called.
 */
export const ChartAutoResizer = ({
  triggerSource = DEFAULT_TRIGGER_SOURCE,
  onResize,
}: ChartAutoResizerProps) => {
  const { chart, containerRef } = useChart();

  useEffect(() => {
    if (triggerSource === 0) return;

    const handler = (entriesOrEvent?: ResizeObserverEntry[] | Event) => {
      const options: DeepPartial<ChartOptions> = chart?.options() ?? {};

      const [observedWidth, observedHeight] = Array.isArray(entriesOrEvent)
        ? getSizeFromEntry(entriesOrEvent[0])
        : [
            containerRef.current?.parentElement
              ? parseInt(
                  getComputedStyle(containerRef.current.parentElement).width,
                )
              : 0,
            containerRef.current?.parentElement
              ? parseInt(
                  getComputedStyle(containerRef.current.parentElement).height,
                )
              : 0,
          ];

      const width = options.width || observedWidth;
      const height = options.height || observedHeight;
      chart?.resize(width, height);

      onResize?.(chart);
    };

    // first run
    handler();

    // listen window's resize event
    if (triggerSource & ChartAutoResizerTriggerSource.windowResize) {
      window.addEventListener('resize', handler);
    }

    // observe parent size change
    let resizeObserver: ResizeObserver | undefined;
    const parent = containerRef.current?.parentElement;
    if (triggerSource & ChartAutoResizerTriggerSource.parentResize && parent) {
      resizeObserver = new ResizeObserver(handler);
      resizeObserver.observe(parent);
    }

    return () => {
      if (triggerSource & ChartAutoResizerTriggerSource.windowResize) {
        window.removeEventListener('resize', handler);
      }
      // don't need to check trigger source here because `resizeObserver` is only created when needed.
      if (parent) {
        resizeObserver?.unobserve(parent);
      }
    };
  }, [chart, triggerSource, containerRef, onResize]);

  return null;
};
