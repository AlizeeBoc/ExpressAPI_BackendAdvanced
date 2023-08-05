import dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()

import mariadb from "mariadb"
let pool = mariadb.createPool({
  host: "localhost",
  //port : 3000,
  user: "alizee",
  password: process.env.password_Maria,
  database: "lokkeroom2",
  connectionLimit: 5,
})

export default pool
