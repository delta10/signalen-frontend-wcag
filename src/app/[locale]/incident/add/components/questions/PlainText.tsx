import { QuestionField } from '@/types/form'
import Markdown from 'react-markdown'
import { useEffect } from 'react'
import { useFormStore } from '@/store/form_store'

interface PlainTextProps extends Omit<QuestionField, 'register' | 'errors'> {
  shouldRender: boolean
}

export const PlainText = ({ field, shouldRender }: PlainTextProps) => {
  const { formState, updateForm } = useFormStore()

  useEffect(() => {
    if (field.meta.validators) {
      const isBlocking =
        field.meta.validators === 'isBlocking'
          ? true
          : !!field.meta.validators.includes('isBlocking')

      updateForm({
        ...formState,
        isBlocking: shouldRender ? isBlocking : false,
      })
    }
  }, [field, shouldRender])

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
