import React, { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { fetchTasks } from "../services/api";

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");

  async function loadTasks() {
    const data = await fetchTasks();
    setTasks(data);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>할 일 관리</h1>
      <TaskForm onTaskAdded={loadTasks} setMessage={setMessage} />

      <div style={{ marginTop: 16 }}>
        <strong>상태 메시지:</strong> {message}
      </div>

      <hr style={{ margin: "16px 0" }} />

      <h2>할 일 목록</h2>
      <TaskList tasks={tasks} onTaskUpdated={loadTasks} setMessage={setMessage} />
    </div>
  );
}
