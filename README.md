# Quiq Endpoints API

A simple Express.js API with endpoints for incidents, account information, and order details.

## Available Endpoints

- `GET /api/incidents` - Get all incidents
- `GET /api/account/:id` - Get account information by ID
- `GET /api/orders` - Get all orders
- `GET /api/orders/:orderId` - Get specific order by ID
- `GET /health` - Health check endpoint

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional):
```
PORT=3000
```

3. Start the development server:
```bash
npm run dev
```

## Deployment to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables (optional):
     - `PORT`: 3000

## Environment Variables

- `PORT`: The port number the server will run on (default: 3000)

## Sample Data

The API currently uses sample data. In a production environment, you would want to:
1. Connect to a database
2. Implement proper authentication
3. Add input validation
4. Implement error handling middleware 