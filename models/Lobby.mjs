import pool from "../db.mjs"

export class Lobby {
  static async findById(id) {
    const query = "SELECT * from lobby where id = ?"
    const values = [id]
    const lobbyResult = await pool.query(query, values)
    return lobbyResult[0]
  }

  static async create(title) {
    const query = "INSERT into lobby (title) VALUES (?)"
    const values = [title]
    await pool.query(query, values)
  }

  static async update(id, title) {
    const query = "UPDATE lobby SET title = ? WHERE id = ?"
    const values = [id, title]
    await pool.query(query, values)
  }

  static async delete(id) {
    const query = "DELETE FROM lobby WHERE id = ?"
    const values = [id]
    await pool.query(query, values)
  }
}
