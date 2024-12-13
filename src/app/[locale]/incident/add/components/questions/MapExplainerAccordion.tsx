import React, { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Heading, Paragraph } from '@/components'
import {
  Accordion,
  AccordionSection,
  UnorderedList,
  UnorderedListItem,
} from '@utrecht/component-library-react'
import { RenderMarkdown } from '@/components/ui/RenderMarkdown'
import Markdown from 'react-markdown'

const MapExplainerAccordion = () => {
  const t = useTranslations('describe_add.map')
  const accordionRef = useRef<HTMLDivElement>(null)
  const [openAcc, setOpenAcc] = useState<boolean>(false)

  // todo kleuren
  const teksttemp =
    '# De kaart gebruiken\n' +
    '\n' +
    '## Een locatie kiezen\n' +
    'U kunt op drie manieren een locatie kiezen:\n' +
    '1. Type een adres in het zoekveld bovenaan\n' +
    '2. Gebruik de "Mijn locatie" knop om uw huidige locatie te selecteren\n' +
    '3. Klik direct op een punt op de kaart\n' +
    '\n' +
    '## Navigeren op de kaart\n' +
    'De kaart kunt u op verschillende manieren bedienen:\n' +
    '- Sleep met de muis om de kaart te verschuiven\n' +
    '- Gebruik het scrollwiel van uw muis om in en uit te zoomen\n' +
    '- Gebruik de + en - knoppen op de kaart om stapsgewijs in en uit te zoomen\n' +
    '\n' +
    '## Objecten selecteren\n' +
    'Wanneer er objecten op de kaart worden getoond:\n' +
    '- U kunt maximaal 5 objecten selecteren\n' +
    '- Selecteren kan door op het object op de kaart te klikken\n' +
    '- Of door het object in de lijst onder de kaart aan te klikken\n' +
    '\n' +
    '## Toetsenbord gebruiken\n' +
    'Voor mensen die liever het toetsenbord gebruiken:\n' +
    '- Klik eerst op de kaart zodat deze de focus heeft\n' +
    '- Vervolgens kunt u:\n' +
    '  - De pijltjestoetsen gebruiken om de kaart te verschuiven\n' +
    '  - + en - toetsen gebruiken om in en uit te zoomen\n' +
    '  - Spatie of enter drukken om het punt in het midden van de kaart te selecteren\n' +
    '  - Tab gebruiken om tussen de knoppen op de kaart te navigeren (zoals zoom en "Mijn locatie")\n' +
    '  - Als er objecten geselecteerd zijn, met tab er doorheen bladeren'

  return (
    <Accordion ref={accordionRef}>
      <AccordionSection
        label={t('explainer_label')}
        expanded={openAcc} // Default collapsed
        onActivate={() => setOpenAcc(!openAcc)}
        body={teksttemp}
      >
        {/*<RenderMarkdown text={teksttemp}></RenderMarkdown>*/}
        <Heading level={2}>De kaart gebruiken</Heading>
        <Heading level={4} className="pt-2">
          Een locatie kiezen
        </Heading>
        <Paragraph className="contact-paragraph">
          U kunt op drie manieren een locatie kiezen:
        </Paragraph>
        <UnorderedList>
          <UnorderedListItem>Type een adres in het</UnorderedListItem>
          <UnorderedListItem>
            Gebruik de &#34;Mijn locatie&#34; knop om uw huidige locatie te
            selecteren
          </UnorderedListItem>
          <UnorderedListItem>
            Klik direct op een punt op de kaart
          </UnorderedListItem>
        </UnorderedList>
      </AccordionSection>
    </Accordion>
  )
}

export default MapExplainerAccordion
