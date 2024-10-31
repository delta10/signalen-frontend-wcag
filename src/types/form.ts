import { PublicQuestionSerializerDetail } from '@/services/client'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

export type QuestionField = {
  field: PublicQuestion
  register?: UseFormRegister<FieldValues>
  errors?: FieldErrors<FieldValues>
}

export enum FieldTypes {
  PLAIN_TEXT = 'plain_text',
  TEXT_INPUT = 'text_input',
  CHECKBOX_INPUT = 'checkbox_input',
  RADIO_INPUT = 'radio_input',
  TEXT_AREA_INPUT = 'text_area_input',
  ASSET_SELECT = 'asset_select',
  LOCATION_SELECT = 'location_select',
}

export interface PublicQuestion
  extends Omit<PublicQuestionSerializerDetail, 'field_type'> {
  field_type: FieldTypes
}
