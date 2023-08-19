// YOU ARE LOST SOMEWHERE HERE //  => comment y intégrer les query via ma db?

import dotenv from "dotenv"
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}
import express, { application } from 'express'
const router = express.Router()
import bodyParser from "body-parser"//ok
router.use(bodyParser.json())//ok
import bcrypt from 'bcrypt'
import passport from 'passport'
import flash from 'express-flash'
import initializePassport from "../passport-config.mjs"
import session from 'express-session'
//import pool from "../db.mjs"



initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []

router.use(express.urlencoded({extended : false})) // !!! ici, pas dans le server.mjs!!! permet d'utiliser les variables entrées dans les champs pour la post method
router.use(flash())
router.use(session({ 
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false
 }))

router.use(passport.session())
//router.use(express.json())
//import { dbConfig } from '../server.mjs'




//1.ok
router.get('/', (req, res) => {
    res.render('login.ejs')
})

//4.
router.post('/', passport.authenticate('local', {
    succesRedirect : '/', 
    failureRedirect : '/api/login',
    failureFlash : true,
}))

//2.
router.get('/register', (req, res) => {
    res.render('register.ejs')
})

//3.
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
          id: Date.now().toString(),
          name : req.body.name,
          email : req.body.email,
          password : hashedPassword 
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    console.log(users)
//req.body.name //req.body.name ou req.body.email ou req.body.password ... ce qui correspond a "name" dans les forms des login et register.ejs
})

export default router 