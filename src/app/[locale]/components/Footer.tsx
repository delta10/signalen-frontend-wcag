'use client'

import { IconChevronRight } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useConfig } from '@/hooks/useConfig'
import { useTranslations } from 'next-intl'
import { Link, PageFooter } from '@/components'

type footerLink = {
  href: string
  label: string
}

const Footer = () => {
  const [links, setLinks] = useState<footerLink[]>([])
  const { config, loading } = useConfig()
  const t = useTranslations('footer')

  useEffect(() => {
    if (!loading && config) {
      const newLinks: footerLink[] = []

      // Note: for now we only choose to show the 3 links below (about, privacy, accessibility).
      if (config.base.links['about']) {
        newLinks.push({ label: t('about'), href: config.base.links['about'] })
      }
      if (config.base.links['privacy']) {
        newLinks.push({
          label: t('privacy'),
          href: config.base.links['privacy'],
        })
      }
      if (config.base.links['accessibility']) {
        newLinks.push({
          label: t('accessibility'),
          href: config.base.links['accessibility'],
        })
      }
      setLinks(newLinks)
    }
  }, [config, loading])

  return (
    <PageFooter>
      {links.map((link) => (
        <Link
          href={link.href}
          key={link.label}
          className="flex items-center !no-underline hover:!underline !text-black hover:!text-cyan-800"
        >
          <IconChevronRight className="w-6 h-6" /> {link.label}
        </Link>
      ))}
    </PageFooter>
  )
}

export { Footer }
