import express from "express"
const router = express()
import pool from "../server.mjs"

router.get("/users", async (req, res) => {
  try {
    const result = await pool.query("select * from users")

    const usernames = result.map((row) => row.username)
    res.json({ usernames })
  } catch (err) {
    console.error("Error fetching users:", err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

export default router
