import { QuestionField } from '@/types/form'

interface TextInputProps extends QuestionField {}

export const TextInput = ({ field, register, errors }: TextInputProps) => {
  return <p>{field.key}</p>
}
