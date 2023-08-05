import express from 'express'
const router = express()
//import pool from "../db.mjs"


//
router.post("/lobby/:lobbyId", async (req, res) => {
    const message = req.body.message
    const lobyId = req.params.lobbyId
    try {

    } catch(err) {
        
    }
})

export default router 