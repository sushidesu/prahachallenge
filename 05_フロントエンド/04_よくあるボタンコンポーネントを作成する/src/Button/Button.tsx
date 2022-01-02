import React from 'react';

export type ButtonProps = {
  children?: string
  size?: "sm" | "md"
}

export const Button = (props: ButtonProps) => {
  const { children, size = "md" } = props
  console.log(children)
  return (
    <button style={{ fontSize: size === "md" ? "1rem" : ".8rem"}}>{children}</button>
  )
}
