import express, { json } from "express"
const router = express()
import pool from "../db.mjs"
router.use(json())

// Crée un nouvel user //ok

router.post("/", async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES ('${name}', '${email}', '${password}', '${role}') RETURNING *`
    )

    if (result.rows && result.rows.length > 0) {
      res.status(201).json(result.rows[0])
    } else {
      res.status(500).json({ error: "Échec de la création de l'utilisateur" })
    }
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Nom d'utilisateur déjà pris" })
    } else {
      console.error("Erreur lors de la création de l'utilisateur", err)
      res.status(500).json({ error: "Erreur Interne du Serveur" })
    }
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
