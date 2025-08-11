# Content Management System Setup

This guide will help you set up the content management system for your landing page content.

## 1. Database Setup

First, run the SQL schema in your Supabase database:

```sql
-- Copy and paste the contents of supabase-content-schema.sql into your Supabase SQL editor
-- This will create the landing_page_content table with initial content
```

## 2. What's Been Implemented

### Frontend Components Updated
- **Hero.js** - Now fetches title, subtitle, and button text from database
- **StorySection.js** - Now fetches section title, subtitle, and chapter content from database
- **ProductsSection.js** - Now fetches section title, subtitle, products, and CTA content from database

### Content Service
- **contentService.js** - Handles fetching and updating content from Supabase
- **AdminPanel.js** - New "Content" tab for managing landing page content

### Database Structure
The `landing_page_content` table stores:
- `section_name` - Identifies which section (hero, story, products)
- `content` - JSONB field containing all content for that section
- `created_at` and `updated_at` - Timestamps for tracking changes

## 3. How It Works

### Content Fetching
1. Each component loads with default content (fallback)
2. `useEffect` hook fetches content from Supabase on component mount
3. If content exists in database, it replaces the default content
4. If no content in database, default content is displayed

### Content Management
1. Admin can access the "Content" tab in the admin panel
2. Forms are provided for editing each section's content
3. Changes can be saved to the database
4. Frontend automatically reflects changes (after page refresh)

## 4. Current Features

### Hero Section
- Title and subtitle editing
- Primary and secondary button text
- Button link configuration

### Story Section
- Section title and subtitle
- Chapter content editing (title, content, icon)
- Visual elements remain unchanged (design preserved)

### Products Section
- Section title and subtitle
- Product details (name, category, description, price, icon, story)
- CTA section content

## 5. Benefits

✅ **No Design Changes** - All visual styling and animations remain exactly the same
✅ **Easy Content Updates** - Change text without touching code
✅ **Centralized Management** - All content in one place (Supabase)
✅ **Real-time Updates** - Changes reflect immediately after saving
✅ **Fallback Content** - Site works even if database is unavailable

## 6. Next Steps

### Immediate
1. Run the SQL schema in your Supabase database
2. Test the content management interface in the admin panel
3. Make some content changes and verify they appear on the frontend

### Future Enhancements
- Add image upload functionality for product images
- Implement content versioning/history
- Add content approval workflows
- Create content templates for different page types
- Add bulk content import/export

## 7. Troubleshooting

### Content Not Loading
- Check browser console for errors
- Verify Supabase connection in `.env.local`
- Ensure `landing_page_content` table exists
- Check RLS policies are correctly set

### Changes Not Saving
- Verify admin authentication
- Check Supabase logs for errors
- Ensure content format matches expected JSON structure

### Design Issues
- All CSS and animations remain unchanged
- If you see design issues, they're likely unrelated to content changes
- Check that the component structure hasn't been modified

## 8. Content Format Examples

### Hero Section
```json
{
  "title": "From Top of the World",
  "subtitle": "Discover authentic Himalayan spices and flavors...",
  "primaryButtonText": "Our Story",
  "secondaryButtonText": "Explore Products",
  "primaryButtonLink": "#story",
  "secondaryButtonLink": "#products"
}
```

### Story Section
```json
{
  "title": "Our Story",
  "subtitle": "A journey from the pristine Himalayas...",
  "chapters": [
    {
      "number": "01",
      "title": "The Sacred Mountains",
      "content": "High in the majestic Himalayas...",
      "icon": "🏔️"
    }
  ]
}
```

### Products Section
```json
{
  "title": "Our Products",
  "subtitle": "Each product tells a story...",
  "categories": [...],
  "products": [...],
  "cta": {...}
}
```

## 9. Security

- Content is publicly readable (needed for frontend display)
- Only authenticated users can update content
- Row Level Security (RLS) policies are in place
- Content validation should be added for production use

---

Your landing page content is now fully manageable from the database while preserving all the beautiful design and animations! 🎉
