import { NextRequest, NextResponse } from 'next/server'

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

    // Fetch the page content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`)
    }

    const html = await response.text()

    // Simple HTML parsing using regex (more reliable than complex DOM parsing)
    const cigarOffers: CigarOffer[] = []
    
    // Look for common patterns in HTML
    const patterns = [
      // Product names in various formats
      /<h[1-6][^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<\/h[1-6]>/gi,
      /<h[1-6][^>]*class="[^"]*name[^"]*"[^>]*>([^<]+)<\/h[1-6]>/gi,
      /<div[^>]*class="[^"]*product[^"]*"[^>]*>.*?<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gis,
      
      // Prices
      /<span[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/span>/gi,
      /<div[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/div>/gi,
      
      // Brands
      /<span[^>]*class="[^"]*brand[^"]*"[^>]*>([^<]+)<\/span>/gi,
      /<div[^>]*class="[^"]*brand[^"]*"[^>]*>([^<]+)<\/div>/gi,
    ]

    // Extract basic information
    let names: string[] = []
    let prices: string[] = []
    let brands: string[] = []

    // Extract names
    for (const pattern of patterns.slice(0, 3)) {
      const matches = html.match(pattern)
      if (matches) {
        names = matches.map(match => {
          const nameMatch = match.match(/>([^<]+)</)
          return nameMatch ? nameMatch[1].trim() : ''
        }).filter(name => name.length > 0)
        if (names.length > 0) break
      }
    }

    // Extract prices
    for (const pattern of patterns.slice(3, 5)) {
      const matches = html.match(pattern)
      if (matches) {
        prices = matches.map(match => {
          const priceMatch = match.match(/>([^<]+)</)
          return priceMatch ? priceMatch[1].trim() : ''
        }).filter(price => price.length > 0 && /\$/.test(price))
        if (prices.length > 0) break
      }
    }

    // Extract brands
    for (const pattern of patterns.slice(5)) {
      const matches = html.match(pattern)
      if (matches) {
        brands = matches.map(match => {
          const brandMatch = match.match(/>([^<]+)</)
          return brandMatch ? brandMatch[1].trim() : ''
        }).filter(brand => brand.length > 0)
        if (brands.length > 0) break
      }
    }

    // Create offers from extracted data
    const maxLength = Math.max(names.length, prices.length, brands.length)
    for (let i = 0; i < maxLength; i++) {
      const name = names[i] || `Cigar ${i + 1}`
      const price = prices[i] || 'Price not available'
      const brand = brands[i] || 'Brand not available'
      
      cigarOffers.push({
        name,
        brand,
        price,
        originalPrice: undefined,
        discount: undefined,
        rating: undefined,
        reviewCount: undefined,
        imageUrl: undefined,
        url: undefined
      })
    }

    if (cigarOffers.length === 0) {
      return NextResponse.json(
        { error: 'No cigar offers found on this page. The page structure may have changed.' },
        { status: 404 }
      )
    }

    // Generate CSV content manually
    const csvHeaders = ['Name', 'Brand', 'Price', 'Original Price', 'Discount', 'Rating', 'Review Count', 'Image URL', 'Product URL']
    const csvRows = cigarOffers.map(offer => [
      `"${offer.name}"`,
      `"${offer.brand}"`,
      `"${offer.price}"`,
      `"${offer.originalPrice || ''}"`,
      `"${offer.discount || ''}"`,
      `"${offer.rating || ''}"`,
      `"${offer.reviewCount || ''}"`,
      `"${offer.imageUrl || ''}"`,
      `"${offer.url || ''}"`
    ].join(','))
    
    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n')

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
