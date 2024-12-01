import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import calculateRoutes from './src/routes/calculateRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Use a different port than your frontend

// Add these middleware
app.use(cors({
  origin: "https://calcify-fmqtcy31p-ujjwalpasahans-projects.vercel.app", // Your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Important: Parse JSON with larger limit
app.use(express.json({ limit: '50mb' }));

// Mount routes with a base path
app.use('/api', calculateRoutes);

// Add a simple health check route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
