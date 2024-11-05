'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import {
  Controller,
  ControllerProps,
  FieldError,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form'

import {
  FormField as UtrechtFormField,
  FormFieldDescription,
  FormFieldErrorMessage,
  FormLabel as UtrechtFormLabel,
  Paragraph,
} from '@/components/index'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

type FormItemProps = {
  error?: FieldError
} & React.HTMLAttributes<HTMLDivElement>

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ error, ...props }, ref) => {
    const id = React.useId()

    return (
      <FormItemContext.Provider value={{ id }}>
        <UtrechtFormField invalid={!!error} ref={ref} {...props} />
      </FormItemContext.Provider>
    )
  }
)
FormItem.displayName = 'FormItem'

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return <UtrechtFormLabel ref={ref} htmlFor={formItemId} {...props} />
})
FormLabel.displayName = 'FormLabel'
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <FormFieldDescription>
      <Paragraph ref={ref} id={formDescriptionId} {...props} />
    </FormFieldDescription>
  )
})
FormDescription.displayName = 'FormDescription'

type FormMessageProps = {
  customError?: FieldError
} & React.HTMLAttributes<HTMLParagraphElement>

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ customError, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField()
    const body = customError
      ? String(customError?.message)
      : error
        ? String(error?.message)
        : children

    if (!body) {
      return null
    }

    return (
      <FormFieldErrorMessage>
        <Paragraph ref={ref} id={formMessageId} {...props}>
          {body}
        </Paragraph>
      </FormFieldErrorMessage>
    )
  }
)
FormMessage.displayName = 'FormMessage'

export {
  useFormField,
  Form,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormLabel,
}
