import express from "express"
const router = express.Router()

import loginRouter from "./login.mjs"
import usersRouter from "./users.mjs"
import lobbyRouter from "./lobby.mjs"
import register from "./register.mjs"


router.use('/login', loginRouter)
router.use('/users', usersRouter)
router.use('/lobby', lobbyRouter)
router.use('/register', register)


export default router
