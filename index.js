const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/index', (req, res) => {
    res.render('index');
});

app.get('/opening', (req, res) => {
    res.render('opening');
});

app.get('/chat', (req, res) => {
    res.render('chatAI');
});

app.get('/', (req, res) => {
    res.render('test');
});

// authentikasi API
app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/api/register', async(req,res) => {
    try {
        const response = await fetch('http://ec2-35-85-179-20.us-west-2.compute.amazonaws.com/user/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });
    
        // Log status dan body respons
        console.log('Status Code:', response.status);
        console.log('Response Body:', await response.text());
    
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Terjadi kesalahan saat melakukan registrasi." });
    }
})

app.get('/login', (req, res) => {
    res.render('login');
});
app.post ('/api/login', async(req,res) => {
    try {
        const response = await fetch ('http://ec2-35-85-179-20.us-west-2.compute.amazonaws.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.status(response.status).json(data);
    }catch (error) {
        res.status(response.status).json(data);
        res.status(500).json({ message: "Terjadi kesalahan saat melakukan registrasi." });
    }
})

app.get('/verify', (req, res) => {
    res.render('verify')
})

app.get('/response', (req, res) => {
    res.render('response')
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
