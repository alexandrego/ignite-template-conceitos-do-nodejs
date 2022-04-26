const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = []; //Array vazio para simular um DB.

// Middleware
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).send({ error: "🕵🏾‍♂ User not found!"});
  }

  request.user = user; //Passando informação para a rota.

  return next();
}

app.get('/users', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).send(user);
});

app.post('/users', (request, response) => {
  const { username, name } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).send({ error: "🤦🏿‍♂ User already exist!" });
  }

  users.push({
    name,
    username,
    id: uuidv4(),
    todos: []
  });

  // return response.status(201).json({ mesage: "🎉 User created!"});
  return response.status(201).send(users);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const { user } = request;

  const createTask = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(createTask);

  // return response.status(201).json({ mesage: "🎉 Task created successfully!" });
  return response.status(201).json(createTask);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;