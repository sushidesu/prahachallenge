import React from "react"
import clsx from "clsx"
import "./Button.css"

export interface ButtonProps {
  /**
   * ボタンの色
   */
  color?: "red" | "blue" | "green"
  /**
   * ボタンの大きさ
   */
  size?: "small" | "medium" | "large"
  children?: string
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export const Button = ({
  color = "blue",
  size = "medium",
  children,
  ...rest
}: ButtonProps) => {
  return (
    <button className={clsx("button", color, size)} {...rest}>
      {children}
    </button>
  )
}
