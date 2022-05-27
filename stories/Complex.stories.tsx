import { ComponentMeta, ComponentStory } from '@storybook/react';

import { App } from '../example/app';

export default {
  title: 'Example/Complex',
  component: App,
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = () => <App />;

export const Default = Template.bind({});
