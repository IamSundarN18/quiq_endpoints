const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

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
    password: "Sundar@123", // In production, this should be hashed
    subscription: "premium",
    lastLogin: "2024-03-15T09:00:00Z"
  },
  {
    id: "ACC124",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "Jane@456",
    subscription: "basic",
    lastLogin: "2024-03-15T10:30:00Z"
  },
  {
    id: "ACC125",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    password: "Bob@789",
    subscription: "premium",
    lastLogin: "2024-03-14T15:45:00Z"
  },
  {
    id: "ACC126",
    name: "Alice Brown",
    email: "alice.brown@example.com",
    password: "Alice@321",
    subscription: "basic",
    lastLogin: "2024-03-15T08:20:00Z"
  },
  {
    id: "ACC127",
    name: "Charlie Wilson",
    email: "charlie.wilson@example.com",
    password: "Charlie@654",
    subscription: "premium",
    lastLogin: "2024-03-15T11:15:00Z"
  }
];

const orderDetails = [
  {
    orderId: "ORD001",
    accountId: "ACC123",
    items: [
      { id: 1, name: "Axor Helmet", quantity: 2, price: 129.99 },
      { id: 2, name: "Bike Stand", quantity: 1, price: 49.99 }
    ],
    total: 179.98,
    status: "processing",
    orderDate: "2024-03-14T15:30:00Z",
    deliveryDate: "2024-03-18T15:30:00Z" // 4 days from order date
  },
  {
    orderId: "ORD002",
    accountId: "ACC123",
    items: [
      { id: 3, name: "Sony Headphones", quantity: 1, price: 79.99 }
    ],
    total: 79.99,
    status: "delivered",
    orderDate: "2024-03-15T10:15:00Z",
    deliveryDate: "2024-03-17T14:30:00Z" // Delivered before May 2nd
  },
  {
    orderId: "ORD003",
    accountId: "ACC124",
    items: [
      { id: 4, name: "Dishwasher", quantity: 3, price: 799.99 }
    ],
    total: 799.99,
    status: "delivered",
    orderDate: "2024-03-13T09:45:00Z",
    deliveryDate: "2024-03-16T11:20:00Z" // Delivered before May 2nd
  },
  {
    orderId: "ORD004",
    accountId: "ACC125",
    items: [
      { id: 5, name: "HP Laptop", quantity: 1, price: 949.99 }
    ],
    total: 949.99,
    status: "shipped",
    orderDate: "2024-03-15T08:30:00Z",
    deliveryDate: "2024-03-19T10:00:00Z" // 4 days from order date
  }
];

// Helper function to calculate delivery date based on order status and date
const calculateDeliveryDate = (orderDate, status) => {
  const date = new Date(orderDate);
  
  if (status === "delivered") {
    // For delivered items, set a date before May 2nd
    return new Date("2024-05-01T12:00:00Z").toISOString();
  } else if (status === "processing") {
    // For processing items, add 3-5 days
    const daysToAdd = Math.floor(Math.random() * 3) + 3; // Random number between 3-5
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString();
  } else if (status === "shipped") {
    // For shipped items, add 2-4 days
    const daysToAdd = Math.floor(Math.random() * 2) + 2; // Random number between 2-4
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString();
  }
  
  return date.toISOString();
};

// Update all orders with calculated delivery dates
orderDetails.forEach(order => {
  if (!order.deliveryDate) {
    order.deliveryDate = calculateDeliveryDate(order.orderDate, order.status);
  }
});

// Helper function to validate account credentials
const validateAccountCredentials = (identifier, password) => {
  const account = accounts.find(acc => 
    (identifier === acc.id) || (identifier === acc.email)
  );

  if (!account) {
    return { isValid: false, error: 'Account not found' };
  }

  if (account.password !== password) {
    return { isValid: false, error: 'Invalid password' };
  }

  return { isValid: true, account };
};

// Endpoints
app.get('/api/incidents', (req, res) => {
  res.json(incidents);
});

app.get('/api/account/:id', (req, res) => {
  const { id } = req.params;
  const { password } = req.query;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const validation = validateAccountCredentials(id, password);
  
  if (!validation.isValid) {
    return res.status(401).json({ error: validation.error });
  }

  // Remove password from response
  const { password: _, ...accountWithoutPassword } = validation.account;
  res.json(accountWithoutPassword);
});

app.get('/api/orders', (req, res) => {
  const { accountId, email, password } = req.query;
  
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (!accountId && !email) {
    return res.status(400).json({ error: 'Either Account ID or Email is required' });
  }

  const identifier = accountId || email;
  const validation = validateAccountCredentials(identifier, password);

  if (!validation.isValid) {
    return res.status(401).json({ error: validation.error });
  }

  // Filter orders for the specific account
  const accountOrders = orderDetails.filter(order => order.accountId === validation.account.id);
  res.json(accountOrders);
});

app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const { accountId, email, password } = req.query;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (!accountId && !email) {
    return res.status(400).json({ error: 'Either Account ID or Email is required' });
  }

  const identifier = accountId || email;
  const validation = validateAccountCredentials(identifier, password);

  if (!validation.isValid) {
    return res.status(401).json({ error: validation.error });
  }

  const order = orderDetails.find(o => o.orderId === orderId);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Verify if the order belongs to the account
  if (order.accountId !== validation.account.id) {
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