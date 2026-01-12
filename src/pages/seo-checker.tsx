import { useState } from 'react'
import Head from 'next/head'

interface TagResult {
  name: string
  value: string
  status: 'present' | 'missing' | 'warning'
  category: string
  required: boolean
  isImage?: boolean
}

const REQUIRED_TAGS = [
  // Essential SEO
  { name: 'Title Tag', selector: 'title', attr: 'text', category: 'Essential SEO', required: true },
  { name: 'Meta Description', selector: 'meta[name="description"]', attr: 'content', category: 'Essential SEO', required: true },
  { name: 'Meta Title', selector: 'meta[name="title"]', attr: 'content', category: 'Essential SEO', required: false },
  { name: 'Keywords', selector: 'meta[name="keywords"]', attr: 'content', category: 'Essential SEO', required: false },
  { name: 'Canonical URL', selector: 'link[rel="canonical"]', attr: 'href', category: 'Essential SEO', required: true },
  { name: 'Meta Robots', selector: 'meta[name="robots"]', attr: 'content', category: 'Essential SEO', required: false },
  { name: 'Meta Author', selector: 'meta[name="author"]', attr: 'content', category: 'Essential SEO', required: false },
  
  // Open Graph
  { name: 'OG:Title', selector: 'meta[property="og:title"]', attr: 'content', category: 'Open Graph', required: true },
  { name: 'OG:Description', selector: 'meta[property="og:description"]', attr: 'content', category: 'Open Graph', required: true },
  { name: 'OG:Image', selector: 'meta[property="og:image"]', attr: 'content', category: 'Open Graph', required: true, isImage: true },
  { name: 'OG:Type', selector: 'meta[property="og:type"]', attr: 'content', category: 'Open Graph', required: false },
  { name: 'OG:URL', selector: 'meta[property="og:url"]', attr: 'content', category: 'Open Graph', required: false },
  
  // Twitter Cards
  { name: 'Twitter:Card', selector: 'meta[name="twitter:card"]', attr: 'content', category: 'Twitter Cards', required: false },
  { name: 'Twitter:Title', selector: 'meta[name="twitter:title"]', attr: 'content', category: 'Twitter Cards', required: false },
  { name: 'Twitter:Description', selector: 'meta[name="twitter:description"]', attr: 'content', category: 'Twitter Cards', required: false },
  { name: 'Twitter:Image', selector: 'meta[name="twitter:image"]', attr: 'content', category: 'Twitter Cards', required: false, isImage: true },
  
  // Technical SEO
  { name: 'Viewport', selector: 'meta[name="viewport"]', attr: 'content', category: 'Technical', required: true },
  { name: 'Charset', selector: 'meta[charset]', attr: 'charset', category: 'Technical', required: true },
  { name: 'Favicon', selector: 'link[rel="icon"]', attr: 'href', category: 'Technical', required: false },
  
  // Internationalization
  { name: 'Hreflang Tags', selector: 'link[hreflang]', attr: 'count', category: 'Internationalization', required: false },
  { name: 'X-Default', selector: 'link[hreflang="x-default"]', attr: 'href', category: 'Internationalization', required: false },
]

interface JsonLdData {
  type: string
  content: object
}

export default function SEOChecker() {
  const [url, setUrl] = useState('http://localhost:3000')
  const [results, setResults] = useState<TagResult[]>([])
  const [jsonLdData, setJsonLdData] = useState<JsonLdData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkedUrl, setCheckedUrl] = useState('')
  const [expandedJsonLd, setExpandedJsonLd] = useState<number[]>([])

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Phone System', path: '/phone-system' },
    { label: 'Features', path: '/phone-system/features' },
    { label: 'Who We Serve', path: '/who-we-serve' },
    { label: 'Dental', path: '/who-we-serve/dental' },
    { label: 'Company', path: '/company' },
  ]

  const setQuickUrl = (path: string) => {
    const baseUrl = url.split('/').slice(0, 3).join('/')
    setUrl(baseUrl + path)
  }

  const extractJsonLd = (doc: Document): JsonLdData[] => {
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]')
    const jsonLdItems: JsonLdData[] = []
    
    scripts.forEach((script) => {
      try {
        const content = JSON.parse(script.textContent || '{}')
        const type = content['@type'] || (Array.isArray(content) ? 'Array' : 'Unknown')
        jsonLdItems.push({ type, content })
      } catch (e) {
        jsonLdItems.push({ type: 'Parse Error', content: { error: 'Failed to parse JSON-LD' } })
      }
    })
    
    return jsonLdItems
  }

  const analyzeTags = (html: string): { tags: TagResult[], jsonLd: JsonLdData[] } => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    
    const tags = REQUIRED_TAGS.map(tag => {
      let value = ''
      let status: 'present' | 'missing' | 'warning' = 'missing'
      
      if (tag.attr === 'count') {
        const elements = doc.querySelectorAll(tag.selector)
        value = elements.length > 0 ? `${elements.length} tags found` : ''
        status = elements.length > 0 ? 'present' : (tag.required ? 'missing' : 'warning')
      } else if (tag.attr === 'text') {
        const element = doc.querySelector(tag.selector)
        value = element ? element.textContent?.trim() || '' : ''
        status = value ? 'present' : (tag.required ? 'missing' : 'warning')
      } else {
        const element = doc.querySelector(tag.selector)
        value = element ? element.getAttribute(tag.attr) || '' : ''
        status = value ? 'present' : (tag.required ? 'missing' : 'warning')
      }
      
      return {
        name: tag.name,
        value,
        status,
        category: tag.category,
        required: tag.required,
        isImage: tag.isImage
      }
    })

    const jsonLd = extractJsonLd(doc)
    
    return { tags, jsonLd }
  }

  const toggleJsonLd = (index: number) => {
    setExpandedJsonLd(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const checkSEO = async () => {
    if (!url) {
      setError('Please enter a URL')
      return
    }

    setLoading(true)
    setError('')
    setResults([])
    setJsonLdData([])
    setExpandedJsonLd([])

    try {
      const response = await fetch(`/api/fetch-page?url=${encodeURIComponent(url)}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const html = await response.text()
      const { tags, jsonLd } = analyzeTags(html)
      setResults(tags)
      setJsonLdData(jsonLd)
      setCheckedUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch page')
    } finally {
      setLoading(false)
    }
  }

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = []
    }
    acc[result.category].push(result)
    return acc
  }, {} as Record<string, TagResult[]>)

  const present = results.filter(r => r.status === 'present').length
  const missing = results.filter(r => r.status === 'missing').length
  const warnings = results.filter(r => r.status === 'warning').length

  return (
    <>
      <Head>
        <title>SEO Tag Checker</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: '#f5f5f5',
        minHeight: '100vh',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ color: '#333', marginBottom: '20px', fontSize: '24px' }}>
            🔍 SEO Tag Checker
          </h1>
          
          {/* Input Section */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkSEO()}
                placeholder="Paste URL here (e.g., http://localhost:3000/pricing)"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '2px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={checkSEO}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: loading ? '#ccc' : '#4a90d9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Checking...' : 'Check SEO Tags'}
              </button>
            </div>
            
            {/* Quick Links */}
            <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#666', marginRight: '8px' }}>Quick:</span>
              {quickLinks.map(link => (
                <span
                  key={link.path}
                  onClick={() => setQuickUrl(link.path)}
                  style={{
                    padding: '6px 12px',
                    background: '#e9ecef',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#495057',
                    cursor: 'pointer'
                  }}
                >
                  {link.label}
                </span>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #4a90d9',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 15px'
              }} />
              Fetching page and analyzing SEO tags...
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: '#f8d7da',
              color: '#721c24',
              padding: '15px 20px',
              borderRadius: '6px',
              marginTop: '20px'
            }}>
              <strong>Error:</strong> {error}
              <br /><br />
              <strong>Tips:</strong><br />
              • Make sure your dev server is running<br />
              • Check if the URL is correct and the page exists
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <div style={{
                background: '#f8f9fa',
                padding: '15px 20px',
                borderBottom: '1px solid #eee',
                fontWeight: 600,
                color: '#333'
              }}>
                Results for: {checkedUrl}
              </div>
              
              {/* Summary */}
              <div style={{
                display: 'flex',
                gap: '20px',
                padding: '15px 20px',
                background: '#f8f9fa',
                borderBottom: '1px solid #eee'
              }}>
                <span style={{ color: '#28a745' }}>✓ {present} Present</span>
                <span style={{ color: '#dc3545' }}>✗ {missing} Missing (Required)</span>
                <span style={{ color: '#ffc107' }}>⚠ {warnings} Optional Missing</span>
              </div>

              {/* Tags by Category */}
              {Object.entries(groupedResults).map(([category, tags]) => (
                <div key={category}>
                  <div style={{
                    background: '#e9ecef',
                    padding: '10px 20px',
                    fontWeight: 600,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#666'
                  }}>
                    {category}
                  </div>
                  
                  {tags.map((tag, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        padding: '15px 20px',
                        borderBottom: '1px solid #eee'
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px',
                        fontSize: '12px',
                        background: tag.status === 'present' ? '#d4edda' : tag.status === 'missing' ? '#f8d7da' : '#fff3cd',
                        color: tag.status === 'present' ? '#28a745' : tag.status === 'missing' ? '#dc3545' : '#856404'
                      }}>
                        {tag.status === 'present' ? '✓' : tag.status === 'missing' ? '✗' : '⚠'}
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: '#333', marginBottom: '4px', fontSize: '14px' }}>
                          {tag.name} {tag.required && <span style={{ color: '#dc3545' }}>*</span>}
                        </div>
                        <div style={{
                          color: tag.value ? '#666' : '#999',
                          fontSize: '13px',
                          wordBreak: 'break-all',
                          background: '#f8f9fa',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          marginTop: '8px',
                          fontStyle: tag.value ? 'normal' : 'italic'
                        }}>
                          {tag.value || 'Not found'}
                          {tag.isImage && tag.value && (
                            <>
                              <br />
                              <img 
                                src={tag.value} 
                                alt="Preview" 
                                style={{ maxWidth: '200px', maxHeight: '100px', marginTop: '8px', borderRadius: '4px' }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* JSON-LD Structured Data */}
          {results.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              marginTop: '20px'
            }}>
              <div style={{
                background: '#e9ecef',
                padding: '10px 20px',
                fontWeight: 600,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#666',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>📋 JSON-LD Structured Data</span>
                <span style={{
                  background: jsonLdData.length > 0 ? '#d4edda' : '#f8d7da',
                  color: jsonLdData.length > 0 ? '#28a745' : '#dc3545',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px'
                }}>
                  {jsonLdData.length > 0 ? `${jsonLdData.length} found` : 'Not found'}
                </span>
              </div>

              {jsonLdData.length === 0 ? (
                <div style={{
                  padding: '20px',
                  color: '#999',
                  fontStyle: 'italic',
                  textAlign: 'center'
                }}>
                  No JSON-LD structured data found on this page
                </div>
              ) : (
                jsonLdData.map((item, idx) => (
                  <div key={idx} style={{ borderBottom: idx < jsonLdData.length - 1 ? '1px solid #eee' : 'none' }}>
                    <div 
                      onClick={() => toggleJsonLd(idx)}
                      style={{
                        padding: '15px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        background: expandedJsonLd.includes(idx) ? '#f8f9fa' : 'white'
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px',
                        fontSize: '12px',
                        background: '#d4edda',
                        color: '#28a745'
                      }}>
                        ✓
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 600, color: '#333' }}>
                          @type: {item.type}
                        </span>
                      </div>
                      <span style={{ color: '#666', fontSize: '12px' }}>
                        {expandedJsonLd.includes(idx) ? '▼ Collapse' : '▶ Expand'}
                      </span>
                    </div>
                    
                    {expandedJsonLd.includes(idx) && (
                      <div style={{
                        padding: '0 20px 20px 59px',
                        background: '#f8f9fa'
                      }}>
                        <pre style={{
                          background: '#1e1e1e',
                          color: '#d4d4d4',
                          padding: '15px',
                          borderRadius: '6px',
                          overflow: 'auto',
                          maxHeight: '400px',
                          fontSize: '12px',
                          lineHeight: '1.5'
                        }}>
                          {JSON.stringify(item.content, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
