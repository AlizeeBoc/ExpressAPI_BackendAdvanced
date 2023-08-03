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

export default router
