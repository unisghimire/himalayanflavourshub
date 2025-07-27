# Himalayan Flavours Hub

A beautiful single-page React website that tells the story of Himalayan Flavours Hub through an immersive storytelling experience while showcasing authentic Himalayan spices and products.

## 🌟 Features

- **Storytelling Design**: Immersive narrative that takes visitors through the journey from the Himalayas to their kitchen
- **Animated Logo**: Interactive logo that matches your brand identity with mountains, mortar, and pestle
- **Product Showcase**: Beautiful product cards with individual stories for each spice and blend
- **Responsive Design**: Fully responsive design that works on all devices
- **Smooth Animations**: Framer Motion animations for engaging user experience
- **Category Filtering**: Filter products by category (Pure Spices, Signature Blends, Fresh Herbs)

## 🏔️ Story Sections

1. **The Sacred Mountains**: Introduction to the Himalayan environment
2. **Traditional Wisdom**: The traditional methods of harvesting and processing
3. **From Mountains to Your Table**: The journey of spices to your kitchen

## 🛍️ Products Featured

- Himalayan Black Pepper
- Sacred Cinnamon
- Mountain Garam Masala
- Wild Himalayan Thyme
- Golden Turmeric
- Spice Route Blend

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download the project files
2. Open terminal in the project directory
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

### Build for Production

```bash
npm run build
```

## 🎨 Design Features

- **Color Scheme**: Matches your logo with earthy greens, dark browns, and cream colors
- **Typography**: Playfair Display for headings, Poppins for body text
- **Animations**: Smooth scroll animations and hover effects
- **Visual Elements**: CSS-drawn mountains, mortar and pestle, and natural elements

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🛠️ Technologies Used

- **React 18**: Modern React with hooks
- **Framer Motion**: Smooth animations and transitions
- **CSS3**: Custom styling with CSS Grid and Flexbox
- **React Intersection Observer**: Scroll-triggered animations
- **Google Fonts**: Playfair Display and Poppins

## 📂 Project Structure

```
src/
├── components/
│   ├── Hero.js              # Hero section with animated logo
│   ├── Hero.css
│   ├── StorySection.js      # Storytelling sections
│   ├── StorySection.css
│   ├── ProductsSection.js   # Product showcase
│   ├── ProductsSection.css
│   ├── Footer.js           # Footer with contact info
│   └── Footer.css
├── App.js                  # Main app component
├── App.css                 # App-specific styles
├── index.js               # React entry point
└── index.css              # Global styles
```

## 🎯 Customization

### Adding Products

To add new products, edit the `products` array in `src/components/ProductsSection.js`:

```javascript
const products = [
  {
    id: 7,
    name: 'Your New Product',
    category: 'spices', // or 'blends', 'herbs'
    description: 'Product description',
    price: '$19.99',
    image: '🌶️', // emoji or image
    story: 'The story behind this product'
  }
];
```

### Changing Colors

Edit the CSS variables in `src/index.css`:

```css
:root {
  --primary-green: #4A6741;
  --dark-brown: #2C1810;
  --light-green: #8FBC8F;
  --cream: #F5F5DC;
  --white: #FFFFFF;
}
```

### Adding Categories

Edit the `categories` array in `src/components/ProductsSection.js`:

```javascript
const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'spices', name: 'Pure Spices' },
  { id: 'blends', name: 'Signature Blends' },
  { id: 'herbs', name: 'Fresh Herbs' },
  { id: 'new-category', name: 'New Category' }
];
```

## 📞 Contact Information

The website includes placeholder contact information that you can customize in the Footer component:

- Email: info@himalayanflavours.com
- Phone: +91 98765 43210
- Location: Himalayan Region, India

## 🌟 Future Enhancements

- Add a shopping cart functionality
- Integrate with an e-commerce platform
- Add product image galleries
- Include customer testimonials
- Add a blog section for spice education
- Implement a newsletter signup

## 📄 License

This project is created for Himalayan Flavours Hub. All rights reserved.

---

**From Top of the World** - Bringing authentic Himalayan flavors to your kitchen since 2025. 