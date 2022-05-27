import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Chart } from '../src/components/Chart';
import { HistogramSeries } from '../src/components/Series';

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

export default {
  title: 'Chart/HistogramSeries',
  component: HistogramSeries,
} as ComponentMeta<typeof HistogramSeries>;

const Template: ComponentStory<typeof HistogramSeries> = (args) => (
  <Chart height={300}>
    <HistogramSeries {...args} />
  </Chart>
);

export const Default = Template.bind({});
Default.args = { data };
