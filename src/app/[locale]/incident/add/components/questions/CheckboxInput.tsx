import { QuestionField } from '@/types/form'

interface CheckboxInputProps extends QuestionField {}

export const CheckboxInput = ({
  field,
  register,
  errors,
}: CheckboxInputProps) => {
  return <p>{field.key}</p>
}
