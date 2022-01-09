import React, { useState } from "react"
import { useTodo, Task } from "./useTodo"

export const App = () => {
  const tasks: Task[] = [
    {"id":"00001","task":"Wake up","complete":false},
    {"id":"00002","task":"Eat breakfast","complete":false},
    {"id":"00003","task":"Go to work","complete":false}
  ]
  return (
    <section className="container vert-offset-top-2">
      <div className="todoBox col-xs-6 col-xs-offset-3">
        <TodoBox tasks={tasks} />
      </div>
    </section>
  )
}

//////////////
// TodoList
//////////////

type TodoBoxProps = {
  tasks: Task[]
}

const TodoBox = (props: TodoBoxProps) => {
  const [tasks, addTodo, removeTodo, toggleComplete] = useTodo(props.tasks)

	const handleRemove = (nodeId: string) => () => {
    removeTodo(nodeId)
	}

	const handleSubmit = (task: string) => {
    addTodo({
      task,
      complete: false
    })
	}

	const handleToggleComplete = (nodeId: string) => () => {
    toggleComplete(nodeId)
	}

  return (
    <div className="well">
      <h1 className="vert-offset-top-0">To do:</h1>
      <ul className="list-group">
        {tasks.map(task => (
          <TodoItem
            key={task.id}
            task={task.task}
            complete={task.complete}
            onCompleteClick={handleToggleComplete(task.id)}
            onRemoveClick={handleRemove(task.id)}
          />
        ))}
      </ul>
      <TodoForm onTaskSubmit={handleSubmit} />
    </div>
  );
}

//////////////
// TodoItem
//////////////

type TodoItemProps = {
  task: string
  complete: boolean
  onCompleteClick?: React.MouseEventHandler<HTMLButtonElement>
  onRemoveClick?: React.MouseEventHandler<HTMLButtonElement>
}

const TodoItem = (props: TodoItemProps) => {
  const {
    task,
    complete,
    onRemoveClick,
    onCompleteClick
  } = props

  let classes = 'list-group-item clearfix';
  if (complete) {
    classes = classes + ' list-group-item-success';
  }

  return (
    <li className={classes}>
      {task}
      <div className="pull-right" role="group">
        <button type="button" className="btn btn-xs btn-success img-circle" onClick={onCompleteClick}>&#x2713;</button>
        <span> </span>
        <button type="button" className="btn btn-xs btn-danger img-circle" onClick={onRemoveClick}>&#xff38;</button>
      </div>
    </li>
  );
}

//////////////
// TodoItem
//////////////

type TodoFormProps = {
  onTaskSubmit: (task: string) => void
}

const TodoForm = (props: TodoFormProps) => {
  const [text, setText] = useState("")
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setText(e.target.value)
  }
  
  const doSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    props.onTaskSubmit(text)
  }

  return (
    <div className="commentForm vert-offset-top-2">
      <hr />
      <div className="clearfix">
        <form className="todoForm form-horizontal" onSubmit={doSubmit}>
          <div className="form-group">
            <label htmlFor="task" className="col-md-2 control-label">Task</label>
            <div className="col-md-10">
              <input type="text" id="task" value={text} onChange={handleChange} className="form-control" placeholder="What do you need to do?" />
            </div>
          </div>
          <div className="row">
            <div className="col-md-10 col-md-offset-2 text-right">
              <input type="submit" value="Save Item" className="btn btn-primary" />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
