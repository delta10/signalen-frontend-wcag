import { QuestionField } from '@/types/form'
import { Alert } from '@/components'
import { RenderMarkdown } from '@/components/ui/RenderMarkdown'

export const PlainText = ({ field }: QuestionField) => {
  const validators = field.meta.validators
  const isBlocking =
    validators === 'isBlocking' ||
    (Array.isArray(validators) && validators.includes('isBlocking'))

  return field.meta.value ? (
    <Alert
      type={isBlocking ? 'error' : 'info'}
      data-testid={
        isBlocking ? 'plain-text-hard-stop' : 'plain-text-information'
      }
    >
      <RenderMarkdown text={field.meta.value} />
    </Alert>
  ) : null
}
