const authRouter = require('./auth')
const usersRouter = require('./user')

function routes (app) {
    app.use('/api/auth', authRouter)

    app.use('/api/users', usersRouter)
}

module.exports = routes