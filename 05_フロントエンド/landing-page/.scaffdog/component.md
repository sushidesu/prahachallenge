---
name: 'component'
root: 'src/components'
output: ['*', 'model/*']
ignore: ['src/components', 'src/components/model', 'src/components/page']
questions:
  name: 'Please enter the name.'
---

# `{{ inputs.name | pascal }}/{{ inputs.name | pascal }}.tsx`

```tsx
{{- inputs.name | pascal | define "name" -}}

import styles from "./{{ name }}.module.css"

type {{ name }}Props = {}

export const {{ name }} = (props: {{ name }}Props): JSX.Element => {
  return (
    <div>hello</div>
  )
}
```

# `{{ inputs.name | pascal }}/{{ inputs.name | pascal }}.module.css`

```css
```

# `{{ inputs.name | pascal }}/index.ts`

```ts
export * from "./{{ inputs.name | pascal }}"
```
