import express from 'express';
import ImageController from '../controllers/imageController.js';

const router = express.Router();

// Middleware for request validation
const validateRequest = (req, res, next) => {
  const { image } = req.body;
  
  if (!image) {
    return res.status(400).json({ error: 'Image data is required' });
  }
  
  // Additional validation can be added here
  next();
};

// Calculate route with validation
router.post('/calculate', 
  validateRequest,
  (req, res) => ImageController.analyzeImage(req, res)
);

export default router;