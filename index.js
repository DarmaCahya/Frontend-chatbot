const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/index', (req, res) => {
    res.render('index');
});

app.get('/opening', (req, res) => {
    res.render('opening');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/chat', (req, res) => {
    res.render('chatAI');
});

app.get('/', (req, res) => {
    res.render('test');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
