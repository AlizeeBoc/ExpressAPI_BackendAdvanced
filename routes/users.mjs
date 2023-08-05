import express, { json } from "express"
const router = express()
import pool from "../db.mjs"
router.use(json())

// 7. GET 1 seul user // ok
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId
  try {
    const result = await pool.query(`SELECT name FROM users WHERE id in (${userId})`)
    res.json(result)
  } catch (err) {
    console.error('Error fetching username', err)
    res.status(500).json({ error : 'Internal Server Error'} )
  }
})





// ok
router.get("/", async (req, res) => {
  const name = req.params.name
  try {
    const result = await pool.query("SELECT * FROM users")
    res.json(result)
    console.log(result)
  } catch (err) {
    console.error("Error fetching usernames", err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})


export default router
