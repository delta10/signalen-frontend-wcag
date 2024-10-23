'use client'

import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/Form'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useStepperStore } from '@/store/stepper_store'
import { useRouter } from '@/routing/navigation'
import { LocationMap } from '@/components/ui/LocationMap'

import { MapDialog } from '@/app/[locale]/incident/add/components/MapDialog'
import { useEffect } from 'react'
import { useFormStore } from '@/store/form_store'

import {
  Button,
  FormLabel,
} from '@utrecht/component-library-react/dist/css-module'

const IncidentQuestionsLocationForm = () => {
  const t = useTranslations('describe-add.form')
  const { updateForm, formState } = useFormStore()
  const { addOneStep, setLastCompletedStep } = useStepperStore()
  const router = useRouter()
  const marker = formState.coordinates!

  const incidentQuestionAndLocationFormSchema = z.object({
    map: z.object({
      lng: z.number().min(0.00000001, t('errors.location_required')),
      lat: z.number().min(0.00000001, t('errors.location_required')),
    }),
  })

  const form = useForm<z.infer<typeof incidentQuestionAndLocationFormSchema>>({
    resolver: zodResolver(incidentQuestionAndLocationFormSchema),
    defaultValues: {
      map: {
        lng: formState.coordinates[0],
        lat: formState.coordinates[1],
      },
    },
  })

  const {
    setValue,
    formState: { errors },
  } = form

  useEffect(() => {
    if (marker[0] !== 0 && marker[1] !== 0) {
      setValue('map', { lng: marker[0], lat: marker[1] })
    }
  }, [marker])

  const onSubmit = (
    values: z.infer<typeof incidentQuestionAndLocationFormSchema>
  ) => {
    updateForm({
      ...formState,
      coordinates: [values.map.lng, values.map.lat],
    })

    setLastCompletedStep(2)
    addOneStep()

    router.push('/incident/contact')
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8 items-start"
        >
          <FormField
            name={'map'}
            control={form.control}
            render={({ field, formState: { errors } }) => (
              <FormItem className="w-full relative">
                <div>
                  <FormLabel>{t('add_map_heading')}</FormLabel>
                  <FormMessage customError={errors.map?.lng} />
                </div>
                <FormControl className="w-full bg-red-400 relative">
                  <>
                    <LocationMap />
                    {/* TODO: I can not find the reason why not every element inside this dialog is focusable */}
                    <MapDialog
                      marker={marker}
                      trigger={
                        <Button
                          className="absolute top-1/2 mt-5 -translate-y-1/2 left-1/2 -translate-x-1/2 border-none"
                          type="button"
                        >
                          {t('add_choose_location_button')}
                        </Button>
                      }
                    />
                  </>
                </FormControl>
              </FormItem>
            )}
          />
          <IncidentFormFooter />
        </form>
      </Form>
    </div>
  )
}

export { IncidentQuestionsLocationForm }
