# WebSocket Live Features Setup Guide

This guide will help you set up the WebSocket server for your portfolio's live features.

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the WebSocket Server**
   ```bash
   npm start
   ```

3. **Access the Dashboard**
   - Open your browser and go to: `http://localhost:8080`
   - You should see the server status and connected clients

## 🔧 Configuration

### Environment Variables
You can customize the server using environment variables:

```bash
# Set custom port (default: 8080)
PORT=3000 npm start

# Set custom host (default: localhost)
HOST=0.0.0.0 npm start
```

### WebSocket URL Configuration
Update the WebSocket URL in your `script.js` file:

```javascript
const WS_CONFIG = {
    // For development
    url: 'ws://localhost:8080',
    
    // For production (use wss://)
    url: 'wss://your-domain.com:8080',
    
    reconnectInterval: 5000,
    maxReconnectAttempts: 10
};
```

## 📱 Live Features Included

### 1. Live Visitor Counter
- Real-time visitor count display
- Updates automatically when users join/leave
- Shows in navigation bar

### 2. Live Chat Widget
- Interactive chat interface
- Typing indicators
- Auto-reply system (demo)
- Message history
- Responsive design

### 3. Real-time Notifications
- Live announcements
- Connection status updates
- Feature highlights
- Auto-dismissing notifications

### 4. Live Activity Panel
- Session timer
- Click tracking
- Scroll percentage
- Live visitor count
- Real-time statistics

### 5. Connection Status
- Online/offline indicators
- Automatic reconnection
- Heartbeat system
- Error handling

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon for automatic server restarts on file changes.

### Testing the Connection
1. Start the server: `npm start`
2. Open your portfolio website
3. Check browser console for connection messages
4. Open multiple browser tabs to test visitor counting
5. Use the live chat to test real-time messaging

## 🌐 Production Deployment

### Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start the server with PM2
pm2 start websocket-server.js --name "portfolio-websocket"

# Save PM2 configuration
pm2 save

# Setup auto-restart on system reboot
pm2 startup
```

### Using Docker
Create a `Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t portfolio-websocket .
docker run -p 8080:8080 portfolio-websocket
```

### Nginx Configuration
For production with SSL:
```nginx
upstream websocket {
    server localhost:8080;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔒 Security Considerations

### Production Security
1. **Use WSS (WebSocket Secure)** in production
2. **Implement authentication** for admin features
3. **Rate limiting** to prevent abuse
4. **Input validation** for all messages
5. **CORS configuration** for cross-origin requests

### Example Security Middleware
```javascript
// Add to websocket-server.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiting
server.use(limiter);
```

## 📊 Monitoring and Analytics

### Built-in Monitoring
The server includes:
- Connection tracking
- Message logging
- Visitor analytics
- Performance metrics

### External Monitoring
Consider integrating with:
- **New Relic** for performance monitoring
- **Sentry** for error tracking
- **Redis** for session storage
- **MongoDB** for message history

## 🐛 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if the server is running
   - Verify the port is not blocked
   - Check firewall settings

2. **WebSocket Connection Failed**
   - Ensure the URL is correct
   - Check for SSL certificate issues
   - Verify CORS settings

3. **Messages Not Received**
   - Check browser console for errors
   - Verify WebSocket connection status
   - Check server logs

### Debug Mode
Enable debug logging:
```javascript
// Add to websocket-server.js
const DEBUG = process.env.DEBUG === 'true';

if (DEBUG) {
    console.log('🐛 Debug mode enabled');
    // Add debug logging here
}
```

## 🔄 Scaling

### Horizontal Scaling
For multiple server instances:
1. Use **Redis** for shared state
2. Implement **sticky sessions**
3. Use **load balancer** with WebSocket support

### Redis Integration Example
```javascript
const redis = require('redis');
const client = redis.createClient();

// Share visitor count across instances
async function updateVisitorCount(count) {
    await client.set('visitor_count', count);
    await client.publish('visitor_count_update', JSON.stringify({ count }));
}
```

## 📝 API Reference

### WebSocket Message Types

#### Client to Server
- `visitor_join` - New visitor joins
- `visitor_leave` - Visitor leaves
- `chat_message` - Send chat message
- `typing` - Typing indicator
- `activity` - User activity tracking
- `ping` - Heartbeat

#### Server to Client
- `connection_established` - Connection confirmed
- `visitor_count` - Updated visitor count
- `chat_message` - New chat message
- `user_typing` - Typing status
- `notification` - System notification
- `live_update` - Live feature update
- `pong` - Heartbeat response

## 🎯 Customization

### Adding New Features
1. Define new message types
2. Add handlers in `handleClientMessage()`
3. Update client-side JavaScript
4. Add UI components as needed

### Styling
All live features use CSS classes that can be customized in `styles.css`:
- `.live-chat-widget`
- `.live-features-panel`
- `.live-notification`
- `.connection-status`

## 📞 Support

If you encounter any issues:
1. Check the server logs
2. Verify browser console for errors
3. Test with a simple WebSocket client
4. Check network connectivity

## 🎉 Enjoy Your Live Features!

Your portfolio now has real-time capabilities that will engage visitors and provide valuable insights into user behavior. The live features create an interactive experience that sets your portfolio apart from static websites.

Happy coding! 🚀
