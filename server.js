const express = require('express');
const app = express();

app.use(express.json());

let todos = [];
let nextId = 1;

// GET all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// GET single todo
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

// POST create todo
app.post('/todos', (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  const todo = { id: nextId++, title: title.trim(), completed: false };
  todos.push(todo);
  res.status(201).json(todo);
});

// PUT update todo
app.put('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  if (req.body.title !== undefined) todo.title = req.body.title;
  if (req.body.completed !== undefined) todo.completed = req.body.completed;
  res.json(todo);
});

// DELETE todo
app.delete('/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });
  todos.splice(index, 1);
  res.status(204).send();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Reset helper (used in tests)
app.delete('/todos', (req, res) => {
  todos = [];
  nextId = 1;
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
let server;

if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`Todo app running on port ${PORT}`);
  });
}

module.exports = { app };
