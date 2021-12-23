---
name: 'page'
root: 'src/components/page'
output: '.'
ignore: []
questions:
  name: 'Please enter the name.'
---

# `{{ inputs.name | pascal }}/{{ inputs.name | pascal }}.page.tsx`

```tsx
{{- inputs.name | pascal | define "name" -}}

import { {{ name }} } from "./{{ name }}"

export const {{ name }}Page = () => {
  return (
    <div>
      <{{ name }} />
    </div>
  )
}
```

# `{{ inputs.name | pascal }}/{{ inputs.name | pascal }}.tsx`

```tsx
{{- inputs.name | pascal | define "name" -}}

import styles from "./{{ name }}.module.css"

export const {{ name }} = (): JSX.Element => {
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
{{- inputs.name | pascal | define "name" -}}

import { {{ name }}Page } from "./{{ name }}.page"

export default {{ name }}Page
```
