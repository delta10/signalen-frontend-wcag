import { PublicQuestion } from '@/types/form'
import { RegisterOptions } from 'react-hook-form'

export const getValidators = (
  field: PublicQuestion,
  t: any
): RegisterOptions => {
  const validators: RegisterOptions = {}

  // If field is required, set required validation rule
  if (field.required) {
    validators.required = t('required')
  }

  // If validators exist on the meta, loop through this
  if (field.meta?.validators) {
    field.meta.validators.forEach(
      (validatorRule: string | [string, number]) => {
        if (typeof validatorRule === 'string') {
          // Handle single validator 'required'
          if (validatorRule === 'required') {
            validators.required = field.required ? t('required') : false
          }
        } else if (Array.isArray(validatorRule)) {
          // Handle validators with parameters like ['maxLength', 100]
          const [validatorName, validatorValue] = validatorRule

          if (validatorName === 'maxLength') {
            validators.maxLength = {
              value: validatorValue,
              message: t('max_length', { maxLength: validatorValue }),
            }
          }
        }
      }
    )
  }

  return validators
}
