const NAMED_HTML_ENTITIES: Record<string, string> = {
  '&shy;': '\u00AD',
  '&nbsp;': '\u00A0',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&ndash;': '\u2013',
  '&mdash;': '\u2014',
  '&hellip;': '\u2026',
  '&rsquo;': '\u2019',
  '&lsquo;': '\u2018',
  '&rdquo;': '\u201D',
  '&ldquo;': '\u201C',
}

export function preventWidows(text: string): string {
  const trailingWhitespace = text.match(/\s*$/)?.[0] ?? ''
  const trimmed = text.trimEnd()
  const words = trimmed.split(/\s+/)

  if (words.length < 2) {
    return text
  }

  const leading = words.slice(0, -2).join(' ')
  const lastTwo = words.slice(-2).join('\u00A0')

  return `${leading ? `${leading} ` : ''}${lastTwo}${trailingWhitespace}`
}

export function decodeHtmlEntities(text: string): string {
  return text.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (entity) => {
    if (entity.startsWith('&#x') || entity.startsWith('&#X')) {
      const codePoint = parseInt(entity.slice(3, -1), 16)
      return Number.isNaN(codePoint) ? entity : String.fromCodePoint(codePoint)
    }

    if (entity.startsWith('&#')) {
      const codePoint = parseInt(entity.slice(2, -1), 10)
      return Number.isNaN(codePoint) ? entity : String.fromCodePoint(codePoint)
    }

    return NAMED_HTML_ENTITIES[entity] ?? entity
  })
}
