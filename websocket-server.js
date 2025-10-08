// WebSocket Server for Portfolio Live Features
// Run with: node websocket-server.js

const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = process.env.PORT || 8080;
const HOST = 'localhost';

// In-memory storage for demo (use Redis/Database in production)
let connectedClients = new Map();
let visitorCount = 0;
let chatMessages = [];

// Create HTTP server
const server = http.createServer((req, res) => {
    // Serve static files (optional)
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>Portfolio WebSocket Server</h1>
            <p>Server is running on ws://${HOST}:${PORT}</p>
            <p>Connected clients: ${connectedClients.size}</p>
            <p>Total visitors: ${visitorCount}</p>
        `);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
    const clientId = Date.now().toString();
    const clientInfo = {
        id: clientId,
        ws: ws,
        connectedAt: Date.now(),
        page: null,
        userAgent: req.headers['user-agent'],
        ip: req.connection.remoteAddress
    };
    
    connectedClients.set(clientId, clientInfo);
    visitorCount++;
    
    console.log(`🔗 New client connected: ${clientId} (Total: ${connectedClients.size})`);
    
    // Send initial data
    ws.send(JSON.stringify({
        type: 'connection_established',
        data: {
            clientId: clientId,
            visitorCount: connectedClients.size,
            serverTime: Date.now()
        }
    }));
    
    // Broadcast visitor count update
    broadcastToAll({
        type: 'visitor_count',
        data: { count: connectedClients.size }
    });
    
    // Handle incoming messages
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            handleClientMessage(clientId, message);
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    
    // Handle client disconnect
    ws.on('close', () => {
        connectedClients.delete(clientId);
        console.log(`🔌 Client disconnected: ${clientId} (Remaining: ${connectedClients.size})`);
        
        // Broadcast updated visitor count
        broadcastToAll({
            type: 'visitor_count',
            data: { count: connectedClients.size }
        });
        
        // Notify other clients about the disconnection
        broadcastToAll({
            type: 'notification',
            data: {
                text: 'A visitor left the site',
                type: 'info'
            }
        }, clientId);
    });
    
    // Handle errors
    ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
    });
});

// Handle different message types
function handleClientMessage(clientId, message) {
    const client = connectedClients.get(clientId);
    if (!client) return;
    
    switch (message.type) {
        case 'visitor_join':
            client.page = message.data.page;
            console.log(`👤 Visitor joined from: ${message.data.page}`);
            
            // Send welcome notification to other clients
            broadcastToAll({
                type: 'notification',
                data: {
                    text: `New visitor on ${message.data.page}`,
                    type: 'info'
                }
            }, clientId);
            break;
            
        case 'visitor_leave':
            console.log(`👋 Visitor left from: ${message.data.page}`);
            break;
            
        case 'activity':
            client.lastActivity = Date.now();
            // Track activity (could be stored in database)
            break;
            
        case 'chat_message':
            handleChatMessage(clientId, message.data);
            break;
            
        case 'typing':
            broadcastTypingStatus(clientId, message.data);
            break;
            
        case 'ping':
            // Heartbeat response
            client.ws.send(JSON.stringify({
                type: 'pong',
                data: { timestamp: Date.now() }
            }));
            break;
            
        case 'click_track':
            // Track clicks for analytics
            console.log(`🖱️ Click tracked from ${clientId}: ${message.data.count} clicks`);
            break;
            
        default:
            console.log(`Unknown message type from ${clientId}:`, message.type);
    }
}

// Handle chat messages
function handleChatMessage(clientId, messageData) {
    const client = connectedClients.get(clientId);
    if (!client) return;
    
    const chatMessage = {
        id: messageData.id,
        message: messageData.message,
        timestamp: messageData.timestamp,
        sender: messageData.sender,
        clientId: clientId
    };
    
    // Store message (in production, save to database)
    chatMessages.push(chatMessage);
    
    // Keep only last 100 messages
    if (chatMessages.length > 100) {
        chatMessages = chatMessages.slice(-100);
    }
    
    // Broadcast to all clients
    broadcastToAll({
        type: 'chat_message',
        data: chatMessage
    });
    
    console.log(`💬 Chat message from ${clientId}: ${messageData.message}`);
    
    // Auto-reply for demo (replace with real admin responses)
    setTimeout(() => {
        const autoReplies = [
            "Thanks for your message! I'll get back to you soon.",
            "Great question! Let me know if you need more details.",
            "I appreciate your interest in my work!",
            "Feel free to ask anything about my projects.",
            "Thanks for visiting my portfolio!"
        ];
        
        const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        
        const autoResponse = {
            id: Date.now(),
            message: randomReply,
            timestamp: Date.now(),
            sender: 'admin'
        };
        
        broadcastToAll({
            type: 'chat_message',
            data: autoResponse
        });
    }, 2000 + Math.random() * 3000); // Random delay 2-5 seconds
}

// Broadcast typing status
function broadcastTypingStatus(clientId, typingData) {
    const client = connectedClients.get(clientId);
    if (!client) return;
    
    // Broadcast to other clients
    broadcastToAll({
        type: 'user_typing',
        data: {
            clientId: clientId,
            typing: typingData.typing
        }
    }, clientId);
}

// Broadcast message to all connected clients
function broadcastToAll(message, excludeClientId = null) {
    const messageStr = JSON.stringify(message);
    
    connectedClients.forEach((client, clientId) => {
        if (clientId !== excludeClientId && client.ws.readyState === WebSocket.OPEN) {
            try {
                client.ws.send(messageStr);
            } catch (error) {
                console.error(`Error sending message to client ${clientId}:`, error);
            }
        }
    });
}

// Send periodic announcements (demo feature)
setInterval(() => {
    const announcements = [
        "Welcome to my portfolio! Feel free to explore my projects.",
        "Check out my latest projects in the projects section!",
        "Have questions? Use the live chat to get in touch!",
        "Don't forget to check out my skills and experience!",
        "Thanks for visiting! I hope you enjoy exploring my work."
    ];
    
    const randomAnnouncement = announcements[Math.floor(Math.random() * announcements.length)];
    
    broadcastToAll({
        type: 'live_update',
        data: {
            updateType: 'announcement',
            message: randomAnnouncement
        }
    });
}, 60000); // Every minute

// Clean up inactive connections
setInterval(() => {
    const now = Date.now();
    const inactiveThreshold = 5 * 60 * 1000; // 5 minutes
    
    connectedClients.forEach((client, clientId) => {
        if (now - (client.lastActivity || client.connectedAt) > inactiveThreshold) {
            console.log(`🧹 Cleaning up inactive client: ${clientId}`);
            client.ws.close();
            connectedClients.delete(clientId);
        }
    });
}, 60000); // Check every minute

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down WebSocket server...');
    
    // Close all connections
    connectedClients.forEach((client) => {
        client.ws.close();
    });
    
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

// Start server
server.listen(PORT, HOST, () => {
    console.log(`🚀 WebSocket server running on ws://${HOST}:${PORT}`);
    console.log(`📊 Dashboard available at http://${HOST}:${PORT}`);
    console.log(`🔗 Ready to accept connections!`);
});

// Export for testing
module.exports = { wss, server, connectedClients };
