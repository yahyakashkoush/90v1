# 🌟 RetroFuture Fashion - AI-Powered Fashion Website

<div align="center">

![RetroFuture Fashion](https://img.shields.io/badge/RetroFuture-Fashion-ff00ff?style=for-the-badge&logo=react)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A cutting-edge fashion e-commerce platform featuring AI-powered virtual try-on technology and cyberpunk-inspired design.**

[🚀 Live Demo](https://your-vercel-url.vercel.app) | [📖 Documentation](./DEPLOYMENT.md) | [🎨 Design System](#design-system)

</div>

## ✨ Features

### 🎭 **Stunning Visual Experience**
- **Cyberpunk Splash Screen**: Animated intro with particle effects and VHS aesthetics
- **90s-Inspired Design**: Neon colors, glitch effects, and retro-futuristic styling
- **Smooth Animations**: Powered by Framer Motion for seamless user experience
- **Responsive Design**: Perfect on all devices from mobile to desktop

### 🤖 **AI-Powered Technology**
- **Virtual Try-On**: Upload your photo and see how clothes look on you
- **3D Product Viewer**: Interactive 3D models using Three.js
- **Smart Recommendations**: AI-powered product suggestions
- **Size Prediction**: AI analyzes photos for accurate sizing

### 🛍️ **E-commerce Features**
- **Product Catalog**: Advanced filtering, sorting, and search
- **Shopping Cart**: Full cart functionality with size/color selection
- **User Accounts**: Registration, login, and profile management
- **Admin Dashboard**: Complete product and user management

### 🔧 **Technical Excellence**
- **Next.js 14**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **MongoDB**: Scalable database with Mongoose ODM
- **Express.js**: Robust backend API
- **JWT Authentication**: Secure user authentication

## 🚀 Quick Start

### One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yahyakashkoush/90v1.git)

### Local Development

```bash
# Clone the repository
git clone https://github.com/yahyakashkoush/90v1.git
cd 90v1

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🌐 Deployment

### Vercel (Recommended)

1. **Fork this repository**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

3. **Environment Variables** (Optional for demo):
   ```
   NEXT_PUBLIC_API_URL=your-backend-url
   ```

4. **Deploy**: Vercel will automatically build and deploy your site

### Other Platforms

- **Netlify**: Works out of the box
- **Railway**: Perfect for full-stack deployment
- **Docker**: Use provided Docker configuration
- **Traditional VPS**: Follow the detailed guide in [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🎨 Design System

### Color Palette
```css
/* Neon Colors */
--neon-pink: #ff00ff;
--neon-cyan: #00ffff;
--neon-green: #00ff00;
--neon-purple: #8b00ff;
--neon-orange: #ff6600;

/* Base Colors */
--retro-dark: #0a0a0a;
--retro-purple: #2d1b69;
```

### Typography
- **Primary**: Orbitron (cyberpunk style)
- **Secondary**: Press Start 2P (retro gaming)

## 📁 Project Structure

```
90v1/
├── app/                    # Next.js 14 app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── products/         # Product pages
│   ├── try-on/          # AI try-on page
│   └── admin/           # Admin dashboard
├── components/            # Reusable components
│   ├── SplashScreen.tsx  # Animated intro
│   ├── Navbar.tsx       # Navigation
│   ├── ProductGrid.tsx  # Product display
│   └── Model3DViewer.tsx # 3D product viewer
├── server/               # Backend API
│   ├── index.js         # Express server
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── middleware/      # Auth middleware
├── types/               # TypeScript definitions
└── public/             # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Optional - for full functionality
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
REPLICATE_API_TOKEN=your_replicate_token
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_jwt_secret
```

**Note**: The website works perfectly without these variables for demo purposes.

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Database | AI/ML | Deployment |
|----------|---------|----------|-------|------------|
| Next.js 14 | Express.js | MongoDB | Replicate | Vercel |
| TypeScript | Node.js | Mongoose | OpenAI | Railway |
| Tailwind CSS | JWT Auth | - | Three.js | Docker |
| Framer Motion | Multer | - | - | Netlify |

</div>

## 📱 Screenshots

<div align="center">

### Splash Screen
![Splash Screen](https://via.placeholder.com/800x400/0a0a0a/ff00ff?text=Cyberpunk+Splash+Screen)

### Homepage
![Homepage](https://via.placeholder.com/800x400/0a0a0a/00ffff?text=90s+Inspired+Homepage)

### AI Try-On
![AI Try-On](https://via.placeholder.com/800x400/0a0a0a/00ff00?text=AI+Virtual+Try-On)

### 3D Product Viewer
![3D Viewer](https://via.placeholder.com/800x400/0a0a0a/8b00ff?text=Interactive+3D+Models)

</div>

## 🎯 Features Showcase

### ✅ Implemented Features
- [x] Cyberpunk splash screen with animations
- [x] Responsive product catalog
- [x] 3D product visualization
- [x] AI try-on interface
- [x] Admin dashboard
- [x] User authentication
- [x] Shopping cart functionality
- [x] Mobile-responsive design

### 🔮 Future Enhancements
- [ ] Real AI try-on integration
- [ ] Payment processing
- [ ] Order management
- [ ] Email notifications
- [ ] Social media integration
- [ ] AR try-on features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: 90s cyberpunk aesthetics and Y2K fashion
- **Technology**: Next.js, Three.js, and the amazing open-source community
- **AI Integration**: Replicate and OpenAI for cutting-edge AI capabilities

## 📞 Support

- 🐛 **Bug Reports**: [Create an issue](https://github.com/yahyakashkoush/90v1/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/yahyakashkoush/90v1/discussions)
- 📧 **Contact**: [Your Email](mailto:your-email@example.com)

---

<div align="center">

**Built with ❤️ and cutting-edge technology for the future of fashion**

[![GitHub stars](https://img.shields.io/github/stars/yahyakashkoush/90v1?style=social)](https://github.com/yahyakashkoush/90v1/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yahyakashkoush/90v1?style=social)](https://github.com/yahyakashkoush/90v1/network/members)

</div>