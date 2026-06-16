'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

export interface SvgImageProps {
  src: string
  width?: number | string
  height?: number | string
  priority?: boolean
  alt: string
}

type SvgImageStyle = CSSProperties & {
  '--svg-image-width'?: string
  '--svg-image-height'?: string
}

const styleElementId = 'svg-image-styles'

const css = `
.svg-image {
  display: inline-block;
  max-height: 100%;
  max-width: 100%;
}

.svg-image__content {
  display: contents;
}

.svg-image__content > svg {
  height: auto;
  max-height: var(--svg-image-height, 100%);
  max-width: 100%;
  width: var(--svg-image-width);
}

@media (forced-colors: active) {
  .svg-image__content > svg * {
    fill: currentColor !important;
    stroke: currentColor !important;
  }
}
`

const injectStyles = () => {
  if (
    typeof document === 'undefined' ||
    document.getElementById(styleElementId)
  ) {
    return
  }

  const style = document.createElement('style')
  style.id = styleElementId
  style.textContent = css
  document.head.appendChild(style)
}

const formatCssSize = (value: number | string) =>
  typeof value === 'number' ? `${value}px` : value

export const SvgImage = ({ src, width, height, alt }: SvgImageProps) => {
  const [svg, setSvg] = useState('')

  useEffect(() => {
    injectStyles()

    const controller = new AbortController()
    let ignore = false

    const loadSvg = async () => {
      setSvg('')

      try {
        const [{ default: DOMPurify }, response] = await Promise.all([
          import('dompurify'),
          fetch(src, { signal: controller.signal }),
        ])
        const data = await response.text()

        if (!ignore) {
          setSvg(
            DOMPurify.sanitize(data, {
              USE_PROFILES: { svg: true, svgFilters: true },
            })
          )
        }
      } catch (error) {
        if (
          !ignore &&
          !(error instanceof Error && error.name === 'AbortError')
        ) {
          setSvg('')
        }
      }
    }

    void loadSvg()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [src])

  const style: SvgImageStyle = {
    ...(width !== undefined
      ? { '--svg-image-width': formatCssSize(width) }
      : {}),
    ...(height !== undefined
      ? { '--svg-image-height': formatCssSize(height) }
      : {}),
  }

  return (
    <span className="svg-image" role="img" aria-label={alt} style={style}>
      <span
        className="svg-image__content"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </span>
  )
}
