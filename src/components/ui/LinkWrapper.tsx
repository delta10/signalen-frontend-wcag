import Link, { LinkProps } from 'next/link'

type LinkWrapperProps = {
  unstyled?: boolean
} & LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement>

const LinkWrapper = ({
  href,
  className,
  unstyled = false,
  children,
  ...props
}: LinkWrapperProps) => {
  return (
    <Link
      className={`${className} ${
        unstyled
          ? ''
          : 'transition duration-100 outline-none text-link underline active:text-active_link active:no-underline hover:text-hover_link hover:no-underline focus:bg-focus_link focus:text-black focus:no-underline focus-visible:border-2 focus-visible:border-focus_visible_link focus-visible:border-dashed'
      }`}
      href={href}
      {...props}
    >
      {children}
    </Link>
  )
}

export { LinkWrapper }
