export const formatHectometerDisplayName = (displayName: string) =>
  displayName.replace(
    /-(\d*)(\d)([a-z]?)$/i,
    (_match, whole, tenth, letter) => `-${whole || '0'}.${tenth}${letter}`
  )

export const isHectometerNotation = (value: string) =>
  /^\d+\.\d[a-z]?$/.test(value.toLocaleLowerCase('nl-NL'))

/** Checks the hectometer part of a complete PDOK display name. */
export const isValidHectometerDisplayName = (displayName: string) => {
  const formattedDisplayName = formatHectometerDisplayName(displayName)
  const hectometerNumber = formattedDisplayName.match(/-([^-]+)$/)?.[1]

  return Boolean(hectometerNumber && isHectometerNotation(hectometerNumber))
}
