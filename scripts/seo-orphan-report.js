#!/usr/bin/env node
/**
 * Compares sitemap URLs against internal links found in key layout components.
 * Usage: node scripts/seo-orphan-report.js [baseUrl]
 * Example: node scripts/seo-orphan-report.js http://localhost:3003
 */

const fs = require('fs')
const path = require('path')

const BASE_URL = (process.argv[2] || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3003').replace(
  /\/+$/,
  '',
)

const ROOT = path.resolve(__dirname, '..')
const SCAN_DIRS = [
  path.join(ROOT, 'src/components/common'),
  path.join(ROOT, 'src/components/revamp'),
  path.join(ROOT, 'src/layout'),
  path.join(ROOT, 'src/v2'),
  path.join(ROOT, 'resources/src/components'),
  path.join(ROOT, 'resources/src/layout'),
]

const HREF_PATTERNS = [
  /href=["'{]([^"'{}]+)["'}]/g,
  /href=\{[`'"]([^`'"{}]+)[`'"]\}/g,
]

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walkFiles(full, acc)
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) acc.push(full)
  }
  return acc
}

function normalizePath(url) {
  if (!url || url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:')) {
    return null
  }
  const withoutQuery = url.split('?')[0].split('#')[0]
  if (!withoutQuery || withoutQuery === '#' || withoutQuery.startsWith('${')) return null
  let p = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`
  if (p.length > 1) p = p.replace(/\/+$/, '')
  return p
}

function extractInternalLinksFromSource(source) {
  const links = new Set()
  for (const pattern of HREF_PATTERNS) {
    let match
    while ((match = pattern.exec(source)) !== null) {
      const normalized = normalizePath(match[1])
      if (normalized) links.add(normalized)
    }
  }
  return links
}

async function fetchText(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} -> ${res.status}`)
  return res.text()
}

function extractLocUrls(xml) {
  const urls = []
  const re = /<loc>([^<]+)<\/loc>/g
  let match
  while ((match = re.exec(xml)) !== null) {
    try {
      const pathname = new URL(match[1]).pathname.replace(/\/+$/, '') || '/'
      urls.push(pathname)
    } catch {
      // skip invalid
    }
  }
  return urls
}

async function main() {
  const internalLinks = new Set(['/'])

  for (const dir of SCAN_DIRS) {
    for (const file of walkFiles(dir)) {
      const source = fs.readFileSync(file, 'utf8')
      for (const link of extractInternalLinksFromSource(source)) {
        internalLinks.add(link)
      }
    }
  }

  const sitemapUrls = [
    `${BASE_URL}/sitemap-en-US.xml`,
    `${BASE_URL}/sitemap-en-GB.xml`,
    `${BASE_URL}/sitemap-en-AU.xml`,
    `${BASE_URL}/sitemap-resources-en-US.xml`,
    `${BASE_URL}/sitemap-resources-en-GB.xml`,
    `${BASE_URL}/sitemap-resources-en-AU.xml`,
  ]

  const sitemapPaths = new Set()
  for (const sitemapUrl of sitemapUrls) {
    try {
      const xml = await fetchText(sitemapUrl)
      for (const p of extractLocUrls(xml)) sitemapPaths.add(p)
      console.log(`Fetched ${sitemapUrl} (${extractLocUrls(xml).length} URLs)`)
    } catch (err) {
      console.warn(`Could not fetch ${sitemapUrl}: ${err.message}`)
    }
  }

  const orphans = [...sitemapPaths]
    .filter((p) => {
      if (p === '/') return false
      return ![...internalLinks].some((link) => p === link || p.startsWith(`${link}/`))
    })
    .sort()

  console.log('\n--- SEO Orphan Report ---')
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Sitemap URLs scanned: ${sitemapPaths.size}`)
  console.log(`Internal link paths from source scan: ${internalLinks.size}`)
  console.log(`Potential orphans (in sitemap, weak static inlink signal): ${orphans.length}\n`)

  if (orphans.length) {
    orphans.slice(0, 100).forEach((p) => console.log(p))
    if (orphans.length > 100) {
      console.log(`... and ${orphans.length - 100} more`)
    }
  } else {
    console.log('No orphans detected by static scan.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
