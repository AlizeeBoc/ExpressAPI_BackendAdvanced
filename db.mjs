import dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()

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


const connection = async (query) => {
  let conn
  try {
    conn = await pool.getConnection()
    //console.log("connection ok")
    const res = await conn.query(query)
    console.log(res)
  } catch (err) {
    throw err
  } finally {
    if (conn) return conn.end()
  }
}
connection()

export default connection


//import mariadb from "mariadb"
//let pool = mariadb.createPool({
//  host: "localhost",
//  //port : 3000,
//  user: "alizee",
//  password: process.env.password_Maria,
//  database: "lokkeroom",
//  connectionLimit: 5,
//})

//export const dbConfig = Object.freeze({
//  pool: pool,
//})