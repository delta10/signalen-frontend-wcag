import { QuestionField } from '@/types/form'
import { Alert } from '@/components'
import { RenderMarkdown } from '@/components/ui/RenderMarkdown'

interface PlainTextProps extends QuestionField {}

export const PlainText = ({ field }: PlainTextProps) => {
  return field.meta.value ? (
    <Alert type="error" data-testid="plain-text-hard-stop">
      <RenderMarkdown text={field.meta.value} />
    </Alert>
  ) : null
}
