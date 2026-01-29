# Moltbot Dashboard - Telegram Mini App

A comprehensive dashboard Mini App for Telegram that integrates multiple productivity features into one interface.

## Features

- **Dashboard Overview**: View daily tasks, calendar events, weather, and notifications
- **Task Manager**: Create and manage to-do lists with priority levels
- **File Explorer**: Browse and manage workspace files
- **Quick Notes**: Take and access notes synced with your knowledge base
- **System Status Panel**: Check status of services, cron jobs, and running agents
- **Package Tracker**: Monitor all shipments with tracking information
- **Knowledge Base Search**: Search your personal knowledge base and memories
- **Automation Studio**: Create and manage visual automation workflows
- **Health & Activity Tracker**: Track habits, goals, and wellness metrics

## Deployment Instructions

### Prerequisites
- A web server capable of serving HTTPS traffic
- Domain name with SSL certificate
- Telegram bot registered with BotFather

### Steps

1. **Upload Files**
   - Upload `mini_app_index.html` to your web server
   - Ensure it's accessible via HTTPS (required by Telegram)

2. **Register with BotFather**
   - Open a chat with [@BotFather](https://t.me/BotFather)
   - Send `/setmenubutton`
   - Select your bot
   - Enter the full HTTPS URL where `mini_app_index.html` is hosted (e.g., `https://yourdomain.com/mini_app/index.html`)
   - Optionally set a text for the menu button (e.g. "Open Dashboard")

3. **Enable Mini App Feature**
   - Send `/mybots` to BotFather
   - Select your bot
   - Choose "Bot Settings"
   - Select "Allow bots to send messages to users who blocked the bot" if needed
   - Go back to your bot settings
   - Choose "Menu button text" and set it to "Open Dashboard" (or your preferred text)

## Customization

### Changing the Appearance
You can modify the CSS styles in the `<style>` section of `mini_app_index.html` to match your branding preferences.

### Adding Functionality
The current implementation is a frontend demo. To connect to actual services, you would need to:

1. Add backend API endpoints for each feature
2. Implement authentication to ensure only authorized users can access data
3. Connect to your Moltbot instance via API
4. Update the JavaScript functions to communicate with your backend

## Security Considerations

- Always serve the Mini App over HTTPS
- Implement proper authentication mechanisms
- Sanitize all inputs to prevent XSS attacks
- Validate and verify all data sent to your backend
- Regularly update dependencies

## Troubleshooting

- If the Mini App doesn't open in Telegram, ensure the URL is served over HTTPS
- Check browser console for errors if components aren't working
- Verify that your domain is not blocked by any security policies

## Limitations

- This is a frontend demonstration - actual integration with Moltbot services would require backend development
- The demo uses mock data - real implementation would connect to actual data sources
- File upload/download functionality would need to be implemented separately for security reasons

## Future Enhancements

- Real-time data synchronization
- Push notifications
- Offline capability
- Advanced analytics
- More granular permission controls

## Support

For technical support, please contact your system administrator or refer to the Moltbot documentation.