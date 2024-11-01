import { PublicQuestion } from '@/types/form'
import { RenderSingleField } from '@/app/[locale]/incident/add/components/questions/RenderSingleField'

type RenderDynamicFieldsProps = {
  data: PublicQuestion[]
}

export const RenderDynamicFields = ({ data }: RenderDynamicFieldsProps) => {
  return Object.keys(data).map((value, index, array) => {
    const question = data[index]

    const fieldName = question.key

    return (
      <div key={fieldName} className="w-full">
        <RenderSingleField field={question} />
      </div>
    )
  })
}
