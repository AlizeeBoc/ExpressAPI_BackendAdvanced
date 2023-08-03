import express from "express"
const router = express.Router()

import loginRouter from "./login.mjs"
import usersRouter from "./users.mjs"
import lobbyRouter from "./lobby.mjs"
import messageRouter from "./messages.mjs"

router.use('/login', loginRouter)
router.use('/users', usersRouter)
router.use('/lobby', lobbyRouter)
router.use('/messages', messageRouter)

export default router
