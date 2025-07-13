const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Configure multer for try-on image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/try-on');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'tryon-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// AI Try-On Processing (Mock Implementation)
async function processAITryOn(userImagePath, productId, options = {}) {
  // This is a mock implementation
  // In a real application, you would integrate with:
  // - Replicate API
  // - OpenAI DALL-E
  // - Custom AI models
  // - ControlNet + Stable Diffusion
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        resultImagePath: userImagePath, // Mock: return same image
        confidence: 0.92 + Math.random() * 0.07, // Random confidence 92-99%
        processingTime: 1.5 + Math.random() * 2 // Random time 1.5-3.5s
      });
    }, 2000); // Simulate 2 second processing time
  });
}

// Process try-on request
router.post('/process', upload.single('userImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image file provided' 
      });
    }

    const { productId, options } = req.body;
    
    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Product ID is required' 
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }

    const userImagePath = req.file.path;
    const parsedOptions = options ? JSON.parse(options) : {};

    // Process with AI (mock implementation)
    const result = await processAITryOn(userImagePath, productId, parsedOptions);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'AI processing failed'
      });
    }

    // Save to user's try-on history if authenticated
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        
        const user = await User.findById(decoded.userId);
        if (user) {
          user.tryOnHistory.push({
            product: productId,
            originalImage: `/uploads/try-on/${req.file.filename}`,
            resultImage: `/uploads/try-on/result-${req.file.filename}`,
            confidence: result.confidence
          });
          await user.save();
        }
      } catch (authError) {
        // Continue without saving to history if auth fails
        console.log('Auth failed for try-on history:', authError.message);
      }
    }

    res.json({
      success: true,
      resultImage: `/uploads/try-on/result-${req.file.filename}`,
      originalImage: `/uploads/try-on/${req.file.filename}`,
      confidence: result.confidence,
      processingTime: result.processingTime,
      product: {
        id: product._id,
        name: product.name,
        price: product.price
      }
    });

  } catch (error) {
    console.error('Try-on processing error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process try-on request' 
    });
  }
});

// Get try-on result by ID
router.get('/result/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, you would fetch from database
    // For now, return mock data
    res.json({
      id,
      success: true,
      resultImage: `/uploads/try-on/result-${id}.jpg`,
      originalImage: `/uploads/try-on/${id}.jpg`,
      confidence: 0.95,
      processingTime: 2.1,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching try-on result:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch try-on result' 
    });
  }
});

// Get user's try-on history
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('tryOnHistory.product', 'name price images')
      .select('tryOnHistory');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Sort by most recent first
    const history = user.tryOnHistory.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(history);
  } catch (error) {
    console.error('Error fetching try-on history:', error);
    res.status(500).json({ error: 'Failed to fetch try-on history' });
  }
});

// Delete try-on result
router.delete('/history/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove from history
    user.tryOnHistory = user.tryOnHistory.filter(
      item => item._id.toString() !== id
    );
    
    await user.save();

    res.json({ message: 'Try-on result deleted successfully' });
  } catch (error) {
    console.error('Error deleting try-on result:', error);
    res.status(500).json({ error: 'Failed to delete try-on result' });
  }
});

// Get try-on statistics
router.get('/stats', async (req, res) => {
  try {
    // Mock statistics
    const stats = {
      totalTryOns: 15420,
      averageConfidence: 0.94,
      averageProcessingTime: 2.3,
      popularProducts: [
        { productId: '1', name: 'Cyber Neon Jacket', tryOnCount: 1250 },
        { productId: '2', name: 'Retro Wave Hoodie', tryOnCount: 980 },
        { productId: '4', name: 'Digital Mesh Top', tryOnCount: 750 }
      ],
      dailyUsage: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 200) + 50
      })).reverse()
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching try-on stats:', error);
    res.status(500).json({ error: 'Failed to fetch try-on statistics' });
  }
});

module.exports = router;