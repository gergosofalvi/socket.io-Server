require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const app = express();
const server = http.createServer(app);

const pubClient = createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
});
const subClient = pubClient.duplicate();

(async () => {
    await pubClient.connect();
    await subClient.connect();
    console.log('Redis connected.');

    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
        adapter: createAdapter(pubClient, subClient),
    });

    app.use(express.json());

    // Middleware for authentication
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (token === process.env.AUTH_TOKEN) {
            return next();
        }
        return next(new Error('Authentication error'));
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Join a channel
        socket.on('join-channel', (channel) => {
            socket.join(channel);
            console.log(`User joined channel: ${channel}`);
        });

        // Send event to a specific channel
        socket.on('send-event', ({ channel, data }) => {
            io.to(channel).emit('message', data);
            //console.log(`Message sent to ${channel}:`);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            //console.log(`User disconnected: ${socket.id}`);
        });
    });

    // POST endpoint to send an event to a channel
    app.post('/send-event', (req, res) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        if (token !== process.env.AUTH_TOKEN) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const { channel, data } = req.body;

        if (!channel || !data) {
            return res.status(400).json({ error: 'Missing channel or data' });
        }

        io.to(channel).emit('message', data);
        //console.log(`Message sent to channel ${channel}:`);
        return res.status(200).json({ success: true, message: 'Message sent' });
    });

    // Start server
    const PORT = process.env.PORT || 3155;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})();