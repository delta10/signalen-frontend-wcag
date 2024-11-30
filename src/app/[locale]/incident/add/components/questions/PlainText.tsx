import { QuestionField } from '@/types/form'
import Markdown from 'react-markdown'
import { Alert } from '@/components'

interface PlainTextProps extends QuestionField {}

export const PlainText = ({ field }: PlainTextProps) => {
  return field.meta.value ? (
    <Alert type="error" data-testid="plain-text-hard-stop">
      <Markdown>{field.meta.value}</Markdown>
    </Alert>
  ) : null
}
