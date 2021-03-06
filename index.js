const Joi = require("joi"); // validator
const express = require("express");
const app = express();

app.use(express.json()); // middleware for json bodies

const users = [];

const schemaUser = Joi.object({
  name: Joi.string().min(3).required(),
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).send();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/users", (req, res) => {
  res.send(users.map((user) => user["id"]));
});

app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  const user = users.find((user) => user.id === parseInt(id));

  if (!user) return res.status(404).send(`User ${id} was not found`);

  res.send(user);
});

app.post("/api/users/", (req, res) => {
  const validation = schemaUser.validate(req.body);

  if (validation.error)
    return res.status(400).send(validation.error.details[0].message);

  const { name } = req.body;

  const user = {
    id: users.length,
    name,
  };

  users.push(user);
  res.send(user);
});

app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;

  const user = users.find((user) => user.id === parseInt(id));
  if (!user) return res.status(404).send(`User ${id} was not found`);

  const validation = schemaUser.validate(req.body);

  if (validation.error) {
    res.status(400).send(validation.error.details[0].message);
    return;
  }

  user.name = req.body.name;
  res.send(user);
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  const user = users.find((user) => user.id === parseInt(id));
  if (!user) return res.status(404).send(`User ${id} was not found`);

  const index = users.indexOf(user);

  users.splice(index, 1);
  res.send(`${user.id} was deleted`);
});

// PORT is an environment variable
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
