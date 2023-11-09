'use client'

import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from '@/components/ui/Form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'

// TODO: Add translations to zod errors
const incidentDescriptionFormSchema = z.object({
  title: z.string().min(2).max(50),
})

export const IncidentDescriptionForm = () => {
  const form = useForm<z.infer<typeof incidentDescriptionFormSchema>>({
    resolver: zodResolver(incidentDescriptionFormSchema),
    defaultValues: {
      title: '',
    },
  })

  const onSubmit = (values: z.infer<typeof incidentDescriptionFormSchema>) => {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name={'title'}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Waar gaat het om?</FormLabel>
              <FormControl>
                <Input placeholder={'title'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Verstuur</button>
      </form>
    </Form>
  )
}
