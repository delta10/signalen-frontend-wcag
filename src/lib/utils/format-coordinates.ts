type CoordinatesTuple = [number, number]

export interface DegreeMinuteSecond {
  degree: number
  minute: number
  second: number
}

export interface DegreeMinuteSecondCoordinates {
  latitude: DegreeMinuteSecond & {
    north: boolean
    south: boolean
  }
  longitude: DegreeMinuteSecond & {
    east: boolean
    west: boolean
  }
}

/**
 * From: https://stackoverflow.com/posts/5786281
 */
export const degreeMinuteSecond = (d: number): DegreeMinuteSecond => {
  let degree = Math.abs(Math.floor(d)),
    minute = Math.abs(Math.floor(((d + 1e-9) % 1) * 60)),
    second = Math.abs(Math.floor(((((d + 1e-9) * 60) % 1) * 6000) / 100))

  return {
    degree,
    minute,
    second,
  }
}

export const coords2degreeMinuteSeconds = ([latitude, longitude]: [
  number,
  number,
]) => {
  return {
    latitude: {
      ...degreeMinuteSecond(latitude),
      north: latitude >= 0,
      south: latitude < 0,
    },
    longitude: {
      ...degreeMinuteSecond(longitude),
      east: longitude >= 0,
      west: longitude < 0,
    },
  }
}

export const coords2degreeMinuteSecondsFlat = (coords: [number, number]) => {
  const {
    latitude: {
      degree: latitudeDegree,
      minute: latitudeMinute,
      second: latitudeSecond,
      south,
      north,
    },
    longitude: {
      degree: longitudeDegree,
      minute: longitudeMinute,
      second: longitudeSecond,
      east,
      west,
    },
  } = coords2degreeMinuteSeconds(coords)

  return {
    latitudeDegree,
    latitudeMinute,
    latitudeSecond,
    longitudeDegree,
    longitudeMinute,
    longitudeSecond,
    north,
    south,
    east,
    west,
  }
}

export const isCoordinatesTuple = (arg: any): arg is CoordinatesTuple =>
  Array.isArray(arg) &&
  arg.length === 2 &&
  typeof arg[0] === 'number' &&
  typeof arg[1] === 'number'
