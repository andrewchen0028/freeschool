const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const prisma = require('../prisma');

usersRouter.get("/", (_, response) => {
  prisma.user.findMany().then((users) => {
    return response.json(users).status(200).end();
  });
});

usersRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  prisma.user.create({
    data: {
      username: username,
      passwordHash: passwordHash
    }
  }).then((user) => {
    return response.json(user).status(201).end();
  }).catch((error) => {
    switch (error.code) {
      case "P2002":
        console.warn(`Attempted to add duplicate username: ${username}`);
        return response.status(409).end();
      default:
        console.warn(`Failed to add user: ${error}`);
        return response.status(500).end();
    }
  });

});

module.exports = usersRouter;