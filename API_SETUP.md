# Setting Up Your Gemini API Key

To use the website generation feature, you need to set up a Gemini API key:

## 1. Get Your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key

## 2. Add Your API Key to the Project

Create a file named `.env` in the root directory of the project with the following content:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with the actual API key you obtained from Google AI Studio.

## 3. Restart Your Development Server

If your development server is already running, restart it to apply the changes.

## Important Notes

- Never commit your `.env` file to version control
- The `.env` file is already added to `.gitignore` to prevent accidental commits
- Keep your API key secure and don't share it publicly