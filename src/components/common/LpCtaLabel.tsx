import { useLpCtaText } from '~/providers/LpMangoCopyProvider'

interface LpCtaLabelProps {
  children: string
}

export default function LpCtaLabel({ children }: LpCtaLabelProps) {
  return (
    <span className="relative z-10 inline-flex items-center">
      {useLpCtaText(children)}
    </span>
  )
}
