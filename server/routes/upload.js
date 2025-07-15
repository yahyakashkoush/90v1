const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed'));
    }
  }
});

// Upload single image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const originalPath = req.file.path;
    const filename = req.file.filename;
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.PRODUCTION_URL || 'https://your-domain.com'
      : `http://localhost:${process.env.PORT || 5000}`;

    try {
      // Optimize image with Sharp
      const optimizedFilename = `optimized-${filename}`;
      const optimizedPath = path.join(uploadsDir, optimizedFilename);

      await sharp(originalPath)
        .resize(800, 1000, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ 
          quality: 85,
          progressive: true 
        })
        .toFile(optimizedPath);

      // Remove original file
      fs.unlinkSync(originalPath);

      const imageUrl = `${baseUrl}/uploads/${optimizedFilename}`;

      res.json({
        success: true,
        url: imageUrl,
        filename: optimizedFilename,
        originalName: req.file.originalname,
        size: fs.statSync(optimizedPath).size
      });

    } catch (optimizationError) {
      console.error('Image optimization failed:', optimizationError);
      
      // Fallback to original file if optimization fails
      const imageUrl = `${baseUrl}/uploads/${filename}`;
      
      res.json({
        success: true,
        url: imageUrl,
        filename: filename,
        originalName: req.file.originalname,
        size: req.file.size,
        note: 'Image uploaded without optimization'
      });
    }

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error.message 
    });
  }
});

// Upload multiple images
router.post('/images', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.PRODUCTION_URL || 'https://your-domain.com'
      : `http://localhost:${process.env.PORT || 5000}`;

    const uploadedImages = [];

    for (const file of req.files) {
      try {
        const originalPath = file.path;
        const filename = file.filename;

        // Optimize image with Sharp
        const optimizedFilename = `optimized-${filename}`;
        const optimizedPath = path.join(uploadsDir, optimizedFilename);

        await sharp(originalPath)
          .resize(800, 1000, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .jpeg({ 
            quality: 85,
            progressive: true 
          })
          .toFile(optimizedPath);

        // Remove original file
        fs.unlinkSync(originalPath);

        const imageUrl = `${baseUrl}/uploads/${optimizedFilename}`;

        uploadedImages.push({
          url: imageUrl,
          filename: optimizedFilename,
          originalName: file.originalname,
          size: fs.statSync(optimizedPath).size
        });

      } catch (optimizationError) {
        console.error(`Optimization failed for ${file.originalname}:`, optimizationError);
        
        // Fallback to original file
        const imageUrl = `${baseUrl}/uploads/${file.filename}`;
        uploadedImages.push({
          url: imageUrl,
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          note: 'Uploaded without optimization'
        });
      }
    }

    res.json({
      success: true,
      images: uploadedImages,
      count: uploadedImages.length
    });

  } catch (error) {
    console.error('Multiple image upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload images',
      details: error.message 
    });
  }
});

// Delete image
router.delete('/image/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Security check - ensure filename doesn't contain path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({ 
      error: 'Failed to delete image',
      details: error.message 
    });
  }
});

// Get image info
router.get('/image/:filename/info', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const stats = fs.statSync(filePath);
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.PRODUCTION_URL || 'https://your-domain.com'
      : `http://localhost:${process.env.PORT || 5000}`;

    res.json({
      filename,
      url: `${baseUrl}/uploads/${filename}`,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    });

  } catch (error) {
    console.error('Image info error:', error);
    res.status(500).json({ 
      error: 'Failed to get image info',
      details: error.message 
    });
  }
});

// List all uploaded images
router.get('/images', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.PRODUCTION_URL || 'https://your-domain.com'
      : `http://localhost:${process.env.PORT || 5000}`;

    const images = imageFiles.map(filename => {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        url: `${baseUrl}/uploads/${filename}`,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    });

    res.json({
      images,
      count: images.length
    });

  } catch (error) {
    console.error('List images error:', error);
    res.status(500).json({ 
      error: 'Failed to list images',
      details: error.message 
    });
  }
});

module.exports = router;