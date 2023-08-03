import express from "express"
const router = express.Router()


router.get("/", (req, res) => {
  res.render("index.ejs", { name : 'kyle'})
})

router.post("/api/register", (req, res) => {
  res.send("A new user has just been created!") // tester en récupérant la liste des users
})

router.post("/api/login", (req, res) => {
  res.send({ json: "token here" })
})

router.get("/api/lobby/:lobby-id", (req, res) => {
  res.send("here : an array of all the messages from the lobby")
})

router.get("/api/lobby/:lobby-id/:message-id", (req, res) => {
  res.send("a single message object from the lobby")
})

router.post("/api/lobby/:lobby-id", (req, res) => {
  res.render("The message has been posted!")
})

router.get("/api/users", (req, res) => {
  res.send("all the users from the same lobby")
})

router.get("/api/users/:user-id", (req, res) => {
  res.send(
    "A single user. If the user is not an admin, can only get details from people that are in the same lobby"
  )
})

router.post("/api/lobby/:lobby-id/add-user", (req, res) => {
  res.send("removes an user from the lobby")
})

router.patch("/api/lobby/:message-id", (req, res) => {
  res.render(
    "Edit a message. Users can only edit their own messages, unless they are admins"
  )
})

router.delete("/api/messages/:message-id", (req, res) => {
  res.render(
    "Delete a message. Users can only edit their own messages, unless they are admins."
  )
})
export default router
