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
  const t = useTranslations('describe_add.explainer')
  const accordionRef = useRef<HTMLDivElement>(null)
  const [openAcc, setOpenAcc] = useState<boolean>(false)

  // todo: later kijken hoe dit dynamischer kan.
  const explainerDictionaryNames = {
    title: 'explainer_title',
    sections: [
      {
        name: 'choose_location',
        explanation: 'location_explanation',
        bullet_list: ['type_address', 'my_location', 'click_map'],
      },
      {
        name: 'navigation',
        explanation: 'navigation_explanation',
        bullet_list: ['move', 'zoom', 'buttons'],
      },
      {
        name: 'object_selection',
        explanation: 'selection_explanation',
        bullet_list: ['max_number', 'select_map', 'select_list'],
      },
      {
        name: 'keyboard_controls',
        explanation: 'keyboard_explanation',
        additional_steps: ['focus_map', 'to_continue'],
        bullet_list: [
          'arrow_keys',
          'zoom_buttons',
          'keyboard_object_selection',
          'tab_navigation_buttons',
          'tab_navigation_objects',
        ],
      },
    ],
  }
  return (
    <Accordion ref={accordionRef} className="purmerend-theme">
      <AccordionSection
        label={t('label')}
        expanded={openAcc} // Default collapsed
        onActivate={() => setOpenAcc(!openAcc)}
        body={null}
      >
        <Heading level={3}>{t(explainerDictionaryNames.title)}</Heading>

        {explainerDictionaryNames.sections.map((section, index) => (
          <div key={index}>
            <Heading level={5} className="pt-2">
              {t(section.name)}
            </Heading>
            <Paragraph className="contact-paragraph">
              {t(section.explanation)}
            </Paragraph>
            {section.additional_steps &&
              section.additional_steps.length > 0 && (
                <UnorderedList className="purmerend-theme">
                  {section.additional_steps?.map((bullet, index) => (
                    <UnorderedListItem key={index} className="subtle-list-item">
                      {t(bullet)}
                    </UnorderedListItem>
                  ))}
                  {section.bullet_list.length > 0 && (
                    <UnorderedList className="purmerend-theme">
                      {section.bullet_list.map((bullet, index) => (
                        <UnorderedListItem
                          key={index}
                          className="subtle-list-item"
                        >
                          {t(bullet)}
                        </UnorderedListItem>
                      ))}
                    </UnorderedList>
                  )}
                </UnorderedList>
              )}
            {!section.additional_steps && section.bullet_list.length > 0 && (
              <UnorderedList className="purmerend-theme">
                {section.bullet_list.map((bullet, index) => (
                  <UnorderedListItem key={index} className="subtle-list-item">
                    {t(bullet)}
                  </UnorderedListItem>
                ))}
              </UnorderedList>
            )}
          </div>
        ))}
      </AccordionSection>
    </Accordion>
  )
}

export default MapExplainerAccordion
