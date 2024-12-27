import type { HTMLAttributes } from 'react'

const css = `
:host {
  display: contents;
}

svg {
  height: auto;
  max-height: var(--svg-image-height, 100%);
  max-width: 100%;
  width: var(--svg-image-width);
}

@media (forced-colors: active) {
  svg * {
    fill: currentColor !important;
    stroke: currentColor !important;
  }
}
`

let stylesheet: CSSStyleSheet

const initStylesheet = () => {
  if (stylesheet) {
    stylesheet
  } else if (typeof CSSStyleSheet !== 'undefined') {
    stylesheet = new CSSStyleSheet()
    stylesheet.replace(css)
  }
}

export class SvgImageElement extends HTMLElement {
  static localName = 'svg-image'
  static define = () => {
    if (!customElements.get(SvgImageElement.localName)) {
      customElements.define(SvgImageElement.localName, SvgImageElement)
    }
  }
  static observedAttributes = ['src']
  connectedCallback() {
    const src = this.getAttribute('src')
    const width = this.getAttribute('width')
    const height = this.getAttribute('height')
    const shadow = this.attachShadow({ mode: 'closed' })
    const span = this.ownerDocument.createElement('span')
    shadow.appendChild(span)

    initStylesheet()
    if (stylesheet) {
      shadow.adoptedStyleSheets = [stylesheet]
    }

    if (width) {
      this.style.setProperty(
        '--svg-image-width',
        this.getAttribute('width') + 'px'
      )
    }

    if (height) {
      this.style.setProperty(
        '--svg-image-height',
        this.getAttribute('height') + 'px'
      )
    }

    if (typeof src === 'string') {
      const init = async () => {
        const response = await fetch(src)
        const data = await response.text()
        span.innerHTML = data
      }
      init()
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'svg-image': HTMLAttributes<HTMLElement> & {
        src: string
        width?: number | string
        height?: number | string
      }
    }
  }
}
