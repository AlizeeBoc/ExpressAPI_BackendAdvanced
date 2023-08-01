import dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()
import expressLayouts from "express-ejs-layouts"

import indexRouter from "./routes/index.mjs"

import mariadb from "mariadb"
let pool = mariadb.createPool({
  host: "localhost",
  //port : 3000,
  user: "alizee",
  password: process.env.password_Maria,
  database: "lokkeroom",
  connectionLimit: 5,
})

const connection = async () => {
  let conn
  try {
    conn = await pool.getConnection()
    //console.log("connection ok")
    const res = await conn.query('select * from users')
    console.log(res)
  } catch (err) {
    throw err
  } finally {
    if (conn) return conn.end()
  }
}
connection()

export const dbConfig = Object.freeze({
  pool: pool,
})

//import path from 'path';
//import url from 'url';

//const __filename = url.fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

//console.log(__filename);
//console.log(__dirname);

app.set("view engine", "ejs")
app.set(
  "views",
  "/home/alizee/becode_exo/hill/backendNodeJs/expressAdvanced" + "/views"
)
app.set("layout", "layouts/layout")
app.use(expressLayouts)
app.use(express.static("public"))

app.use("/", indexRouter)

app.listen(process.env.PORT || 3000)

// npm init -y
// npm i express ejs express-ejs-layouts  ==> json/main : server.mjs
// npm i --save-dev nodemon ==> json/scripts : start/dev
// npm i mariadb
// npm install dotenv

// TUTOS :
// application setUp : https://www.youtube.com/watch?v=qj2oDkvc4dQ

// ISSUES AND HOW TO FIX THEM :
// __dirname in ECMAS : https://stackabuse.com/bytes/fix-dirname-is-not-defined-in-es-module-scope-in-javascript-node/
// connect MariaDb to express : https://mariadb.com/resources/blog/getting-started-with-connector-node-js/
