const isObject = (value) => value !== null && typeof value === 'object'

const cloneJson = (value) => JSON.parse(JSON.stringify(value))

const splitDotPath = (dotPath) => {
  if (typeof dotPath !== 'string' || dotPath.trim() === '') {
    throw new Error('Token update path must be a non-empty string.')
  }

  return dotPath.split('.').filter(Boolean)
}

const hasByDotPath = (target, dotPath) => {
  const pathSegments = splitDotPath(dotPath)
  let node = target

  for (const segment of pathSegments) {
    if (!isObject(node) || !(segment in node)) return false
    node = node[segment]
  }

  return true
}

const setByDotPath = (target, dotPath, value) => {
  const pathSegments = splitDotPath(dotPath)
  let node = target

  for (let index = 0; index < pathSegments.length - 1; index += 1) {
    const segment = pathSegments[index]
    if (!isObject(node) || !(segment in node)) {
      throw new Error(`Cannot set token update for unknown path "${dotPath}".`)
    }
    node = node[segment]
  }

  const leafKey = pathSegments[pathSegments.length - 1]
  if (!isObject(node) || !(leafKey in node)) {
    throw new Error(`Cannot set token update for unknown path "${dotPath}".`)
  }

  const currentLeaf = node[leafKey]
  if (isObject(currentLeaf) && '$value' in currentLeaf) {
    let nextValue = value
    if (Array.isArray(value) && currentLeaf.$type === 'fontFamily') {
      nextValue = value.map((item) => `"${item}"`).join(',')
    }

    currentLeaf.$value = nextValue
    if (isObject(currentLeaf.original) && '$value' in currentLeaf.original) {
      currentLeaf.original.$value = nextValue
    }
    return
  }

  node[leafKey] = value
}

const assertUpdateMap = (value, label) => {
  if (!isObject(value)) {
    throw new Error(
      `Organization tokens must provide an object for "${label}".`
    )
  }
}

const applyUpdatesMap = (targetTokens, updatesMap) => {
  for (const [dotPath, value] of Object.entries(updatesMap)) {
    if (!hasByDotPath(targetTokens, dotPath)) {
      throw new Error(`Unknown token update path "${dotPath}".`)
    }
    setByDotPath(targetTokens, dotPath, value)
  }
}

export const applyTokenUpdates = (baseTokens, updatePayload) => {
  if (!isObject(baseTokens)) {
    throw new Error('Base tokens must be a JSON object.')
  }

  if (!isObject(updatePayload)) {
    throw new Error(
      'Organization tokens must use the format: { "light": { ... }, "dark": { ... } }.'
    )
  }

  assertUpdateMap(updatePayload.light, 'light')

  const lightTokens = cloneJson(baseTokens)
  applyUpdatesMap(lightTokens, updatePayload.light)

  const darkTokens = cloneJson(lightTokens)
  if (isObject(updatePayload.dark)) {
    applyUpdatesMap(darkTokens, updatePayload.dark)
  }

  return {
    lightTokens,
    darkTokens,
  }
}
