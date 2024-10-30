import React from 'react'
import { Button, Heading3 } from '@utrecht/component-library-react'
import { useTranslations } from 'next-intl'
import { useStepperStore } from '@/store/stepper_store'
import { useFormStore } from '@/store/form_store'
import { Link } from '@utrecht/component-library-react/dist/css-module'
import { usePathname } from '@/routing/navigation'

type Props = {}

const FormProgress = ({}: Props) => {
  const t = useTranslations('stepper')
  const { step, lastCompletedStep, goToStep, setLastCompletedStep } =
    useStepperStore()
  const { resetForm } = useFormStore()
  const pathname = usePathname()

  const resetState = () => {
    setLastCompletedStep(0)
    goToStep(1)
    resetForm()
  }

  if (pathname !== '/incident/thankyou') {
    return (
      <nav className="flex justify-between items-center">
        <Button>Vorige</Button>
        <Heading3>Stap 1 van 4</Heading3>
        <Button>Niets?</Button>
      </nav>
    )
  }
  return (
    <Button onClick={() => resetState()} asChild>
      <Link href={'/incident'}>{t('new_notification')}</Link>
    </Button>
  )
}

export default FormProgress
