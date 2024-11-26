const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

let isAdmin = false;

app.get('/index', (req, res) => {
    res.render('index');
});

app.get('/opening', (req, res) => {
    res.render('opening');
});

app.get('/chats', (req, res) => {
    res.render('chatAI');
});

app.get('/verify', (req, res) => {
    res.render('verify');
});

app.get('/unauthorized', (req, res) => {
    res.render('unauthorized');
});

app.get('/not-found', (req, res) => {
    res.render('notFound');
});

app.get('/', (req, res) => {
    res.render('test');
});

app.get('/dashboards', (req, res) => {
    try {
        if(isAdmin){
            res.render('dashboards');
        } else {
            res.render('unauthorized');
        }
    } catch (e){
        res.render('notFound');
    }
});

app.get('/forgot-password', (req, res) => {
    try {
        res.render('forgot-password');
    } catch (e){
        res.render('notFound');
    }
});

app.get('/lupa-password', (req, res) => {
    try {
        res.render('reset-password', {token : req.query.token});
    } catch (e){
        res.render('notFound');
    }
});

app.post('/forgot-password-post', async (req, res) => {
    try {
        const response = await fetch(`${process.env.FORGOT_PASSWORD_API_URL}`, {
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
    } catch (e){
        res.render('notFound');
    }
});

app.get('/verify-change-password-token', async (req, res) =>{
    try{
        const verifyTokenApi = process.env.TOKEN_FORGOT_API_URL;
        const token = req.query.token;
        const response = await fetch(`${verifyTokenApi}?token=${token}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            const data = await response.text();
            res.status(400).json({ message: data });
        } else {
            const data = await response.text();
            res.status(200).json(data);
        }
    }catch (error) {
        console.error(error);
    }
});

app.post('/reset-password-post', async (req, res) => {
    try {
        const resetPasswordApi = process.env.RESET_PASSWORD_API_URL;
        const response = await fetch(`${resetPasswordApi}`, {
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
    } catch (e){
        res.status(500).json({ message: "Terjadi kesalahan saat melakukan set ulang sandi" });
    }
});

// API Chat
app.post('/histories', async (req, res) => {
    try{
        const {historyName, status, userId} = req.body;
        const token = req.headers.authorization;
        const response = await fetch(process.env.HISTORY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ historyName,status, userId })
        })
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
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
app.delete('/histories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization;

        const response = await fetch(`${process.env.HISTORY_API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log("Deleted data:", data);
            res.status(response.status).json(data);
        } else {
            const text = await response.text();
            res.status(response.status).json({ message: text });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat menghapus history." });
    }
});
app.get('/history-lists/:userId', async (req, res) =>{
    try{
        const historyList = process.env.HISTORYLIST_API_URL;
        const token = req.headers.authorization;
        const userId = req.params.userId;
        const response = await fetch(`${historyList}${userId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (!response.ok) {
            throw new Error('Gagal mengambil daftar chat');
        }
        const data = await response.json();
        res.status(200).json(data);
    }catch (error) {
        console.error(error);
    }
})
app.put('/histories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization;
        const {historyName, status, userId} = req.body;

        const response = await fetch(`${process.env.HISTORY_API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ historyName, status, userId})
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
        console.error("Error:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat memperbarui history." });
    }
});

app.post('/bot', async (req,res ) => {
    try {
        const { message, token_jwt, historyId } = req.body; 
        console.log('history', historyId);
        const response = await fetch(process.env.BOT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token_jwt}`
            },
            body: JSON.stringify({ 'chat': message, 'historyId': historyId })
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
            const role = jwt.decode(data.token).role;
            isAdmin = role === 'ADMIN';
        } else {
            res.status(response.status).json({ message: "Terjadi kesalahan saat melakukan masuk." });
        }
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat melakukan masuk." });
    }
});

app.get('/chat-history/:historyId', async (req, res) =>{
    try{
        const chatHistory = process.env.CHATHISTORY_API_URL;
        const token = req.headers.authorization;
        const historyId = req.params.historyId;
        const response = await fetch(`${chatHistory}${historyId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (!response.ok) {
            throw new Error('Gagal mengambil daftar chat');
        }
        const data = await response.json();
        res.status(200).json(data);
    }catch (error) {
        console.error(error);
    }
})

//Dashboard API
app.get('/active-users', async (req, res) =>{
    try{
        const token = req.headers.authorization;
        const response = await fetch(process.env.TOTAL_ACTIVE_USER_API_URL,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (!response.ok) {
            throw new Error('Gagal mengambil jumlah user aktif');
        }
        const data = await response.json();
        res.status(200).json(data);
    }catch (error) {
        console.error(error);
    }
})

app.get('/total-chats', async (req, res) =>{
    try{
        const token = req.headers.authorization;
        const response = await fetch(process.env.TOTAL_CHATS_API_URL,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (!response.ok) {
            throw new Error('Gagal mengambil jumlah percakapan');
        }
        const data = await response.json();
        res.status(200).json(data);
    }catch (error) {
        console.error(error);
    }
})

app.get('/user-register-count', async (req, res) =>{
    try{
        const apiUrl = process.env.USER_REGISTER_COUNT_API_URL;
        const year = req.query.year;
        const month = req.query.month;
        const token = req.headers.authorization;
        const response = await fetch(`${apiUrl}?year=${year}&month=${month}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        console.log(response);
        if (!response.ok) {
            throw new Error('Gagal mengambil jumlah user terdaftar');
        }
        const data = await response.json();
        res.status(200).json(data);
    }catch (error) {
        console.error(error);
    }
})

app.get('/total-history', async (req, res) =>{
    try{
        const token = req.headers.authorization;
        const response = await fetch(process.env.TOTAL_HISTORY_API_URL,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (!response.ok) {
            throw new Error('Gagal mengambil jumlah History');
        }
        const data = await response.json();
        res.status(200).json(data);
    }catch (error) {
        console.error(error);
    }
})

app.get('/recent-login', async (req, res) =>{
    try{
        const token = req.headers.authorization;
        const response = await fetch(process.env.RECENT_LOGIN_API_URL,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (!response.ok) {
            throw new Error('Gagal mengambil data user yang baru saja login');
        }
        const data = await response.json();
        res.status(200).json(data);
    }catch (error) {
        console.error(error);
    }
})

app.get('/user-active', async (req, res) =>{
    try{
        const token = req.headers.authorization;
        const response = await fetch(process.env.USER_COUNTRY_API_URL,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (!response.ok) {
            throw new Error('Gagal mengambil data user yang baru saja login');
        }
        const data = await response.json();
        res.status(200).json(data);
    }catch (error) {
        console.error(error);
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
