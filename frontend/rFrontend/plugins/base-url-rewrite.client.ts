export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  const { app } = useRuntimeConfig()
  const rawBase = app.baseURL || '/'
  if (rawBase === '/') return

  const normalizedBase = `/${rawBase.replace(/^\/+|\/+$/g, '')}/`

  const shouldRewrite = (value: string) => {
    if (!value || !value.startsWith('/')) return false
    if (value.startsWith('//')) return false
    if (value.startsWith(normalizedBase)) return false
    if (value.startsWith('/_nuxt/')) return false
    if (value.startsWith('/__nuxt_error')) return false
    return true
  }

  const toBasePath = (value: string) => {
    if (!shouldRewrite(value)) return value
    return `${normalizedBase}${value.replace(/^\/+/, '')}`
  }

  const rewriteSrcSet = (value: string) =>
    value
      .split(',')
      .map((item) => {
        const trimmed = item.trim()
        if (!trimmed) return trimmed
        const parts = trimmed.split(/\s+/)
        parts[0] = toBasePath(parts[0])
        return parts.join(' ')
      })
      .join(', ')

  const rewriteStyleUrls = (value: string) =>
    value.replace(/url\((['"]?)(\/[^'")]+)\1\)/g, (_all, quote: string, path: string) => {
      const next = toBasePath(path)
      return `url(${quote}${next}${quote})`
    })

  const attrNames = ['src', 'href', 'poster', 'data-src', 'action'] as const

  const rewriteElement = (el: Element) => {
    for (const attr of attrNames) {
      const raw = el.getAttribute(attr)
      if (!raw) continue
      const next = toBasePath(raw)
      if (next !== raw) el.setAttribute(attr, next)
    }

    const srcSet = el.getAttribute('srcset')
    if (srcSet) {
      const next = rewriteSrcSet(srcSet)
      if (next !== srcSet) el.setAttribute('srcset', next)
    }

    const style = el.getAttribute('style')
    if (style && style.includes('url(')) {
      const next = rewriteStyleUrls(style)
      if (next !== style) el.setAttribute('style', next)
    }
  }

  const rewriteTree = (root: ParentNode) => {
    if (root instanceof Element) rewriteElement(root)
    root
      .querySelectorAll('[src], [href], [poster], [data-src], [action], [srcset], [style*="url("]')
      .forEach(rewriteElement)
  }

  rewriteTree(document)

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.target instanceof Element) {
        rewriteElement(mutation.target)
        continue
      }
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) rewriteTree(node)
      })
    }
  })

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'href', 'poster', 'data-src', 'action', 'srcset', 'style'],
  })
})
