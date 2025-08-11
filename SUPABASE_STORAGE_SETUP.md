# Supabase Storage Setup for Product Images

This guide will help you set up Supabase Storage to handle product image uploads for your Himalayan Flavours Hub.

## 1. Create Storage Bucket

### Step 1: Navigate to Storage in Supabase Dashboard
1. Go to your Supabase project dashboard
2. Click on "Storage" in the left sidebar
3. Click "Create a new bucket"

### Step 2: Configure the Bucket
- **Bucket name**: `product-images`
- **Public bucket**: ✅ Check this (so images can be accessed publicly)
- **File size limit**: Set to `5MB` (or your preferred limit)
- **Allowed MIME types**: `image/*` (allows all image types)

### Step 3: Create the Bucket
Click "Create bucket" to finalize the setup.

## 2. Configure Storage Policies

### Step 1: Go to Storage Policies
1. In the Storage section, click on your `product-images` bucket
2. Click on "Policies" tab

### Step 2: Create Upload Policy
Create a policy that allows authenticated users to upload images:

```sql
-- Policy name: Allow authenticated users to upload images
-- Operation: INSERT
-- Target roles: authenticated
-- Policy definition:
(auth.role() = 'authenticated')
```

### Step 3: Create Read Policy
Create a policy that allows public read access to images:

```sql
-- Policy name: Allow public read access to images
-- Operation: SELECT
-- Target roles: public
-- Policy definition:
(true)
```

### Step 4: Create Delete Policy
Create a policy that allows authenticated users to delete their uploaded images:

```sql
-- Policy name: Allow authenticated users to delete images
-- Operation: DELETE
-- Target roles: authenticated
-- Policy definition:
(auth.role() = 'authenticated')
```

## 3. Update Database Schema

Run the updated schema from `supabase-content-schema.sql` in your Supabase SQL Editor to add the `image` field to products.

## 4. Test Image Upload

### Step 1: Go to Admin Panel
1. Navigate to your admin panel (`/admin`)
2. Click on the "📝 Content" tab
3. Scroll down to the Products section

### Step 2: Upload an Image
1. Find a product in the list
2. Click "📁 Choose Image" in the Product Image section
3. Select an image file from your computer
4. The image should upload and display a preview

### Step 3: Verify Storage
1. Go back to Supabase Dashboard → Storage → product-images bucket
2. You should see your uploaded image in the `products/` folder

## 5. Image Storage Structure

Images are stored with the following naming convention:
```
products/{productId}-{timestamp}.{extension}
```

Example:
```
products/1-1703123456789.jpg
products/temp-1703123456789.png
```

## 6. Troubleshooting

### Issue: "Bucket not found" error
- Ensure the bucket name is exactly `product-images`
- Check that the bucket was created successfully

### Issue: "Policy violation" error
- Verify that storage policies are correctly configured
- Ensure you're logged in as an authenticated user

### Issue: Images not displaying
- Check that the bucket is set as public
- Verify the image URL is accessible in browser
- Check browser console for CORS errors

### Issue: Upload fails
- Check file size (should be under 5MB)
- Verify file type is an image
- Check browser console for error messages

## 7. Security Considerations

- **Public Access**: Images are publicly accessible, so don't upload sensitive content
- **File Validation**: Consider adding client-side file validation for size and type
- **Rate Limiting**: Monitor upload frequency to prevent abuse
- **Cleanup**: Implement cleanup procedures for unused images

## 8. Advanced Features (Optional)

### Image Optimization
Consider implementing:
- Image compression before upload
- Multiple image sizes (thumbnail, medium, large)
- WebP format conversion for better performance

### CDN Integration
For better performance, consider:
- Setting up a CDN for image delivery
- Using Supabase's built-in CDN features

## 9. Environment Variables

Ensure your `.env.local` file has the correct Supabase credentials:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 10. Testing Checklist

- [ ] Storage bucket created successfully
- [ ] Storage policies configured correctly
- [ ] Database schema updated with image field
- [ ] Image upload works in admin panel
- [ ] Images display correctly in product preview
- [ ] Image deletion works properly
- [ ] No console errors during upload/display

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify Supabase dashboard settings
3. Check network tab for failed requests
4. Ensure all environment variables are set correctly

The image upload functionality should now work seamlessly with your product management system!
