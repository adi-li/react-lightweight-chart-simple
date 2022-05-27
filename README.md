# react-lightweight-charts-simple

A simple react wrapper for [lightweight-charts](https://github.com/tradingview/lightweight-charts) library.

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
  const data = useMemo(() => [
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

## License
[MIT](./LICENSE)
