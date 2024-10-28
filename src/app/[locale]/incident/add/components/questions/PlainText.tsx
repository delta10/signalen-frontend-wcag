import { QuestionField } from '@/types/form'
import Markdown from 'react-markdown'

interface PlainTextProps extends Omit<QuestionField, 'register' | 'errors'> {}

export const PlainText = ({ field }: PlainTextProps) => {
  // TODO: Discuss if alert is the only used PlainText type in Signalen, style Markdown
  return field.meta.value ? (
    <div className="bg-red-100 rounded-lg p-4">
      <Markdown>{field.meta.value}</Markdown>
    </div>
  ) : (
    <></>
  )
}
