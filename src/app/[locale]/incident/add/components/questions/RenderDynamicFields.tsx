import { FieldTypes, PublicQuestion } from '@/types/form'
import { RadioInput } from '@/app/[locale]/incident/add/components/questions/RadioInput'
import { PlainText } from '@/app/[locale]/incident/add/components/questions/PlainText'
import { TextInput } from '@/app/[locale]/incident/add/components/questions/TextInput'
import { CheckboxInput } from '@/app/[locale]/incident/add/components/questions/CheckboxInput'
import { TextAreaInput } from '@/app/[locale]/incident/add/components/questions/TextAreaInput'
import { AssetSelect } from '@/app/[locale]/incident/add/components/questions/AssetSelect'
import { LocationSelect } from '@/app/[locale]/incident/add/components/questions/LocationSelect'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

type RenderDynamicFieldsProps = {
  data: PublicQuestion[]
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
}

export const RenderDynamicFields = ({
  data,
  register,
  errors,
}: RenderDynamicFieldsProps) => {
  const additionalQuestionTypes = {
    [FieldTypes.RADIO_INPUT]: (field: PublicQuestion) => (
      <RadioInput register={register} field={field} errors={errors} />
    ),
    [FieldTypes.PLAIN_TEXT]: (field: PublicQuestion) => (
      <PlainText field={field} />
    ),
    [FieldTypes.TEXT_INPUT]: (field: PublicQuestion) => (
      <TextInput register={register} field={field} errors={errors} />
    ),
    [FieldTypes.CHECKBOX_INPUT]: (field: PublicQuestion) => (
      <CheckboxInput register={register} field={field} errors={errors} />
    ),
    [FieldTypes.TEXT_AREA_INPUT]: (field: PublicQuestion) => (
      <TextAreaInput register={register} field={field} errors={errors} />
    ),
    [FieldTypes.ASSET_SELECT]: (field: PublicQuestion) => (
      <AssetSelect field={field} />
    ),
    [FieldTypes.LOCATION_SELECT]: (props: any) => (
      <LocationSelect marker={[0, 0]} />
    ),
  }

  return Object.keys(data).map((value, index, array) => {
    const question = data[index]

    const fieldName = question.key

    return (
      <div key={fieldName} className="w-full">
        {additionalQuestionTypes[question.field_type]?.(question)}
      </div>
    )
  })
}
