import express from 'express' 
const router = express.Router()
import { dbConfig } from "../server.mjs"


router.get('/', (req, res) => {
    res.render('index')
})

export default router