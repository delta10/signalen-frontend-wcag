'use client'

import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { Heading, HeadingGroup, PreHeading } from '@/components'
import { IncidentQuestionsLocationForm } from '@/app/[locale]/incident/add/components/IncidentQuestionsLocationForm'
import FormProgress from '@/app/[locale]/components/FormProgress'

const currentStep = 2
const maxStep = 4

export const AdditionalInformationPage = () => {
  const t = useTranslations('describe-add')
  const tGeneral = useTranslations('general.describe_form')
  const { loaded } = useFormStore()

  if (loaded) {
    return (
      <div className="flex flex-col gap-12">
        <FormProgress>
          <HeadingGroup>
            <Heading level={1}>{t('heading')}</Heading>
            <PreHeading>
              {tGeneral('pre-heading', { current: currentStep, max: maxStep })}
            </PreHeading>
          </HeadingGroup>
        </FormProgress>
        <IncidentQuestionsLocationForm />
      </div>
    )
  }
}
