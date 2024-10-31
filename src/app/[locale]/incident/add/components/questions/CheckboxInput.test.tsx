import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FieldTypes } from '@/types/form'
import { FormMock } from '../../../../../../../__mocks__/FormMock'
import { FieldValues } from 'react-hook-form'
import { CheckboxInput } from '@/app/[locale]/incident/add/components/questions/CheckboxInput'

const renderWithForm = (
  component: React.ReactElement,
  defaultValues: FieldValues
) => {
  return render(<FormMock defaultValues={defaultValues}>{component}</FormMock>)
}

// Visiblity tests
test('should show checkbox inputs', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Weet u het nummer van de container?',
      values: {
        '1': 'test',
        '2': 'test-twee',
        '3': 'test-drie',
      },
    },
    required: false,
  }

  renderWithForm(<CheckboxInput field={field} />, {})

  expect(screen.getByTestId('checkbox-group')).toBeInTheDocument()
})

test('should not show checkbox inputs', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Weet u het nummer van de container?',
      values: {
        '1': 'test',
        '2': 'test-twee',
        '3': 'test-drie',
      },
      ifOneOf: {
        Bank_type_melding: ['1'],
      },
    },
    required: false,
  }

  renderWithForm(<CheckboxInput field={field} />, {})

  expect(screen.queryByTestId('checkbox-group')).not.toBeInTheDocument()
})

test('should show checkbox inputs with ifOneOf resolving to true', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Weet u het nummer van de container?',
      values: {
        '1': 'test',
        '2': 'test-twee',
        '3': 'test-drie',
      },
      ifOneOf: {
        Bank_type_melding: ['1'],
      },
    },
    required: false,
  }

  renderWithForm(<CheckboxInput field={field} />, { Bank_type_melding: '1' })

  expect(screen.queryByTestId('checkbox-group')).toBeInTheDocument()
})

test('should not show checkbox inputs with ifOneOf resolving to false', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Weet u het nummer van de container?',
      values: {
        '1': 'test',
        '2': 'test-twee',
        '3': 'test-drie',
      },
      ifOneOf: {
        Bank_type_melding: ['1'],
      },
    },
    required: false,
  }

  renderWithForm(<CheckboxInput field={field} />, { Bank_type_melding: '2' })

  expect(screen.queryByTestId('checkbox-group')).not.toBeInTheDocument()
})

test('should show checkbox inputs with ifAllOf condition resolving to true', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Weet u het nummer van de container?',
      values: {
        '1': 'test',
        '2': 'test-twee',
        '3': 'test-drie',
      },
      ifAllOf: {
        Bank_type_melding: ['2'],
        Test_type_melding: ['15'],
      },
    },
    required: false,
  }

  renderWithForm(<CheckboxInput field={field} />, {
    Bank_type_melding: '2',
    Test_type_melding: '15',
  })

  expect(screen.queryByTestId('checkbox-group')).toBeInTheDocument()
})

test('should not show checkbox inputs with ifAllOf condition resolving to false', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Weet u het nummer van de container?',
      values: {
        '1': 'test',
        '2': 'test-twee',
        '3': 'test-drie',
      },
      ifAllOf: {
        Bank_type_melding: ['2'],
        Test_type_melding: ['12'],
      },
    },
    required: false,
  }

  renderWithForm(<CheckboxInput field={field} />, {
    Bank_type_melding: '2',
    Test_type_melding: '15',
  })

  expect(screen.queryByTestId('checkbox-group')).not.toBeInTheDocument()
})

test('should show checkbox inputs with ifOneOf nested condition (ifAllOf) resolving to true', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Weet u het nummer van de container?',
      values: {
        '1': 'test',
        '2': 'test-twee',
        '3': 'test-drie',
      },
      ifOneOf: {
        ifOneOf: {
          Bank_type_melding: ['1'],
        },
        ifAllOf: {
          Bank_type_melding: ['2', '3'],
          Test_type_melding: ['15'],
        },
      },
    },
    required: false,
  }

  renderWithForm(<CheckboxInput field={field} />, {
    Bank_type_melding: ['2', '3'],
    Test_type_melding: '15',
  })

  expect(screen.queryByTestId('checkbox-group')).toBeInTheDocument()
})

test('should show checkbox inputs with ifOneOf nested condition (ifOneOf) resolving to true', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Weet u het nummer van de container?',
      values: {
        '1': 'test',
        '2': 'test-twee',
        '3': 'test-drie',
      },
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

  renderWithForm(<CheckboxInput field={field} />, {
    Bank_type_melding: '1',
    Test_type_melding: '15',
  })

  expect(screen.queryByTestId('checkbox-group')).toBeInTheDocument()
})
