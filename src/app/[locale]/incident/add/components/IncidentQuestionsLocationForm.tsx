'use client'

import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import * as Dialog from '@radix-ui/react-dialog'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useSignalStore, useStepperStore } from '@/store/store'
import { useRouter } from '@/routing/navigation'
import { LocationMap } from '@/app/[locale]/incident/add/components/LocationMap'
import { Button } from '@/components/ui/Button'
import { TbCross, TbPlus } from 'react-icons/tb'
import { MapDialog } from '@/app/[locale]/incident/add/components/MapDialog'

const IncidentQuestionsLocationForm = () => {
  const t = useTranslations('describe-add.form')
  const { updateSignal, signal } = useSignalStore()
  const { addOneStep } = useStepperStore()
  const router = useRouter()

  const incidentQuestionAndLocationFormSchema = z.object({
    map: z.any(),
  })

  const form = useForm<z.infer<typeof incidentQuestionAndLocationFormSchema>>({
    resolver: zodResolver(incidentQuestionAndLocationFormSchema),
    defaultValues: {
      map: null,
    },
  })

  const onSubmit = (
    values: z.infer<typeof incidentQuestionAndLocationFormSchema>
  ) => {
    console.log(values)

    updateSignal({
      ...signal,
      location: { ...signal.location, address: { naam: 'oranjestraat' } },
      reporter: { ...signal.reporter, allows_contact: true },
    })

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
                  <FormMessage />
                </div>
                <FormControl className="w-full bg-red-400 relative">
                  <>
                    <LocationMap />
                    <MapDialog
                      trigger={
                        <Button
                          className="absolute top-1/2 mt-5 -translate-y-1/2 left-1/2 -translate-x-1/2 border-none"
                          type="button"
                        >
                          Kies locatie
                        </Button>
                      }
                    />{' '}
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
