import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from './Button';

export default {
  title: 'Example/Button',
  component: Button
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} >hello</Button>;

export const Primary = Template.bind({});
Template.args = {
  size: "md"
}

export const Secondary = Template.bind({});
Template.args = {
  size: "sm"
}
