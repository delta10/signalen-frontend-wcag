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
    return
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
  static observedAttributes = ['src', 'role', 'aria-label', 'width', 'height']

  #shadow?: ShadowRoot
  #wrapper?: HTMLSpanElement

  connectedCallback() {
    if (!this.#shadow) {
      this.#shadow = this.attachShadow({ mode: 'closed' })
      this.#wrapper = this.ownerDocument.createElement('span')
      this.#shadow.appendChild(this.#wrapper)

      initStylesheet()
      if (stylesheet) {
        this.#shadow.adoptedStyleSheets = [stylesheet]
      }
    }

    this.#updateDimensions()
    this.#updateAccessibility()
    void this.#updateSrc()
  }

  attributeChangedCallback(name: string) {
    if (!this.isConnected || !this.#wrapper) {
      return
    }

    switch (name) {
      case 'src':
        void this.#updateSrc()
        break
      case 'role':
      case 'aria-label':
        this.#updateAccessibility()
        break
      case 'width':
      case 'height':
        this.#updateDimensions()
        break
    }
  }

  #updateDimensions() {
    const width = this.getAttribute('width')
    const height = this.getAttribute('height')

    if (width) {
      this.style.setProperty('--svg-image-width', `${width}px`)
    } else {
      this.style.removeProperty('--svg-image-width')
    }

    if (height) {
      this.style.setProperty('--svg-image-height', `${height}px`)
    } else {
      this.style.removeProperty('--svg-image-height')
    }
  }

  #updateAccessibility() {
    const wrapper = this.#wrapper
    if (!wrapper) {
      return
    }

    const role = this.getAttribute('role') ?? 'img'
    const ariaLabel = this.getAttribute('aria-label')

    wrapper.setAttribute('role', role)

    if (ariaLabel) {
      wrapper.setAttribute('aria-label', ariaLabel)
    } else {
      wrapper.removeAttribute('aria-label')
    }
  }

  async #updateSrc() {
    const wrapper = this.#wrapper
    if (!wrapper) {
      return
    }

    const src = this.getAttribute('src')
    if (typeof src !== 'string') {
      wrapper.innerHTML = ''
      return
    }

    const response = await fetch(src)
    const data = await response.text()

    if (this.getAttribute('src') !== src) {
      return
    }

    wrapper.innerHTML = data
    this.#updateAccessibility()
  }
}
