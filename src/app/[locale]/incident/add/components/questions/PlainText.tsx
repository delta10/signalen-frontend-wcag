import { QuestionField } from '@/types/form'
import { Alert, SpotlightSection } from '@/components'
import { RenderMarkdown } from '@/components/ui/RenderMarkdown'

export const PlainText = ({ field }: QuestionField) => {
  const isInformation = ['info', 'citation', 'disclaimer'].includes(
    field.meta.type
  )
  const Message = isInformation ? SpotlightSection : Alert

  return field.meta.value ? (
    <Message
      type={isInformation ? 'info' : 'error'}
      data-testid="plain-text-hard-stop"
    >
      <RenderMarkdown text={field.meta.value} />
    </Message>
  ) : null
}
