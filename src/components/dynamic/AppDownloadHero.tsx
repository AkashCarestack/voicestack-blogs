import React from 'react'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Container from '../structure/Container'
import Section from '../structure/Section'
import H1 from '../typography/H1'
import { urlForImage } from '~/lib/sanity.image'
import Link from 'next/link'
import AppleIcon from '../../../public/assets/AppleIcon'
import PlayIcon from '../../../public/assets/PlayIcon'

interface AppDownloadHeroProps {
  data: any
  slugData?: any
}

const AppDownloadHero: React.FC<AppDownloadHeroProps> = ({ data }) => {
  if (!data) return null

  const {
    heroStrip,
    heroheading,
    heroDescription,
    heroImage,
    heroImageSecondary,
    appStoreLinks,
  } = data

  // Extract text from block content for heading
  const getHeadingText = () => {
    if (!heroheading || !Array.isArray(heroheading)) return ''
    const firstBlock = heroheading[0]
    if (firstBlock?.children && firstBlock.children.length > 0) {
      return firstBlock.children.map((child: any) => child.text || '').join('')
    }
    return ''
  }

  const headingText = getHeadingText()

  return (
    <Section className="relative  ">
      <Container className="relative justify-center">
        <div className="flex flex-col items-center md:max-w-[606px] w-full gap-3">
          {heroStrip && (
            <div className="flex justify-center items-center gap-2 rounded-full border border-white/10 bg-gray-50/5 w-fit">
              <span className="text-[#030712] text-center text-base font-medium leading-[120%] tracking-[0.84px] uppercase">
                {heroStrip}
              </span>
            </div>
          )}

          {/* Heading */}
          {heroheading && (
            <div className="flex flex-col">
              {headingText ? (
                <H1 className="text-center !text-[#030712]">
                  {headingText}
                </H1>
              ) : (
                <PortableText
                  value={heroheading}
                  components={{
                    block: {
                      normal: ({ children }) => (
                        <H1 className="text-center !text-[#030712]">
                          {children}
                        </H1>
                      ),
                    },
                  }}
                />
              )}
            </div>
          )}

          {/* Description */}
          {heroDescription && (
            <p className="text-[#030712] font-inter text-lg font-normal leading-[160%] text-center max-w-[600px] w-full">
              <PortableText
                value={heroDescription}
                components={{
                  block: {
                    normal: ({ children }) => <>{children}</>,
                  },
                }}
              />
            </p>
          )}

          {/* Download Section */}
          {appStoreLinks && (appStoreLinks.appStore || appStoreLinks.googlePlay) && (
            <div className="flex flex-col gap-4 items-center md:pt-12 pt-[10px]">
              {appStoreLinks.downloadText && (
                <p className="text-[#030712] text-lg font-medium leading-[160%] text-center">
                  {appStoreLinks.downloadText}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* App Store Button */}
                {appStoreLinks.appStore && (
                  <Link
                    href={appStoreLinks.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-6 px-2 py-2 pr-6 rounded-[18px] border border-white/20 bg-white hover:bg-white/90 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center w-[62px] h-[62px] rounded-xl bg-black/10">
                      <AppleIcon />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-gray-900 text-sm font-normal uppercase leading-[1.45]">
                        Download on
                      </span>
                      <span className="text-gray-900 text-xl font-semibold leading-[1.45]">
                        App Store
                      </span>
                    </div>
                  </Link>
                )}

                {/* Google Play Button */}
                {appStoreLinks.googlePlay && (
                  <Link
                    href={appStoreLinks.googlePlay}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-6 px-2 py-2 pr-6 rounded-[18px] border border-white/20 bg-white/15 hover:bg-white/25 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center w-[62px] h-[62px] rounded-xl bg-white">
                      <PlayIcon />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[#030712] text-sm font-normal uppercase leading-[1.45]">
                        GET IT ON
                      </span>
                      <span className="text-[#030712] text-xl font-semibold leading-[1.45]">
                        Google Play
                      </span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}

export default AppDownloadHero

