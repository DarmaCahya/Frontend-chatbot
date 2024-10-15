const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk menyajikan file statis
app.use(express.static(path.join(__dirname, 'public')));


// Menyajikan file HTML sebagai halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Define your routes
app.get('/opening', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/opening.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/login.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/pages/chatAI.html'));
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
