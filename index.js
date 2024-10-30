const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();
const jwt_decode = require('jwt-decode');

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

app.get('/chats', (req, res) => {
    res.render('chatAI');
});

app.get('/', (req, res) => {
    res.render('test');
});

// API Chat
app.post('/history', async (req, res) => {
    try{
        const {historyName, status, userId} = req.body;

        const response = await fetch(process.env.HISTORY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ historyName,status, userId })
        })
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log(data);
            res.status(response.status).json(data);
        } else {
            const text = await response.text();
            res.status(response.status).json({ message: text });
        }
    }catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat membuat history." });
    }
});

app.post('/bot', async (req,res ) => {
    try {
        const { message } = req.body; 

        const response = await fetch(process.env.BOT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            res.status(response.status).json(data);
        } else {
            const text = await response.text();
            res.status(response.status).json({ message: text });
        }
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat menghubungi bot." });
    }
});

// authentikasi API
app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/api/register', async (req, res) => {
    try {
        const response = await fetch(process.env.REGISTER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            res.status(response.status).json(data);
        } else {
            const text = await response.text();
            res.status(response.status).json({ message: text });
        }
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat melakukan pendaftaran." });
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/api/login', async (req, res) => {
    try {
        const response = await fetch(process.env.LOGIN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            res.status(response.status).json(data);
        } else {
            res.status(response.status).json({ message: "Terjadi kesalahan saat melakukan masuk." });
        }
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat melakukan masuk." });
    }
});
app.get('/verify', (req, res) => {
    res.render('verify')
})

app.get('/response', (req, res) => {
    res.render('response')
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
