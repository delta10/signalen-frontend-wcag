const TEMPLATE_REGEX = /\{\{.+?\}\}/g

export function isTemplateString(template: string): boolean {
  if (!template) {
    return false
  }

  return (template.match(TEMPLATE_REGEX) || []).length > 0
}

export function parseTemplateString(template: string, context: any): string {
  if (!context || typeof context !== 'object') {
    return template
  }

  return template.replace(TEMPLATE_REGEX, (match: string) => {
    const fallback = match
    const path = match.slice(2, match.length - 3).trim()

    if (!path) {
      return fallback
    }

    return String(
      path.split('.').reduce((res, key) => {
        if (res == null || typeof res !== 'object') {
          return fallback
        }
        return res[key] ?? fallback
      }, context)
    )
  })
}
