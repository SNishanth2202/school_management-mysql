import express from 'express';
import {pool} from '../db.js'; 
import Joi from 'joi';

const router = express.Router();

const schoolSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  address: Joi.string().trim().min(1).max(500).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required()
});

router.post('/addSchool', async (req, res) => {
  try {
    const { error, value } = schoolSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, address, latitude, longitude } = value;
    const sql = `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.execute(sql, [name, address, latitude, longitude]);

    return res.status(201).json({ message: 'School added', id: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/listSchools', async (req, res) => {
  try {
    const userLat = parseFloat(req.query.lat);
    const userLng = parseFloat(req.query.lng);

    const Query = `
      SELECT id, name, address, latitude, longitude
      FROM schools`;

    const [rows] = await pool.execute(Query, [userLat, userLng, userLat]);

    return res.json({ count: rows.length, schools: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
