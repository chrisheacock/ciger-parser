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

// Helper function to add random delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || !url.includes('cigarpage.com')) {
      return NextResponse.json(
        { error: 'Please provide a valid cigarpage.com URL' },
        { status: 400 }
      )
    }

    // Advanced user agents with more variety
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ]

    // Try multiple approaches to fetch the page
    let html = ''
    let success = false
    let blockedAttempts = 0

    for (let i = 0; i < userAgents.length; i++) {
      const userAgent = userAgents[i]
      
      try {
        // Add random delay between attempts to appear more human-like
        if (i > 0) {
          const delayMs = Math.floor(Math.random() * 2000) + 1000 // 1-3 seconds
          await delay(delayMs)
        }

        // First, try to get the homepage to establish a session
        const homeResponse = await fetch('https://www.cigarpage.com/', {
          headers: {
            'User-Agent': userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
            'DNT': '1',
            'Referer': 'https://www.google.com/',
            'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"'
          },
          method: 'GET',
          redirect: 'follow'
        })

        // If homepage works, try the target URL
        if (homeResponse.ok) {
          console.log(`Homepage accessible with User-Agent: ${userAgent}`)
          
          // Small delay to simulate human browsing
          await delay(500)
          
          const targetResponse = await fetch(url, {
            headers: {
              'User-Agent': userAgent,
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9,en;q=0.8',
              'Accept-Encoding': 'gzip, deflate, br',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
              'Sec-Fetch-Dest': 'document',
              'Sec-Fetch-Mode': 'navigate',
              'Sec-Fetch-Site': 'same-origin',
              'Sec-Fetch-User': '?1',
              'Cache-Control': 'max-age=0',
              'DNT': '1',
              'Referer': 'https://www.cigarpage.com/',
              'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
              'sec-ch-ua-mobile': '?0',
              'sec-ch-ua-platform': '"Windows"'
            },
            method: 'GET',
            redirect: 'follow'
          })

          if (targetResponse.ok) {
            html = await targetResponse.text()
            success = true
            console.log(`Target URL accessible with User-Agent: ${userAgent}`)
            break
          } else if (targetResponse.status === 403) {
            console.log(`403 error with target URL for User-Agent: ${userAgent}`)
            blockedAttempts++
            continue
          } else {
            throw new Error(`Failed to fetch target page: ${targetResponse.status}`)
          }
        } else if (homeResponse.status === 403) {
          console.log(`403 error with homepage for User-Agent: ${userAgent}`)
          blockedAttempts++
          continue
        } else {
          throw new Error(`Failed to fetch homepage: ${homeResponse.status}`)
        }
      } catch (error) {
        console.log(`Error with User-Agent ${userAgent}:`, error)
        continue
      }
    }

    if (!success || !html) {
      // Create a helpful CSV with information about the blocking
      const csvContent = `Status,Message,Details,Recommendations
Blocked,Website Access Denied,All ${blockedAttempts} attempts were blocked with 403 Forbidden errors,The website is actively blocking automated requests from Vercel servers
Detection,Advanced Bot Protection,Multiple user agents and realistic headers were detected as automated,This suggests sophisticated bot detection beyond basic header spoofing
Solution,Manual Access Required,The website may require manual browser access or have IP-based blocking,Consider accessing the site manually in your browser first
Alternative,Contact Website Owners,For bulk data access, contact cigarpage.com directly,They may provide API access or data export options for legitimate business use
Note,Common Issue,This is a common challenge with modern e-commerce sites,Many sites block server-to-server requests to prevent scraping`

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="scraping-status.csv"',
        },
      })
    }

    // Simple HTML parsing using regex
    const cigarOffers: CigarOffer[] = []
    
    // Look for common patterns in HTML
    const patterns = [
      // Product names in various formats
      /<h[1-6][^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<\/h[1-6]>/gi,
      /<h[1-6][^>]*class="[^"]*name[^"]*"[^>]*>([^<]+)<\/h[1-6]>/gi,
      /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi, // Fallback for any heading
      
      // Prices
      /<span[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/span>/gi,
      /<div[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/div>/gi,
      /<span[^>]*>(\$[0-9,]+\.?[0-9]*)<\/span>/gi, // Fallback for price patterns
      
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
        }).filter(name => name.length > 0 && name.length < 200) // Filter out extremely long names
        if (names.length > 0) break
      }
    }

    // Extract prices
    for (const pattern of patterns.slice(3, 6)) {
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
    for (const pattern of patterns.slice(6)) {
      const matches = html.match(pattern)
      if (matches) {
        brands = matches.map(match => {
          const brandMatch = match.match(/>([^<]+)</)
          return brandMatch ? brandMatch[1].trim() : ''
        }).filter(brand => brand.length > 0 && brand.length < 100)
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
      // Return a CSV explaining the situation
      const csvContent = `Status,Message,Details,HTML Preview
No Data,Page Accessed But No Offers Found,The page was successfully loaded but no cigar offers could be extracted,${html.substring(0, 200).replace(/"/g, '""')}...
Possible Causes,Page Structure Changed,The website may have updated their HTML structure,Check if the page layout has changed
Alternative,Manual Review,Consider manually reviewing the page content,The HTML was received but parsing patterns need updating`

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="parsing-results.csv"',
        },
      })
    }

    // Generate CSV content manually
    const csvHeaders = ['Name', 'Brand', 'Price', 'Original Price', 'Discount', 'Rating', 'Review Count', 'Image URL', 'Product URL']
    const csvRows = cigarOffers.map(offer => [
      `"${offer.name.replace(/"/g, '""')}"`,
      `"${offer.brand.replace(/"/g, '""')}"`,
      `"${offer.price.replace(/"/g, '""')}"`,
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
    
    // Return error information as CSV
    const csvContent = `Status,Error,Details,Timestamp
Error,Scraping Failed,${error instanceof Error ? error.message : 'Unknown error'},${new Date().toISOString()}
Recommendation,Check Logs,Review server logs for detailed error information,Contact support if the issue persists`

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="error-report.csv"',
      },
    })
  }
}
