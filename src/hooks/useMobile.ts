import { useMediaQuery } from '@uidotdev/usehooks'

export const useIsMobile = () => {
  // Checks for screen widths up to 768px (common mobile breakpoint)
  return useMediaQuery('(max-width: 768px)')
}
