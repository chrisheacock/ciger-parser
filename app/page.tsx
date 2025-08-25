'use client'

import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setStatus('')

    try {
      const response = await fetch('/api/scrape-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to scrape data')
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      
      // Determine filename based on response headers
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = 'cigar-offers.csv'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }
      
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)

      // Check what type of CSV was downloaded
      if (filename === 'scraping-status.csv') {
        setStatus('⚠️ Website blocked access - check the downloaded CSV for details and alternatives')
      } else if (filename === 'parsing-results.csv') {
        setStatus('⚠️ Page accessed but no cigar offers found - check the downloaded CSV for details')
      } else if (filename === 'error-report.csv') {
        setStatus('❌ Scraping failed - check the downloaded CSV for error details')
      } else {
        setStatus('✅ CSV downloaded successfully! Check the file for extracted cigar offers.')
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cigar Scraper
          </h1>
          <p className="text-gray-600 mb-8">
            Extract cigar offers from cigarpage.com and download as CSV
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Cigarpage.com URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.cigarpage.com/..."
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !url}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Scraping...' : 'Download CSV'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {status && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-600">{status}</p>
          </div>
        )}

        <div className="mt-8 space-y-4 text-sm text-gray-500">
          <div className="text-center">
            <p className="mb-2">Enter a cigarpage.com URL to extract cigar offers and download as a CSV file.</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <h3 className="font-medium text-yellow-800 mb-2">⚠️ Important Note</h3>
            <p className="text-yellow-700 text-xs">
              This tool may encounter access restrictions from cigarpage.com. If blocked, the downloaded CSV will contain helpful information about alternatives and solutions.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
            <h3 className="font-medium text-gray-800 mb-2">📋 What You'll Get</h3>
            <ul className="text-gray-700 text-xs space-y-1">
              <li>• <strong>cigar-offers.csv</strong> - Successfully extracted data</li>
              <li>• <strong>scraping-status.csv</strong> - Website blocking information</li>
              <li>• <strong>parsing-results.csv</strong> - Page structure analysis</li>
              <li>• <strong>error-report.csv</strong> - Technical error details</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
