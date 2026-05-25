import { useEffect } from 'react'

const SITE_NAME = 'Token Tracer'
const DEFAULT_IMAGE = '/og-card.svg'

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Sets document title + Open Graph / Twitter Card tags for shareable audits.
 */
export default function PageMeta({
  title,
  description,
  path = '',
  image = DEFAULT_IMAGE,
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
    const origin = window.location.origin
    const url = `${origin}${path}`
    const imageUrl = image.startsWith('http') ? image : `${origin}${image}`

    document.title = fullTitle
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:image', imageUrl)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', imageUrl)
  }, [title, description, path, image])

  return null
}
