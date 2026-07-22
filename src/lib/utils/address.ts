import {
  getNearestAddressByCoordinate,
  getNearestHectometerPostByCoordinate,
} from '@/services/location/address'
import { Feature, GeoJsonProperties, Geometry } from 'geojson'
import { AppConfig } from '@/types/config'
import { FormStoreState } from '@/types/stores'

export const getNewSelectedAddress = async (
  lat: number,
  lng: number,
  config: AppConfig | null
) => {
  const findAddressInDistance = config
    ? config.base.map.find_address_in_distance
    : 30

  const hectometerPost = config?.base.pdok_hectometer_suggest?.enabled
    ? await getNearestHectometerPostByCoordinate(
        lat,
        lng,
        findAddressInDistance,
        config.pdokUrlApi
      )
    : null

  if (hectometerPost) {
    return {
      coordinates: [lng, lat],
      id: hectometerPost.id,
      postcode: '',
      huisnummer: '',
      woonplaats: '',
      openbare_ruimte: hectometerPost.weergavenaam,
      weergave_naam: hectometerPost.weergavenaam,
    }
  }

  const address = await getNearestAddressByCoordinate(
    lat,
    lng,
    findAddressInDistance,
    config?.pdokUrlApi
  )

  return address
    ? {
        coordinates: [lng, lat],
        id: address.id,
        postcode: address.postcode,
        huisnummer: address.huis_nlt,
        woonplaats: address.woonplaatsnaam,
        openbare_ruimte: address.straatnaam,
        weergave_naam: address.weergavenaam,
      }
    : null
}

export const getFirstFeatureOrCurrentAddress = async (
  lat: number,
  lng: number,
  newSelectedFeatureArray: Feature<Geometry, GeoJsonProperties>[],
  config: AppConfig | null,
  formState: FormStoreState
) => {
  let address = null
  // When no features selected select first available from selected feature array
  if (
    formState.selectedFeatures?.length === 0 &&
    newSelectedFeatureArray.length > 0
  ) {
    address = await getNewSelectedAddress(lat, lng, config)
  } else if (formState.address) {
    address = formState.address
  }

  return address
}
