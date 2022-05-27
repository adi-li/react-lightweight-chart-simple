import type {
  AreaSeriesOptions,
  ChartOptions,
  DeepPartial,
  HistogramData,
  HistogramSeriesOptions,
  SeriesMarker,
  SingleValueData,
  UTCTimestamp,
} from 'lightweight-charts';
import * as React from 'react';

import {
  AreaSeries,
  Chart,
  HistogramSeries,
  PriceLine,
  Tooltip,
} from '../../dist';

const BASE_TIMESTAMP = Math.floor(Date.now() / 1000);
const DAY = 86400;

const chartOptions: DeepPartial<ChartOptions> = {
  rightPriceScale: {
    scaleMargins: {
      top: 0.1,
      bottom: 0,
    },
    borderVisible: false,
  },
  leftPriceScale: {
    visible: true,
    scaleMargins: {
      top: 0.8,
      bottom: 0,
    },
    borderVisible: false,
  },
  layout: {
    backgroundColor: '#131722',
    textColor: '#d1d4dc',
  },
  grid: {
    vertLines: {
      visible: false,
    },
    horzLines: {
      visible: false,
    },
  },
  crosshair: {
    vertLine: {
      labelVisible: false,
      width: 4,
      color: 'rgba(224, 227, 235, 0.1)',
      style: 0,
    },
    horzLine: {
      labelVisible: true,
    },
  },
};

const histogramOptions: DeepPartial<HistogramSeriesOptions> = {
  color: '#26a69a',
  base: 0,
  priceScaleId: 'left',
  priceFormat: {
    type: 'volume',
  },
  lastValueVisible: false,
  priceLineVisible: false,
};

const areaOptions: DeepPartial<AreaSeriesOptions> = {
  topColor: 'rgba(245, 124, 0, 0.4)',
  bottomColor: 'rgba(245, 124, 0, 0.1)',
  lineColor: 'rgba(245, 124, 0, 1)',
  lineWidth: 2,
};

export const App = () => {
  const data: HistogramData[] = React.useMemo(
    () =>
      Array.from(Array(100).keys()).map((i) => ({
        time: (BASE_TIMESTAMP + (i - 50) * DAY) as UTCTimestamp,
        value: Math.random() * 10000 + 100,
      })),
    [],
  );

  const areaData: SingleValueData[] = React.useMemo(
    () =>
      Array.from(Array(100).keys()).map((i) => ({
        time: (BASE_TIMESTAMP + (i - 50) * DAY) as UTCTimestamp,
        value: Math.random() * 10000 + 100,
      })),
    [],
  );

  const [lines, setLines] = React.useState<number>(0);

  React.useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (Math.floor(i / 10) % 2 === 0) {
        setLines((prev) => prev + 1);
      } else {
        setLines((prev) => prev - 1);
      }
      i++;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const markers: SeriesMarker<UTCTimestamp>[] = React.useMemo(
    () => [
      {
        time: (BASE_TIMESTAMP + DAY) as UTCTimestamp,
        position: 'aboveBar',
        shape: 'arrowDown',
        color: 'red',
        size: 1,
      },
    ],
    [],
  );

  return (
    <div>
      <Chart height={500} options={chartOptions}>
        <HistogramSeries data={data} options={histogramOptions}>
          {Array.from(Array(lines).keys()).map((price) => (
            <PriceLine key={price} price={(price + 1) * 750} />
          ))}
        </HistogramSeries>
        <AreaSeries data={areaData} options={areaOptions} markers={markers}>
          {Array.from(Array(lines).keys()).map((price) => (
            <PriceLine key={price} price={(price + 1) * 500} color="green" />
          ))}
        </AreaSeries>
        <Tooltip
          content={(event) => (
            <div
              style={{
                padding: 16,
                borderRadius: 8,
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                color: 'white',
              }}
            >
              {typeof event.time === 'number' &&
                new Date(event.time * 1000).toLocaleDateString()}
            </div>
          )}
        />
      </Chart>
    </div>
  );
};
