const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // Replace with your database host
  user: 'root', // Replace with your database user
  password: 'root_123', // Replace with your database password
});

// Connect to MySQL and create database
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');

  // Create database if it doesn't exist
  db.query('CREATE DATABASE IF NOT EXISTS animalsDB', err => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database animalsDB ensured');

    // Use the new database
    db.changeUser({ database: 'animalsDB' }, err => {
      if (err) {
        console.error('Error switching to database:', err);
        return;
      }
      console.log('Switched to animalsDB');

      // Create table if it doesn't exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS reports (
          id INT AUTO_INCREMENT PRIMARY KEY,
          animalType VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      db.query(createTableQuery, err => {
        if (err) {
          console.error('Error creating table:', err);
          return;
        }
        console.log('Table reports ensured');
      });
    });
  });
});

// Endpoint to add a report
app.post('/addReport', (req, res) => {
    console.log('Received request:', req.body);
  const { animalType, location, description } = req.body;

  if (!animalType || !location || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO reports (animalType, location, description) VALUES (?, ?, ?)';
  db.query(query, [animalType, location, description], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json({ message: 'Report added successfully', reportId: result.insertId });
  });
});
