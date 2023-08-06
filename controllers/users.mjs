import express, { json } from "express"
const router = express.Router()
import pool from "../db.mjs"
router.use(json())
import bodyParser from "body-parser"
//import { use } from "passport"
router.use(bodyParser.json())



// @desc      Display the name of a specific user
// @route     GET /api/users/:userId
// @acces  
export const displayUser = async (req, res) => {
    const userId = req.params.userId
    try {
      const result = await pool.query(`SELECT name FROM users WHERE id in (${userId})`)
      res.json(result)
    } catch (err) {
      console.error('Error fetching username', err)
      res.status(500).json({ error : 'Internal Server Error'} )
    }
  }


// ok
// @desc      Display all the users
// @route     GET /api/users/
// @acces   
export const displayAllUsers = async (req, res) => {
    const name = req.params.name
    try {
      const result = await pool.query("SELECT * FROM users")
      res.json(result)
      console.log(result)
    } catch (err) {
      console.error("Error fetching usernames", err)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }