import React from "react";
import "./App.css";
import axios from "axios";

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

  // Tak ma wyglądać funkcja, żeby nie trzeba było bindować
  fetchTask = () => {
    axios.get("http://127.0.0.1:8000/api/task-list").then((res) => {
      console.log(res.data);
      this.setState({
        todoList: res.data,
      });
    });
  };

  // żeby odpalić funkcję fetch task, trzeba dać this.fetchTask().
  // inaczej nie zadziała, mimo, że nie przyjmuje argumentów to należy użyć ()
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
    // axios.post(url, { headers: { "Content-Type": "application/json" } });

    if (this.state.editing) {
      url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`;
      this.setState({
        editing: false,
      });
    }

    axios
      .post(url, this.state.activeItem) //postuje słownika activeItem do backendu
      .then((res) => {
        console.log(res);
        this.fetchTask(); //pobiera listę
        this.setState({
          // resetuje stan activeItem
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
        this.fetchTask(); //robimy to w then, bo jak damy pod spodem to pamiętaj
        // że axios działa wolniej, i zrealizuje nam fetch task najpierw
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
                  {/* The flex-grow property specifies how much 
                the item will grow relative to the rest of the flexible items inside the same container. */}
                  <input
                    onChange={this.handleChange}
                    placeholder="Add task"
                    className="form-control"
                    id="title"
                    name="bry"
                    value={this.state.activeItem.title} //to nam wyczyści inputa po zatwierdzeniu
                    // gdy activeItem resetuje swe wartości
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
                  {/* tutaj flex 7 a potem oznacza, że ten będzie 7x większy od 1, 14 2 2 zrobi to samo */}
                  {task.completed == false ? (
                    <span>{task.title}</span>
                  ) : (
                    <strike>{task.title}</strike>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <button
                    onClick={() => this.startEdit(task)}
                    // musimy podać najpierw () bo inaczej odpali nam to od razu i będzie milion errorów
                    className="btn btn-sm btn-outline-info"
                  >
                    Edit
                  </button>
                  {/* przekazujemy argument task, który mamy w obecnej iteracji */}
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
