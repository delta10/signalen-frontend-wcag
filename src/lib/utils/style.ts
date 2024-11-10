import { ClassValue, clsx } from 'clsx'

export const cn = (...inputs: ClassValue[]) => {
  return clsx(inputs)
}
