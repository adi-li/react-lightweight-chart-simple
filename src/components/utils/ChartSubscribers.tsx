import {
  LogicalRangeChangeEventHandler,
  MouseEventHandler,
  SizeChangeEventHandler,
  TimeRangeChangeEventHandler,
} from 'lightweight-charts';
import { useEffect } from 'react';

import { useChart } from '../../hooks/useChart';

/**
 * Subscribe `handler` via `chart.subscribeClick()`.
 *
 * ❗Only use inside `<Chart />`.
 */
export const ChartOnClickSubscriber = ({
  handler,
}: {
  handler: MouseEventHandler;
}) => {
  const { chart } = useChart();

  useEffect(() => {
    chart?.subscribeClick(handler);
    return () => chart?.unsubscribeClick(handler);
  }, [chart, handler]);

  return null;
};

/**
 * Subscribe `handler` via `chart.subscribeCrosshairMove()`.
 *
 * ❗Only use inside `<Chart />`.
 */
export const ChartOnCrosshairMoveSubscriber = ({
  handler,
}: {
  handler: MouseEventHandler;
}) => {
  const { chart } = useChart();

  useEffect(() => {
    chart?.subscribeCrosshairMove(handler);
    return () => chart?.unsubscribeCrosshairMove(handler);
  }, [chart, handler]);

  return null;
};

/**
 * Subscribe `handler` via `chart.timeScale().subscribeSizeChange()`.
 *
 * ❗Only use inside `<Chart />`.
 */
export const TimeScaleOnSizeChangeSubscriber = ({
  handler,
}: {
  handler: SizeChangeEventHandler;
}) => {
  const { chart } = useChart();

  useEffect(() => {
    chart?.timeScale().subscribeSizeChange(handler);
    return () => chart?.timeScale().unsubscribeSizeChange(handler);
  }, [chart, handler]);

  return null;
};

/**
 * Subscribe `handler` via `chart.timeScale().subscribeVisibleTimeRangeChange()`.
 *
 * ❗Only use inside `<Chart />`.
 */
export const TimeScaleOnVisibleTimeRangeChangeSubscriber = ({
  handler,
}: {
  handler: TimeRangeChangeEventHandler;
}) => {
  const { chart } = useChart();

  useEffect(() => {
    chart?.timeScale().subscribeVisibleTimeRangeChange(handler);
    return () => chart?.timeScale().unsubscribeVisibleTimeRangeChange(handler);
  }, [chart, handler]);

  return null;
};

/**
 * Subscribe `handler` via `chart.timeScale().subscribeVisibleLogicalRangeChange()`.
 *
 * ❗Only use inside `<Chart />`.
 */
export const TimeScaleOnVisibleLogicalRangeChangeSubscriber = ({
  handler,
}: {
  handler: LogicalRangeChangeEventHandler;
}) => {
  const { chart } = useChart();

  useEffect(() => {
    chart?.timeScale().subscribeVisibleLogicalRangeChange(handler);
    return () =>
      chart?.timeScale().unsubscribeVisibleLogicalRangeChange(handler);
  }, [chart, handler]);

  return null;
};
