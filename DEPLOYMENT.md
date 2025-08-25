# Deployment Guide

## Option 1: Local Development (Recommended for Testing)

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup Steps
1. **Install Node.js** (if not already installed)
   - Download from [https://nodejs.org/](https://nodejs.org/)
   - Choose LTS version for Windows
   - Ensure "Add to PATH" is checked during installation

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - Enter a cigarpage.com URL
   - Click "Download CSV" to test the scraper

## Option 2: Vercel Deployment (Production)

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Deployment Steps

1. **Prepare Your Code**
   - Ensure all files are committed to Git
   - Push to a GitHub repository

2. **Deploy to Vercel**
   - Go to [https://vercel.com/](https://vercel.com/)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js
   - Click "Deploy"

3. **Configuration**
   - The app is pre-configured for Vercel
   - Function timeout is set to 60 seconds
   - CORS headers are configured
   - No environment variables needed

### Vercel Features
- **Automatic Deployments**: Deploys on every Git push
- **Preview Deployments**: Creates preview URLs for pull requests
- **Custom Domains**: Add your own domain
- **Analytics**: Built-in performance monitoring

## Option 3: Alternative Package (Simpler Deployment)

If you encounter issues with the main package, use the simplified version:

1. **Rename package files**:
   ```bash
   mv package.json package-full.json
   mv package-simple.json package.json
   ```

2. **Install simplified dependencies**:
   ```bash
   npm install
   ```

3. **Deploy as usual**

## Testing Your Deployment

### Test URLs
Try these cigarpage.com URLs to test your scraper:
- Main page: `https://www.cigarpage.com/`
- Sale page: `https://www.cigarpage.com/sale`
- New arrivals: `https://www.cigarpage.com/new-arrivals`

### Expected Results
- CSV file should download automatically
- File should contain cigar offer data
- Data should include names, brands, and prices

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (must be 18+)
   - Clear node_modules and reinstall
   - Check for TypeScript errors

2. **Runtime Errors**
   - Check Vercel function logs
   - Verify API endpoint URLs
   - Test with simple URLs first

3. **No Data Extracted**
   - Website structure may have changed
   - Check if cigarpage.com blocks scraping
   - Try different page types

### Vercel-Specific Issues

1. **Function Timeout**
   - Default timeout is 60 seconds
   - Upgrade to Pro plan for longer timeouts
   - Optimize scraping logic

2. **Memory Limits**
   - Free tier: 1024 MB
   - Pro tier: 3008 MB
   - Consider using simpler scraping methods

## Performance Optimization

### For Production Use
1. **Rate Limiting**: Implement delays between requests
2. **Caching**: Cache results to avoid repeated scraping
3. **Error Handling**: Graceful fallbacks for failed requests
4. **Monitoring**: Track success/failure rates

### Scaling Considerations
- Vercel free tier: 100 GB-hours/month
- Pro tier: 1000 GB-hours/month
- Enterprise: Custom limits

## Security Considerations

1. **Input Validation**: URLs are validated for cigarpage.com domain
2. **Rate Limiting**: Implement to prevent abuse
3. **Error Handling**: Don't expose internal errors to users
4. **CORS**: Configured for cross-origin requests

## Support

- **Vercel Documentation**: [https://vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **GitHub Issues**: Report bugs in your repository
- **Community**: Stack Overflow, Discord, etc.
