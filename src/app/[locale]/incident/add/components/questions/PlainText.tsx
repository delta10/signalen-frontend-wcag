import { QuestionField } from '@/types/form'

interface PlainTextProps extends Omit<QuestionField, 'register' | 'errors'> {}

export const PlainText = ({ field }: PlainTextProps) => {
  return <p>{field.key}</p>
}
