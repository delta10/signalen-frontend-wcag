import { Key, ReactNode } from 'react'
import { UnorderedList, UnorderedListItem } from '..'

export type ParagraphOrListEntry = [Key, ReactNode]

export interface ParagraphOrListProps {
  entries: ParagraphOrListEntry[]
}

export const ParagraphOrList = ({ entries }: ParagraphOrListProps) => {
  if (entries.length >= 2) {
    return (
      <UnorderedList>
        {entries.map(([id, item]) => (
          <UnorderedListItem key={id}>{item}</UnorderedListItem>
        ))}
      </UnorderedList>
    )
  } else if (entries.length === 1) {
    return <>{entries[0][1]}</>
  }
}
