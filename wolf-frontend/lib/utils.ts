import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const HTML_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
}

// Converts rich-text post HTML into plain text, safe for excerpts/previews
export function htmlToText(html: string): string {
  if (!html) return ''
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>|<\/(p|div|li|h[1-6]|blockquote)>/gi, ' ')
    .replace(/<[^>]*>?/g, '')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
      if (e[0] === '#') {
        const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)
        return Number.isNaN(code) ? m : String.fromCodePoint(code)
      }
      return HTML_ENTITIES[e.toLowerCase()] ?? m
    })
    .replace(/\s+/g, ' ')
    .trim()
}

export function excerpt(html: string, length = 150): string {
  const text = htmlToText(html)
  return text.length > length ? text.substring(0, length).trimEnd() + '...' : text
}
