import React, { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Heading, Paragraph } from '@/components'
import {
  Accordion,
  AccordionSection,
  UnorderedList,
  UnorderedListItem,
} from '@utrecht/component-library-react'
import { IconChevronDown } from '@tabler/icons-react'
import { cn } from '@/lib/utils/style'

type MapExplainerAccordion = {
  mobileView?: boolean
  isOpen?: boolean
  setIsOpen?: any
}

const MapExplainerAccordion = ({
  mobileView = false,
  isOpen,
  setIsOpen,
}: MapExplainerAccordion) => {
  const t = useTranslations('describe_add.explainer')
  const accordionRef = useRef<HTMLDivElement>(null)

  const [internalOpen, setInternalOpen] = useState<boolean>(false)

  // Determine whether to use controlled or internal state
  const isAccordionOpen = isOpen ?? internalOpen

  const toggleAccordion = () => {
    if (setIsOpen) {
      setIsOpen(!isAccordionOpen) // External control
    } else {
      setInternalOpen(!internalOpen) // Internal control
    }
  }

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
        bullet_list: [
          'zoom_for_objects',
          'max_number',
          'select_map',
          'select_list',
        ],
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
    <Accordion
      ref={accordionRef}
      className={cn('utrecht-accordion', {
        mobile: mobileView,
      })}
    >
      <AccordionSection
        icon={<IconChevronDown />}
        headingLevel={3}
        label={t('label')}
        expanded={isAccordionOpen} // Default collapsed
        onActivate={() => toggleAccordion()}
        body={null}
      >
        <div
          tabIndex={0}
          role="region"
          aria-label="Accordion content: De kaart gebruiken"
          className="dashed-focus"
        >
          <Heading level={4}>{t(explainerDictionaryNames.title)}</Heading>

          {explainerDictionaryNames.sections.map((section, index) => (
            <div key={index}>
              <Heading level={5} className="pt-2">
                {t(section.name)}
              </Heading>
              <Paragraph>{t(section.explanation)}</Paragraph>
              {section.additional_steps &&
                section.additional_steps.length > 0 && (
                  <UnorderedList>
                    {section.additional_steps?.map((bullet, index) => (
                      <UnorderedListItem key={index}>
                        {t(bullet)}
                      </UnorderedListItem>
                    ))}
                    {section.bullet_list.length > 0 && (
                      <UnorderedList>
                        {section.bullet_list.map((bullet, index) => (
                          <UnorderedListItem key={index}>
                            {t(bullet)}
                          </UnorderedListItem>
                        ))}
                      </UnorderedList>
                    )}
                  </UnorderedList>
                )}
              {!section.additional_steps && section.bullet_list.length > 0 && (
                <UnorderedList>
                  {section.bullet_list.map((bullet, index) => (
                    <UnorderedListItem key={index}>
                      {t(bullet)}
                    </UnorderedListItem>
                  ))}
                </UnorderedList>
              )}
            </div>
          ))}
        </div>
      </AccordionSection>
    </Accordion>
  )
}

export default MapExplainerAccordion
