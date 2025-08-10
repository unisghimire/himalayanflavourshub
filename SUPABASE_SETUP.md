# Supabase Setup Guide for Himalayan Flavours Hub

## Overview
This guide will help you set up Supabase as your email collection database, replacing the current localStorage approach with a proper cloud database.

## Prerequisites
- A Supabase account (free at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Basic knowledge of SQL

## Step 1: Create Supabase Project

1. **Sign up/Login**: Go to [supabase.com](https://supabase.com) and create an account or login
2. **Create New Project**: Click "New Project"
3. **Project Details**:
   - Name: `himalayan-flavours-hub` (or your preferred name)
   - Database Password: Choose a strong password (save this!)
   - Region: Choose closest to your users
4. **Wait for Setup**: This may take 2-3 minutes

## Step 2: Get Project Credentials

1. **Go to Settings**: In your project dashboard, click the gear icon (⚙️) → Settings
2. **API Section**: Copy these values:
   - **Project URL**: Looks like `https://abcdefghijklmnop.supabase.co`
   - **Anon Public Key**: Looks like `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Create Database Table

1. **SQL Editor**: In your Supabase dashboard, go to SQL Editor
2. **New Query**: Click "New Query"
3. **Copy Schema**: Copy the contents of `supabase-schema.sql` file
4. **Run Query**: Paste and click "Run" to create the table and policies

## Step 4: Configure Environment Variables

1. **Create .env file**: In your project root, create a `.env` file
2. **Add Credentials**:
   ```env
   REACT_APP_SUPABASE_URL=https://your-project-url.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. **Restart Development Server**: After adding .env, restart your React app

## Step 5: Test the Setup

1. **Start Development Server**: `npm start`
2. **Test Email Collection**: Submit an email through the popup
3. **Check Supabase**: Go to your Supabase dashboard → Table Editor → emails
4. **Verify Admin Panel**: Visit `/admin` and check if emails are loaded

## Step 6: Deploy to Vercel

1. **Environment Variables**: Add the same environment variables in Vercel:
   - Go to your Vercel project → Settings → Environment Variables
   - Add `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`
2. **Redeploy**: Trigger a new deployment

## Database Schema Details

The `emails` table has these columns:
- `id`: Unique identifier (auto-increment)
- `email`: Email address (unique, required)
- `ip_address`: IP address of submitter
- `created_at`: Timestamp when email was submitted
- `updated_at`: Timestamp when record was last updated

## Security Features

- **Row Level Security (RLS)**: Enabled for data protection
- **Public Policies**: Allows email insertion and reading (configurable)
- **Unique Emails**: Prevents duplicate email submissions
- **Indexed Fields**: Optimized for fast queries

## Troubleshooting

### Common Issues:

1. **"Invalid API key" Error**:
   - Check your environment variables
   - Ensure you're using the anon key, not the service role key

2. **"Table doesn't exist" Error**:
   - Run the SQL schema in Supabase SQL Editor
   - Check if the table was created successfully

3. **CORS Errors**:
   - Supabase handles CORS automatically
   - If issues persist, check your Supabase project settings

4. **Environment Variables Not Loading**:
   - Restart your development server after adding .env
   - Ensure variable names start with `REACT_APP_`

### Testing Commands:

```bash
# Check if Supabase client is working
npm start
# Open browser console and check for Supabase connection errors

# Verify environment variables
echo $REACT_APP_SUPABASE_URL
echo $REACT_APP_SUPABASE_ANON_KEY
```

## Benefits of This Setup

✅ **Centralized Storage**: All emails stored in one place  
✅ **Real-time Updates**: Admin panel shows live data  
✅ **Scalable**: Handles thousands of emails  
✅ **Secure**: Built-in security features  
✅ **Free Tier**: 500MB database, 50,000 monthly users  
✅ **Vercel Compatible**: Works perfectly with Vercel hosting  

## Next Steps

After setup, consider:
1. **Email Validation**: Add server-side email validation
2. **Rate Limiting**: Prevent spam submissions
3. **Analytics**: Track email collection metrics
4. **Backup**: Set up automated database backups

## Support

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Community**: [github.com/supabase/supabase](https://github.com/supabase/supabase)
- **Discord**: [discord.supabase.com](https://discord.supabase.com)
