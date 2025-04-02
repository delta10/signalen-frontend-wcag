import React from 'react'
import { Icon } from '@/components'
import { IconMapPinFilled } from '@tabler/icons-react'
import { Category } from '@/types/category'

export const CategoryIcon = (category: Category) => {
  const categoryIcon = category?._links?.['sia:icon']?.href || null

  return (
    <Icon className="!w-7 !h-7">
      {categoryIcon ? (
        <img src={categoryIcon} alt="Categorie icoon" />
      ) : (
        <IconMapPinFilled color="currentColor" />
      )}
    </Icon>
  )
}

export const CategoryLabelWithIcon = (category: Category) => {
  if (!category) {
    return
  }

  return (
    <span className="flex gap-2">
      {CategoryIcon(category)}
      {category.name}
    </span>
  )
}
