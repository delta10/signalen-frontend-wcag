'use client'

import { SvgImage } from './SvgImage'
import type { SvgImageProps } from './SvgImage'
import Head from 'next/head'

interface NextSvgImageProps extends SvgImageProps {
  priority?: boolean
}

export const NextSvgImage = ({
  src,
  priority,
  ...props
}: NextSvgImageProps) => {
  return (
    <>
      {priority ? (
        <Head>
          <link rel="preload" href={src} as="fetch" />
        </Head>
      ) : null}
      <SvgImage src={src} {...props} />
    </>
  )
}
