import { QuestionField } from '@/types/form'
import { Alert, SpotlightSection } from '@/components'
import { RenderMarkdown } from '@/components/ui/RenderMarkdown'

export const PlainText = ({
  field,
  isBlocking,
}: QuestionField & { isBlocking: boolean }) => {
  const isInformation =
    !isBlocking && ['info', 'citation', 'disclaimer'].includes(field.meta.type)
  const Message = isInformation ? SpotlightSection : Alert

  return field.meta.value ? (
    <Message
      type={isBlocking ? 'error' : 'info'}
      data-testid={
        isBlocking ? 'plain-text-hard-stop' : 'plain-text-information'
      }
    >
      <RenderMarkdown text={field.meta.value} />
    </Message>
  ) : null
}
