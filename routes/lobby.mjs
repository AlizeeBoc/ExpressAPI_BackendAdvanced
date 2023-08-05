import express, { json } from "express"
const router = express.Router()
import pool from "../db.mjs"
router.use(json())
import bodyParser from "body-parser"
router.use(bodyParser.json())

// creer un lobby // ok
router.post("/newLobby", async (req, res) => {
  const { title, user_id } = req.body

  if (!title || !user_id) {
    return res.status(400).json({ message: "Tous les champs sont requis." })
  }

  const sqlQuery = "INSERT INTO lobby (title, user_id) VALUES (?, ?)"
  const values = [title, user_id]

  try {
    await pool.query(sqlQuery, values)
    return res
      .status(201)
      .json({ message: "Le lobby a été créé avec succès !" })
  } catch (err) {
    console.error("Erreur lors de la création du lobby :", err)
    return res.status(500).json({
      message: "Une erreur est survenue lors de la création du lobby.",
    })
  }
})

// POST un message dans un lobby // ok
router.post("/:lobbyId", async (req, res) => {
  const { user_id, content, timeStamp } = req.body
  const lobbyId = req.params.lobbyId
  console.log(user_id, content, timeStamp, lobbyId)

  if (!user_id || !content || !timeStamp || !lobbyId) {
    return res.status(400).json({ message: "Tous les champs sont requis." })
  }

  const query =
    "INSERT INTO messages (user_id, content, timeStamp, lobby_id) VALUES (?, ?, ?, ?)"
  const values = [user_id, content, timeStamp, lobbyId]

  try {
    await pool.query(query, values)
    return res
      .status(201)
      .json({ message: "Le message a été enregistré avec succès !" })
  } catch (err) {
    console.error("Erreur lors de l'insertion du message :", err)
    return res.status(500).json({
      message: "Une erreur est survenue lors de l'enregistrement du message.",
    })
  }
})

// get tous les users d'un meme lobby // ok
router.get("/:lobbyId/users", async (req, res) => {
  const lobbyId = req.params.lobbyId
  try {
    const result = await pool.query(
      `SELECT users.name FROM users left join lobbies_has_users on users.id = lobbies_has_users.users_id 
      where lobbies_has_users.lobby_id = ${lobbyId}`
    )
    res.json(result)
    console.log(result)
  } catch (err) {
    console.error("Error fetching usernames", err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// get les messages d'un lobbyId  // ok
router.get("/:lobbyId", async (req, res) => {
  const lobbyId = req.params.lobbyId
  try {
    const result = await pool.query(
      `SELECT * FROM messages WHERE lobby_id = ${lobbyId}`
    )
    res.json(result)
    console.log(result)
  } catch (err) {
    console.error("Error fetching messages", err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

//GET a single message du lobby // ok
router.get("/:lobbyId/:messageId", async (req, res) => {
  const lobbyId = req.params.lobbyId
  const messageId = req.params.messageId
  try {
    const result = await pool.query(
      `SELECT content FROM messages WHERE lobby_id = ${lobbyId} AND id = ${messageId}`
    )
    console.log(result)
    res.json(result)
  } catch (err) {
    console.error("Error fetching messages", err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

export default router
