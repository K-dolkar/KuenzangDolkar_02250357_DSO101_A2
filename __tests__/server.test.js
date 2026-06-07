const request = require('supertest');
const { app } = require('../server');

// Reset todos before each test
beforeEach(async () => {
  await request(app).delete('/todos');
});

describe('Health check', () => {
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /todos', () => {
  test('returns empty array initially', async () => {
    const res = await request(app).get('/todos');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('returns all todos', async () => {
    await request(app).post('/todos').send({ title: 'Task A' });
    await request(app).post('/todos').send({ title: 'Task B' });
    const res = await request(app).get('/todos');
    expect(res.body).toHaveLength(2);
  });
});

describe('POST /todos', () => {
  test('creates a todo with valid title', async () => {
    const res = await request(app).post('/todos').send({ title: 'Buy milk' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ title: 'Buy milk', completed: false });
    expect(res.body.id).toBeDefined();
  });

  test('returns 400 when title is missing', async () => {
    const res = await request(app).post('/todos').send({});
    expect(res.statusCode).toBe(400);
  });

  test('returns 400 when title is empty string', async () => {
    const res = await request(app).post('/todos').send({ title: '   ' });
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /todos/:id', () => {
  test('returns the correct todo', async () => {
    const created = await request(app).post('/todos').send({ title: 'Test todo' });
    const res = await request(app).get(`/todos/${created.body.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Test todo');
  });

  test('returns 404 for unknown id', async () => {
    const res = await request(app).get('/todos/9999');
    expect(res.statusCode).toBe(404);
  });
});

describe('PUT /todos/:id', () => {
  test('updates title', async () => {
    const created = await request(app).post('/todos').send({ title: 'Old title' });
    const res = await request(app)
      .put(`/todos/${created.body.id}`)
      .send({ title: 'New title' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('New title');
  });

  test('marks todo as completed', async () => {
    const created = await request(app).post('/todos').send({ title: 'Finish assignment' });
    const res = await request(app)
      .put(`/todos/${created.body.id}`)
      .send({ completed: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  test('returns 404 for unknown id', async () => {
    const res = await request(app).put('/todos/9999').send({ title: 'x' });
    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /todos/:id', () => {
  test('deletes a todo', async () => {
    const created = await request(app).post('/todos').send({ title: 'Delete me' });
    const res = await request(app).delete(`/todos/${created.body.id}`);
    expect(res.statusCode).toBe(204);
    const check = await request(app).get(`/todos/${created.body.id}`);
    expect(check.statusCode).toBe(404);
  });

  test('returns 404 for unknown id', async () => {
    const res = await request(app).delete('/todos/9999');
    expect(res.statusCode).toBe(404);
  });
});
