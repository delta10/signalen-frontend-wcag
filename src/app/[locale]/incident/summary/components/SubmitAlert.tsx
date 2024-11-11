import { useTranslations } from 'next-intl'
import React, { useEffect, useRef } from 'react'
import {
  Alert,
  Paragraph,
} from '@utrecht/component-library-react/dist/css-module'
import { Heading, MultilineData } from '@utrecht/component-library-react'

export const SubmitAlert = ({
  error,
  loading,
}: {
  error: boolean
  loading: boolean
}) => {
  const t = useTranslations('describe-summary')
  const alertRef = useRef<HTMLDivElement | null>(null)
  const multilineRef = useRef<HTMLPreElement>(null)

  // Scroll to error message when an error occurs
  useEffect(() => {
    if ((error || loading) && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [error, loading])

  if (loading) {
    return (
      <Alert ref={alertRef} id="submit-described-by">
        <Heading level={3}>{t('submit_alert.loading.heading')}</Heading>
        <MultilineData ref={multilineRef} className="pt-2">
          {t('submit_alert.loading.description')}
        </MultilineData>
      </Alert>
    )
  }

  if (error) {
    return (
      <Alert ref={alertRef} type="error" id="submit-described-by">
        <Heading level={3}>{t('submit_alert.error.heading')}</Heading>
        <Paragraph className="pt-2">
          {t('submit_alert.error.description')}
        </Paragraph>
      </Alert>
    )
  }

  return null
}
