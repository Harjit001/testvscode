import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './src/lib/db.js';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

// API Routes
app.get('/api/menu', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu_items');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  const { name, email, date, time, guests, bringing_dog, dog_name, dog_breed, swimming_session } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO bookings (name, email, date, time, guests, bringing_dog, dog_name, dog_breed, swimming_session)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, email, date, time, guests, bringing_dog, dog_name, dog_breed, swimming_session]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});