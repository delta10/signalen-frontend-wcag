import { useEffect } from 'react'

export interface SvgImageProps {
  src: string
  width?: number | string
  height?: number | string
  priority?: boolean
  alt: string
}

export const SvgImage = ({ src, width, height }: SvgImageProps) => {
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

  return <svg-image src={src} width={width} height={height} />
}
