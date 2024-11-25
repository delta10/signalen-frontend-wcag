import { LocationMap } from '@/components/ui/LocationMap'
import { MapDialog } from '@/app/[locale]/incident/add/components/MapDialog'
import { PublicQuestion } from '@/types/form'
import { MapProvider } from 'react-map-gl/maplibre'
import { useFormContext } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import {
  Button,
  Paragraph,
  LinkButton,
  Fieldset,
  FieldsetLegend,
  FormField,
  Textbox,
  ListboxOptionProps,
  ButtonGroup,
} from '@/components/index'
import { useFormStore } from '@/store/form_store'
import {
  getNearestAddressByCoordinate,
  getSuggestedAddresses,
} from '@/services/location/address'
import { useConfig } from '@/hooks/useConfig'
import { isCoordinates } from '@/lib/utils/map'
import { useTranslations } from 'next-intl'
import { FormFieldErrorMessage } from '@/components'
import { getServerConfig } from '@/services/config/config'

export interface LocationSelectProps {
  field?: PublicQuestion
}

const normalizeQuery = (str: string) => str.trim().replace(/\s+/, ' ')

const parsePoint = (str: string): [number, number] | undefined => {
  const match = /POINT\((\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\)/i.exec(str)

  if (match) {
    return [parseFloat(match[1]), parseFloat(match[2])]
  }
}
export const LocationSelect = ({ field }: LocationSelectProps) => {
  const {
    formState: { errors },
  } = useFormContext()
  const errorMessage = errors['location']?.message as string
  const { formState: formStoreState, updateForm } = useFormStore()
  const [address, setAddress] = useState<string | null>(null)
  const { config } = useConfig()
  const t = useTranslations('describe-add.map')
  const [addressOptions, setAddressOptions] = useState<ListboxOptionProps[]>([])
  const [addressFilter, setAddressFilter] = useState('')

  const addressLookup = async (query: string) => {
    const municipality = (await getServerConfig())['base']['municipality']
    const normalizedQuery = normalizeQuery(query)

    setAddressOptions([])

    if (query.length >= 1) {
      console.log(normalizedQuery)
      const apiCall = await getSuggestedAddresses(normalizedQuery, municipality)

      console.log(apiCall.response.docs)
      // TODO: Prevent out-of-order responses showing up
      const options = apiCall.response.docs.map((item) => ({
        children: item.weergavenaam,
        value: item.weergavenaam,
        coordinates: parsePoint(item.centroide_ll),
      }))
      console.log('setAddressOptions', options)
      setAddressOptions(options)
    } else {
      console.log('no query')
    }
  }
  // TODO: Limit API calls to once every 250ms

  useEffect(() => {
    addressLookup(addressFilter)
  }, [addressFilter])

  useEffect(() => {
    const getAddress = async () => {
      const result = await getNearestAddressByCoordinate(
        formStoreState.coordinates[0],
        formStoreState.coordinates[1],
        config ? config.base.map.find_address_in_distance : 30
      )

      if (result) {
        setAddress(result.weergavenaam)
        updateForm({
          ...formStoreState,
          address: {
            postcode: result.postcode,
            huisnummer: result.huis_nlt,
            woonplaats: result.woonplaatsnaam,
            openbare_ruimte: result.straatnaam,
            weergave_naam: result.weergavenaam,
          },
        })
      } else {
        setAddress(null)
      }
    }

    getAddress()
  }, [formStoreState.coordinates])

  return (
    <Fieldset invalid={Boolean(errorMessage)} className="w-full">
      <FieldsetLegend>
        {field
          ? `${field.meta.label} (${t('required_short')})`
          : `${t('map_label')} (${t('required_short')})`}
      </FieldsetLegend>

      {Boolean(errorMessage) && errorMessage && (
        <FormFieldErrorMessage>{errorMessage}</FormFieldErrorMessage>
      )}

      <FormField
        label={t('address_search_label')}
        input={
          <Textbox
            name="address"
            defaultValue={addressFilter}
            onChange={(evt: any) => setAddressFilter(evt.target.value)}
          />
        }
      ></FormField>
      {Array.isArray(addressOptions) && (
        <ButtonGroup>
          {addressOptions.map((option: any, index) => {
            return (
              <Button
                appearance="secondary-action"
                key={index}
                onClick={() => {
                  console.log('Go to: ', option.coordinates)
                  setAddressFilter(option.value)
                }}
              >
                {option.children}
              </Button>
            )
          })}
        </ButtonGroup>
      )}
      <div className="relative w-full">
        <div style={{ minHeight: 200, height: 200 }}>
          <LocationMap />
        </div>
        <Paragraph>{address}</Paragraph>
        <MapProvider>
          <MapDialog
            trigger={
              isCoordinates(formStoreState.coordinates) &&
              formStoreState.coordinates[0] === 0 &&
              formStoreState.coordinates[1] === 0 ? (
                <Button
                  appearance="primary-action-button"
                  id="location-button"
                  className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 border-none"
                  type="button"
                >
                  Kies locatie
                </Button>
              ) : (
                <LinkButton inline={true} id="location-button" type="button">
                  Wijzig locatie
                </LinkButton>
              )
            }
          />
        </MapProvider>
      </div>
    </Fieldset>
  )
}
