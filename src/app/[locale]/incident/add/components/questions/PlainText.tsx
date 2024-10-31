import { QuestionField } from '@/types/form'
import Markdown from 'react-markdown'
import { useEffect } from 'react'
import { useFormStore } from '@/store/form_store'

interface PlainTextProps extends Omit<QuestionField, 'register' | 'errors'> {}

export const PlainText = ({ field }: PlainTextProps) => {
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
    <div className="bg-red-100 rounded-lg p-4">
      <Markdown>{field.meta.value}</Markdown>
    </div>
  ) : (
    <></>
  )
}
