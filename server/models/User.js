const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  preferences: {
    favoriteCategories: [{
      type: String
    }],
    preferredSizes: [{
      type: String
    }],
    preferredColors: [{
      type: String
    }],
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      newProducts: {
        type: Boolean,
        default: true
      },
      sales: {
        type: Boolean,
        default: true
      }
    }
  },
  measurements: {
    chest: Number,
    waist: Number,
    hips: Number,
    height: Number,
    weight: Number,
    shoeSize: String
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    size: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  tryOnHistory: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    originalImage: String,
    resultImage: String,
    confidence: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastLogin: {
    type: Date,
    default: Date.now
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true
});

// Index for efficient queries
userSchema.index({ email: 1 });
userSchema.index({ 'cart.product': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add item to cart
userSchema.methods.addToCart = function(productId, quantity, size, color) {
  const existingItem = this.cart.find(item => 
    item.product.toString() === productId.toString() && 
    item.size === size && 
    item.color === color
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.cart.push({
      product: productId,
      quantity,
      size,
      color
    });
  }

  return this.save();
};

// Remove item from cart
userSchema.methods.removeFromCart = function(productId, size, color) {
  this.cart = this.cart.filter(item => 
    !(item.product.toString() === productId.toString() && 
      item.size === size && 
      item.color === color)
  );
  return this.save();
};

// Clear cart
userSchema.methods.clearCart = function() {
  this.cart = [];
  return this.save();
};

// Add to wishlist
userSchema.methods.addToWishlist = function(productId) {
  if (!this.wishlist.includes(productId)) {
    this.wishlist.push(productId);
  }
  return this.save();
};

// Remove from wishlist
userSchema.methods.removeFromWishlist = function(productId) {
  this.wishlist = this.wishlist.filter(id => id.toString() !== productId.toString());
  return this.save();
};

module.exports = mongoose.model('User', userSchema);