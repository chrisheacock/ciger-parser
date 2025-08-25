# Setup Guide for Cigar Scraper

## Prerequisites Installation

### 1. Install Node.js

Since Node.js is not currently installed on your system, you'll need to install it first:

#### Option A: Download from Official Website (Recommended)
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS (Long Term Support) version for Windows
3. Run the installer and follow the setup wizard
4. Make sure to check "Add to PATH" during installation

#### Option B: Using Chocolatey (if you have it installed)
```powershell
choco install nodejs
```

#### Option C: Using Winget (Windows Package Manager)
```powershell
winget install OpenJS.NodeJS
```

### 2. Verify Installation
After installation, restart your terminal/PowerShell and run:
```powershell
node --version
npm --version
```

You should see version numbers displayed.

## Project Setup

### 1. Install Dependencies
Once Node.js is installed, navigate to your project directory and run:
```powershell
npm install
```

### 2. Run Development Server
```powershell
npm run dev
```

### 3. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## Alternative: Direct Deployment to Vercel

If you prefer not to install Node.js locally, you can deploy directly to Vercel:

### 1. Push to GitHub
1. Create a new repository on GitHub
2. Push your code to the repository

### 2. Deploy on Vercel
1. Go to [https://vercel.com/](https://vercel.com/)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Deploy automatically

## Troubleshooting

### Common Issues

1. **"npm is not recognized"**
   - Restart your terminal after Node.js installation
   - Check if Node.js is added to PATH
   - Try running as Administrator

2. **Permission Errors**
   - Run PowerShell as Administrator
   - Check Windows Defender/Firewall settings

3. **Port Already in Use**
   - Change the port in package.json scripts
   - Kill processes using port 3000

### Getting Help

- Check Node.js installation: [https://nodejs.org/](https://nodejs.org/)
- Vercel documentation: [https://vercel.com/docs](https://vercel.com/docs)
- Next.js documentation: [https://nextjs.org/docs](https://nextjs.org/docs)
