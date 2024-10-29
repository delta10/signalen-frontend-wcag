import { QuestionField } from '@/types/form'
import Markdown from 'react-markdown'
import { useEffect, useMemo, useState } from 'react'
import { evaluateConditions } from '@/lib/utils/check-visibility'
import { useFormContext } from 'react-hook-form'

interface PlainTextProps extends Omit<QuestionField, 'register' | 'errors'> {}

export const PlainText = ({ field }: PlainTextProps) => {
  const [shouldRender, setShouldRender] = useState<boolean>(false)
  const { watch, getValues } = useFormContext()

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

  // TODO: Discuss if alert is the only used PlainText type in Signalen, style Markdown
  return field.meta.value ? (
    <div className="bg-red-100 rounded-lg p-4">
      <Markdown>{field.meta.value}</Markdown>
    </div>
  ) : (
    <></>
  )
}
