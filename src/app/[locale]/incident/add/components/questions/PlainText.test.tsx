import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FieldTypes } from '@/types/form'
import { FormMock } from '../../../../../../../__mocks__/FormMock'
import { FieldValues } from 'react-hook-form'
import { PlainText } from '@/app/[locale]/incident/add/components/questions/PlainText'

const renderWithForm = (
  component: React.ReactElement,
  defaultValues: FieldValues
) => {
  return render(<FormMock defaultValues={defaultValues}>{component}</FormMock>)
}

// Visiblity tests
test('should show plain text', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      value: 'Weet u het nummer van de container?',
    },
    required: false,
  }

  renderWithForm(<PlainText field={field} />, {})

  expect(screen.queryByTestId('plain-text-hard-stop')).toBeInTheDocument()
})

test('should not show plain text', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      value: 'Weet u het nummer van de container?',
      ifOneOf: {
        Bank_type_melding: ['1'],
      },
    },
    required: false,
  }

  renderWithForm(<PlainText field={field} />, {})

  expect(screen.queryByTestId('plain-text-hard-stop')).not.toBeInTheDocument()
})

test('should show plain text with ifOneOf resolving to true', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      value: 'Weet u het nummer van de container?',
      ifOneOf: {
        Bank_type_melding: ['1'],
      },
    },
    required: false,
  }

  renderWithForm(<PlainText field={field} />, { Bank_type_melding: '1' })

  expect(screen.queryByTestId('plain-text-hard-stop')).toBeInTheDocument()
})

test('should not show plain text with ifOneOf resolving to false', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      value: 'Weet u het nummer van de container?',
      ifOneOf: {
        Bank_type_melding: ['1'],
      },
    },
    required: false,
  }

  renderWithForm(<PlainText field={field} />, { Bank_type_melding: '2' })

  expect(screen.queryByTestId('plain-text-hard-stop')).not.toBeInTheDocument()
})

test('should show plain text with ifAllOf condition resolving to true', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      value: 'Weet u het nummer van de container?',
      ifAllOf: {
        Bank_type_melding: ['2'],
        Test_type_melding: ['15'],
      },
    },
    required: false,
  }

  renderWithForm(<PlainText field={field} />, {
    Bank_type_melding: '2',
    Test_type_melding: '15',
  })

  expect(screen.queryByTestId('plain-text-hard-stop')).toBeInTheDocument()
})

test('should not show plain text with ifAllOf condition resolving to false', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      value: 'Weet u het nummer van de container?',
      ifAllOf: {
        Bank_type_melding: ['2'],
        Test_type_melding: ['12'],
      },
    },
    required: false,
  }

  renderWithForm(<PlainText field={field} />, {
    Bank_type_melding: '2',
    Test_type_melding: '15',
  })

  expect(screen.queryByTestId('plain-text-hard-stop')).not.toBeInTheDocument()
})

test('should show plain text with ifOneOf nested condition (ifAllOf) resolving to true', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      value: 'Weet u het nummer van de container?',
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

  renderWithForm(<PlainText field={field} />, {
    Bank_type_melding: '2',
    Test_type_melding: '15',
  })

  expect(screen.queryByTestId('plain-text-hard-stop')).toBeInTheDocument()
})

test('should show plain text with ifOneOf nested condition (ifOneOf) resolving to true', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      value: 'Weet u het nummer van de container?',
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

  renderWithForm(<PlainText field={field} />, {
    Bank_type_melding: '1',
    Test_type_melding: '15',
  })

  expect(screen.queryByTestId('plain-text-hard-stop')).toBeInTheDocument()
})
