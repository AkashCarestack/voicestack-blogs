import {
  ArrowTopRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  TruncateIcon,
} from '@sanity/icons'
import siteConfig from '~/resources-config/siteConfig'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

import GrowthClubLogo from '~/resources/assets/reactiveAssets/GrowthClubLogo'
import VoiceStackResources from '~/resources/assets/reactiveAssets/VoiceStackResources'
import Anchor from '~/resources/components/commonSections/Anchor'
import { useGlobalData } from '~/resources/components/Context/GlobalDataContext'
import Section from '~/resources/components/Section'
import { generateHref, getResourcesCmsLocale, normalizePath } from '~/resources/utils/common'

import { navigationLinks } from '../Header'
import Wrapper from '../Wrapper'

interface NavProps {
  className?: string
  showMenu?: boolean
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
}

export const NavPopover = ({
  className = '',
  showMenu,
  setShowMenu,
}: NavProps) => {
  const { data, featuredTags } = useGlobalData()
  const [active, setActive] = useState(false)
  const [showTags, setShowTags] = useState(false)
  const [tagData, setTagData] = useState(null)
  const [contentHeight, setContentHeight] = useState(0)
  const contentRef = useRef(null)
  const buttonRef = useRef(null)
  const navPopoverRef = useRef(null)
  const router = useRouter()
  const cmsLocale = getResourcesCmsLocale(router)

  useEffect(() => {
    const handleRouteChange = () => {
      if (showMenu) {
        setShowMenu(false)
        setShowTags(false)
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router, showMenu, setShowMenu])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMenu &&
        navPopoverRef.current &&
        !navPopoverRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false)
        setShowTags(false)
      }
    }

    // document.addEventListener('mousedown', handleClickOutside)
    // document.addEventListener('scroll',handleClickOutside) // can be used if needed
    return () => {
      // document.removeEventListener('mousedown', handleClickOutside)
      // document.removeEventListener('scroll',handleClickOutside)
    }
  }, [showMenu, setShowMenu])

  // useEffect(() => {
  //   if (active && contentRef.current) {
  //     setContentHeight(contentRef.current.scrollHeight)
  //   } else {
  //     setContentHeight(0)
  //   }
  // }, [active])

  useEffect(() => {
    if (data) setTagData(data)
  }, [tagData, data])


  const closeMenu = () => {
    setShowMenu(false)
    setShowTags(false)
  }

  const showTagsMob = () => {
    setShowTags(true)
  }

  const hideTagsMob = () => {
    setShowTags(false)
  }

  const handleMouseLeave = (event) => {
    const rect = buttonRef.current.getBoundingClientRect()
    const x = event.clientX
    const y = event.clientY
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setActive(false) // to hide default menu
    }
  }
  return (
    <section
      ref={navPopoverRef}
      className={`pt-[10px] px-4 lg:px-[10px] pb-[20px] lg:rounded-[12px] bg-white shadow-custom 
    justify-center bg-transparent fixed lg:absolute lg:top-0 left-0 w-full h-[100vh] lg:h-auto 
    lg:overflow-hidden top-0 transition-transform duration-300 linear z-20 lg:z-10 ${showMenu
          ? 'flex lg:translate-y-0 opacity-100 visible'
          : 'lg:-translate-y-3 opacity-0 invisible'
        }`}
    >
      <Wrapper>
        <div className={`${className} w-full lg:pt-0 pt-14`}>
          {/* <button
            ref={buttonRef}
            className="px-4 py-3 text-sm font-medium  hover:bg-zinc-300 rounded-md"
            onMouseEnter={handleMouseEnter}
          >
            <TruncateIcon width={40} height={40} />
          </button> */}
          <div
            className={`lg:hidden transition-all ease-out duration-200 flex fixed top-0 left-0 w-full py-4 px-4 z-20 bg-white border-b border-zinc-200 h-[56px] items-center justify-between`}
          >
            {showTags ? (
              <div className="flex items-center gap-0">
                <ChevronLeftIcon
                  width={25}
                  height={25}
                  className="text-zinc-900"
                />
                <span onClick={hideTagsMob} className="text-zinc-900 text-base">
                  Back
                </span>
              </div>
            ) : (
              <Anchor
                href={generateHref(cmsLocale, '')}
                className="text-zinc-900 font-monrope tracking-tighterText"
              >
                <VoiceStackResources/> 
              </Anchor>
            )}
            <CloseIcon
              width={40}
              height={40}
              onClick={closeMenu}
              className="text-black"
            />
          </div>
          <div className='flex flex-col h-full gap-40 flex-shrink-0'>
          
          <div id='mob-content'
            className={`transition-all duration-300 ease ${showTags && '-translate-x-[105%]'} lg:translate-x-0`}
          >
            <div
              ref={contentRef}
              className={`w-full transform transition-all duration-200}`}
            >
              <nav className="flex flex-col lg:flex-row gap-y-3 gap-x-2 lg:gap-x-2 flex-wrap rounded-[6px] py-[17px] lg:px-[20px] lg:bg-zinc-100">
                {navigationLinks?.map((link, i) => {
                  const isActive = router.pathname.startsWith(link.href) || router.asPath.includes(link.href)
                  return(
                  <Anchor
                    key={link.href}
                    href={generateHref(cmsLocale, link.href)}
                    className={`self-start font-medium text-base lg:text-sm flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 hover:bg-white hover:text-zinc-900 ${
                      isActive ? 'text-zinc-900 bg-white' : 'text-zinc-600'
                    }`}
                  >
                    {link.icon && <link.icon />}
                    {link.label}
                  </Anchor>
                )})}
              </nav>
              <div className="px-[10px] py-6 lg:p-6 lg:block hidden">
                <div className="text-zinc-400 pb-6 font-medium text-sm uppercase">
                  Browse  Topics
                </div>
                <div className="lg:columns-3 gap-6">
                  {tagData &&
                    tagData.length > 0 &&
                    tagData.map((tag, index) => {
                      const basePath = `${siteConfig.categoryBaseUrls.base}/${tag?.slug?.current || ''}`;
                      return(
                      <div className="break-inside-avoid pb-[14px]" key={tag?.slug?.current}>
                        <Anchor
                          href={generateHref(cmsLocale, basePath)}
                          scroll={false}
                          className="text-zinc-500 font-medium text-sm hover:text-zinc-600 transition-colors inlin-flex underline underline-offset-2"
                        >
                          <span>{tag?.categoryName}</span>
                        </Anchor>
                      </div>
                    )})}
                </div>
              </div>

              {/* <div // Hided 
                className="text-zinc-400 pt-3 font-medium text-sm uppercase lg:hidden flex items-center gap-1"
                onClick={showTagsMob}
              >
                Browse Topics
                <ChevronRightIcon
                  width={25}
                  height={25}
                  className="text-zinc-400"
                />
              </div> */}
            </div>
          </div>
          </div>
          {/* this duplicate is for mobile only */}
          {/* {showTags && ( */}
          <div
            className={`px-4 lg:px-[10px] flex flex-col gap-9  py-6 lg:p-6 lg:hidden block absolute top-[56px] h-full left-0 w-full overflow-auto transition-all duration-300 ease  ${showTags ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="columns-1 gap-6">
              {tagData &&
                tagData.length > 0 &&
                tagData.map((tag, index) => {
                  const basePath = `${siteConfig.categoryBaseUrls.base}/${tag?.slug?.current || ''}`;
                  const cleanHref = normalizePath(basePath)
                  return (
                    <div className="break-inside-avoid" key={cleanHref}>
                      <Anchor
                        href={generateHref(cmsLocale, cleanHref)}
                        scroll={false}
                        className="text-zinc-500 pb-[14px] font-medium text-sm flex hover:text-zinc-600 transition-colors"
                      >
                        <span>{tag?.categoryName}</span>
                      </Anchor>
                    </div>
                  )
                })}
            </div>
            <Anchor
              href={generateHref(cmsLocale, siteConfig.paginationBaseUrls.base)}
              className=" lg:flex text-[14px] group font-medium leading-[1.5] justify-center text-zinc-500 flex items-center gap-x-1 hover:text-zinc-300 group"
            >
              <span className="text-[14px] md:text-[16px] cursor-pointer text-zinc-500 font-medium text-sm hover:text-zinc-600 inline-flex items-center gap-1">
                {'Browse All'}
                <ArrowTopRightIcon className="group-hover:translate-y-[-2px] transition-transform duration-300" height={20} width={20} />
              </span>
            </Anchor>

          </div>

          {/* )} */}
          {/* ./ this is for mobile only */}

          {/* <Link
            href={`/${siteConfig.paginationBaseUrls.base}`}
            className="hidden lg:flex text-[14px] group font-medium leading-[1.5] justify-center text-zinc-500 flex items-center gap-x-1 hover:text-zinc-300 group"
          >
            <span className="text-[14px] md:text-[16px] cursor-pointer text-zinc-500 font-medium text-sm hover:text-zinc-600 inline-flex items-center gap-1">
              {'Browse All'}
              <ArrowTopRightIcon className="group-hover:translate-y-[-2px] transition-transform duration-300" height={20} width={20} />
            </span>
          </Link> */}
        </div>
      </Wrapper>
    </section>
  )
}
