import { IconLoader2 } from '@tabler/icons-react'
import { Icon } from '@/components'
import './Spinner.css'

export const Spinner = () => (
  <Icon className="signalen-loading-icon">
    <IconLoader2 className="animate-spin" />
  </Icon>
)
