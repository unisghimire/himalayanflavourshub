# Storage Setup Guide for Himalayan Flavours Hub

This guide will help you set up file storage for your product images using Supabase Storage.

## 🚀 Quick Setup

### 1. Run the Storage SQL Script

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Run the `supabase-storage-setup.sql` file
4. This will create storage buckets and security policies

### 2. Verify Storage Buckets

In your Supabase Dashboard:
1. Go to **Storage** in the left sidebar
2. You should see these buckets:
   - `product-images` (for product photos)
   - `category-images` (for category images)
   - `gallery-images` (for product galleries)

## 📁 Storage Structure

```
Storage Buckets:
├── product-images/
│   ├── products/
│   │   ├── product_1_1640995200000.jpg
│   │   ├── product_2_1640995201000.png
│   │   └── ...
├── category-images/
│   ├── categories/
│   │   ├── category_1_1640995200000.jpg
│   │   └── ...
└── gallery-images/
    ├── gallery/
    │   ├── gallery_1_0_1640995200000.jpg
    │   ├── gallery_1_1_1640995201000.jpg
    │   └── ...
```

## 🔐 Security Policies

The setup includes Row Level Security (RLS) policies:

- **Public Read Access**: Anyone can view images
- **Authenticated Upload**: Only logged-in users can upload
- **Authenticated Update/Delete**: Only logged-in users can modify

## 🛠️ How It Works

### File Upload Process:

1. **User selects file** in admin form
2. **File validation** (size, type)
3. **Upload to Supabase Storage** with unique filename
4. **Get public URL** for the uploaded file
5. **Save URL to database** in `image_url` field
6. **Display image** on landing page

### File Naming Convention:

- **Products**: `product_{id}_{timestamp}.{ext}`
- **Categories**: `category_{id}_{timestamp}.{ext}`
- **Gallery**: `gallery_{productId}_{index}_{timestamp}.{ext}`

## 📋 Usage Examples

### Upload Product Image:
```javascript
import { storageService } from '../services/storageService'

const file = document.querySelector('input[type="file"]').files[0]
const result = await storageService.uploadProductImage(file, productId)

if (result.success) {
  console.log('Image URL:', result.url)
  // Save result.url to your database
}
```

### Validate File:
```javascript
const validation = storageService.validateFile(file, {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png']
})

if (!validation.valid) {
  alert(validation.error)
}
```

## 🎯 Features

### ✅ What's Included:

- **File Upload**: Drag & drop or click to upload
- **File Validation**: Size and type checking
- **Unique Naming**: Prevents filename conflicts
- **Public URLs**: Direct access to uploaded images
- **Error Handling**: Graceful failure handling
- **Security**: RLS policies for access control

### 📊 File Limits:

- **Max Size**: 10MB per file
- **Allowed Types**: JPEG, PNG, GIF, WebP
- **Storage**: Unlimited (based on your Supabase plan)

## 🔧 Configuration

### Environment Variables:

Make sure your `.env` file includes:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Storage Service Options:

You can customize the storage service in `src/services/storageService.js`:

```javascript
// Customize file validation
const validation = storageService.validateFile(file, {
  maxSize: 5 * 1024 * 1024, // 5MB instead of 10MB
  allowedTypes: ['image/jpeg', 'image/png'] // Only JPEG and PNG
})
```

## 🚨 Troubleshooting

### Common Issues:

1. **Upload Fails**: Check if user is authenticated
2. **File Too Large**: Reduce file size or increase limit
3. **Invalid File Type**: Use supported image formats
4. **Permission Denied**: Check RLS policies

### Debug Steps:

1. Check browser console for errors
2. Verify Supabase Storage buckets exist
3. Confirm user authentication status
4. Check file size and type

## 📈 Next Steps

1. **Test Upload**: Try uploading an image in admin panel
2. **Monitor Usage**: Check Supabase Storage dashboard
3. **Optimize Images**: Consider image compression
4. **CDN**: Images are automatically served via Supabase CDN

## 💡 Pro Tips

- **Image Optimization**: Compress images before upload for faster loading
- **Lazy Loading**: Implement lazy loading for better performance
- **Fallback Images**: Always have fallback images for missing files
- **Backup**: Regularly backup your storage buckets

## 🔗 Related Files

- `src/services/storageService.js` - Storage service functions
- `src/pages/AdminPage.jsx` - Admin form with upload
- `supabase-storage-setup.sql` - Database setup script

Your storage system is now ready! 🎉
