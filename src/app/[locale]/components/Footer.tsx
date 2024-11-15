import { Link } from '@utrecht/component-library-react'
import { IconChevronRight } from '@tabler/icons-react'

type footerLink = {
  href: string
  label: string
}

export interface props {
  links: footerLink[]
}

const Footer = ({ links }: props) => {
  return (
    <footer>
      <div className="w-full h-16 md:h-24 bg-neutral-500"></div>
      {/* todo: set organisation hover color */}
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-3 md:gap-12 py-3">
        {links.map((link) => (
          <Link
            href={link.href}
            key={link.label}
            className="flex items-center !no-underline hover:!underline !text-black hover:!text-cyan-800"
          >
            <IconChevronRight className="w-6 h-6" /> {link.label}
          </Link>
        ))}
      </div>
    </footer>
  )
}

export { Footer }
