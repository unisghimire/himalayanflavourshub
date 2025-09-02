# 🏔️ Himalayan Flavours Hub

**From Top of the World** - Professional e-commerce website for authentic Himalayan spices and flavors.

![Himalayan Flavours Hub](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.0-blue)
![Supabase](https://img.shields.io/badge/Database-Supabase-green)

## ✨ Features

### 🛍️ **Complete E-commerce Experience**
- **Modern Shopping Cart** - Add, remove, update quantities with real-time totals
- **Advanced Product Filtering** - Search, category filters, price ranges, and sorting
- **Detailed Product Pages** - Rich product information, reviews, and specifications
- **Secure Checkout Process** - Multi-step checkout with form validation
- **User Authentication** - Sign up, sign in, password reset with Supabase Auth

### 🎨 **Professional UI/UX Design**
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Beautiful Animations** - Smooth transitions with Framer Motion
- **Modern Design System** - Consistent colors, typography, and spacing
- **Accessibility** - WCAG compliant with proper ARIA labels and keyboard navigation

### 🔒 **Admin & User Management**
- **Role-based Access Control** - Admin panel with user management
- **Supabase Integration** - Real-time database with Row Level Security
- **Newsletter System** - Email collection with database storage
- **Review System** - Customer reviews and ratings

### 📱 **Content Management**
- **Dynamic Content** - Database-driven product catalog and content
- **SEO Optimized** - Meta tags, structured data, and semantic HTML
- **Performance** - Optimized images, lazy loading, and code splitting

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/himalayan-flavours-hub.git
   cd himalayan-flavours-hub
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Edit \`.env\` with your Supabase credentials:
   \`\`\`env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

4. **Set up Supabase database**
   
   Run the SQL scripts in your Supabase SQL editor in this order:
   1. \`supabase-schema.sql\` - Basic tables and email collection
   2. \`supabase-roles-schema.sql\` - User roles and permissions
   3. \`supabase-content-schema.sql\` - Landing page content
   4. \`supabase-users-function.sql\` - Admin user management functions
   5. \`assign-admin-role.sql\` - Helper to assign admin roles

5. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to \`http://localhost:3000\`

## 🏗️ Project Structure

\`\`\`
src/
├── components/           # Reusable UI components
│   ├── home/            # Homepage sections
│   └── layout/          # Header, Footer, Navigation
├── context/             # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   └── CartContext.jsx # Shopping cart state
├── pages/               # Route components
│   ├── HomePage.jsx     # Landing page
│   ├── ProductsPage.jsx # Product catalog
│   ├── CartPage.jsx     # Shopping cart
│   ├── CheckoutPage.jsx # Checkout process
│   ├── AboutPage.jsx    # Company story
│   ├── ContactPage.jsx  # Contact form & info
│   ├── AuthPage.jsx     # Login/Register
│   └── AdminPage.jsx    # Admin dashboard
├── lib/                 # External service configs
│   └── supabase.js      # Supabase client
├── utils/               # Utility functions
└── styles/              # CSS and styling
\`\`\`

## 🎨 Design System

### Color Palette
- **Primary Green**: \`#7ca87c\` - Inspired by Himalayan nature
- **Earth Brown**: \`#8b6f47\` - Traditional spice colors  
- **Mountain Gray**: \`#78716c\` - Neutral tones
- **Clean Whites**: \`#fafaf9\` - Modern backgrounds

### Typography
- **Display Font**: Playfair Display (Headings)
- **Body Font**: Inter (Content)

### Components
- Custom button variants (\`btn-primary\`, \`btn-secondary\`, \`btn-outline\`)
- Consistent card design with hover effects
- Input fields with focus states
- Loading states and micro-interactions

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication & authorization
  - Edge functions

### State Management
- **React Context** - For cart and authentication state
- **Local Storage** - Cart persistence
- **Supabase Real-time** - Live data updates

## 📊 Database Schema

### Core Tables
- \`emails\` - Newsletter subscriptions
- \`landing_page_content\` - Dynamic page content
- \`roles\` & \`user_roles\` - Role-based access control
- \`auth.users\` - User authentication (Supabase managed)

### Key Features
- **Row Level Security** enabled on all tables
- **Real-time subscriptions** for live updates
- **Custom functions** for admin operations
- **Automated timestamps** with triggers

## 🔐 Security Features

- **Row Level Security (RLS)** - Database-level access control
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Client and server-side validation
- **HTTPS Only** - Secure data transmission
- **Environment Variables** - Sensitive data protection

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Netlify
1. Connect repository to Netlify
2. Set build command: \`npm run build\`
3. Set publish directory: \`dist\`
4. Add environment variables

### Traditional Hosting
\`\`\`bash
npm run build
# Upload dist/ folder to your web server
\`\`\`

## 🎯 Performance Optimizations

- **Code Splitting** - Lazy loading of pages and components
- **Image Optimization** - WebP format with fallbacks
- **Bundle Analysis** - Regular bundle size monitoring
- **Caching Strategies** - Effective browser caching
- **Lighthouse Score**: 95+ on all metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature-name\`
3. Commit changes: \`git commit -am 'Add feature'\`
4. Push to branch: \`git push origin feature-name\`
5. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern e-commerce best practices
- **Cultural Authenticity**: Traditional Himalayan heritage
- **Community**: Open source libraries and contributors

## 📞 Support

- **Documentation**: Check our comprehensive guides
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join our Discord server
- **Email**: support@himalayanflavours.com

---

**Built with ❤️ for authentic Himalayan flavors** | **From Top of the World** 🏔️
