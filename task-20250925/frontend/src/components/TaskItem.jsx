import React from "react";
import { updateTask } from "../services/api";

export default function TaskItem({ task, onTaskUpdated, setMessage }) {
  async function handleToggle() {
    const result = await updateTask(task.id, !task.done);
    if (result.message && result.message !== "실패") {
      setMessage(result.message);
      onTaskUpdated();
    } else {
      setMessage("실패");
    }
  }

  return (
    <li style={{ marginBottom: 8 }}>
      <span style={{ marginRight: 12 }}>
        [{task.priority}] {task.task} — 생성:{" "}
        {new Date(task.created_time).toLocaleString()}
      </span>
      <button onClick={handleToggle}>
        {task.done ? "완료취소" : "완료"}
      </button>
      {task.update_time && (
        <span style={{ marginLeft: 8 }}>
          갱신: {new Date(task.update_time).toLocaleString()}
        </span>
      )}
    </li>
  );
}
