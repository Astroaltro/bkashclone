const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------
// MOCK DATABASE (Replace with real database later)
// ---------------------------------------------------------
const users = []; 

// ---------------------------------------------------------
// ROUTES
// ---------------------------------------------------------

// 1. REGISTER a new user
app.post('/api/register', async (req, res) => {
    try {
        const { phone, password, name } = req.body;

        // Check if user already exists
        const userExists = users.find(u => u.phone === phone);
        if (userExists) {
            return res.status(400).json({ message: 'Phone number already registered' });
        }

        // Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user to "database"
        const newUser = { id: Date.now().toString(), phone, name, password: hashedPassword };
        users.push(newUser);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// 2. LOGIN an existing user
app.post('/api/login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Find the user
        const user = users.find(u => u.phone === phone);
        if (!user) {
            return res.status(400).json({ message: 'Invalid phone number or password' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid phone number or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.id, phone: user.phone }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ 
            message: 'Login successful', 
            token, 
            user: { id: user.id, name: user.name, phone: user.phone } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
});

// 3. PROTECTED ROUTE (Example of fetching balance, requires token)
app.get('/api/balance', (req, res) => {
    // Read the token from the headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // If valid, return the data
        res.json({ phone: decoded.phone, balance: '৳ 12,450.00' });
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
});

// ---------------------------------------------------------
// START SERVER
// ---------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));