// api/index.js
const express = require('express');

const app = express();

app.use(express.json());

// In-memory storage
let todos = [
  { id: 1, text: 'Learn JavaScript from jjssss', completed: false },
  { id: 2, text: 'Build an API', completed: false },
  { id: 3, text: 'Deploy on Vercel', completed: false }
];

// GET - Get all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// GET - Get todo by id
app.get('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(todo => todo.id === id);
  
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  
  res.json(todo);
});

// POST - Create new todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }
  
  const newTodo = {
    id: todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1,
    text,
    completed: false
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT - Update todo
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  
  const { text, completed } = req.body;
  todos[todoIndex] = { 
    ...todos[todoIndex], 
    text: text !== undefined ? text : todos[todoIndex].text,
    completed: completed !== undefined ? completed : todos[todoIndex].completed
  };
  
  res.json(todos[todoIndex]);
});

// DELETE - Delete todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  
  todos.splice(todoIndex, 1);
  res.status(204).end();
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Todo API is running!' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;