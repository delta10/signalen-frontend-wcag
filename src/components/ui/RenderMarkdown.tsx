import Markdown, { defaultUrlTransform } from 'react-markdown'
import {
  HTMLContent,
  Link,
  Paragraph,
  UnorderedList,
  UnorderedListItem,
} from '@/components'

export const RenderMarkdown = ({ text }: { text: string }) => {
  return (
    <HTMLContent className="flex flex-col gap-[1em]">
      <Markdown
        urlTransform={(url) =>
          url.startsWith('tel:') ? url : defaultUrlTransform(url)
        }
        components={{
          p: (props) => <Paragraph>{props.children}</Paragraph>,
          a: ({ href, children, title }) => (
            <Link href={href} title={title}>
              {children}
            </Link>
          ),
          ul: (props) => (
            <UnorderedList className="!list-disc">
              {props.children}
            </UnorderedList>
          ),
          li: (props) => (
            <UnorderedListItem>{props.children}</UnorderedListItem>
          ),
        }}
      >
        {text}
      </Markdown>
    </HTMLContent>
  )
}
