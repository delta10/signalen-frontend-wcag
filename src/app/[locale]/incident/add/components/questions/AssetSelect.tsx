import { QuestionField } from '@/types/form'
import { Paragraph } from '@/components/index'

interface AssetSelectProps extends Omit<QuestionField, 'register' | 'errors'> {}

export const AssetSelect = ({ field }: AssetSelectProps) => {
  return <Paragraph>{field.key}</Paragraph>
}
