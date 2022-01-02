import React from 'react';

export interface ButtonProps {
  children?: string
  size?: "sm" | "md"
}

export const Button = ({ size="md", children }: ButtonProps) => {
  return (
    <button style={{ fontSize: size === "md" ? "1rem" : ".8rem"}} >{children}</button>
  )
}
