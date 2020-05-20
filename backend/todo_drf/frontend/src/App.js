import React from "react";
import "./App.css";
import axios from "axios";

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

class App extends React.Component {
  state = {
    todoList: [],
    activeItem: {
      id: null,
      title: "",
      completed: false,
    },
    editing: false,
  };

  fetchTask = () => {
    axios.get("http://127.0.0.1:8000/api/task-list").then((res) => {
      console.log(res.data);
      this.setState({
        todoList: res.data,
      });
    });
  };
  componentDidMount() {
    this.fetchTask();
  }

  handleChange = (e) => {
    // let name = e.target.name; // da nam wartość name z inputu
    let value = e.target.value;
    // console.log("Name", name);
    // console.log("Value", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value,
      },
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("Item: ", this.state.activeItem);

    let url = "http://127.0.0.1:8000/api/task-create/";

    if (this.state.editing) {
      url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`;
      this.setState({
        editing: false,
      });
    }

    axios
      .post(url, this.state.activeItem)
      .then((res) => {
        console.log(res);
        this.fetchTask();
        this.setState({
          activeItem: {
            id: null,
            title: "",
            completed: false,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  startEdit = (task) => {
    this.setState({
      activeItem: task,
      editing: true,
    });
  };

  deleteItem = (task) => {
    axios
      .delete(`http://127.0.0.1:8000/api/task-delete/${task.id}/`)
      .then((res) => {
        this.fetchTask();
        console.log(res);
      });
  };

  strikeUnstrike = (task) => {
    task.completed = !task.completed;
    let url = `http://127.0.0.1:8000/api/task-update/${task.id}/`;

    axios
      .post(url, { completed: task.completed, title: task.title })
      .then(() => {
        this.fetchTask(); 
      });

    console.log("Task:", task.completed);
  };
  render() {
    let tasks = this.state.todoList;
    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form id="form" onSubmit={this.handleSubmit}>
              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input
                    onChange={this.handleChange}
                    placeholder="Add task"
                    className="form-control"
                    id="title"
                    name="bry"
                    value={this.state.activeItem.title} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    id="submit"
                    type="submit"
                    name="add"
                    className="btn btn-warning"
                    value="Submit"
                  />
                </div>
              </div>
            </form>
          </div>
          <div id="list-wrapper">
            {tasks.map((task, index) => (
              <div key={index} className="task-wrapper flex-wrapper">
                <div
                  onClick={() => this.strikeUnstrike(task)}
                  style={{ flex: 7 }}
                >
                  {task.completed == false ? (
                    <span>{task.title}</span>
                  ) : (
                    <strike>{task.title}</strike>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <button
                    onClick={() => this.startEdit(task)}
                    className="btn btn-sm btn-outline-info"
                  >
                    Edit
                  </button>
                </div>
                <div style={{ flex: 1 }}>
                  <button
                    onClick={() => this.deleteItem(task)}
                    className="btn btn-sm btn-outline-dark delete"
                  >
                    -
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
