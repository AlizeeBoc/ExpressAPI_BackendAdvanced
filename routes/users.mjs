import express, { json } from "express"
const router = express()
router.use(json())
import pool from "../db.mjs"



// @desc      Display the name of a specific user
// @route     GET /api/users/:userId
// @acces  
router.get("/:userId", async (req, res) => {
    const userId = req.params.userId
    try {
      const result = await pool.query(`SELECT name FROM users WHERE id in (${userId})`)
      res.json(result)
    } catch (err) {
      console.error('Error fetching username', err)
      res.status(500).json({ error : 'Internal Server Error'} )
      //next(err)
    }
  })


// ok
// @desc      Display all the users
// @route     GET /api/users/
// @acces   
router.get("/", async (req, res, next) => {
    const name = req.params.name
    try {
      const result = await pool.query("SELECT * FROM users")
      res.json(result)
      console.log(result)
    } catch (err) {
      console.error("Error fetching usernames", err)
      res.status(500).json({ error: "Internal Server Error" })
      //next(err)
    }
  })


export default router
