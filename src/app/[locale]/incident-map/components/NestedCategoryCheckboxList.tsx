import { FormFieldCheckbox, Icon } from '@/components'
import React, { useState } from 'react'
import { Category, ParentCategory } from '@/types/category'
import { IconChevronDown } from '@tabler/icons-react'

type NestedCategoryCheckboxListProps = {
  categories: ParentCategory[]
  onChange?: (checkedItems: Record<string, boolean>) => void
}

const NestedCheckboxList = ({
  categories,
  onChange,
}: NestedCategoryCheckboxListProps) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const updateCheckedItems = (newCheckedItems: Record<string, boolean>) => {
    setCheckedItems(newCheckedItems)
    if (onChange) onChange(newCheckedItems)
  }

  const handleGroupChange = (group: Category) => {
    const newCheckedItems = { ...checkedItems }
    // const newValue = !group.sub_categories.every(
    //   (child) => checkedItems[child.slug]
    // )
    //
    // group.sub_categories.forEach((child) => {
    //   newCheckedItems[child.slug] = newValue
    // })

    updateCheckedItems(newCheckedItems)
  }

  const handleChildChange = (childSlug: string) => {
    const newCheckedItems = { ...checkedItems }
    newCheckedItems[childSlug] = !checkedItems[childSlug]
    updateCheckedItems(newCheckedItems)
  }

  const toggleExpand = (groupSlug: string) => {
    setExpanded((prev) => ({ ...prev, [groupSlug]: !prev[groupSlug] }))
  }

  return (
    <div>
      {categories.map((category: ParentCategory) => {
        // const allChecked = category.sub_categories.every(
        //   (child) => checkedItems[child.slug]
        // )
        // const someChecked =
        //   group.sub_categories.some((child) => checkedItems[child.slug]) &&
        //   !allChecked

        const isExpanded = expanded[category.slug]

        return (
          <div key={category.slug} className="mb-3">
            <div className="flex items-center gap-1">
              {/* 
                              indeterminate={false}
                value={group.slug}

              */}
              <FormFieldCheckbox
                checked={false}
                label={category.name}
                onChange={() => handleGroupChange(category)}
              />

              {category.configuration?.show_children_in_filter &&
                category.sub_categories?.length && (
                  <button
                    className="mr-2 p-1 text-gray-600 hover:text-black"
                    onClick={() => toggleExpand(category.slug)}
                  >
                    <Icon
                      className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                    >
                      <IconChevronDown />
                    </Icon>
                  </button>
                )}
            </div>

            {isExpanded && (
              <div className="ml-6">
                {category.configuration?.show_children_in_filter &&
                  category.sub_categories?.length &&
                  category.sub_categories.map((subCategory) => (
                    <div
                      key={subCategory.slug}
                      className="flex items-center mt-1"
                    >
                      {/* Replacing the simple <Checkbox /> with FormFieldCheckbox */}
                      <FormFieldCheckbox
                        checked={checkedItems[subCategory.slug] || false}
                        value={subCategory.slug}
                        label={subCategory.name}
                        onChange={() => handleChildChange(subCategory.slug)}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default NestedCheckboxList
