import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onTaskUpdated, setMessage }) {
  return (
    <ul>
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          onTaskUpdated={onTaskUpdated}
          setMessage={setMessage}
        />
      ))}
    </ul>
  );
}
