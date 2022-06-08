# react-lightweight-charts-simple

A simple react wrapper for [lightweight-charts](https://github.com/tradingview/lightweight-charts) library.

:warning: This is a beta library currently, may have some breaking changes released without notice.

## Installation

```bash
npm install --save react-lightweight-charts-simple lightweight-charts
// or
yarn add react-lightweight-charts-simple lightweight-charts
```

## Usage

```tsx
import React from 'react';
import { Chart, AreaSeries } from 'react-lightweight-charts';

export const App = () => {
  // Memoize data to prevent setting data multiple times
  const data = React.useMemo(() => [
    { time: '2022-02-01', value: 100 },
    { time: '2022-02-02', value: 300 },
    { time: '2022-02-03', value: 500 },
    { time: '2022-02-04', value: 700 },
    { time: '2022-02-05', value: 600 },
    { time: '2022-02-06', value: 400 },
    { time: '2022-02-07', value: 200 },
    { time: '2022-02-08', value: 500 },
    { time: '2022-02-09', value: 800 },
    { time: '2022-02-10', value: 1000 },
  ]);

  return (
    <Chart height={300}>
      <AreaSeries data={data} />
    </Chart>
  );
}
```

Here is also a [complex example](./example/app/index.tsx)

## Components

### Core

These are the wrapper components for using `lightweight-charts`.

  - [`<Chart />`](./src/components/Chart.tsx)

  - [`<Series />`](./src/components/Series.tsx) (abstract type)

    Only usable inside `<Chart />`

    - `<AreaSeries />`
    - `<BarSeries />`
    - `<BaselineSeries />`
    - `<CandlestickSeries />`
    - `<HistogramSeries />`
    - `<LineSeries />`

  - [`<PriceLine />`](./src/components/PriceLine.tsx)

    Only usable inside `<Series />`

### Helpers

  - [`<Tooltip />`](./src/components/Tooltip.tsx)

    Only usable inside `<Chart />` or `<Series />`

    You can also add your custom helper components by referencing it.

### Utilities

These do not render any visual, just for effect.

  - [`<ChartAutoResizer />`](./src/components/utils/ChartAutoResizer.tsx)
  - [`<ChartFitContentTrigger />`](./src/components/utils/ChartFitContentTrigger.tsx)
  - [`<ChartOnClickSubscriber />`](./src/components/utils/ChartSubscribers.tsx)
  - [`<ChartOnCrosshairMoveSubscriber />`](./src/components/utils/ChartSubscribers.tsx)
  - [`<TimeScaleOnSizeChangeSubscriber />`](./src/components/utils/ChartSubscribers.tsx)
  - [`<TimeScaleOnVisibleTimeRangeChangeSubscriber />`](./src/components/utils/ChartSubscribers.tsx)
  - [`<TimeScaleOnVisibleLogicalRangeChangeSubscriber />`](./src/components/utils/ChartSubscribers.tsx)
  - [`<SeriesHoverDataSubscriber />`](./src/components/utils/SeriesSubscribers.tsx)

You can also add your custom utility components by referencing any one of the above.

## Hooks

- [`useChart()`](./src/hooks/useChart.ts) to get `IChartApi` object and container `div` reference.
- [`useSeries()`](./src/hooks/useSeries.ts) to get `ISeriesApi` object.

## License

[MIT](./LICENSE)
