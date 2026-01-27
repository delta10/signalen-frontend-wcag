import { useState, useEffect, useMemo, useRef } from 'react'
import {
  MapLayerMouseEvent,
  MapRef,
  MarkerEvent,
  useMap,
  ViewState,
} from 'react-map-gl/maplibre'
import { useTranslations } from 'next-intl'
import { PublicQuestion } from '@/types/form'
import { debounce, uniqBy } from '@/lib/utils/utils'
import { useFormStore } from '@/store/form_store'
import { FeatureCollection } from 'geojson'
import { getNearestAddressByCoordinate } from '@/services/location/address'
import {
  formatAddressToSignalenInput,
  getMapStyleUrl,
  processFeature,
} from '@/lib/utils/map'
import { useFormContext } from 'react-hook-form'
import {
  getFirstFeatureOrCurrentAddress,
  getNewSelectedAddress,
} from '@/lib/utils/address'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useWindowSize } from 'usehooks-ts'
import { useConfig } from '@/contexts/ConfigContext'
import { generateFeatureId } from '@/lib/utils/features'
import { ExtendedFeature } from '@/types/map'
import { point as turfPoint } from '@turf/helpers'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import type { Feature } from 'geojson'

function useMapDialog(
  onMapReady: ((map: MapRef) => void) | undefined,
  field?: PublicQuestion | undefined,
  features?: FeatureCollection | null | undefined,
  isAssetSelect?: boolean | undefined
) {
  const { dialogMap } = useMap()
  const config = useConfig()
  const { formState, updateForm } = useFormStore()
  const { setValue } = useFormContext()
  const { isDarkMode } = useDarkMode()
  const { width = 0 } = useWindowSize()
  const dialogRef = useRef<HTMLDialogElement>(null)

  const [marker, setMarker] = useState<[number, number] | []>([])
  const [isMapSelected, setIsMapSelected] = useState<boolean | null>(null)
  const [mapFeatures, setMapFeatures] = useState<FeatureCollection | null>()
  const [focusedItemId, setFocusedItemId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openLegend, setOpenLegend] = useState<boolean>(false)

  const t = useTranslations('describe_add.map')

  const getInitialZoomLevel = () => {
    // Check if there is either an address selecter or point on the map.
    if (
      formState.address ||
      (formState.coordinates[0] !== 0 && formState.coordinates[1] !== 0)
    ) {
      return config.base.map.minimal_zoom || 17
    }

    return config.base.map.default_zoom || 12
  }

  const [viewState, setViewState] = useState<ViewState>({
    latitude:
      formState.coordinates[0] === 0
        ? config.base.map.center[0]
        : formState.coordinates[0],
    longitude:
      formState.coordinates[1] === 0
        ? config.base.map.center[1]
        : formState.coordinates[1],
    zoom: getInitialZoomLevel(),
    bearing: 0,
    padding: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    pitch: 0,
  })

  // Change marker position on formState.coordinates change
  useEffect(() => {
    setMarker([formState.coordinates[0], formState.coordinates[1]])
  }, [formState.coordinates])

  // Set dialog map in parent component
  useEffect(() => {
    if (dialogMap && onMapReady) {
      onMapReady(dialogMap)
    }
  }, [dialogMap, onMapReady])

  // Set new map features with ID
  useEffect(() => {
    const start = performance.now()

    if (features && field) {
      const featuresWithId = features.features
        .map((feature) => {
          const preprocessFeature = processFeature(
            field.meta.featureTypes,
            feature.properties
          )

          if (!preprocessFeature) {
            return null
          }

          return {
            ...feature,
            // @ts-ignore
            id: preprocessFeature.id,
            description: preprocessFeature.description,
            label: preprocessFeature.label,
            internal_id: generateFeatureId(feature),
            properties: {
              ...feature.properties,
              iconUrl: preprocessFeature.iconUrl,
            },
          }
        })
        .filter(Boolean)

      // @ts-ignore
      setMapFeatures({ ...features, features: featuresWithId })
      const end = performance.now()
    }
  }, [features, field])

  const keyDownHandler = async (event: any) => {
    if (event.key === 'Enter' || event.key === ' ') {
      const coordinates = dialogMap?.getCenter()
      if (coordinates) {
        updatePosition(coordinates.lat, coordinates.lng)
        setIsMapSelected(true)
        const address = await getNewSelectedAddress(
          coordinates.lat,
          coordinates.lng,
          config
        )

        updateForm({
          ...formState,
          address: address,
        })
      }
    }
  }

  useEffect(() => {
    const element = document.getElementsByClassName('maplibregl-canvas')
    const canvas = element[1]
    const debouncedHandler = debounce(keyDownHandler, 500)

    // Create a reference to the wrapped handler function
    const eventHandler = (e: KeyboardEvent) => debouncedHandler(e)

    // @ts-ignore
    canvas?.addEventListener('keydown', eventHandler)

    // Cleanup using the same function reference
    return () => {
      // @ts-ignore
      canvas?.removeEventListener('keydown', eventHandler)
    }
  }, [dialogMap, keyDownHandler, onMapReady])

  // Update position, flyTo position, after this set the marker position
  const updatePosition = (lat: number, lng: number) => {
    if (dialogMap) {
      dialogMap.flyTo({
        center: [lng, lat],
        zoom: Math.max(config.base.map.minimal_zoom || 17, dialogMap.getZoom()),
      })
    }

    setMarker([lat, lng])
  }

  const objectDisplayName = useMemo(
    () => ({
      singular: field?.meta.language.objectTypeSingular || t('object'),
      plural: field?.meta.language.objectTypePlural || t('objects'),
    }),
    [field?.meta.language, t]
  )

  // memoize list of features to show in left sidebar
  const featureList = useMemo(() => {
    if (dialogMap) {
      const mapFeaturesToShow = mapFeatures ? mapFeatures.features : []

      const features =
        dialogMap?.getZoom() >= config.base.map.minimal_zoom
          ? mapFeaturesToShow
          : []

      return uniqBy([...features, ...formState.selectedFeatures], 'internal_id')
    }

    return []
  }, [dialogMap, formState, mapFeatures])

  // Handle click on feature marker, set selectedFeatures and show error if maxNumberOfAssets is reached
  const handleFeatureMarkerClick = async (
    event: MarkerEvent,
    feature: ExtendedFeature
  ) => {
    // @ts-ignore
    event.originalEvent?.stopPropagation()
    // @ts-ignore
    const featureId = feature.internal_id as number
    const maxNumberOfAssets = field?.meta.maxNumberOfAssets || 1

    if (dialogMap && featureId) {
      const newSelectedFeatureArray = Array.from(
        formState.selectedFeatures ? formState.selectedFeatures : []
      )

      const index = newSelectedFeatureArray.findIndex(
        (feature: ExtendedFeature) => feature.internal_id === featureId
      )

      if (index !== -1) {
        newSelectedFeatureArray.splice(index, 1) // Remove the feature at the found index
      } else {
        if (newSelectedFeatureArray.length >= maxNumberOfAssets) {
          setError(t('max_number_of_assets_error', { max: maxNumberOfAssets }))
          dialogRef.current?.showModal()

          return
        }

        newSelectedFeatureArray.push(feature)
      }

      const address = await getFirstFeatureOrCurrentAddress(
        // @ts-ignore
        feature.geometry.coordinates[1],
        // @ts-ignore
        feature.geometry.coordinates[0],
        newSelectedFeatureArray,
        config,
        formState
      )

      updateForm({
        ...formState,
        selectedFeatures: newSelectedFeatureArray,
        address: address,
      })

      setIsMapSelected(false)
      setMarker([
        // @ts-ignore
        feature.geometry.coordinates[1],
        // @ts-ignore
        feature.geometry.coordinates[0],
      ])
    }
  }

  const assetSelectFeatureLabel =
    isAssetSelect && field ? field.meta.language.title || field.meta.label : ''

  // Close map dialog, if isAssetSelect is not set only update formStore with new coordinates. Otherwise update field with type isAssetSelect with feature answers
  const closeMapDialog = async () => {
    updateForm({ ...formState, coordinates: marker })
    if (isAssetSelect && field) {
      const formValues = await Promise.all(
        formState.selectedFeatures.map(async (feature) => {
          const address = await getNearestAddressByCoordinate(
            // @ts-ignore
            feature.geometry.coordinates[1],
            // @ts-ignore
            feature.geometry.coordinates[0],
            config ? config.base.map.find_address_in_distance : 30,
            config?.pdokUrlApi
          )
          return {
            address: {
              ...formatAddressToSignalenInput(
                address ? address.weergavenaam : ''
              ),
            },
            id: feature.id?.toString(),
            coordinates: {
              // @ts-ignore
              lat: feature.geometry.coordinates[1],
              // @ts-ignore
              lng: feature.geometry.coordinates[0],
            },
            // @ts-ignore
            description: feature.description,
            // @ts-ignore
            label: feature.label,
            type: 'Feature',
          }
        })
      )
      setValue(field.key, formValues)
    }
  }

  // Source ids
  const OUT_OF_BOUNDS_SOURCE_ID = 'out-of-bounds-source'
  const OUT_OF_BOUNDS_LINE_ID = 'restricted-corridor-line'
  const OUT_OF_BOUNDS_FILL_ID = 'out-of-bounds-area'

  // Optional: extra line layer (vaak niet nodig, maar kan)
  const outOfBoundsLineStyle: any = {
    id: OUT_OF_BOUNDS_LINE_ID,
    type: 'line',
    source: OUT_OF_BOUNDS_SOURCE_ID,
    'source-layer': config.maptilerOutOfBoundsLayerId,
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 16, 3],
      'line-opacity': 0.9,
    },
  }

  // Mask fill (alles buiten corridor)
  const outOfBoundsFillStyle: any = {
    id: OUT_OF_BOUNDS_SOURCE_ID,
    type: 'fill',
    source: OUT_OF_BOUNDS_FILL_ID,
    'source-layer': config.maptilerOutOfBoundsLayerId,
    paint: {
      'fill-color': '#858383',
      'fill-opacity': 0.6,
    },
  }

  const isPointInsideRestrictedArea = (lng: number, lat: number): boolean => {
    if (!dialogMap) return false

    const point = turfPoint([lng, lat])

    // TODO: Add constant for 'out-of-bounds-area' source
    const sourceFeatures = dialogMap.querySourceFeatures(
      OUT_OF_BOUNDS_SOURCE_ID,
      {
        sourceLayer: config.maptilerOutOfBoundsLayerId,
      }
    )

    return sourceFeatures.some((feature) => {
      if (feature.type !== 'Feature' || !feature.geometry) {
        return false
      }

      const { type } = feature.geometry
      const isPolygonType = type === 'Polygon' || type === 'MultiPolygon'

      return isPolygonType && !booleanPointInPolygon(point, feature as any)
    })
  }

  // Handle click on map, setIsMapSelected to true
  const handleMapClick = async (event: MapLayerMouseEvent) => {
    const { lng, lat } = event.lngLat

    // todo: zorgen dat dit alleen gedaan wordt wanneer er een gebied opgegeven is
    if (
      config.restrictSelectionArea &&
      !isPointInsideRestrictedArea(lng, lat)
    ) {
      setError(t('please_choose_a_point_on_a_road'))
      dialogRef.current?.showModal?.()
      return
    }

    updatePosition(lat, lng)
    setIsMapSelected(true)
    const address = await getNewSelectedAddress(lat, lng, config)

    updateForm({
      ...formState,
      address: address,
    })
  }

  const mapStyle = getMapStyleUrl(isDarkMode)

  return {
    dialogMap,
    dialogRef,
    config,
    viewState,
    setViewState,
    marker,
    updatePosition,
    isMapSelected,
    setIsMapSelected,
    objectDisplayName,
    featureList,
    assetSelectFeatureLabel,
    focusedItemId,
    setFocusedItemId,
    closeMapDialog,
    handleMapClick,
    mapStyle,
    width,
    mapFeatures,
    setMapFeatures,
    error,
    setError,
    handleFeatureMarkerClick,
    openLegend,
    setOpenLegend,
    outOfBoundsLineStyle,
    outOfBoundsFillStyle,
    OUT_OF_BOUNDS_SOURCE_ID,
  }
}

export default useMapDialog
