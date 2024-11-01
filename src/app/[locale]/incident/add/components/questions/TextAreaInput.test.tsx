import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FieldTypes } from '@/types/form'
import { FormMock } from '../../../../../../../__mocks__/FormMock'
import { FieldValues } from 'react-hook-form'
import { TextAreaInput } from '@/app/[locale]/incident/add/components/questions/TextAreaInput'
import React, { ReactElement } from 'react'

const renderWithForm = (
  component: ReactElement,
  defaultValues: FieldValues
) => {
  return render(<FormMock defaultValues={defaultValues}>{component}</FormMock>)
}

// Visiblity tests
test('should show textarea input', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Weet u het nummer van de container?',
    },
    required: false,
  }

  renderWithForm(<TextAreaInput field={field} />, {})

  expect(
    screen.getByRole('textbox', {
      name: `${field.meta.label} ${field.required ? '' : '(not required)'}`,
    })
  ).toBeInTheDocument()
})

test('should not show textarea input', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Weet u het nummer van de container?',
      ifOneOf: {
        Bank_type_melding: ['1'],
      },
    },
    required: false,
  }

  renderWithForm(<TextAreaInput field={field} />, {})

  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})

test('should show textarea input with ifOneOf resolving to true', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Weet u het nummer van de container?',
      ifOneOf: {
        Bank_type_melding: ['1'],
      },
    },
    required: false,
  }

  renderWithForm(<TextAreaInput field={field} />, { Bank_type_melding: '1' })

  expect(
    screen.queryByRole('textbox', {
      name: `${field.meta.label} ${field.required ? '' : '(not required)'}`,
    })
  ).toBeInTheDocument()
})

test('should not show textarea input with ifOneOf resolving to false', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Weet u het nummer van de container?',
      ifOneOf: {
        Bank_type_melding: ['1'],
      },
    },
    required: false,
  }

  renderWithForm(<TextAreaInput field={field} />, { Bank_type_melding: '2' })

  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})

test('should show textarea input with ifAllOf condition resolving to true', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Weet u het nummer van de container?',
      ifAllOf: {
        Bank_type_melding: ['2'],
        Test_type_melding: ['15'],
      },
    },
    required: false,
  }

  renderWithForm(<TextAreaInput field={field} />, {
    Bank_type_melding: '2',
    Test_type_melding: '15',
  })

  expect(
    screen.queryByRole('textbox', {
      name: `${field.meta.label} ${field.required ? '' : '(not required)'}`,
    })
  ).toBeInTheDocument()
})

test('should not show textarea input with ifAllOf condition resolving to false', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Weet u het nummer van de container?',
      ifAllOf: {
        Bank_type_melding: ['2'],
        Test_type_melding: ['12'],
      },
    },
    required: false,
  }

  renderWithForm(<TextAreaInput field={field} />, {
    Bank_type_melding: '2',
    Test_type_melding: '15',
  })

  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})

test('should show textarea input with ifOneOf nested condition (ifAllOf) resolving to true', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Weet u het nummer van de container?',
      ifOneOf: {
        ifOneOf: {
          Bank_type_melding: ['1'],
        },
        ifAllOf: {
          Bank_type_melding: ['2'],
          Test_type_melding: ['15'],
        },
      },
    },
    required: false,
  }

  renderWithForm(<TextAreaInput field={field} />, {
    Bank_type_melding: '2',
    Test_type_melding: '15',
  })

  expect(
    screen.queryByRole('textbox', {
      name: `${field.meta.label} ${field.required ? '' : '(not required)'}`,
    })
  ).toBeInTheDocument()
})

test('should show textarea input with ifOneOf nested condition (ifOneOf) resolving to true', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Weet u het nummer van de container?',
      ifOneOf: {
        ifOneOf: {
          Bank_type_melding: ['1'],
        },
        ifAllOf: {
          Bank_type_melding: ['2'],
          Test_type_melding: ['15'],
        },
      },
    },
    required: false,
  }

  renderWithForm(<TextAreaInput field={field} />, {
    Bank_type_melding: '1',
    Test_type_melding: '15',
  })

  expect(
    screen.queryByRole('textbox', {
      name: `${field.meta.label} ${field.required ? '' : '(not required)'}`,
    })
  ).toBeInTheDocument()
})
