import * as React from 'react';
import * as ReactDOM from 'react-dom';

// import { AreaSeries, Chart } from '../src';

const data = [
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
];

// FIXME: lightweight-charts seems incompatible with jest, need to investigate
describe('AreaSeries', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    // ReactDOM.render(
    //   <Chart>
    //     <AreaSeries data={data} />
    //   </Chart>,
    //   div
    // );

    // FIXME: need to migrate to use `ReactDOM.createRoot`
    ReactDOM.render(<div>{JSON.stringify(data, null, 2)}</div>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
