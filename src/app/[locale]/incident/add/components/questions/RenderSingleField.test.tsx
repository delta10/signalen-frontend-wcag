import { test, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FieldTypes } from '@/types/form'
import { useFormStore } from '@/store/form_store'
import { FormMock } from '../../../../../../../__mocks__/FormMock'
import { FieldValues, useFormContext } from 'react-hook-form'
import { RenderSingleField } from '@/app/[locale]/incident/add/components/questions/RenderSingleField'

const renderWithForm = (
  component: React.ReactElement,
  defaultValues: FieldValues
) => {
  return render(<FormMock defaultValues={defaultValues}>{component}</FormMock>)
}

// RenderSingleField visibility tests
test('should show text input', async () => {
  const field = {
    key: 'Vuurwerk_overlast_simpel',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Weet u het nummer van de container?',
    },
    required: false,
  }

  renderWithForm(
    <RenderSingleField field={field} setIsBlocking={vi.fn()} />,
    {}
  )

  expect(
    screen.queryByRole('textbox', {
      name: `${field.meta.label} ${field.required ? '' : '(not required)'}`,
    })
  ).toBeInTheDocument()
})

test('should not show text input', async () => {
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

  renderWithForm(
    <RenderSingleField field={field} setIsBlocking={vi.fn()} />,
    {}
  )

  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})

test('should show text input with ifOneOf resolving to true', async () => {
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

  renderWithForm(<RenderSingleField field={field} setIsBlocking={vi.fn()} />, {
    Bank_type_melding: '1',
  })

  expect(
    screen.queryByRole('textbox', {
      name: `${field.meta.label} ${field.required ? '' : '(not required)'}`,
    })
  ).toBeInTheDocument()
})

test('should not show text input with ifOneOf resolving to false', async () => {
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

  renderWithForm(<RenderSingleField field={field} setIsBlocking={vi.fn()} />, {
    Bank_type_melding: '2',
  })

  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})

test('should show text input with ifAllOf condition resolving to true', async () => {
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

  renderWithForm(<RenderSingleField field={field} setIsBlocking={vi.fn()} />, {
    Bank_type_melding: '2',
    Test_type_melding: '15',
  })

  expect(
    screen.queryByRole('textbox', {
      name: `${field.meta.label} ${field.required ? '' : '(not required)'}`,
    })
  ).toBeInTheDocument()
})

test('should not show text input with ifAllOf condition resolving to false', async () => {
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

  renderWithForm(<RenderSingleField field={field} setIsBlocking={vi.fn()} />, {
    Bank_type_melding: '2',
    Test_type_melding: '15',
  })

  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})

test('should show text input with ifOneOf nested condition (ifAllOf) resolving to true', async () => {
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

  renderWithForm(<RenderSingleField field={field} setIsBlocking={vi.fn()} />, {
    Bank_type_melding: '2',
    Test_type_melding: '15',
  })

  expect(
    screen.queryByRole('textbox', {
      name: `${field.meta.label} ${field.required ? '' : '(not required)'}`,
    })
  ).toBeInTheDocument()
})

test('should show text input with ifOneOf nested condition (ifOneOf) resolving to true', async () => {
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

  renderWithForm(<RenderSingleField field={field} setIsBlocking={vi.fn()} />, {
    Bank_type_melding: '1',
    Test_type_melding: '15',
  })

  expect(
    screen.queryByRole('textbox', {
      name: `${field.meta.label} ${field.required ? '' : '(not required)'}`,
    })
  ).toBeInTheDocument()
})

afterEach(() => {
  useFormStore.getState().resetForm()
})

const VisibilityControl = () => {
  const { register } = useFormContext()
  return (
    <select aria-label="Visibility" {...register('trigger')}>
      <option value="yes">Show question</option>
      <option value="no">Hide question</option>
    </select>
  )
}

test.each([
  { validators: undefined, variant: 'info' },
  { validators: 'isBlocking', variant: 'error' },
  { validators: ['isBlocking'], variant: 'error' },
])(
  'renders plain text as $variant for validators $validators',
  ({ validators, variant }) => {
    const setIsBlocking = vi.fn()
    renderWithForm(
      <RenderSingleField
        field={{
          key: 'message',
          field_type: FieldTypes.PLAIN_TEXT,
          required: false,
          meta: { value: 'Message for the resident', validators },
        }}
        setIsBlocking={setIsBlocking}
      />,
      {}
    )
    expect(
      screen.getByText('Message for the resident').closest('.utrecht-alert')
    ).toHaveClass(`utrecht-alert--${variant}`)
    if (variant === 'error')
      expect(setIsBlocking).toHaveBeenLastCalledWith(true)
  }
)

test('preserves edits on rerender and restores saved answers when a question becomes visible again', () => {
  const field = {
    key: 'followup',
    field_type: FieldTypes.TEXT_INPUT,
    meta: {
      label: 'Follow-up question',
      ifOneOf: { trigger: ['yes'] },
      validators: ['isBlocking'],
    },
    required: false,
  }
  useFormStore.getState().updateForm({
    ...useFormStore.getState().formState,
    extra_properties: [
      {
        id: field.key,
        label: field.meta.label,
        answer: 'Saved answer',
        category_url: '',
      },
    ],
  })
  const setIsBlocking = vi.fn()
  const content = () => (
    <FormMock defaultValues={{ trigger: 'yes' }}>
      <VisibilityControl />
      <RenderSingleField field={{ ...field }} setIsBlocking={setIsBlocking} />
    </FormMock>
  )
  const { rerender } = render(content())

  expect(screen.getByRole('textbox')).toHaveValue('Saved answer')
  expect(setIsBlocking).toHaveBeenLastCalledWith(true)
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'Edited answer' },
  })
  rerender(content())
  expect(screen.getByRole('textbox')).toHaveValue('Edited answer')

  fireEvent.change(screen.getByLabelText('Visibility'), {
    target: { value: 'no' },
  })
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  expect(setIsBlocking).toHaveBeenLastCalledWith(false)

  fireEvent.change(screen.getByLabelText('Visibility'), {
    target: { value: 'yes' },
  })
  expect(screen.getByRole('textbox')).toHaveValue('Saved answer')
  expect(setIsBlocking).toHaveBeenLastCalledWith(true)
})
