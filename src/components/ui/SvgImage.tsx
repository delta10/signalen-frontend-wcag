import { SvgImageElement } from './SvgImageElement'

export interface SvgImageProps {
  src: string
  width?: number | string
  height?: number | string
  priority?: boolean
  alt: string
}

export const SvgImage = ({ src, width, height }: SvgImageProps) => {
  SvgImageElement.define()

  return <svg-image src={src} width={width} height={height} />
}
