import { QuestionField } from '@/types/form'

interface AssetSelectProps extends Omit<QuestionField, 'register' | 'errors'> {}

export const AssetSelect = ({ field }: AssetSelectProps) => {
  return <p>{field.key}</p>
}
