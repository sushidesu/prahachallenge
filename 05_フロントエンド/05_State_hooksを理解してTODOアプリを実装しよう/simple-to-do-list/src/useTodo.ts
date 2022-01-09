import { useState } from "react"

export type Task = {
  id: string
  task: string
  complete: boolean
}

type TaskValue = Omit<Task, "id">
type AddTodoFunction = (task: TaskValue) => void
type RemoveTodoFunction = (id: string) => void
type ToggleCompleteFunction = (id: string) => void

export const useTodo = (init?: Task[]): [readonly Task[], AddTodoFunction, RemoveTodoFunction, ToggleCompleteFunction] => {
  const [tasks, setTasks] = useState<Task[]>(init ?? [])

	const generateId = (): string => {
		return Math.random().toString(36).slice(-8)
	}

  const addTodo: AddTodoFunction = (task) => {
    setTasks(prev => prev.concat({
      id: generateId(),
      ...task
    }))
  }

  const removeTodo: RemoveTodoFunction = (id) => {
    setTasks(prev => {
      return prev.filter(task => task.id !== id)
    })
  }

  const toggleComplete: ToggleCompleteFunction = (id) => {
    setTasks(prev => {
      const next = [...prev]
      return next.map(task => {
        if (task.id === id) {
          const target = {...task}
          target.complete = !target.complete
          return target
        }
        return task
      })
    })
  }

  return [
    tasks,
    addTodo,
    removeTodo,
    toggleComplete
  ]
}
