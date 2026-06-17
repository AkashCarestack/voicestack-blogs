import VsFooter from '~/components/common/Footer'
import ResourcesHeaderStack from '~/resources/layout/ResourcesHeaderStack'
import { useLayoutData } from '~/providers/LayoutDataProvider'

interface LayoutProps {
  children: React.ReactNode
  fullWidth?: boolean
  className?: string
}

export default function Layout({
  children,
  className,
  fullWidth = false,
}: LayoutProps) {
  const { footerData } = useLayoutData()

  return (
    <div
      className={`flex flex-col w-full h-full items-center min-h-[100vh]`}
    >
      <ResourcesHeaderStack />
      <main className="w-full flex flex-col bg-white pt-resourcesStackSpacerMob md:pt-resourcesStackSpacer">
        {children}
      </main>
      {footerData && (
        <VsFooter data={footerData} />
      )}
    </div>
  )
}
