import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Chart } from '../src/components/Chart';
import { BarSeries } from '../src/components/Series';

const data = [
  { time: '2022-02-01', open: 100, high: 200, low: 100, close: 300 },
  { time: '2022-02-02', open: 300, high: 500, low: 200, close: 500 },
  { time: '2022-02-03', open: 500, high: 1300, low: 400, close: 700 },
  { time: '2022-02-04', open: 700, high: 1400, low: 600, close: 600 },
  { time: '2022-02-05', open: 600, high: 1100, low: 200, close: 400 },
  { time: '2022-02-06', open: 400, high: 500, low: 100, close: 200 },
  { time: '2022-02-07', open: 200, high: 600, low: 200, close: 500 },
  { time: '2022-02-08', open: 500, high: 600, low: 200, close: 800 },
  { time: '2022-02-09', open: 800, high: 1800, low: 500, close: 1000 },
  { time: '2022-02-10', open: 1000, high: 1500, low: 600, close: 900 },
];

export default {
  title: 'Chart/BarSeries',
  component: BarSeries,
} as ComponentMeta<typeof BarSeries>;

const Template: ComponentStory<typeof BarSeries> = (args) => (
  <Chart height={300}>
    <BarSeries {...args} />
  </Chart>
);

export const Default = Template.bind({});
Default.args = { data };
