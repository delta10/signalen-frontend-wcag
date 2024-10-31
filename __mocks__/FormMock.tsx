import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { RootMock } from './RootMock'

export const FormMock = ({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode
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
