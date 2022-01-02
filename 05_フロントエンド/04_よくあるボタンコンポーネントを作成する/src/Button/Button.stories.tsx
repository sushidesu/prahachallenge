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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "2rem",
      }}
    >
      <div>
        <p>Blue</p>
        <Button {...defaultProps} color="blue" />
      </div>
      <div>
        <p>Green</p>
        <Button {...defaultProps} color="green" />
      </div>
      <div>
        <p>Red</p>
        <Button {...defaultProps} color="red" />
      </div>
      <div>
        <p>Blue (Disabled)</p>
        <Button {...defaultProps} color="blue" disabled />
      </div>
      <div>
        <p>Green (Disabled)</p>
        <Button {...defaultProps} color="green" disabled />
      </div>
      <div>
        <p>Red (Disabled)</p>
        <Button {...defaultProps} color="red" disabled />
      </div>
      <div>
        <p>Small</p>
        <Button {...defaultProps} size="small" />
      </div>
      <div>
        <p>Medium</p>
        <Button {...defaultProps} size="medium" />
      </div>
      <div>
        <p>Large</p>
        <Button {...defaultProps} size="large" />
      </div>
    </div>
  )
}

export const Small = generate()
Small.args = {
  ...defaultProps,
  size: "small",
}
