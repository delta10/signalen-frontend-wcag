import { useEffect } from 'react'
import type { ElementType } from 'react'

export interface SvgImageProps {
  src: string
  width?: number | string
  height?: number | string
  priority?: boolean
  alt: string
}

const SvgImageTag = 'svg-image' as ElementType

export const SvgImage = ({ src, width, height, alt }: SvgImageProps) => {
  useEffect(() => {
    const loadSvgImageElement = async () => {
      // Do not import web component during server side rendering, as HTMLElement is not available
      if (typeof window === 'undefined') {
        return
      }

      const { SvgImageElement } = await import('./SvgImageElement')
      SvgImageElement.define()
    }

    loadSvgImageElement()
  }, [])

  return (
    <SvgImageTag
      src={src}
      width={width}
      height={height}
      role="img"
      aria-label={alt}
    />
  )
}
