import Footer from './common/Footer'
import Header from './common/Header'
import ImageSwitchProvider from '~/providers/ImageSwitchProvider'
import NavigationContextProvider from '~/providers/NavigationContextProvider'
import { useLayoutData } from '~/providers/LayoutDataProvider'

interface LayoutProps {
  children: React.ReactNode
  fullWidth?: boolean
  className?: string
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

  // Only show loading state if we truly don't have data yet
  // Don't hide header/footer if we're just waiting for new data during navigation
  if (loading && !headerData && !footerData) {
    return (
      <NavigationContextProvider>
        <ImageSwitchProvider>
          <div className={`flex flex-col w-full items-center}`}>
            <div className="w-full flex flex-col">{children}</div>
          </div>
        </ImageSwitchProvider>
      </NavigationContextProvider>
    );
  }

  return (
    // <NavigationContextProvider>
    //   <ImageSwitchProvider>

        <div
          className={`flex flex-col w-full items-center pt-[48px] lg:pt-[108px] bg-[#F9F9F9]`}
        >
          {headerData && <Header data={headerData} />}
          <div className="w-full flex flex-col">{children}</div>
          {footerData && <Footer data={footerData} />}
        </div>
    //   </ImageSwitchProvider>
    // </NavigationContextProvider>
  )
}
