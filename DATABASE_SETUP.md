# Database Setup for Himalayan Flavours Hub

This document explains how to set up the database for categories and collections in your Himalayan Flavours Hub e-commerce website.

## Database Schema

The database includes three main tables:

### 1. Categories Table
- **id**: Primary key
- **name**: Category name (e.g., "Spices", "Herbs")
- **slug**: URL-friendly identifier (e.g., "spices", "herbs")
- **description**: Category description
- **image_url**: Category image path
- **background_gradient**: CSS gradient classes for styling
- **icon**: Emoji or icon representation
- **sort_order**: Display order
- **is_active**: Whether the category is active

### 2. Collections Table
- **id**: Primary key
- **name**: Collection name (e.g., "Mountain Harvest")
- **slug**: URL-friendly identifier
- **description**: Collection description
- **category_id**: Foreign key to categories table
- **image_url**: Collection image path
- **background_gradient**: CSS gradient classes
- **icon**: Emoji or icon representation
- **sort_order**: Display order
- **is_active**: Whether the collection is active
- **is_featured**: Whether to feature this collection

### 3. Products Table
- **id**: Primary key
- **name**: Product name
- **slug**: URL-friendly identifier
- **description**: Product description
- **short_description**: Brief product description
- **price**: Current price
- **original_price**: Original price (for discounts)
- **discount_percentage**: Discount percentage
- **category_id**: Foreign key to categories table
- **collection_id**: Foreign key to collections table
- **image_url**: Product image path
- **gallery_images**: Array of additional product images
- **weight_grams**: Product weight
- **stock_quantity**: Available stock
- **sku**: Stock keeping unit
- **is_active**: Whether the product is active
- **is_featured**: Whether to feature this product
- **is_trending**: Whether this is a trending product
- **rating**: Average rating (0-5)
- **review_count**: Number of reviews
- **tags**: Array of product tags
- **certifications**: Array of certifications (e.g., "Organic", "Fair Trade")
- **origin**: Country/region of origin
- **harvest_season**: Harvest season information
- **storage_instructions**: Storage instructions

## Setup Instructions

### 1. Run the Database Schema

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Run the `supabase-categories-schema.sql` file
4. This will create all tables, indexes, and sample data

### 2. Sample Data Included

The schema includes sample data for:

#### Categories:
- Spices (🌶️)
- Herbs (🌿)
- Teas (🍵)
- Essential Oils (💧)
- Salts (🧂)
- Blends (✨)

#### Collections:
- Mountain Harvest
- Wild Herbs
- Tea Gardens
- Aromatherapy
- Pink Salt
- Chef Blends

#### Products:
- Wild Himalayan Thyme
- Black Pepper Premium
- Green Cardamom
- Himalayan Pink Salt
- Mountain Tea Blend
- Lavender Essential Oil

### 3. Database Views

The schema creates several views for easier querying:

- **featured_products**: Products marked as featured
- **trending_products**: Products marked as trending
- **category_products**: Categories with product counts and ratings

### 4. Row Level Security (RLS)

The database includes RLS policies:
- Public read access for all active categories, collections, and products
- Full access for authenticated users (admins)

### 5. Frontend Integration

The frontend has been updated to:
- Fetch data from the database using the `categoryService.js`
- Display loading states while fetching data
- Fall back to hardcoded data if the database is unavailable
- Handle both database and fallback data structures

## File Structure

```
src/
├── services/
│   └── categoryService.js          # Database service functions
├── components/
│   └── home/
│       └── ProductsPreview.jsx     # Updated to use database data
└── lib/
    └── supabase.js                 # Supabase client configuration
```

## Usage

### Fetching Categories
```javascript
import { categoryService } from '../services/categoryService'

const categories = await categoryService.getAllCategories()
```

### Fetching Products
```javascript
import { productService } from '../services/categoryService'

const products = await productService.getAllProducts()
const featuredProducts = await productService.getFeaturedProducts()
const trendingProducts = await productService.getTrendingProducts()
```

### Fetching Collections
```javascript
import { collectionService } from '../services/categoryService'

const collections = await collectionService.getAllCollections()
const featuredCollections = await collectionService.getFeaturedCollections()
```

## Benefits

1. **Dynamic Content**: Categories and products can be managed through the database
2. **Scalability**: Easy to add new categories, collections, and products
3. **Performance**: Optimized with proper indexes and views
4. **Security**: Row Level Security ensures data protection
5. **Flexibility**: Support for rich product data including images, ratings, and metadata

## Next Steps

1. Add more sample products to the database
2. Create admin interfaces for managing categories and products
3. Implement product search and filtering
4. Add product reviews and ratings functionality
5. Set up image upload and storage
