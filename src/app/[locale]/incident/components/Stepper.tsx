'use client'

import { useTranslations } from 'next-intl'
import { Paths, usePathname } from '@/routing/navigation'
import { useStepperStore } from '@/store/stepper_store'
import { useEffect, useRef } from 'react'
import { useFormStore } from '@/store/form_store'
import { Button, Link } from '@utrecht/component-library-react/dist/css-module'

import { Paragraph } from '../../../../components/index'

type StepperProps = {}

type StepperItem = {
  path: Paths
  name: string
}

export const Stepper = ({}: StepperProps) => {
  const t = useTranslations('stepper')
  const { step, lastCompletedStep, goToStep, setLastCompletedStep } =
    useStepperStore()
  const { resetForm } = useFormStore()
  const ref = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const lineStatusRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (
      ref.current !== null &&
      lineRef.current !== null &&
      window.screen.width < 768
    ) {
      lineRef.current.style.width = `${String(ref.current.offsetWidth - 24)}px`
    }
  }, [ref.current, lineRef.current])

  useEffect(() => {
    if (lineRef.current !== null && lineStatusRef.current !== null) {
      const partOfLineBetweenTwoSteps =
        (window.screen.width > 768
          ? lineRef.current.offsetHeight
          : lineRef.current.offsetWidth) /
        (items.length - 1)

      lineStatusRef.current.style[
        window.screen.width > 768 ? 'minHeight' : 'minWidth'
      ] = `${String(partOfLineBetweenTwoSteps * (step - 1))}px`
    }
  }, [step])

  const resetState = () => {
    setLastCompletedStep(0)
    goToStep(1)
    resetForm()
  }

  const items: Array<StepperItem> = [
    {
      path: '/incident',
      name: t('step_one'),
    },
    {
      path: '/incident/add',
      name: t('step_two'),
    },
    {
      path: '/incident/contact',
      name: t('step_three'),
    },
    {
      path: '/incident/summary',
      name: t('step_four'),
    },
  ]

  if (pathname !== '/incident/thankyou') {
    return (
      <div className="flex md:flex-row flex-col items-start md:items-stretch">
        <div
          className="border-t-2 md:border-t-0 md:border-l-2 border-gray-400"
          ref={lineRef}
        ></div>
        <div
          className="border-t-2 -mt-[2px] md:-mt-0 md:-ml-[2px] md:border-t-0 md:border-l-2 border-primary"
          ref={lineStatusRef}
          style={{ height: '0px' }}
        ></div>
        <div
          className="flex flex-row md:flex-col gap-10 -translate-y-1/2 md:translate-y-0"
          ref={ref}
        >
          {items.map((item, index) => {
            return (
              <Link
                onClick={() => goToStep(index + 1)}
                href={item.path}
                key={item.path}
                tabIndex={lastCompletedStep >= index ? 0 : -1}
                className={`flex flex-row gap-4 h-6 items-center group ${
                  lastCompletedStep >= index ? '' : 'pointer-events-none'
                }`}
              >
                <div
                  className={`${step == index + 1 ? 'w-9 h-9' : 'w-6 h-6'} ${
                    lastCompletedStep >= index ? 'bg-primary' : 'bg-gray-400'
                  } flex items-center justify-center rounded-full -translate-x-1/2 -ml-[1px] text-white text-sm`}
                >
                  {index + 1}
                </div>
                <Paragraph
                  className={`${
                    step == index + 1 ? 'text-xl font-semibold -ml-3' : ''
                  } md:block hidden transition duration-100 group-hover:underline group-focus:underline`}
                >
                  {item.name}
                </Paragraph>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Button onClick={() => resetState()} asChild>
      <Link href={'/incident'}>{t('new_notification')}</Link>
    </Button>
  )
}
