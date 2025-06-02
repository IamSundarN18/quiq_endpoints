const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data (in a real application, this would come from a database)
const incidents = [
  {
    id: 1,
    title: "Server Outage",
    status: "resolved",
    priority: "high",
    createdAt: "2024-03-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Database Connection Issue",
    status: "investigating",
    priority: "medium",
    createdAt: "2024-03-15T11:30:00Z"
  }
];

const accounts = [
  {
    id: "ACC123",
    name: "Sundar",
    email: "sundar@test.com",
    subscription: "premium",
    lastLogin: "2024-03-15T09:00:00Z"
  },
  {
    id: "ACC124",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    subscription: "basic",
    lastLogin: "2024-03-15T10:30:00Z"
  },
  {
    id: "ACC125",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    subscription: "premium",
    lastLogin: "2024-03-14T15:45:00Z"
  },
  {
    id: "ACC126",
    name: "Alice Brown",
    email: "alice.brown@example.com",
    subscription: "basic",
    lastLogin: "2024-03-15T08:20:00Z"
  },
  {
    id: "ACC127",
    name: "Charlie Wilson",
    email: "charlie.wilson@example.com",
    subscription: "premium",
    lastLogin: "2024-03-15T11:15:00Z"
  }
];

const orderDetails = [
  {
    orderId: "ORD001",
    accountId: "ACC123",
    items: [
      { id: 1, name: "Product A", quantity: 2, price: 29.99 },
      { id: 2, name: "Product B", quantity: 1, price: 49.99 }
    ],
    total: 109.97,
    status: "delivered",
    orderDate: "2024-03-14T15:30:00Z"
  },
  {
    orderId: "ORD002",
    accountId: "ACC123",
    items: [
      { id: 3, name: "Product C", quantity: 1, price: 79.99 }
    ],
    total: 79.99,
    status: "processing",
    orderDate: "2024-03-15T10:15:00Z"
  },
  {
    orderId: "ORD003",
    accountId: "ACC124",
    items: [
      { id: 4, name: "Product D", quantity: 3, price: 19.99 }
    ],
    total: 59.97,
    status: "delivered",
    orderDate: "2024-03-13T09:45:00Z"
  },
  {
    orderId: "ORD004",
    accountId: "ACC125",
    items: [
      { id: 5, name: "Product E", quantity: 1, price: 149.99 }
    ],
    total: 149.99,
    status: "shipped",
    orderDate: "2024-03-15T08:30:00Z"
  }
];

// Endpoints
app.get('/api/incidents', (req, res) => {
  res.json(incidents);
});

app.get('/api/account/:id', (req, res) => {
  const { id } = req.params;
  const account = accounts.find(acc => acc.id === id);
  
  if (account) {
    res.json(account);
  } else {
    res.status(404).json({ error: 'Account not found' });
  }
});

app.get('/api/orders', (req, res) => {
  const { accountId, email } = req.query;
  
  if (!accountId && !email) {
    return res.status(400).json({ error: 'Either Account ID or Email is required' });
  }

  // Find account by either ID or email
  const account = accounts.find(acc => 
    (accountId && acc.id === accountId) || 
    (email && acc.email === email)
  );

  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  // Filter orders for the specific account
  const accountOrders = orderDetails.filter(order => order.accountId === account.id);
  res.json(accountOrders);
});

app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const { accountId, email } = req.query;

  if (!accountId && !email) {
    return res.status(400).json({ error: 'Either Account ID or Email is required' });
  }

  // Find account by either ID or email
  const account = accounts.find(acc => 
    (accountId && acc.id === accountId) || 
    (email && acc.email === email)
  );

  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  const order = orderDetails.find(o => o.orderId === orderId);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Verify if the order belongs to the account
  if (order.accountId !== account.id) {
    return res.status(403).json({ error: 'Unauthorized access to order' });
  }

  res.json(order);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 