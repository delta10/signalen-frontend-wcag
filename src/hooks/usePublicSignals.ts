import { useEffect, useMemo, useState } from 'react'
import type { Feature, Point } from 'geojson'
import type { MapRef } from 'react-map-gl/maplibre'
import { useConfig } from '@/contexts/ConfigContext'
import { createSignalsClient } from '@/services/client/api-client'
import type { CancelablePromise, SignalsClient } from '@/services/client'
import type { ParentCategory } from '@/types/category'

type PublicSignalsResponse = Awaited<
  ReturnType<SignalsClient['v1']['v1PublicSignalsGeographyRetrieve']>
>
type ApiSignal = NonNullable<PublicSignalsResponse['features']>[number]
type SignalFeature = Feature<
  Point,
  {
    category: {
      name: string
      slug?: string
      parent?: { name?: string; slug?: string }
    }
    created_at?: string
  }
>

export type PublicSignal = SignalFeature & { internal_id: string }

type PublicSignalsFilter = {
  mainCategory: string
  subCategory: string
}

type PublicSignalsResult = {
  queryKey: string
  signals: PublicSignal[]
  loadError: boolean
}

const hasLocation = (signal: ApiSignal): signal is SignalFeature =>
  signal.type === 'Feature' &&
  signal.geometry?.type === 'Point' &&
  signal.geometry.coordinates?.length === 2 &&
  signal.geometry.coordinates.every(Number.isFinite) &&
  Boolean(signal.properties?.category?.name)

const signalKey = (signal: SignalFeature) =>
  JSON.stringify([
    signal.geometry.coordinates,
    signal.properties.category.parent?.slug,
    signal.properties.category.slug,
    signal.properties.created_at,
  ])

export const usePublicSignals = (
  map: MapRef | undefined,
  filter?: PublicSignalsFilter
) => {
  const config = useConfig()
  const mainCategory = filter?.mainCategory
  const subCategory = filter?.subCategory
  const enabled = !filter || Boolean(mainCategory && subCategory)
  const queryKey = JSON.stringify([
    config.baseUrlApi,
    mainCategory,
    subCategory,
  ])
  const [result, setResult] = useState<PublicSignalsResult | null>(null)
  const [categories, setCategories] = useState<ParentCategory[]>([])
  const client = useMemo(
    () => createSignalsClient(config.baseUrlApi),
    [config.baseUrlApi]
  )

  useEffect(() => {
    let active = true
    const request = client.v1.v1PublicTermsCategoriesList()
    request
      .then((response) => {
        if (active) {
          // The generated client does not describe nested categories correctly.
          const parents = (response.results ??
            []) as unknown as ParentCategory[]
          setCategories(
            parents.filter((category) => category.is_public_accessible)
          )
        }
      })
      .catch(() => {
        // Reports remain usable with the fallback icon if category icons fail.
      })
    return () => {
      active = false
      request.cancel()
    }
  }, [client])

  useEffect(() => {
    if (!map || !enabled) return

    let active = true
    let latestRequest = 0
    let lastBbox: string | undefined
    let request: CancelablePromise<PublicSignalsResponse> | undefined
    const loadSignals = async () => {
      const bounds = map.getBounds()
      if (!bounds) return
      const bbox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ].join(',')
      if (bbox === lastBbox) return
      lastBbox = bbox
      const requestId = ++latestRequest
      request?.cancel()
      request =
        mainCategory && subCategory
          ? client.v1.v1PublicSignalsGeographyRetrieve(
              bbox,
              [subCategory],
              undefined,
              undefined,
              [mainCategory]
            )
          : client.v1.v1PublicSignalsGeographyRetrieve(bbox)

      try {
        const response = await request
        if (!active || requestId !== latestRequest) return
        const locatedSignals = (response.features ?? [])
          .filter(hasLocation)
          .filter(
            (signal) =>
              (!mainCategory ||
                signal.properties.category.parent?.slug === mainCategory) &&
              (!subCategory || signal.properties.category.slug === subCategory)
          )
        const uniqueSignals = new Map(
          locatedSignals.map((signal) => {
            const internal_id = signalKey(signal)
            return [internal_id, { ...signal, internal_id }]
          })
        )
        setResult({
          queryKey,
          signals: [...uniqueSignals.values()],
          loadError: false,
        })
      } catch {
        if (!active || requestId !== latestRequest) return
        // Allow retrying the same bounds after a failed request.
        lastBbox = undefined
        setResult({ queryKey, signals: [], loadError: true })
      }
    }

    map.on('load', loadSignals)
    map.on('moveend', loadSignals)
    // Also fetch when a map has already loaded before this hook mounts.
    loadSignals()

    return () => {
      active = false
      map.off('load', loadSignals)
      map.off('moveend', loadSignals)
      request?.cancel()
    }
  }, [map, client, mainCategory, subCategory, enabled, queryKey])

  // Never show the previous category while its replacement is loading.
  const currentResult = enabled && result?.queryKey === queryKey ? result : null
  return {
    signals: currentResult?.signals ?? [],
    categories,
    loadError: currentResult?.loadError ?? false,
  }
}
