import { QuestionField } from '@/types/form'
import Markdown from 'react-markdown'
import { useEffect, useMemo, useState } from 'react'
import { evaluateConditions } from '@/lib/utils/check-visibility'
import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import { useFormStore } from '@/store/form_store'

interface PlainTextProps extends Omit<QuestionField, 'register' | 'errors'> {}

export const PlainText = ({ field }: PlainTextProps) => {
  const [shouldRender, setShouldRender] = useState<boolean>(false)
  const { watch } = useFormContext()

  const watchValues = watch()

  // Memoize `evaluateConditions` result to prevent unnecessary updates
  const shouldRenderResult = useMemo(
    () => evaluateConditions(field.meta, watchValues),
    [field.meta, watchValues]
  )

  // Only update `shouldRender` if the result changes
  useEffect(() => {
    if (shouldRender !== shouldRenderResult) {
      setShouldRender(shouldRenderResult)
    }
  }, [shouldRenderResult, shouldRender])

  if (!shouldRender) {
    return null // Do not render if conditions aren't met
  }

  const { formState, updateForm } = useFormStore()

  useEffect(() => {
    if (field.meta.validators) {
      const isBlocking =
        field.meta.validators === 'isBlocking'
          ? true
          : !!field.meta.validators.includes('isBlocking')

      updateForm({
        ...formState,
        isBlocking: isBlocking,
      })
    }
  }, [field])

  useEffect(() => {
    console.log(formState.isBlocking)
  }, [formState.isBlocking])

  // TODO: Discuss if alert is the only used PlainText type in Signalen, style Markdown
  return field.meta.value ? (
    <div
      className="bg-red-100 rounded-lg p-4"
      data-testid="plain-text-hard-stop"
    >
      <Markdown>{field.meta.value}</Markdown>
    </div>
  ) : (
    <></>
  )
}
