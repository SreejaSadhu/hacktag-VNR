# Supabase Authentication Setup

This application now uses Supabase for user authentication. Follow these steps to set up Supabase:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be ready

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon/public key
3. Create a `.env` file in the root directory with:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:8081`)
3. Add redirect URLs if needed
4. Configure email templates if desired

## 4. Enable Email Confirmation (Optional)

1. Go to Authentication > Settings
2. Enable "Enable email confirmations" if you want users to verify their email
3. Configure email templates

## 5. Test the Authentication

1. Start the development server: `npm run dev`
2. Go to `http://localhost:8081/signup`
3. Create a new account
4. Try logging in with the created credentials

## Features

- ✅ User registration with email/password
- ✅ User login with email/password
- ✅ Form validation and error handling
- ✅ Success/error messages
- ✅ User session management
- ✅ Automatic redirect to dashboard after login

## Security Notes

- Passwords are securely hashed by Supabase
- User sessions are managed securely
- All authentication data is stored in Supabase's secure database
- No sensitive data is stored locally

## Troubleshooting

If you encounter issues:

1. Check that your Supabase URL and anon key are correct
2. Ensure your project is active in Supabase dashboard
3. Check the browser console for any error messages
4. Verify that authentication is enabled in your Supabase project 