const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient('mongodb://127.0.0.1:27017');

async function startServer() {
  try {
    await client.connect();

    console.log('MongoDB connected successfully!');

    const db = client.db('ecommerce');
// REGISTER USER
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email and password are required'
      });
    }

    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user',
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(user);

    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertedId
    });

  } catch (error) {
    console.error('Registration failed:', error);

    res.status(500).json({
      error: 'Failed to register user'
    });
  }
});
   // LOGIN USER
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login failed:', error);

    res.status(500).json({
      error: 'Failed to login'
    });
  }
});
 // GET all products
    app.get('/products', async (req, res) => {
      try {
        const products = await db.collection('products').find().toArray();
        res.json(products);
      } catch (error) {
        res.status(500).json({
          error: 'Failed to fetch products'
        });
      }
    });

    // POST a new product
    app.post('/products', async (req, res) => {
      try {
        const product = req.body;

        const result = await db.collection('products').insertOne(product);

        res.status(201).json({
          message: 'Product added successfully',
          productId: result.insertedId
        });
      } catch (error) {
        res.status(500).json({
          error: 'Failed to add product'
        });
      }
    });

    // UPDATE a product
    app.put('/products/:id', async (req, res) => {
      try {
        const id = req.params.id;

        const result = await db.collection('products').updateOne(
          { _id: new ObjectId(id) },
          { $set: req.body }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({
            error: 'Product not found'
          });
        }

        res.json({
          message: 'Product updated successfully'
        });
      } catch (error) {
        res.status(500).json({
          error: 'Failed to update product'
        });
      }
    });

    // DELETE a product
    app.delete('/products/:id', async (req, res) => {
      try {
        const id = req.params.id;

        const result = await db.collection('products').deleteOne({
          _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({
            error: 'Product not found'
          });
        }

        res.json({
          message: 'Product deleted successfully'
        });
      } catch (error) {
        res.status(500).json({
          error: 'Failed to delete product'
        });
      }
    });
// CREATE a new order
app.post('/orders', async (req, res) => {
  try {
    const order = {
      ...req.body,
      createdAt: new Date(),
      status: 'Pending'
    };

    const result = await db.collection('orders').insertOne(order);

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: result.insertedId
    });
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({
      error: 'Failed to place order'
    });
  }
});

// GET all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await db.collection('orders').find().toArray();
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch orders'
    });
  }
});
// UPDATE order status
app.put('/orders/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }

    res.json({
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Order status update failed:', error);
    res.status(500).json({
      error: 'Failed to update order status'
    });
  }
});
// UPDATE order status

    // Home route
    app.get('/', (req, res) => {
      res.send('E-commerce Backend is running!');
    });

    const PORT = 5001;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
}

startServer();
