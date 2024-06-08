const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'myappuser',
    password: 'Itamar1405!',  // replace with your actual password
    database: 'isgodb'     // ensure this is the correct database name
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    console.log(`Registration request received for username: ${username}`);

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error during registration:', err);
            return res.status(500).json({ message: 'User registration failed', error: err });
        }
        console.log(`User registered successfully: ${username}`);
        res.status(201).json({ message: 'User registered successfully' });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Login request received for username: ${username}`);

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).json({ message: 'Server error', error: err });
        }

        if (results.length === 0) {
            console.log(`User not found: ${username}`);
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log(`Invalid password for user: ${username}`);
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        console.log(`User logged in successfully: ${username}`);
        res.status(200).json({ token });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
