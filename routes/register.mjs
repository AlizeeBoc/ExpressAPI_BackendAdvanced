import express, { json } from "express"
const router = express.Router()
router.use(json())
import bodyParser from "body-parser"
router.use(bodyParser.json())
import { register } from "../controllers/register.mjs"

router.route("/").post(register)

export default router