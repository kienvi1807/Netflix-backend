const express = require('express')
const router = express.Router()
const userController = require('../app/controllers/UserController')
const verifyToken = require('../app/middlewares/verifyToken')

router.get('/' ,  userController.getAll)

module.exports = router