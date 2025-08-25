import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import { createObjectCsvWriter } from 'csv-writer'

interface CigarOffer {
  name: string
  brand: string
  price: string
  originalPrice?: string
  discount?: string
  rating?: string
  reviewCount?: string
  imageUrl?: string
  url?: string
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || !url.includes('cigarpage.com')) {
      return NextResponse.json(
        { error: 'Please provide a valid cigarpage.com URL' },
        { status: 400 }
      )
    }

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    })

    const page = await browser.newPage()
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
    
    // Navigate to the page
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

    // Wait for content to load
    await page.waitForTimeout(3000)

    // Extract cigar offers
    const cigarOffers = await page.evaluate(() => {
      const offers: CigarOffer[] = []
      
      // Look for product cards/items
      const productElements = document.querySelectorAll('[class*="product"], [class*="item"], [class*="card"]')
      
      productElements.forEach((element) => {
        try {
          // Extract product name
          const nameElement = element.querySelector('h1, h2, h3, h4, [class*="title"], [class*="name"]')
          const name = nameElement?.textContent?.trim() || ''
          
          // Extract brand
          const brandElement = element.querySelector('[class*="brand"], [class*="manufacturer"]')
          const brand = brandElement?.textContent?.trim() || ''
          
          // Extract price
          const priceElement = element.querySelector('[class*="price"], [class*="cost"]')
          const price = priceElement?.textContent?.trim() || ''
          
          // Extract original price
          const originalPriceElement = element.querySelector('[class*="original"], [class*="old"], [class*="was"]')
          const originalPrice = originalPriceElement?.textContent?.trim() || ''
          
          // Extract discount
          const discountElement = element.querySelector('[class*="discount"], [class*="sale"], [class*="save"]')
          const discount = discountElement?.textContent?.trim() || ''
          
          // Extract rating
          const ratingElement = element.querySelector('[class*="rating"], [class*="stars"]')
          const rating = ratingElement?.textContent?.trim() || ''
          
          // Extract review count
          const reviewElement = element.querySelector('[class*="review"], [class*="count"]')
          const reviewCount = reviewElement?.textContent?.trim() || ''
          
          // Extract image URL
          const imgElement = element.querySelector('img')
          const imageUrl = imgElement?.src || imgElement?.getAttribute('data-src') || ''
          
          // Extract product URL
          const linkElement = element.querySelector('a')
          const productUrl = linkElement?.href || ''
          
          if (name && price) {
            offers.push({
              name,
              brand,
              price,
              originalPrice: originalPrice || undefined,
              discount: discount || undefined,
              rating: rating || undefined,
              reviewCount: reviewCount || undefined,
              imageUrl: imageUrl || undefined,
              url: productUrl || undefined
            })
          }
        } catch (error) {
          console.error('Error parsing product element:', error)
        }
      })
      
      return offers
    })

    await browser.close()

    if (cigarOffers.length === 0) {
      return NextResponse.json(
        { error: 'No cigar offers found on this page' },
        { status: 404 }
      )
    }

    // Create CSV content
    const csvWriter = createObjectCsvWriter({
      path: 'temp.csv',
      header: [
        { id: 'name', title: 'Name' },
        { id: 'brand', title: 'Brand' },
        { id: 'price', title: 'Price' },
        { id: 'originalPrice', title: 'Original Price' },
        { id: 'discount', title: 'Discount' },
        { id: 'rating', title: 'Rating' },
        { id: 'reviewCount', title: 'Review Count' },
        { id: 'imageUrl', title: 'Image URL' },
        { id: 'url', title: 'Product URL' }
      ]
    })

    await csvWriter.writeRecords(cigarOffers)

    // Read the CSV file and return it
    const fs = require('fs')
    const csvContent = fs.readFileSync('temp.csv', 'utf-8')
    
    // Clean up temp file
    fs.unlinkSync('temp.csv')

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="cigar-offers.csv"',
      },
    })

  } catch (error) {
    console.error('Scraping error:', error)
    return NextResponse.json(
      { error: 'Failed to scrape the page. Please try again.' },
      { status: 500 }
    )
  }
}
