import { ArrowRightIcon } from '@sanity/icons'
import { CloseIcon } from '@sanity/icons'
import { MenuIcon } from '@sanity/icons'
import siteConfig from '~/resources-config/siteConfig'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

// import { ArticlesIcon } from '~/resources/assets/reactiveAssets/svgs'
import VoiceStackResources from '~/resources/assets/reactiveAssets/VoiceStackResources'
import Anchor from '~/resources/components/commonSections/Anchor'
import { useGlobalData } from '~/resources/components/Context/GlobalDataContext'
import { generateHref } from '~/resources/utils/common'
import ProgressBar from '~/resources/utils/progressBar/progressBar'
import useMediaQuery from '~/resources/utils/useMediaQueryHook'
import Button from '~/components/common/Button'
import { useHeaderContext } from '~/providers/HeaderContextProvider'

import { NavPopover } from './overlaynav/NavPopover'
import { ShortNavPopover } from './overlaynav/ShortNavPopover'

type NavigationLink = {
  href: string
  label: string
  icon?: React.ComponentType
}

export const navigationLinks: NavigationLink[] = [
  // { href: siteConfig.pageURLs.article, label: 'Articles', icon: ArticlesIcon },
  { href: siteConfig.categoryBaseUrls.base, label: 'All Topics' },
]

interface HeaderProps {
  topOffset?: number
  headerFixed?: boolean
}

const Header = ({
  topOffset = 0,
  headerFixed = false,
}: HeaderProps) => {
  const { homeSettings } = useGlobalData()
  const router = useRouter()
  const { locale } = router.query
  const [showMenu, setShowMenu] = useState(false)
  const [navPopoverId, setNavPopoverId] = useState<string | null>(null)
  const pathname = usePathname()
  const { showResourceCtas } = useHeaderContext()

  const toggleMenu = () => {
    setShowMenu(!showMenu)
    if (window.innerWidth < 1024 && showMenu === true) {
      document.body.classList.add('menu-active')
    } else {
      document.body.classList.remove('menu-active')
    }
    setNavPopoverId(Math.random().toString(36).substr(2, 9))
  }

  const isMobile: boolean = useMediaQuery(1024)

  const demoBannerOffset =
    headerFixed && homeSettings?.demoBanner ? -44 : 0
  const computedTop = topOffset + demoBannerOffset

  return (
    <>
      <ProgressBar />
      <div className="relative w-full before:content-[''] before:-z-0 before:absolute before:left-0 before:right-0 before:top-[-100px] before:bg-white">
        <header
          className="fixed w-full left-0 z-20 transition-all duration-300 ease-linear"
          style={{ top: computedTop }}
        >
          {homeSettings?.demoBanner && (
            <div className="bg-cs-primary group hover:bg-[#42dd88] transition-all duration-200 px-4 h-[44px]">
              <Anchor
                href="https://voicestack.com/?refer=carestack "
                className="flex justify-center py-3"
              >
                <div className="max-w-7xl flex justify-center gap-3 w-full items-center">
                  <div className="text-xs md:text-sm text-zinc-900">
                    {` Book a Demo with us - It's free!`}
                  </div>
                  <div className="flex items-center gap-1 text-xs md:text-sm text-zinc-800 font-medium">
                    <span>{`Register Now`}</span>
                    <ArrowRightIcon className="w-5 h-5 text-zinc-800 group-hover:translate-x-[4px] transition-transform duration-300 ease-in-out" />
                  </div>
                </div>
              </Anchor>
            </div>
          )}

          <div className="z-10 bg-white text-zinc-900 border-b border-gray-200 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-row gap-2 justify-between items-center py-3">
                  <Anchor
                    href={generateHref(locale as string, '')}
                    className="font-monrope tracking-tighterText flex items-center shrink-0"
                  >
                    <VoiceStackResources />
                  </Anchor>
                  <div className="flex flex-1 lg:gap-10 gap-3 justify-end rounded-xl items-center">
                    {!isMobile && (
                      <div className="group relative py-4">
                        {navPopoverId && (
                          <ShortNavPopover
                            navPopoverId={navPopoverId}
                            showMenu={showMenu}
                            setShowMenu={setShowMenu}
                            className="z-10 group-hover:block group-hover:visible group-hover:opacity-100 "
                          />
                        )}
                      </div>
                    )}
                    <nav className="hidden lg:flex flex-row lg:gap-2 flex-wrap items-center">
                      {navigationLinks?.map((link) => {
                        const isActive = pathname.includes(link.href)
                        return (
                        <Anchor
                          key={link.href}
                          href={generateHref(locale as string, link.href)}
                          className={`text-base rounded-full px-4 py-2 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-900 ${
                            isActive
                              ? 'text-zinc-900 font-medium bg-zinc-100'
                              : 'text-zinc-600'
                          }`}
                        >
                          {link.label}
                        </Anchor>
                      )})}
                    </nav>
                    <div
                      className={`hidden lg:flex gap-6 items-center overflow-hidden transition-all duration-300 ease-out ${
                        showResourceCtas
                          ? 'max-w-[320px] opacity-100 translate-x-0'
                          : 'max-w-0 opacity-0 -translate-x-6 pointer-events-none'
                      }`}
                    >
                      <Button
                        type="borderless"
                        className={`w-fit shrink-0 text-sm font-medium transition-all duration-300 ease-out ${
                          showResourceCtas
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-4'
                        }`}
                        style={{ transitionDelay: showResourceCtas ? '50ms' : '0ms' }}
                        link="/pricing"
                      >
                        Pricing
                      </Button>
                      <Button
                        type="primary"
                        className={`shrink-0 m-1 transition-all duration-300 ease-out ${
                          showResourceCtas
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-4'
                        }`}
                        style={{ transitionDelay: showResourceCtas ? '120ms' : '0ms' }}
                        link="/demo"
                      >
                        <span className="text-sm font-medium">Book Free Demo</span>
                      </Button>
                    </div>
                    <div
                      className={`flex gap-3 items-center lg:hidden overflow-hidden transition-all duration-300 ease-out ${
                        showResourceCtas
                          ? 'max-w-[200px] opacity-100 translate-x-0'
                          : 'max-w-0 opacity-0 -translate-x-4 pointer-events-none'
                      }`}
                    >
                      <Button
                        type="primary"
                        className={`w-fit shrink-0 transition-all duration-300 ease-out ${
                          showResourceCtas
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-4'
                        }`}
                        link="/demo"
                      >
                        <span className="text-sm font-medium">Book Free Demo</span>
                      </Button>
                    </div>
                    <div className="flex gap-3 items-center lg:hidden">
                      {isMobile && (
                        <div
                          onClick={toggleMenu}
                          className={`flex text-zinc-900 cursor-pointer items-center select-none z-20 rounded-lg lg:rounded-xl lg:py-[6px] lg:pr-[10px] lg:pl-[14px] ${
                            showMenu
                              ? 'absolute top-5 lg:top-[8px] right-5 lg:right-[8px] lg:relative'
                              : 'bg-white'
                          }`}
                        >
                          {!showMenu && (
                            <span className="hidden lg:inline-flex text-zinc-800 text-sm">
                              More
                            </span>
                          )}
                          {showMenu ? (
                            <CloseIcon width={40} height={40} />
                          ) : (
                            <MenuIcon width={40} height={40} />
                          )}
                        </div>
                      )}
                    </div>
                    <NavPopover
                      showMenu={showMenu}
                      setShowMenu={setShowMenu}
                      className="z-10"
                    />
                  </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  )
}

export default Header
