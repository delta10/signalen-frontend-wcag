'use client'

import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { Heading, HeadingGroup, PreHeading } from '@/components'
import { Alert } from '@/components'
import { IncidentDescriptionForm } from '@/app/[locale]/incident/components/IncidentDescriptionForm'
import FormProgress from '@/app/[locale]/components/FormProgress'
import { useConfig } from '@/hooks/useConfig'
import { RenderMarkdown } from '@/components/ui/RenderMarkdown'

const currentStep = 1
const maxStep = 4

export const IncidentDescriptionPage = () => {
  const t = useTranslations('describe_report')
  const { loaded } = useFormStore()
  const { config } = useConfig()
  const tGeneral = useTranslations('general.form')

  if (loaded) {
    return (
      <>
        <div className="flex flex-col gap-12">
          <FormProgress>
            <HeadingGroup>
              <Heading level={1}>{t('heading')}</Heading>
              <PreHeading>
                {tGeneral('pre_heading', {
                  current: currentStep,
                  max: maxStep,
                })}
              </PreHeading>
            </HeadingGroup>
          </FormProgress>
          {config ? (
            <Alert>
              <RenderMarkdown text={t('alert.help_text')} />
            </Alert>
          ) : null}
          <IncidentDescriptionForm />
        </div>
      </>
    )
  }
}
