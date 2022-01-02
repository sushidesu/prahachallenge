import React from "react"

import { ComponentStory, ComponentMeta } from "@storybook/react"

import { Button, ButtonProps } from "./Button"

export default {
  title: "Example/Button",
  component: Button,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />
const generate = () => Template.bind({}) as ComponentStory<typeof Button>

const defaultProps: ButtonProps = {
  children: "hello",
  size: "medium",
}

export const Default = generate()
Default.args = {
  ...defaultProps,
}

export const All = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <p>Blue</p>
        <Button {...defaultProps} />
      </div>
      <div>
        <p>Green</p>
        <Button {...defaultProps} color="green" />
      </div>
      <div>
        <p>Red</p>
        <Button {...defaultProps} color="red" />
      </div>
    </div>
  )
}

export const Small = generate()
Small.args = {
  ...defaultProps,
  size: "small",
}
