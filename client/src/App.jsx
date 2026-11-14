import { useEffect, useState } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [error, setError] = useState('');

  // Load tasks once when the page opens
  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => {
        if (!res.ok) throw new Error('Could not load tasks');
        return res.json();
      })
      .then((data) => {
        setTasks(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch(() => setError('Could not load tasks. Is the API running?'));
  }, []);

  async function addTask(e) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) return setError('Could not add task');
    const task = await res.json();
    setTasks((prev) => [...prev, task]);
    setNewTitle('');
    setError('');
  }

  async function toggleTask(task) {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !task.done }),
    });
    if (!res.ok) return setError('Could not update task');
    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setError('');
  }

  async function deleteTask(id) {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 404) return setError('Could not delete task');
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setError('');
  }

  return (
    <main>
      <h1>My To-Do List</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={addTask}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="What needs doing?"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.done ? 'done' : ''}>
            <label>
              <input type="checkbox" checked={task.done} onChange={() => toggleTask(task)} />
              {task.title}
            </label>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
