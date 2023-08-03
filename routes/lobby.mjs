import express, { json } from "express"
const router = express.Router()
import pool from "../server.mjs"

router.get("/lobby/:lobbyId/users", async (req, res) => {
  const lobbyId = req.params.lobbyId
  try {
    const result = await pool.query(
      `SELECT username FROM users WHERE teams_team_id = ${lobbyId}`
    )
    res.json(result)
    console.log(result)
  } catch (err) {
    console.error("Error fetching usernames", err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

router.get("/lobby/:lobbyId", async (req, res) => {
    const lobbyId = req.params.lobbyId
    try {
        const result = await pool.query(`SELECT content FROM messages WHERE lobby_id = ${lobbyId}`
        )
        res.json(result)
        console.log(result)
    } catch (err) {
        console.error("Error fetching messages", err)
        res.status(500).json({ error : "Internal Server Error"})
}
})

router.get("/lobby/:lobbyId/:messageId", async (req, res) => {
    const lobbyId = req.params.lobbyId
    const messageId = req.params.messageId
    try {
        const result = await pool.query(`SELECT content FROM messages WHERE lobby_id = ${lobbyId} AND message_id = ${messageId}`
        )
        res.json(result)
    } catch (err) {
        console.error("Error fetching messages", err)
        res.status(500).json({ error : "Internal Server Error"})
}
})

export default router
