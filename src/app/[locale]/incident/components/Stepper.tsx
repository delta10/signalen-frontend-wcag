'use client'

import { useTranslations } from 'next-intl'
import { Link, Paths } from '@/routing/navigation'
import { useStepperStore } from '@/store/store'

type StepperProps = {}

type StepperItem = {
  path: Paths
  name: string
}

export const Stepper = ({}: StepperProps) => {
  const t = useTranslations('stepper')
  const { step, lastCompletedStep, goToStep } = useStepperStore()

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

  return (
    <div className="flex">
      <div className="border-l-2 border-gray-400"></div>
      <div className="flex flex-col gap-10">
        {items.map((item, index) => {
          console.log(lastCompletedStep, index)

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
              <p
                className={`${
                  step == index + 1 ? 'text-xl font-semibold -ml-3' : ''
                } transition duration-100 group-hover:underline group-focus:underline`}
              >
                {item.name}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
