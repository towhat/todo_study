import React, { useState } from "react";
import { addTask } from "../services/api";

export default function TaskForm({ onTaskAdded, setMessage }) {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState(3);

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await addTask(task.trim(), Number(priority));
    if (result.message && result.message !== "실패") {
      setMessage(result.message);
      setTask("");
      setPriority(3);
      onTaskAdded();
    } else {
      setMessage("실패");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="할 일 입력"
          required
          style={{ padding: 8, width: 300 }}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        중요도:
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          {[5, 4, 3, 2, 1, 0].map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: 12 }}>
        <button type="submit">추가</button>
      </div>
    </form>
  );
}
