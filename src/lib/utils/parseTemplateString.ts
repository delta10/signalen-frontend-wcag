const TEMPLATE_REGEX = /\{\{.+?\}\}/g

/**
 * Checks if a string contains template placeholders in the format {{key}}.
 *
 * @param {string} template - The string to check for template placeholders
 * @returns {boolean} True if the string contains one or more template placeholders, false otherwise
 *
 * @example
 * isTemplateString("Straatverlichting {{ mastnummer }}!") // returns true
 * isTemplateString("Eik") // returns false
 * isTemplateString("") // returns false
 */
export function isTemplateString(template: string): boolean {
  if (!template) {
    return false
  }

  return (template.match(TEMPLATE_REGEX) || []).length > 0
}

/**
 * Replaces template placeholders in a string with values from a context object.
 * Supports nested object property access using dot notation (e.g., {{user.name}}).
 *
 * @param {string} template - The template string containing placeholders in {{key}} format
 * @param {any} context - The context object containing values to substitute into the template
 * @returns {string} The template string with placeholders replaced by context values
 *
 * @example
 * parseTemplateString("Straatverlichting {{mastnummer}}", { mastnummer: "123" })
 * // returns "Straatverlichting 123"
 */
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
