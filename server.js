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
        adapter: createAdapter(pubClient, subClient), // Redis adapter setup
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
            console.log(`Message sent to ${channel}:`, data);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    // Start server
    const PORT = process.env.PORT || 3155;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})();