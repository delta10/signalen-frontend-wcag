'use client'

import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { Heading, Paragraph, HeadingGroup, PreHeading } from '@/components'
import { Alert, Link } from '@utrecht/component-library-react/dist/css-module'
import { IncidentDescriptionForm } from '@/app/[locale]/incident/components/IncidentDescriptionForm'
import FormProgress from '../../components/FormProgress'
import { useConfig } from '@/hooks/useConfig'

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
              <Paragraph>
                {`${t('alert.help_text')} `}
                <Link href={`tel:${config.base.contact.tel}`}>
                  {config.base.contact.tel}
                </Link>
              </Paragraph>
              <Paragraph>{t('alert.opening_hours')}</Paragraph>
            </Alert>
          ) : null}
          <IncidentDescriptionForm />
        </div>
      </>
    )
  }
}
