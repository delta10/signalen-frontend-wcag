export interface Links {
  curies: {
    name: string
    href: string
  }
  self: {
    href: string
  }
}

export interface Department {
  code: string
  name: string
  is_intern: boolean
}

export interface Category {
  _links: Links
  _display: string
  name: string
  slug: string
  public_name: string | null
  is_public_accessible: boolean
}

export interface Subcategory extends Category {
  handling: string
  departments: Department[]
  is_active: boolean
  description: string | null
  handling_message: string | null
}

export interface ParentCategory extends Category {
  sub_categories?: Subcategory[]
  configuration?: {
    show_children_in_filter: boolean
  }
}
