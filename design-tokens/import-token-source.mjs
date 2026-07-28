const isObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const cloneJson = (value) => JSON.parse(JSON.stringify(value))

const mergeDeep = (target, source) => {
  for (const [key, value] of Object.entries(source ?? {})) {
    if (isObject(value) && isObject(target[key]) && !('$value' in value)) {
      mergeDeep(target[key], value)
    } else {
      target[key] = cloneJson(value)
    }
  }

  return target
}

const flattenTokens = (value, prefix = '', result = {}) => {
  for (const [key, child] of Object.entries(value ?? {})) {
    const tokenPath = prefix ? `${prefix}.${key}` : key

    if (isObject(child) && '$value' in child) {
      result[tokenPath] = {
        type: child.$type,
        value: child.$value,
      }
    } else if (isObject(child)) {
      flattenTokens(child, tokenPath, result)
    }
  }

  return result
}

const getByDotPath = (value, tokenPath) =>
  tokenPath.split('.').reduce((node, key) => node?.[key], value)

const hasByDotPath = (value, tokenPath) =>
  getByDotPath(value, tokenPath) !== undefined

const normalizeValue = (value, type) => {
  if (type === 'fontWeights') {
    const weights = {
      Regular: 400,
      Medium: 500,
      SemiBold: 600,
      Bold: 700,
    }

    return weights[value] ?? value
  }

  if (type === 'fontFamilies' && typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
  }

  return value
}

const resolveSourceReferences = ({
  value,
  type,
  sourceTokens,
  baseTokens,
  stack = [],
}) => {
  if (Array.isArray(value)) {
    return value.map((item) =>
      resolveSourceReferences({
        value: item,
        type,
        sourceTokens,
        baseTokens,
        stack,
      })
    )
  }

  if (isObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        resolveSourceReferences({
          value: child,
          type,
          sourceTokens,
          baseTokens,
          stack,
        }),
      ])
    )
  }

  if (typeof value !== 'string') return value

  const exactReference = value.match(/^\{([^}]+)\}$/)
  if (!exactReference) return normalizeValue(value, type)

  const reference = exactReference[1]
  if (hasByDotPath(baseTokens, reference)) return value

  if (stack.includes(reference)) {
    throw new Error(
      `Circulaire tokenreferentie in bronbestand: ${[...stack, reference].join(
        ' -> '
      )}`
    )
  }

  const referencedToken = sourceTokens[reference]
  if (!referencedToken) {
    throw new Error(
      `Onopgeloste tokenreferentie in bronbestand: "${reference}".`
    )
  }

  return resolveSourceReferences({
    value: referencedToken.value,
    type: referencedToken.type,
    sourceTokens,
    baseTokens,
    stack: [...stack, reference],
  })
}

const createUpdateMap = ({
  sourceTokens,
  referenceTokens,
  baseTokens,
  comparisonValues,
}) => {
  const updates = {}

  for (const [tokenPath, token] of Object.entries(sourceTokens)) {
    // The organization export can contain tokens that this application does not
    // consume. Only import paths supported by the application's base token set.
    if (!hasByDotPath(baseTokens, tokenPath)) continue

    const value = resolveSourceReferences({
      value: token.value,
      type: token.type,
      sourceTokens: referenceTokens,
      baseTokens,
    })

    if (JSON.stringify(value) !== JSON.stringify(comparisonValues[tokenPath])) {
      updates[tokenPath] = value
    }
  }

  return updates
}

export const createImportedTokenUpdates = (source, baseTokens) => {
  const tokenSetOrder = source?.$metadata?.tokenSetOrder
  if (!Array.isArray(tokenSetOrder)) {
    throw new Error(
      'Tokenbron moet $metadata.tokenSetOrder uit de Theme Wizard-export bevatten.'
    )
  }

  const lightTree = {}
  const darkTree = {}

  for (const tokenSetName of tokenSetOrder) {
    const tokenSet = source[tokenSetName]
    if (!isObject(tokenSet)) {
      throw new Error(`Tokenset "${tokenSetName}" ontbreekt in tokenbron.`)
    }

    if (tokenSetName.startsWith('color-scheme-dark/')) {
      mergeDeep(darkTree, tokenSet)
    } else {
      mergeDeep(lightTree, tokenSet)
    }
  }

  const lightSourceTokens = flattenTokens(lightTree)
  const darkSourceTokens = flattenTokens(darkTree)
  const baseValues = Object.fromEntries(
    Object.entries(flattenTokens(baseTokens)).map(([tokenPath, token]) => [
      tokenPath,
      token.value,
    ])
  )

  const light = createUpdateMap({
    sourceTokens: lightSourceTokens,
    referenceTokens: lightSourceTokens,
    baseTokens,
    comparisonValues: baseValues,
  })

  const dark = createUpdateMap({
    sourceTokens: darkSourceTokens,
    referenceTokens: { ...lightSourceTokens, ...darkSourceTokens },
    baseTokens,
    comparisonValues: { ...baseValues, ...light },
  })

  return { light, dark }
}
