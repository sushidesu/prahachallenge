---
name: 'task'
root: '.'
output: '**/*'
ignore: ['*/**', '.', '.git/**', 'node_modules', '.scaffdog']
questions:
  index: 'Please enter index.'
  title: 'Please enter a task title.'
---

# `{{ inputs.index }}_{{ inputs.title }}/{{ inputs.index }}_{{ inputs.title }}.md`

```markdown
# {{ inputs.title }}

```
