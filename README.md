# Cigar Scraper

A Vercel-compatible web application that scrapes cigar offers from cigarpage.com and returns the data as a CSV file.

## Features

- **Web Scraping**: Uses Puppeteer to extract cigar offer data from cigarpage.com
- **CSV Export**: Automatically generates and downloads CSV files with extracted data
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **Vercel Ready**: Optimized for deployment on Vercel platform

## Extracted Data

The scraper extracts the following information for each cigar offer:
- Product Name
- Brand
- Price
- Original Price (if available)
- Discount (if available)
- Rating (if available)
- Review Count (if available)
- Image URL (if available)
- Product URL (if available)

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Web Scraping**: Puppeteer
- **CSV Generation**: csv-writer
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cigar-scraper
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a valid cigarpage.com URL in the input field
2. Click "Download CSV" to start scraping
3. The app will extract all cigar offers from the page
4. A CSV file will automatically download with the extracted data

## Development

- **Build**: `npm run build`
- **Start Production**: `npm start`
- **Lint**: `npm run lint`

## Deployment to Vercel

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Deploy automatically on push

The app is already configured for Vercel deployment with:
- Proper function timeout settings
- CORS headers
- Puppeteer compatibility

## Important Notes

- **Rate Limiting**: Be respectful of cigarpage.com's servers. Don't make excessive requests.
- **Terms of Service**: Ensure you comply with cigarpage.com's terms of service.
- **Data Accuracy**: Web scraping may not always capture 100% accurate data due to dynamic content.

## Troubleshooting

### Common Issues

1. **No data extracted**: The page structure may have changed. Check the browser console for errors.
2. **Timeout errors**: Some pages may take longer to load. Consider increasing timeout values.
3. **Puppeteer issues**: Ensure you're using Node.js 18+ and have proper system dependencies.

### Vercel Deployment Issues

- Ensure your Vercel plan supports the required function timeout (60 seconds)
- Check that Puppeteer is properly bundled for serverless deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please ensure compliance with all applicable laws and terms of service.
