import Footer from './common/Footer'
import Header from './common/Header'
import LpFooter from './common/LpFooter'
import ImageSwitchProvider from '~/providers/ImageSwitchProvider'
import NavigationContextProvider from '~/providers/NavigationContextProvider'
import HeaderContextProvider from '~/providers/HeaderContextProvider'
import { useLayoutData } from '~/providers/LayoutDataProvider'
import { useRouter } from 'next/router'

interface LayoutProps {
  children: React.ReactNode
  fullWidth?: boolean
  className?: string
}

interface LayoutRule {
  pathPrefix: string
  hideHeader?: boolean
  hideFooter?: boolean
  compactTopSpacing?: boolean
  footerVariant?: 'lp'
}


// const Layout = (props) => {
//   return (
//     <NavigationContextProvider>
//       <div className={`flex flex-col min-h-screen ${props.className}`}>
//         {/* <Header {...props} /> */}
//         <main>{props.children}</main>
//         {/* <Footer {...props} /> */}
//       </div>
//     </NavigationContextProvider>
//   )
// }

// export default Layout

export default function Layout({
  children,
  className,
  fullWidth = false,
}: LayoutProps) {

  const { headerData, footerData, loading, error } = useLayoutData();
  const router = useRouter();

  const layoutRules: LayoutRule[] = [
    {
      pathPrefix: '/company/partners/',
      hideHeader: true,
      compactTopSpacing: true,
      footerVariant: 'lp',
    },
    {
      pathPrefix: '/lp/',
      hideHeader: true,
      hideFooter: true,
      compactTopSpacing: true,
    },
  ] as const

  const matchedLayoutRule = layoutRules.find(({ pathPrefix }) =>
    router.pathname.startsWith(pathPrefix)
  )
  const hideHeader = Boolean(matchedLayoutRule?.hideHeader)
  const hideFooter = Boolean(matchedLayoutRule?.hideFooter)
  const compactTopSpacing = Boolean(matchedLayoutRule?.compactTopSpacing)
  const useLpFooter = matchedLayoutRule?.footerVariant === 'lp'

  // Only show loading state if we truly don't have data yet
  // Don't hide header/footer if we're just waiting for new data during navigation
  if (loading && !headerData && !footerData) {
    return (
      <HeaderContextProvider>
        <NavigationContextProvider>
          <ImageSwitchProvider>
            <div className={`flex flex-col w-full items-center}`}>
              <div className="w-full flex flex-col">{children}</div>
            </div>
          </ImageSwitchProvider>
        </NavigationContextProvider>
      </HeaderContextProvider>
    );
  }

  return (
    <HeaderContextProvider>
      {/* <NavigationContextProvider> */}
      {/*   <ImageSwitchProvider> */}

        <div
          className={`flex flex-col w-full items-center ${compactTopSpacing ? 'pt-[76px] lg:pt-[76px]' : 'pt-[48px] lg:pt-[108px]'} bg-[#F9F9F9]`}
        >
          {headerData && !hideHeader && <Header data={headerData} />}
          <div className="w-full flex flex-col">{children}</div>
          {footerData && !hideFooter && (useLpFooter ? <LpFooter data={footerData} /> : <Footer data={footerData} />)}
        </div>
      {/*   </ImageSwitchProvider> */}
      {/* </NavigationContextProvider> */}
    </HeaderContextProvider>
  )
}
