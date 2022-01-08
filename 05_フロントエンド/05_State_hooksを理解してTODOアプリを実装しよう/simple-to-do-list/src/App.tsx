import React from "react"

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
      {"id":"00001","task":"Wake up","complete":"false"},
      {"id":"00002","task":"Eat breakfast","complete":"false"},
      {"id":"00003","task":"Go to work","complete":"false"}
    ]
	}

	generateId() {
		return Math.floor(Math.random()*90000) + 10000;
	}

	handleNodeRemoval(nodeId: any) {
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
		var complete = 'false';
		data = data.concat([{id, task, complete}]);
		this.setState({data});
	}

	handleToggleComplete(nodeId: any) {
		var data = this.state.data;
		for (var i in data) {
			if (data[i].id == nodeId) {
				data[i].complete = data[i].complete === 'true' ? 'false' : 'true';
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

class TodoList extends React.Component<any> {
	removeNode(nodeId: any) {
		this.props.removeNode(nodeId);
		return;
	}
	toggleComplete(nodeId: any) {
		this.props.toggleComplete(nodeId);
		return;
	}
	render() {
    const removeNode = this.removeNode
    const toggleComplete = this.toggleComplete
		var listNodes = this.props.data.map(function (listItem: any) {
			return (
				<TodoItem key={listItem.id} nodeId={listItem.id} task={listItem.task} complete={listItem.complete} removeNode={removeNode} toggleComplete={toggleComplete} />
			);
		},this);
		return (
			<ul className="list-group">
				{listNodes}
			</ul>
		);
	}
}

class TodoItem extends React.Component<any> {
	removeNode(e: any) {
		e.preventDefault();
		this.props.removeNode(this.props.nodeId);
		return;
	}

	toggleComplete(e: any) {
		e.preventDefault();
		this.props.toggleComplete(this.props.nodeId);
		return;
	}

	updateClass() {}

	render() {
		var classes = 'list-group-item clearfix';
		if (this.props.complete === 'true') {
			classes = classes + ' list-group-item-success';
		}
		return (
			<li className={classes}>
				{this.props.task}
				<div className="pull-right" role="group">
					<button type="button" className="btn btn-xs btn-success img-circle" onClick={this.toggleComplete}>&#x2713;</button>
          <button type="button" className="btn btn-xs btn-danger img-circle" onClick={this.removeNode}>&#xff38;</button>
				</div>
			</li>
		);
	}
}

type TodoFormProps = {
  onTaskSubmit: any
}

type TodoFormState = {
  text: string
}

class TodoForm extends React.Component<TodoFormProps, TodoFormState> {
  state: Readonly<TodoFormState> = {
    text: ""
  }

  handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    this.setState({
      text: e.target.value
    })
  }

	doSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
    this.props.onTaskSubmit(this.state.text)
	}

	render() {
		return (
			<div className="commentForm vert-offset-top-2">
				<hr />
				<div className="clearfix">
					<form className="todoForm form-horizontal" onSubmit={this.doSubmit}>
						<div className="form-group">
							<label htmlFor="task" className="col-md-2 control-label">Task</label>
							<div className="col-md-10">
								<input type="text" id="task" value={this.state.text} onChange={this.handleChange} className="form-control" placeholder="What do you need to do?" />
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
		);
	}
}
