# Netlify Deployment Guide for Craft AI

## Prerequisites
1. GitHub account
2. Netlify account
3. GROQ API key

## Deployment Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Connect to Netlify
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Choose GitHub and select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `public`
   - **Functions directory**: `netlify/functions`

### 3. Environment Variables
In Netlify dashboard, go to Site settings > Environment variables and add:
- **GROQ_API_KEY**: Your GROQ API key

### 4. Deploy
Click "Deploy site" - Netlify will automatically build and deploy your site.

## File Structure for Netlify
```
├── netlify/
│   └── functions/
│       ├── generate.js          # Main post generation
│       └── improve-post.js      # AI post improvement
├── public/
│   ├── index.html              # Main frontend
│   ├── logo.png               # Logo image
│   └── _redirects             # Netlify redirects
├── netlify.toml               # Netlify configuration
├── package.json               # Dependencies
├── linkedinPostGenerator.js   # Core logic
└── .env                       # Environment variables (local only)
```

## Key Changes Made for Netlify

### 1. Serverless Functions
- Converted Express routes to Netlify functions
- Added CORS headers for cross-origin requests
- Proper error handling for serverless environment

### 2. Frontend Updates
- Changed API endpoints from `/generate` to `/.netlify/functions/generate`
- Changed `/improve-post` to `/.netlify/functions/improve-post`

### 3. Configuration Files
- `netlify.toml`: Build and redirect configuration
- `public/_redirects`: Fallback routing
- Updated `package.json` with build script

### 4. Static Assets
- All static files moved to `public/` directory
- Logo image accessible at `/logo.png`

## Testing Locally
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run locally
netlify dev
```

## Custom Domain (Optional)
1. In Netlify dashboard, go to Domain settings
2. Add your custom domain
3. Configure DNS settings as instructed

## Environment Variables Needed
- `GROQ_API_KEY`: Your GROQ API key for AI functionality

## Troubleshooting
1. **Functions not working**: Check environment variables are set
2. **CORS errors**: Ensure functions include proper CORS headers
3. **Build fails**: Check all dependencies are in package.json
4. **Logo not showing**: Ensure logo.png is in public/ directory

Your Craft AI LinkedIn Post Generator is now ready for Netlify deployment! 🚀