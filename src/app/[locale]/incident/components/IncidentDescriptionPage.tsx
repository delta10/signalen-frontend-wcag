'use client'

import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { Heading, Paragraph, HeadingGroup, PreHeading } from '@/components'
import { Alert, Link } from '@/components'
import { IncidentDescriptionForm } from '@/app/[locale]/incident/components/IncidentDescriptionForm'
import FormProgress from '@/app/[locale]/components/FormProgress'
import { useConfig } from '@/hooks/useConfig'
import Markdown, { defaultUrlTransform } from 'react-markdown'

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
              <Markdown
                urlTransform={(url) =>
                  url.startsWith('tel:') ? url : defaultUrlTransform(url)
                }
                components={{
                  p: (props) => <Paragraph>{props.children}</Paragraph>,
                  a: (props) => <Link {...props}>{props.children}</Link>,
                }}
              >
                {t('alert.help_text')}
              </Markdown>
            </Alert>
          ) : null}
          <IncidentDescriptionForm />
        </div>
      </>
    )
  }
}
