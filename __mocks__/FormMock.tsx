import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { RootMock } from './RootMock'
import { ReactNode } from 'react'

export const FormMock = ({
  children,
  defaultValues = {},
}: {
  children: ReactNode
  defaultValues?: FieldValues
}) => {
  const methods = useForm({
    defaultValues: defaultValues,
  })

  return (
    <RootMock>
      <FormProvider {...methods}>{children}</FormProvider>
    </RootMock>
  )
}
