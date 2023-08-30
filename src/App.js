import { useState, useEffect } from "react";

const http = "https://fullstack-todolist-be.vercel.app";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  const getTodos = async () => {
    try {
      const res = await fetch(`${http}/todos`);
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const completeTodo = async (id) => {
    try {
      const res = await fetch(`${http}/todo/complete/${id}`, {
        method: "PUT",
      });
      const data = await res.json();
      setTodos((todos) =>
        todos.map((todo) =>
          todo._id === data._id ? { ...todo, complete: data.complete } : todo
        )
      );
    } catch (error) {
      console.error("Error completing todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${http}/todo/delete/${id}`, {
        method: "DELETE",
      });
      setTodos((todos) => todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const addTodo = async () => {
    try {
      const res = await fetch(`${http}/todo/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newTodo,
        }),
      });
      const data = await res.json();
      setTodos((prevTodos) => [...prevTodos, data]);
      setPopupActive(false);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="App">
      <h1>Welcome, Channy</h1>
      <h4>Your Tasks</h4>

      <div className="todos">
        {todos.map((todo) => (
          <div
            className={"todo " + (todo.complete ? "is-complete" : "")}
            key={todo._id}
          >
            <div className="todo-checks" onClick={() => completeTodo(todo._id)}>
              <div className="checkbox"></div>
              <div className="text">{todo.text}</div>
            </div>

            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
              x
            </div>
          </div>
        ))}

        <div className="addPopup" onClick={() => setPopupActive(true)}>
          +
        </div>

        {popupActive ? (
          <div className="popup">
            <div className="closePopup" onClick={() => setPopupActive(false)}>
              x
            </div>
            <div className="content">
              <h3>Add Task</h3>
              <input
                type="text"
                className="add-todo-input"
                onChange={(e) => setNewTodo(e.target.value)}
                value={newTodo}
              />
              <div className="button" onClick={addTodo}>
                Create Task
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default App;
