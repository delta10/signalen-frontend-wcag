import { Key, ReactNode } from 'react'
import { Paragraph, UnorderedList, UnorderedListItem } from '..'

export type ParagraphOrListEntry = [Key, ReactNode]

export interface ParagraphOrListProps {
  entries: ParagraphOrListEntry[]
}

export const ParagraphOrList = ({ entries }: ParagraphOrListProps) => {
  if (entries.length >= 2) {
    return (
      <UnorderedList>
        {entries.map(([id, item], index) => (
          <UnorderedListItem key={index}>{item}</UnorderedListItem>
        ))}
      </UnorderedList>
    )
  } else if (entries.length === 1) {
    return <>{entries[0][1]}</>
  }
}
