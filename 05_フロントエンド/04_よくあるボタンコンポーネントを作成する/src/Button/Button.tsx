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
    <button
      className={clsx("button", color)}
      style={{ fontSize: size === "medium" ? "1rem" : ".8rem" }}
      {...rest}
    >
      {children}
    </button>
  )
}
