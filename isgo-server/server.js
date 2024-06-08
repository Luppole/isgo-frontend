const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

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

const transporter = nodemailer.createTransport({
    service: 'Gmail', // use your email service provider
    auth: {
        user: 'your-email@gmail.com', // replace with your email
        pass: 'your-email-password' // replace with your email password
    }
});

// Generate a confirmation code
const generateConfirmationCode = () => {
    return crypto.randomBytes(20).toString('hex');
};

app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationCode = generateConfirmationCode();

    db.query('INSERT INTO users (username, password, email, confirmation_code) VALUES (?, ?, ?, ?)', 
             [username, hashedPassword, email, confirmationCode], (err, result) => {
        if (err) {
            console.error('Error during registration:', err);
            return res.status(500).json({ message: 'User registration failed', error: err });
        }

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Email Confirmation',
            text: `Please confirm your email by using the following code: ${confirmationCode}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending confirmation email:', error);
                return res.status(500).json({ message: 'Error sending confirmation email', error: error });
            }
            res.status(201).json({ message: 'User registered successfully. Please check your email to confirm your account.' });
        });
    });
});

app.post('/confirm', (req, res) => {
    const { username, confirmationCode } = req.body;

    db.query('SELECT * FROM users WHERE username = ? AND confirmation_code = ?', [username, confirmationCode], (err, results) => {
        if (err) {
            console.error('Error during confirmation:', err);
            return res.status(500).json({ message: 'Server error', error: err });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid username or confirmation code' });
        }

        db.query('UPDATE users SET is_confirmed = 1, confirmation_code = NULL WHERE username = ?', [username], (err, result) => {
            if (err) {
                console.error('Error during confirmation:', err);
                return res.status(500).json({ message: 'Server error', error: err });
            }
            res.status(200).json({ message: 'Email confirmed successfully' });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
