const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// "Database": a JSON file next to this script. Good enough for learning CRUD.
const DB_FILE = path.join(__dirname, 'db.json');

function loadTasks() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
  catch { return []; }
}
function saveTasks(tasks) {
  fs.writeFileSync(DB_FILE, JSON.stringify(tasks, null, 2));
}

// List all tasks
app.get('/api/tasks', (req, res) => {
  res.json(loadTasks());
});

// Add a task
app.post('/api/tasks', (req, res) => {
  const title = (req.body.title || '').trim();
  if (!title) return res.status(400).json({ error: 'title is required' });
  const tasks = loadTasks();
  const task = {
    id: crypto.randomUUID(),
    title,
    done: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  saveTasks(tasks);
  res.status(201).json(task);
});

// Update a task (mark done/undone or rename)
app.put('/api/tasks/:id', (req, res) => {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'task not found' });
  if (typeof req.body.done === 'boolean') task.done = req.body.done;
  if (typeof req.body.title === 'string' && req.body.title.trim()) task.title = req.body.title.trim();
  saveTasks(tasks);
  res.json(task);
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const tasks = loadTasks();
  const remaining = tasks.filter((t) => t.id !== req.params.id);
  if (remaining.length === tasks.length) return res.status(404).json({ error: 'task not found' });
  saveTasks(remaining);
  res.status(204).end();
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
