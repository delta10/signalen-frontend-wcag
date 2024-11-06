import { QuestionField } from '@/types/form'
import Markdown from 'react-markdown'
import { Alert } from '@utrecht/component-library-react/dist/css-module'

interface PlainTextProps extends QuestionField {}

export const PlainText = ({ field }: PlainTextProps) => {
  // TODO: Discuss if alert is the only used PlainText type in Signalen, style Markdown
  return field.meta.value ? (
    <Alert type="error" data-testid="plain-text-hard-stop">
      <Markdown>{field.meta.value}</Markdown>
    </Alert>
  ) : (
    <></>
  )
}
