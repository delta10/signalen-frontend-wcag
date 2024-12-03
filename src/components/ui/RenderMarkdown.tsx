import Markdown, { defaultUrlTransform } from 'react-markdown'
import { Link, Paragraph } from '@/components'

export const RenderMarkdown = ({ text }: { text: string }) => {
  return (
    <Markdown
      urlTransform={(url) =>
        url.startsWith('tel:') ? url : defaultUrlTransform(url)
      }
      components={{
        p: (props) => <Paragraph>{props.children}</Paragraph>,
        a: (props) => <Link {...props}>{props.children}</Link>,
      }}
    >
      {text}
    </Markdown>
  )
}
