import React, { useState } from "react"

type Task = {
  id: string
  task: string
  complete: boolean
}

export const App = () => {
  return (
    <section className="container vert-offset-top-2">
      <div className="todoBox col-xs-6 col-xs-offset-3">
        <TodoBox />
      </div>
    </section>
  )
}

class TodoBox extends React.Component {
  state = {
    data: [
      {"id":"00001","task":"Wake up","complete":false},
      {"id":"00002","task":"Eat breakfast","complete":false},
      {"id":"00003","task":"Go to work","complete":false}
    ]
	}

	generateId() {
		return Math.floor(Math.random()*90000) + 10000;
	}

	handleNodeRemoval = (nodeId: string) => {
		var data = this.state.data;
		data = data.filter(function (el) {
			return el.id !== nodeId;
  })
		this.setState({data});
		return;
	}

	handleSubmit = (task: string) => {
		var data = this.state.data;
		var id = this.generateId().toString();
		var complete = false;
		data = data.concat([{id, task, complete}]);
		this.setState({data});
	}

	handleToggleComplete = (nodeId: string) => {
		var data = this.state.data;
		for (var i in data) {
			if (data[i].id == nodeId) {
				data[i].complete = !data[i].complete;
				break;
			}
		}
		this.setState({data});
		return;
	}
	render() {
		return (
			<div className="well">
				<h1 className="vert-offset-top-0">To do:</h1>
				<TodoList data={this.state.data} removeNode={this.handleNodeRemoval} toggleComplete={this.handleToggleComplete} />
				<TodoForm onTaskSubmit={this.handleSubmit} />
			</div>
		);
	}
}

//////////////
// TodoList
//////////////

type TodoListProps = {
  data: Task[]
  removeNode: (nodeId: string) => void
  toggleComplete: (nodeId: string) => void
}

const TodoList = (props: TodoListProps) => {
	const removeNode = (nodeId: string) => {
		props.removeNode(nodeId)
		return;
	}
	const toggleComplete = (nodeId: string) => {
		props.toggleComplete(nodeId);
		return;
	}
  const listNodes = props.data.map((listItem) => {
    return (
      <TodoItem
        key={listItem.id}
        nodeId={listItem.id}
        task={listItem.task}
        complete={listItem.complete}
        removeNode={removeNode}
        toggleComplete={toggleComplete}
      />
    )
  })

  return (
    <ul className="list-group">
      {listNodes}
    </ul>
  );
}

//////////////
// TodoItem
//////////////

type TodoItemProps = {
  nodeId: string
  task: string
  complete: boolean
  removeNode: (nodeId: string) => void
  toggleComplete: (nodeId: string) => void
}

const TodoItem = (props: TodoItemProps) => {
  let classes = 'list-group-item clearfix';
  if (props.complete) {
    classes = classes + ' list-group-item-success';
  }

	const removeNode: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		props.removeNode(props.nodeId);
		return;
	}

	const toggleComplete: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		props.toggleComplete(props.nodeId);
		return;
	}

  return (
    <li className={classes}>
      {props.task}
      <div className="pull-right" role="group">
        <button type="button" className="btn btn-xs btn-success img-circle" onClick={toggleComplete}>&#x2713;</button>
        <span> </span>
        <button type="button" className="btn btn-xs btn-danger img-circle" onClick={removeNode}>&#xff38;</button>
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
