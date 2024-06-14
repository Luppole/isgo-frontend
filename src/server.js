const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'isgoroot',
  password: 'isgorootpwd',
  database: 'isgodb'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
  console.log('Connected to MySQL');
});

// Create HTTP server
const server = http.createServer(app);
const io = socketIo(server);

// WebSockets
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Endpoint to save canvas state
app.post('/canvas', (req, res) => {
  const { classId, canvasState } = req.body;
  const query = 'INSERT INTO canvas_states (class_id, canvas_state) VALUES (?, ?)';

  db.query(query, [classId, canvasState], (err, result) => {
    if (err) {
      console.error('Error saving canvas state:', err);
      return res.status(500).json({ message: 'Failed to save canvas state', error: err });
    }

    res.status(201).json({ message: 'Canvas state saved successfully' });
  });
});

// Endpoint to fetch the latest canvas state for a class
app.get('/canvas/:classId', (req, res) => {
  const classId = req.params.classId;
  const query = 'SELECT * FROM canvas_states WHERE class_id = ? ORDER BY created_at DESC LIMIT 1';

  db.query(query, [classId], (err, results) => {
    if (err) {
      console.error('Error fetching canvas state:', err);
      return res.status(500).json({ message: 'Failed to fetch canvas state', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No canvas state found' });
    }

    res.status(200).json(results[0]);
  });
});

// Existing endpoints
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const confirmationCode = generateConfirmationCode();

  db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, results) => {
    if (err) {
      console.error('Error checking existing users:', err);
      return res.status(500).json({ message: 'User registration failed', error: err });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Username or email already taken' });
    }

    db.query('INSERT INTO users (username, password, email, confirmation_code) VALUES (?, ?, ?, ?)', 
             [username, hashedPassword, email, confirmationCode], (err, result) => {
      if (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ message: 'User registration failed', error: err });
      }

      const mailOptions = {
        from: 'isgodevteam@gmail.com',
        to: email,
        subject: 'Email Confirmation',
        text: `Please confirm your email by using the following code: ${confirmationCode}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending confirmation email:', error);
          return res.status(500).json({ message: 'Error sending confirmation email', error: error });
        }
        res.status(201).json({ message: 'User registered successfully. Please check your email to confirm your account.', username });
      });
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ message: 'Server error', error: err });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const user = results[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, 'secret', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
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

app.post('/saveuserinfo', (req, res) => {
    let { username, email, age, school, address, phone, interests, professions, skills } = req.body;

    // Convert professions and skills to JSON strings if not empty
    try {
        professions = professions ? JSON.stringify(professions.split(',').map(profession => profession.trim())) : '[]';
        skills = skills ? JSON.stringify(skills.split(',').map(skill => skill.trim())) : '[]';
    } catch (error) {
        console.error('Error converting professions or skills to JSON:', error);
        return res.status(400).json({ message: 'Invalid professions or skills format', error });
    }

    // Handle age and other numeric fields being null or empty
    age = age ? parseInt(age, 10) : null;

    const sql = `
        INSERT INTO users_data (username, email, age, school, address, phone, interests, professions, skills)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        email = VALUES(email),
        age = VALUES(age),
        school = VALUES(school),
        address = VALUES(address),
        phone = VALUES(phone),
        interests = VALUES(interests),
        professions = VALUES(professions),
        skills = VALUES(skills)
    `;

    db.query(sql, [username, email, age, school, address, phone, interests, professions, skills], (err, result) => {
        if (err) {
            console.error('Error saving user info:', err);
            return res.status(500).json({ message: 'Failed to save user info', error: err });
        }
        res.status(200).json({ message: 'User info saved successfully' });
    });
});

// Add endpoint to fetch all classes
app.get('/classes', (req, res) => {
  const query = 'SELECT * FROM classes ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching classes:', err);
      return res.status(500).json({ message: 'Failed to fetch classes', error: err });
    }
    res.status(200).json(results);
  });
});

// Add endpoint to add a new class
app.post('/addclass', (req, res) => {
  const { name, description, professor } = req.body;
  const query = 'INSERT INTO classes (name, description, professor, created_at) VALUES (?, ?, ?, NOW())';

  db.query(query, [name, description, professor], (err, result) => {
    if (err) {
      console.error('Error adding class:', err);
      return res.status(500).json({ message: 'Failed to add class', error: err });
    }
    res.status(201).json({ message: 'Class added successfully' });
  });
});

// Endpoint to fetch messages for a class
app.post('/messages', (req, res) => {
  const { classId, username, message } = req.body;

  const query = 'INSERT INTO messages (class_id, username, message) VALUES (?, ?, ?)';
  db.query(query, [classId, username, message], (err, result) => {
    if (err) {
      console.error('Error sending message:', err);
      return res.status(500).json({ message: 'Failed to send message', error: err });
    }
    res.status(201).json({ message: 'Message sent successfully' });
  });
});

app.get('/messages/:classId', (req, res) => {
  const classId = req.params.classId;

  const query = 'SELECT username, message FROM messages WHERE class_id = ? ORDER BY id ASC';
  db.query(query, [classId], (err, results) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({ message: 'Failed to fetch messages', error: err });
    }
    res.status(200).json(results);
  });
});

app.get('/userinfo', (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const query = 'SELECT username, email, age, school, address, phone, interests, professions, skills FROM users_data WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch user info' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userInfo = results[0];
    res.json(userInfo);
  });
});

app.get('/classes/:classId', (req, res) => {
  const classId = req.params.classId;

  const query = 'SELECT * FROM classes WHERE id = ?';
  db.query(query, [classId], (err, results) => {
    if (err) {
      console.error('Error fetching class by ID:', err);
      return res.status(500).json({ message: 'Failed to fetch class', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.status(200).json(results[0]);
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});