import { QuestionField } from '@/types/form'

interface TextAreaInputProps extends QuestionField {}

export const TextAreaInput = ({
  field,
  register,
  errors,
}: TextAreaInputProps) => {
  return <p>{field.key}</p>
}
