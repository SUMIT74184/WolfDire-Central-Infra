import DOMPurify from 'isomorphic-dompurify'

// Sanitizes user-generated rich-text HTML before rendering with dangerouslySetInnerHTML.
// Strips scripts, event handlers (onerror, onclick...) and javascript: URLs.
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return ''
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
}
