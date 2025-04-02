import { FormFieldCheckbox, Icon } from '@/components'
import React, { useState } from 'react'
import { Category, ParentCategory } from '@/types/category'
import { IconChevronDown } from '@tabler/icons-react'

type NestedCategoryCheckboxListProps = {
  categories: ParentCategory[]
  selectedSubCategories: string[]
  setSelectedSubCategories: React.Dispatch<React.SetStateAction<string[]>>
  onChange?: (checkedItems: Record<string, boolean>) => void
}

const NestedCheckboxList = ({
  categories,
  selectedSubCategories,
  setSelectedSubCategories,
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

  // Get all subcategories for a parent category
  const getSubcategorySlugs = (parentCategory: ParentCategory): string[] => {
    return parentCategory.sub_categories?.map((sub) => sub.slug) || []
  }

  // Toggle subcategory selection
  const toggleSubCategory = (slug: string) => {
    setSelectedSubCategories((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((item) => item !== slug)
      } else {
        return [...prev, slug]
      }
    })
  }
  // Toggle parent category (selects/deselects all subcategories)
  const toggleParentCategory = (parentCategory: ParentCategory) => {
    const subcategorySlugs = getSubcategorySlugs(parentCategory)

    // Check if all subcategories are already selected
    const allSelected = subcategorySlugs.every((slug) =>
      selectedSubCategories?.includes(slug)
    )

    if (allSelected) {
      // Deselect all subcategories of this parent
      setSelectedSubCategories((prev) =>
        prev.filter((slug) => !subcategorySlugs.includes(slug))
      )
    } else {
      // Select all subcategories of this parent
      setSelectedSubCategories((prev) => {
        const newSelection = [...prev]
        subcategorySlugs.forEach((slug) => {
          if (!newSelection.includes(slug)) {
            newSelection.push(slug)
          }
        })
        return newSelection
      })
    }
  }

  // Check if a parent category is fully selected
  const isParentCategorySelected = (
    parentCategory: ParentCategory
  ): boolean => {
    const subcategorySlugs = getSubcategorySlugs(parentCategory)
    // console.log('parentCategory', parentCategory)
    // console.log('subcategorySlugs', subcategorySlugs)
    // console.log('selectedSubCategories', selectedSubCategories)
    return (
      subcategorySlugs.length > 0 &&
      subcategorySlugs.every((slug) => selectedSubCategories?.includes(slug))
    )
  }

  // Check if a parent category is partially selected
  const isParentCategoryIndeterminate = (
    parentCategory: ParentCategory
  ): boolean => {
    const subcategorySlugs = getSubcategorySlugs(parentCategory)
    const selectedCount = subcategorySlugs.filter((slug) =>
      selectedSubCategories?.includes(slug)
    ).length

    return selectedCount > 0 && selectedCount < subcategorySlugs.length
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
                checked={isParentCategorySelected(category)}
                indeterminate={isParentCategoryIndeterminate(category)}
                label={category.name}
                onChange={() => toggleParentCategory(category)}
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
                        checked={selectedSubCategories?.includes(
                          subCategory.slug
                        )}
                        label={subCategory.name}
                        onChange={() => toggleSubCategory(subCategory.slug)}
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
