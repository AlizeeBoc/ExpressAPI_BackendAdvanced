import express, { json } from "express"
const router = express.Router()
router.use(json()) //ok
import bodyParser from "body-parser"//ok
router.use(bodyParser.json())//ok
import { register } from "../controllers/register.mjs"

router.route("/").post(register)

export default router