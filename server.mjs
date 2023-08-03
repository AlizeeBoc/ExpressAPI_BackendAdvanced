import dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()
import expressLayouts from "express-ejs-layouts"

import indexRouter from "./routes/index.mjs"
import loginRouter from "./routes/login.mjs"
import usersRouter from "./routes/users.mjs"
import lobbyRouter from "./routes/lobby.mjs"
//import connection from "./db.mjs"
//import bcrypt from 'bcrypt'

import mariadb from "mariadb"
let pool = mariadb.createPool({
  host: "localhost",
  //port : 3000,
  user: "alizee",
  password: process.env.password_Maria,
  database: "lokkeroom",
  connectionLimit: 5,
})

export const dbConfig = Object.freeze({
  pool: pool,
})

app.set("view engine", "ejs")
app.set(
  "views",
  "/home/alizee/becode_exo/hill/backendNodeJs/expressAdvanced" + "/views"
)
app.set("layout", "layouts/layout")
app.use(expressLayouts)
app.use(express.static("public"))

//app.use(express.json())
app.use("/", indexRouter)
app.use("/", loginRouter)
app.use("/", usersRouter)
app.use("/", lobbyRouter)

//app.use(express.urlencoded({extended : false})) // a mettre dans le login.mjs!!! permet d'utiliser les datas entrées dans le form dans les requetes inside of our request variables inside our post method

app.listen(process.env.PORT || 3000)
export default pool















// npm init -y
// npm i express ejs express-ejs-layouts  ==> json/main : server.mjs
// npm i --save-dev nodemon ==> json/scripts : start/dev
// npm i mariadb
// npm install dotenv
// npm i bcrypt
// npm i passport passport-local express-session express-flash

// TUTOS :
// application setUp : https://www.youtube.com/watch?v=qj2oDkvc4dQ
// login/register : https://www.youtube.com/watch?v=-RCnNyD0L-s
//

// ISSUES AND HOW TO FIX THEM :
// __dirname in ECMAS : https://stackabuse.com/bytes/fix-dirname-is-not-defined-in-es-module-scope-in-javascript-node/
//import path from 'path';
//import url from 'url';

//const __filename = url.fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

//console.log(__filename);
//console.log(__dirname);

// connect MariaDb to express : https://mariadb.com/resources/blog/getting-started-with-connector-node-js/

