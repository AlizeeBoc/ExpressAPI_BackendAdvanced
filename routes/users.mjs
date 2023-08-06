import express, { json } from "express"
const router = express()
import { displayAllUsers, displayUser } from "../controllers/users.mjs"
router.use(json())

router.route('/:userId').get(displayUser)
router.route('/').get(displayAllUsers)

export default router
