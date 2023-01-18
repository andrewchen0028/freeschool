const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const prisma = require('../prisma');

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body;

    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id,
    }

    const token = jwt.sign(userForToken, process.env.AUTH_SECRET)

    response
        .status(200)
        .send({ token, username: user.username, id: user.id })
})

module.exports = loginRouter