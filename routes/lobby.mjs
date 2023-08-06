import express, { json } from "express"
const router = express.Router()
import { createNewLobby, createMessage, usersFromLobby, messagesFromLobby, messageFromLobby, createNewUser, removeUserFromLobby } from "../controllers/lobby.mjs";
router.use(json())
import bodyParser from "body-parser"
router.use(bodyParser.json())


router.route('/newLobby').post(createNewLobby)//ok
router.route('/:lobbyId').post(createMessage).get(messagesFromLobby) //ok //ok
router.route('/:lobbyId/users').get(usersFromLobby) //ok
router.route('/:lobbyId/:messageId').get(messageFromLobby) // ok
router.route('/:lobbyId/add-user').post(createNewUser) //ok
router.route('/:lobbyId/remove-user/:userId').post(removeUserFromLobby)


export default router
