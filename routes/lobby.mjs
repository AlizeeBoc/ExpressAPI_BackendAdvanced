import express, { json } from "express"
const router = express.Router()
import pool from "../db.mjs"
router.use(json())
import bodyParser from "body-parser"
//import { use } from "passport"
router.use(bodyParser.json())

// creer un lobby // ok
router.post("/newLobby", async (req, res) => {
  const { title} = req.body

  if (!title) {
    return res.status(400).json({ message: "Tous les champs sont requis." })
  }

  const sqlQuery = "INSERT INTO lobby (title) VALUES (?)"
  const values = [title]

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

// 5. POST un message dans un lobby // ok
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

// 5. get tous les users d'un meme lobby // ok
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

// 3. get les messages d'un lobbyId  // ok
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

//4. GET a single message du lobby // ok
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

// Crée un nouvel user dans un lobby (en créer un s'il n'existe pas encore) // ok

router.post("/:lobbyId/add-user", async (req, res) => {
  const lobbyId = req.params.lobbyId;
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    // Vérifier si le lobby avec l'ID spécifié existe
    const lobbyCheckQuery = "SELECT * FROM lobby WHERE id = ?";
    const lobbyCheckResult = await pool.query(lobbyCheckQuery, [lobbyId]);

    if (lobbyCheckResult.length === 0) {
      // Si le lobby n'existe pas, le créer d'abord 
      const createLobbyQuery = "INSERT INTO lobby (id, title) VALUES (?, ?)";
      const createLobbyValues = [lobbyId, `Lobby ${lobbyId}`];
      await pool.query(createLobbyQuery, createLobbyValues);
    }

    // Insérer le nouvel utilisateur dans la table "users"
    const userQuery =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    const userValues = [name, email, password, role];
    const userResult = await pool.query(userQuery, userValues);

    // Récupérer l'ID de l'utilisateur nouvellement inséré
    const userId = userResult.insertId;

    // Insérer la relation dans la table "lobbies_has_users"
    const lobbiesHasUsersQuery =
      "INSERT INTO lobbies_has_users (users_id, lobby_id) VALUES (?, ?)";
    const lobbiesHasUsersValues = [userId, lobbyId];
    await pool.query(lobbiesHasUsersQuery, lobbiesHasUsersValues);

    return res
      .status(201)
      .json({ message: "Le nouvel utilisateur a été créé avec succès !" });
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur :", err);
    return res.status(500).json({
      message: "Une erreur est survenue lors de la création de l'utilisateur.",
    });
  }
});


// remove user from a lobby // non ok. Le code ne crash pas, response = utilisateur supprimé avec succes mais ... rien ne change dans ma database
router.post("/:lobbyId/remove-user/:userId", async (req, res) => {
  const lobbyId = req.params.lobbyId;
  const userId = req.params.userId;

  try {
    // Vérifier si le lobby avec l'ID spécifié existe
    const lobbyCheckQuery = "SELECT * FROM lobby WHERE id = ?";
    const lobbyCheckResult = await pool.query(lobbyCheckQuery, [lobbyId]);

    if (lobbyCheckResult.length === 0) {
      return res.status(404).json({ message: "Le lobby spécifié n'existe pas." });
    }

    // Vérifier si l'utilisateur avec l'ID spécifié existe
    const userCheckQuery = "SELECT * FROM users WHERE id = ?";
    const userCheckResult = await pool.query(userCheckQuery, [userId]);

    if (userCheckResult.length === 0) {
      return res.status(404).json({ message: "L'utilisateur spécifié n'existe pas." });
    }

    // Supprimer la relation dans la table "lobbies_has_users"
    const removeUserFromLobbyQuery =
      "DELETE FROM lobbies_has_users WHERE users_id = ? AND lobby_id = ?";
    await pool.query(removeUserFromLobbyQuery, [userId, lobbyId]);

    return res.status(200).json({ message: "L'utilisateur a été supprimé du lobby avec succès !" });
  } catch (err) {
    console.error("Erreur lors de la suppression de l'utilisateur du lobby :", err);
    return res.status(500).json({
      message: "Une erreur est survenue lors de la suppression de l'utilisateur du lobby.",
    });
  }
});



export default router
