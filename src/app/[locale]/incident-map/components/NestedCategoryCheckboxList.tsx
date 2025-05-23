import { FormFieldCheckbox, Icon } from '@/components'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { ParentCategory } from '@/types/category'
import { IconChevronDown } from '@tabler/icons-react'
import { CategoryLabelWithIcon } from '@/app/[locale]/incident-map/components/CategoryLabelWithIcon'
import { clsx } from 'clsx'

type NestedCategoryCheckboxListProps = {
  categories: ParentCategory[]
  selectedSubCategories: string[] | null
  setSelectedSubCategories: Dispatch<SetStateAction<string[]>>
  mobile?: boolean
}

/**
 * `NestedCheckboxList` is a React component that renders a hierarchical list of categories
 * and subcategories using checkboxes. It's typically used to allow users to filter items
 * based on category selections.
 *
 * - Parent categories are displayed as checkable items.
 * - If a parent category's `configuration.show_children_in_filter` is `true` and it has subcategories,
 *   a toggle is shown to expand and collapse the list of subcategories.
 * - Subcategories are displayed as nested checkboxes beneath their parent, provided they are
 *   allowed by the `show_children_in_filter` flag.
 * - The component supports indeterminate and fully-checked states for parent checkboxes
 *   depending on the selection status of their subcategories.
 */
const NestedCheckboxList = ({
  categories,
  selectedSubCategories,
  setSelectedSubCategories,
  mobile = false,
}: NestedCategoryCheckboxListProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  /**
   * Toggles the expanded/collapsed state of a category group by its slug.
   */
  const toggleExpand = (groupSlug: string) => {
    setExpanded((prev) => ({ ...prev, [groupSlug]: !prev[groupSlug] }))
  }

  /**
   * Retrieves an array of slugs for all subcategories under a given parent category.
   */
  const getSubcategorySlugs = (parentCategory: ParentCategory): string[] => {
    return parentCategory.sub_categories?.map((sub) => sub.slug) || []
  }

  /**
   * Toggles the selection state of a single subcategory.
   * If it's already selected, it gets removed; otherwise, it's added.
   */
  const toggleSubCategory = (slug: string) => {
    setSelectedSubCategories((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((item) => item !== slug)
      } else {
        return [...prev, slug]
      }
    })
  }

  /**
   * Toggles the selection state of an entire parent category.
   * If all its subcategories are selected, it deselects them.
   * Otherwise, it selects all of its subcategories.
   */
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

  /**
   * Determines whether all subcategories under a parent category are selected.
   */
  const isParentCategorySelected = (
    parentCategory: ParentCategory
  ): boolean => {
    const subcategorySlugs = getSubcategorySlugs(parentCategory)

    return (
      subcategorySlugs.length > 0 &&
      subcategorySlugs.every((slug) => selectedSubCategories?.includes(slug))
    )
  }

  /**
   * Determines whether some (but not all) subcategories under a parent category are selected.
   * Useful for showing an indeterminate checkbox state.
   */
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
            <div
              className={clsx(
                'flex items-center gap-1',
                mobile ? 'text-lg' : ''
              )}
            >
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
                        className={clsx(
                          'flex items-center mt-1 gap-2',
                          mobile ? 'text-lg' : ''
                        )}
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
