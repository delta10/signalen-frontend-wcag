'use client'

import { useTranslations } from 'next-intl'
import { IncidentContactForm } from '@/app/[locale]/incident/contact/components/IncidentContactForm'
import { Heading } from '@/components/index'
import { useFormStore } from '@/store/form_store'

export default function AddContactDetailsPage() {
  const t = useTranslations('describe-contact')
  const { loaded } = useFormStore()

  if (loaded) {
    return (
      <div className="flex flex-col gap-4">
        <Heading level={1}>{t('heading')}</Heading>
        <IncidentContactForm />
      </div>
    )
  }
}
