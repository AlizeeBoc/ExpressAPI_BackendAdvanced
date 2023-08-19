import express, { json } from "express"
const router = express.Router()
router.use(json()) //ok
import bodyParser from "body-parser"//ok
router.use(bodyParser.json())//ok
import pool from "../db.mjs"
import bcrypt from "bcrypt"
router.use(express.urlencoded({ extended: true })); // !!!!



//GET formulaire pour Register
router.get("/", (req, res) => {
    res.render("register");
  });

//
router.post("/", async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) 
        return res.status(400).send({error : "Tous les champs sont requis"})

    try {
        const encryptedPassword = await bcrypt.hash(password, 10)

        await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, encryptedPassword]
            )
        
        return res.json({ message : "Utilisateur créé avec succès!" })
    } catch (err) {
        console.log(err)

        return res.status(500).json({ error : 'Internal server error'})
    }
    })
    
    export default router 