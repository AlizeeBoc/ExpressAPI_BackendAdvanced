import express from "express"
const router = express.Router()
import pool from "../db.mjs"
//import bodyParser from "boddy-parser"
import bcrypt from "bcrypt"

//router.use(json())
//router.use(bodyParser.json())


// @desc      register a new user
// @route     POST /api/register
// @acces
export const register = async (req, res) => {
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
    }



