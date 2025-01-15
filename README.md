
# Socket.IO High Availability Server with Redis | Dockerized

This project demonstrates a **high availability Socket.IO server** setup that uses **Redis** as the adapter for message synchronization between multiple instances. The included client application allows testing of the server functionality, including joining channels, sending messages, and receiving events in real-time.

## Features

- **High Availability (HA)**: Multiple server instances can run simultaneously, ensuring reliability and scalability.
- **Redis Integration**: Uses Redis as the backend for message synchronization across instances.
- **Authentication**: Clients must provide a valid token to connect to the server.
- **Channel-Based Communication**: Clients can join specific channels and send/receive messages within those channels.
- **Real-Time Event Handling**: Events are broadcasted in real-time to all connected clients in the same channel.

## Components

### Server

The server is implemented in Node.js with the following key dependencies:
- `express`: For HTTP server setup.
- `socket.io`: For real-time communication.
- `redis`: For message synchronization across server instances.
- `@socket.io/redis-adapter`: For integrating Redis with Socket.IO.
- `Dockerized`

### Client

A simple HTML-based, or node client allows interaction with the server:
- Join a channel.
- Send messages to a specific channel.
- Receive real-time events from the server.

## Setup Instructions

### Prerequisites
1. Node.js and npm installed on your system.
2. Redis server installed and running.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/socket-io-ha-server.git
   cd socket-io-ha-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and specify the following variables:
   ```
   NODE_ENV=production
   REDIS_URL=redis://localhost:6379
   REDIS_PASSWORD=your-redis-password
   AUTH_TOKEN=your-auth-token
   PORT=3155
   ```

4. Start the server:
   ```bash
   node server.js
   ```

5. (Optional) Start multiple instances for high availability:
   ```bash
   PORT=3156 node server.js
   ```

### Running the Client

1. Open the `index.html` file in any modern web browser.
2. Enter the channel name and click **Join Channel**.
3. Send JSON-formatted messages to the joined channel and observe real-time updates.

### Testing with Postman

1. Use the WebSocket URL:
   ```
   ws://127.0.0.1:3155/socket.io/?token=your-auth-token&EIO=4&transport=websocket
   ```
2. Send the following messages:
   - Join a channel:
     ```json
     ["join-channel", "test-channel"]
     ```
   - Send an event:
     ```json
     ["send-event", { "channel": "test-channel", "data": { "message": "Hello, World!" } }]
     ```

### Logging and Debugging

- Use the `DEBUG` environment variable to enable detailed logs:
  ```bash
  DEBUG=socket.io* node server.js
  ```

## Project Structure

```
socket-io-ha-server/
├── server.js           # Main server file
├── index.html          # Client for testing
├── package.json        # Node.js dependencies
├── .env                # Environment variables
├── README.md           # Project documentation
```

## License

This project is licensed under the MIT License.

