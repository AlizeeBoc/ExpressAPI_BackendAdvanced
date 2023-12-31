import pool from "../db.mjs"


// @desc      Create a new lobby
// @route     POST /api/lobby/newLobby
// @acces
export const createNewLobby = async (req, res, next) => {
  const { title } = req.body

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
}

// @desc      Create a message in a lobby
// @route     POST /api/lobby/:lobbyId
// @acces
export const createMessage = async (req, res, next) => {
  const { user_id, content, timeStamp } = req.body
  const lobbyId = req.params.lobbyId

  if (!user_id || !content || !timeStamp || !lobbyId) {
    return res.status(400).json({ message: "Tous les champs sont requis." })
  }

  const userLobbyCheckQuery =
    "SELECT * FROM lobbies_has_users WHERE users_id = ? AND lobby_id = ?"
  const userLobbyCheckValues = [user_id, lobbyId]
  const userLobbyCheckResult = await pool.query(
    userLobbyCheckQuery,
    userLobbyCheckValues
  )

  if (userLobbyCheckResult.length === 0) {
    return res
      .status(403)
      .json({ message: "Vous n'êtes pas autorisé à poster dans ce lobby." })
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
  next()
}

// @desc      Display all the users from a lobby
// @route     GET /api/lobby/:lobbyId/users
// @acces
export const usersFromLobby = async (req, res, next) => {
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
}

// @desc      Display all the messages from a lobby
// @route     GET /api/lobby/:lobbyId
// @acces
export const messagesFromLobby = async (req, res, next) => {
  const lobbyId = req.params.lobbyId
  try {
    const result = await pool.query(
      `SELECT content FROM messages WHERE lobby_id = ${lobbyId}`
    )
    res.json(result)
    console.log(result)
  } catch (err) {
    console.error("Error fetching messages", err)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

// @desc      Display a specific message from a specific lobby
// @route     GET /api/lobby/:lobbyId/:messageId
// @acces
export const messageFromLobby = async (req, res, next) => {
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
}

// @desc      Create a new user in a specific lobby (create a new lobby if it doesn't already exist)
// @route     POST /api/lobby/:lobbyId/add-user
// @acces

export const createNewUser = async (req, res, next) => {
  const lobbyId = req.params.lobbyId
  const { name, email, password, role } = req.body

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Tous les champs sont requis." })
  }

  try {
    // Vérifier si le lobby avec l'ID spécifié existe
    const lobbyCheckQuery = "SELECT * FROM lobby WHERE id = ?"
    const lobbyCheckResult = await pool.query(lobbyCheckQuery, [lobbyId])

    if (lobbyCheckResult.length === 0) {
      // Si le lobby n'existe pas, le créer d'abord
      const createLobbyQuery = "INSERT INTO lobby (id, title) VALUES (?, ?)"
      const createLobbyValues = [lobbyId, `Lobby ${lobbyId}`]
      await pool.query(createLobbyQuery, createLobbyValues)
    }

    // Insérer le nouvel utilisateur dans la table "users"
    const userQuery =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
    const userValues = [name, email, password, role]
    const userResult = await pool.query(userQuery, userValues)

    // Récupérer l'ID de l'utilisateur nouvellement inséré
    const userId = userResult.insertId

    // Insérer la relation dans la table "lobbies_has_users"
    const lobbiesHasUsersQuery =
      "INSERT INTO lobbies_has_users (users_id, lobby_id) VALUES (?, ?)"
    const lobbiesHasUsersValues = [userId, lobbyId]
    await pool.query(lobbiesHasUsersQuery, lobbiesHasUsersValues)

    return res
      .status(201)
      .json({ message: "Le nouvel utilisateur a été créé avec succès !" })
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur :", err)
    return res.status(500).json({
      message: "Une erreur est survenue lors de la création de l'utilisateur.",
    })
  }
}

// @desc      Remove a specific user from a specific lobby
// @route     POST /api/lobby/:lobbyId/remove-user/:userId
// @acces
export const removeUserFromLobby = async (req, res, next) => {
  const lobbyId = req.params.lobbyId
  const userId = req.params.userId

  try {
    const lobbyCheckQuery = "SELECT * FROM lobby WHERE id = ?"
    const lobbyCheckResult = await pool.query(lobbyCheckQuery, [lobbyId])

    if (lobbyCheckResult.length === 0) {
      return res
        .status(404)
        .json({ message: "Le lobby spécifié n'existe pas." })
    }

    const userCheckQuery = "SELECT * FROM users WHERE id = ?"
    const userCheckResult = await pool.query(userCheckQuery, [userId])

    if (userCheckResult.length === 0) {
      return res
        .status(404)
        .json({ message: "L'utilisateur spécifié n'existe pas." })
    }

    const removeUserFromLobbyQuery =
      "DELETE FROM lobbies_has_users WHERE users_id = ? AND lobby_id = ?"
    await pool.query(removeUserFromLobbyQuery, [userId, lobbyId])

    return res
      .status(200)
      .json({ message: "L'utilisateur a été supprimé du lobby avec succès !" })
  } catch (err) {
    console.error(
      "Erreur lors de la suppression de l'utilisateur du lobby :",
      err
    )
    return res.status(500).json({
      message:
        "Une erreur est survenue lors de la suppression de l'utilisateur du lobby.",
    })
  }
  next()
}
