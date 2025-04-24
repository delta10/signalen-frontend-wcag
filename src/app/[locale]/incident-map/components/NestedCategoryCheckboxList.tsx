import { FormFieldCheckbox, Icon } from '@/components'
import React, { useState } from 'react'
import { ParentCategory } from '@/types/category'
import { IconChevronDown } from '@tabler/icons-react'
import { CategoryLabelWithIcon } from '@/app/[locale]/incident-map/components/CategoryLabelWithIcon'

type NestedCategoryCheckboxListProps = {
  categories: ParentCategory[]
  selectedSubCategories: string[] | null
  setSelectedSubCategories: React.Dispatch<React.SetStateAction<string[]>>
}

const NestedCheckboxList = ({
  categories,
  selectedSubCategories,
  setSelectedSubCategories,
}: NestedCategoryCheckboxListProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleExpand = (groupSlug: string) => {
    setExpanded((prev) => ({ ...prev, [groupSlug]: !prev[groupSlug] }))
  }

  const getSubcategorySlugs = (parentCategory: ParentCategory): string[] => {
    return parentCategory.sub_categories?.map((sub) => sub.slug) || []
  }

  const toggleSubCategory = (slug: string) => {
    setSelectedSubCategories((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((item) => item !== slug)
      } else {
        return [...prev, slug]
      }
    })
  }

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

  const isParentCategorySelected = (
    parentCategory: ParentCategory
  ): boolean => {
    const subcategorySlugs = getSubcategorySlugs(parentCategory)

    return (
      subcategorySlugs.length > 0 &&
      subcategorySlugs.every((slug) => selectedSubCategories?.includes(slug))
    )
  }

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
        const isExpanded = expanded[category.slug]

        return (
          <div key={category.slug} className="mb-3">
            <div className="flex items-center gap-1">
              <FormFieldCheckbox
                checked={isParentCategorySelected(category)}
                indeterminate={isParentCategoryIndeterminate(category)}
                label={CategoryLabelWithIcon(category)}
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
                  category.sub_categories.map((subCategory) => {
                    return (
                      <div
                        key={subCategory.slug}
                        className="flex items-center mt-1 gap-2"
                      >
                        <FormFieldCheckbox
                          checked={selectedSubCategories?.includes(
                            subCategory.slug
                          )}
                          label={CategoryLabelWithIcon(subCategory)}
                          onChange={() => toggleSubCategory(subCategory.slug)}
                        />
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default NestedCheckboxList
