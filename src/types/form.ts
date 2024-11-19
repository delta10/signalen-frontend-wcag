import { PublicQuestionSerializerDetail } from '@/services/client'

export type QuestionField = {
  field: PublicQuestion
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

export type FeatureType = {
  icon: {
    iconUrl: string
  }
  label: string
  idField: string
  description: string
}

export enum FormStep {
  STEP_1_DESCRIPTION = 1,
  STEP_2_ADD = 2,
  STEP_3_CONTACT = 3,
  STEP_4_SUMMARY = 4,
  STEP_5_THANK_YOU = 5,
}
