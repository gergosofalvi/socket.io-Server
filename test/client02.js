const readline = require("readline");
const io = require("socket.io-client");

// Create a readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Connect to the Socket.IO server
const socket = io("ws://127.0.0.1:3156", {
    auth: {
        token: "your-auth-token", // Replace with your actual token
    },
});

// On successful connection
socket.on("connect", () => {
    console.log("Connected to server!");

    // Prompt the user for commands/messages
    promptUser();
});

// Handle connection errors
socket.on("connect_error", (err) => {
    console.error("Connection failed:", err.message);
});

// Handle received messages
socket.on("message", (data) => {
    console.log("Received message:", data);
});

// Function to handle user input
function promptUser() {
    rl.question("Enter command (join/send/exit): ", (command) => {
        if (command === "join") {
            rl.question("Enter channel to join: ", (channel) => {
                socket.emit("join-channel", channel);
                console.log(`Joined channel: ${channel}`);
                promptUser();
            });
        } else if (command === "send") {
            rl.question("Enter channel to send message: ", (channel) => {
                rl.question("Enter message to send: ", (message) => {
                    socket.emit("send-event", {
                        channel: channel,
                        data: { message: message },
                    });
                    console.log(`Message sent to channel ${channel}: ${message}`);
                    promptUser();
                });
            });
        } else if (command === "exit") {
            console.log("Exiting...");
            socket.disconnect();
            rl.close();
        } else {
            console.log("Unknown command. Try again.");
            promptUser();
        }
    });
}