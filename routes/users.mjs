import express from 'express'
const router = express()
import { dbConfig } from '../server.mjs'


router.get('/users', async (req, res) => {
    try {
        const conn = await dbConfig.pool.getConnection();
        const result = await conn.query('select * from users');
        conn.release();
    
        // Extract the usernames from the result and send as response
        const usernames = result.map(row => row.username);
        res.json({ usernames });
      } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

export default router

