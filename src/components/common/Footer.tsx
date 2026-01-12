import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import VoicestackLogo from 'public/assets/voicestack-logo-sm.svg'

import MacIcon from '../../../public/assets/reactive/macIcon'
import PlayIcon from '../../../public/assets/reactive/playIcon'

import Anchor from './anchor'
import Button from './Button'
import Container from '../structure/Container'
import Section from '../structure/Section'
import FooterBottom from '~/v2/components/FooterBottom'

const Footer = ({ data }) => {
  const CopyrightYear = new Date().getFullYear()
  const router = useRouter()

  // Add fallback data if data is null
  const safeData = data || {
    title: 'VoiceStack',
    footerColumns: [],
    socialMedia: {},
    bottomLinks: [],
    copyrightText: '© 2024 VoiceStack. All rights reserved.',
  }

  const [isUk, setIsUk] = useState(false)
  const [isAu, setIsAu] = useState(false)

  useEffect(() => {
    setIsUk(router.locale == 'en-GB')
    setIsAu(router.locale == 'en-AU')
  }, [router.locale])

  const noBannerPaths = ['/demo', '/en-GB/demo', '/en-AU/demo'];
  const path = router.pathname; // better for static paths
  const showBanner = !noBannerPaths.includes(path);

  // Social media icons component
  const SocialIcon = ({ href, title, children, className = '' }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={title}
      className={`md:h-[54px] md:w-[54px] p-3 md:p-0 group inline-flex items-center justify-center transition-colors duration-300 ${className}`}
      style={{
        borderRadius: 'var(--radius-lg, 8px)',
        border: '0 solid rgba(255, 255, 255, 0.40)',
        background: 'rgba(255, 255, 255, 0.10)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {children}
    </a>
  )

  return (
    <Section id="footer" className={'bg-black'}>
      <div className="flex justify-center w-full px-4 md:px-12">
        <div className="w-full flex flex-col gap-3">
          <FooterBottom data={data}/>

          {/* Main Footer Content */}
          <div className="pt-8 md:pt-3 bg-zinc-900 md:rounded-tr-[24px]  md:rounded-tl-[24px] rounded-tl-[12px] rounded-tr-[12px]">
            <Container className='flex flex-col gap-3 w-full max-w-[1144px]'>
            {/* Footer Columns */}
            {safeData?.footerColumns && safeData.footerColumns.length > 0 && (
              <div
                className="grid grid-cols-2 md:grid-cols-3 pt-8 pb-8 rounded-xl lg:grid-cols-5 gap-6"
                style={{
                  borderRadius: 'var(--radius-lg, 8px)',
                  border: '0 solid rgba(255, 255, 255, 0.40)',
                  // background: 'rgba(255, 255, 255, 0.10)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {safeData.footerColumns.map((column: any, index: number) => (
                  <div key={index} className="space-y-4">
                    <span className="font-geist text-base font-medium leading-6 tracking-normal" style={{ color: 'rgba(255, 255, 255, 0.40)' }}>
                      {column.titleLink ? (
                        <Anchor
                          href={column.titleLink}
                          target={column.titleLinkNewTab ? '_blank' : '_self'}
                          className="font-geist text-base font-medium leading-6 tracking-normal hover:text-white/80 transition-colors duration-300"
                          style={{ color: 'rgba(255, 255, 255, 0.40)' }}
                        >
                          {column.title}
                        </Anchor>
                      ) : (
                        <span className="font-geist text-base font-medium leading-6 tracking-normal" style={{ color: 'rgba(255, 255, 255, 0.40)' }}>
                          {column.title}
                        </span>
                      )}
                    </span>
                    <ul className="space-y-2">
                      {column.links &&
                        column.links.map((link: any, linkIndex: number) => (
                          <li key={linkIndex}>
                            <Anchor
                              href={link.link}
                              target={link.newTab ? '_blank' : '_self'}
                              className="text-white font-geist text-sm font-normal leading-5 tracking-normal hover:text-white/80 transition-colors duration-300"
                            >
                              {link.text}
                            </Anchor>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Footer Section */}
            <div className="py-3 border-gray-800 ">
              <div className="flex flex-col md:flex-row gap-2 items-center justify-between border-y border-dashed border-white/10 py-6">
                {/* Logo and Copyright */}
                <div className="flex md:gap-0 gap-6 flex-col md:flex-row md:h-[84px] items-center justify-between rounded-xl bg-zinc-900 flex-1 py-3 px-3 md:pl-8">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <Anchor
                      elementId="footer-logo"
                      href="/"
                      className="flex-shrink-0"
                    >
                      {data?.logo?.asset?.url ? (
                        <Image
                          src={data.logo.asset.url}
                          alt={data.logo.alt || 'VoiceStack'}
                          width={120}
                          height={40}
                          className="h-8 w-auto"
                        />
                      ) : (
                        <Image
                          src={VoicestackLogo}
                          alt="VoiceStack"
                          className="h-8 w-auto"
                        />
                      )}
                    </Anchor>
                  </div>

                  {/* App Store Links */}
                  {data?.appStoreLinks &&
                    (data.appStoreLinks.googlePlay ||
                      data.appStoreLinks.appStore) && (
                      <div className="flex gap-3">
                        {data.appStoreLinks.googlePlay && (
                          <a
                            href={data.appStoreLinks.googlePlay}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 p-3 text-white transition-colors duration-300"
                            style={{
                              borderRadius: 'var(--radius-lg, 8px)',
                              border: '0 solid rgba(255, 255, 255, 0.40)',
                              background: 'rgba(255, 255, 255, 0.10)',
                              backdropFilter: 'blur(8px)',
                            }}
                          >
                            <PlayIcon width={24} height={24} />
                            <div className="flex flex-col">
                              <span className="md:text-xs text-[10px] text-gray-300">
                                GET IT ON
                              </span>
                              <span className="md:text-sm text-xs font-semibold">
                                Google Play
                              </span>
                            </div>
                          </a>
                        )}
                        {data.appStoreLinks.appStore && (
                          <a
                            href={data.appStoreLinks.appStore}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 p-3 text-white transition-colors duration-300"
                            style={{
                              borderRadius: 'var(--radius-lg, 8px)',
                              border: '0 solid rgba(255, 255, 255, 0.40)',
                              background: 'rgba(255, 255, 255, 0.10)',
                              backdropFilter: 'blur(8px)',
                            }}
                          >
                            <MacIcon width={24} height={24} />
                            <div className="flex flex-col">
                              <span className="md:text-xs text-[10px] text-gray-300">
                                DOWNLOAD ON
                              </span>
                              <span className="md:text-sm text-xs font-semibold">
                                App Store
                              </span>
                            </div>
                          </a>
                        )}
                      </div>
                    )}
                </div>

                {/* Social Media Links */}
                {data?.socialMedia && (
                  <div className="flex items-center gap-3">
                    {data.socialMedia.linkedin && (
                      <SocialIcon
                        className=""
                        href={data.socialMedia.linkedin}
                        title="LinkedIn"
                      >
                        <svg
                          className="group-hover:text-white text-gray-400 transition-colors duration-300"
                          width="24"
                          height="24"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_312_57)">
                            <path
                              d="M18.5195 0H1.47656C0.660156 0 0 0.644531 0 1.44141V18.5547C0 19.3516 0.660156 20 1.47656 20H18.5195C19.3359 20 20 19.3516 20 18.5586V1.44141C20 0.644531 19.3359 0 18.5195 0ZM5.93359 17.043H2.96484V7.49609H5.93359V17.043ZM4.44922 6.19531C3.49609 6.19531 2.72656 5.42578 2.72656 4.47656C2.72656 3.52734 3.49609 2.75781 4.44922 2.75781C5.39844 2.75781 6.16797 3.52734 6.16797 4.47656C6.16797 5.42187 5.39844 6.19531 4.44922 6.19531ZM17.043 17.043H14.0781V12.4023C14.0781 11.2969 14.0586 9.87109 12.5352 9.87109C10.9922 9.87109 10.7578 11.0781 10.7578 12.3242V17.043H7.79688V7.49609H10.6406V8.80078H10.6797C11.0742 8.05078 12.043 7.25781 13.4844 7.25781C16.4883 7.25781 17.043 9.23438 17.043 11.8047V17.043V17.043Z"
                              fill="currentColor"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_312_57">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </SocialIcon>
                    )}

                    {data.socialMedia.facebook && (
                      <SocialIcon
                        href={data.socialMedia.facebook}
                        title="Facebook"
                      >
                        <svg
                          className="group-hover:text-white text-gray-400 transition-colors duration-300"
                          width="24"
                          height="24"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_312_58)">
                            <path
                              d="M10 0C4.4772 0 0 4.4772 0 10C0 14.6896 3.2288 18.6248 7.5844 19.7056V13.056H5.5224V10H7.5844V8.6832C7.5844 5.2796 9.1248 3.702 12.4664 3.702C13.1 3.702 14.1932 3.8264 14.6404 3.9504V6.7204C14.4044 6.6956 13.9944 6.6832 13.4852 6.6832C11.8456 6.6832 11.212 7.3044 11.212 8.9192V10H14.4784L13.9172 13.056H11.212V19.9268C16.1636 19.3288 20.0004 15.1128 20.0004 10C20 4.4772 15.5228 0 10 0Z"
                              fill="currentColor"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_312_58">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </SocialIcon>
                    )}

                    {data.socialMedia.instagram && (
                      <SocialIcon
                        href={data.socialMedia.instagram}
                        title="Instagram"
                      >
                        <svg
                          className="group-hover:text-white text-gray-400 transition-colors duration-300"
                          width="24"
                          height="24"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_312_59)">
                            <path
                              d="M10 1.80078C12.6719 1.80078 12.9883 1.8125 14.0391 1.85937C15.0156 1.90234 15.543 2.06641 15.8945 2.20313C16.3594 2.38281 16.6953 2.60156 17.043 2.94922C17.3945 3.30078 17.6094 3.63281 17.7891 4.09766C17.9258 4.44922 18.0898 4.98047 18.1328 5.95313C18.1797 7.00781 18.1914 7.32422 18.1914 9.99219C18.1914 12.6641 18.1797 12.9805 18.1328 14.0313C18.0898 15.0078 17.9258 15.5352 17.7891 15.8867C17.6094 16.3516 17.3906 16.6875 17.043 17.0352C16.6914 17.3867 16.3594 17.6016 15.8945 17.7813C15.543 17.918 15.0117 18.082 14.0391 18.125C12.9844 18.1719 12.668 18.1836 10 18.1836C7.32813 18.1836 7.01172 18.1719 5.96094 18.125C4.98438 18.082 4.45703 17.918 4.10547 17.7813C3.64063 17.6016 3.30469 17.3828 2.95703 17.0352C2.60547 16.6836 2.39063 16.3516 2.21094 15.8867C2.07422 15.5352 1.91016 15.0039 1.86719 14.0313C1.82031 12.9766 1.80859 12.6602 1.80859 9.99219C1.80859 7.32031 1.82031 7.00391 1.86719 5.95313C1.91016 4.97656 2.07422 4.44922 2.21094 4.09766C2.39063 3.63281 2.60938 3.29688 2.95703 2.94922C3.30859 2.59766 3.64063 2.38281 4.10547 2.20313C4.45703 2.06641 4.98828 1.90234 5.96094 1.85937C7.01172 1.8125 7.32813 1.80078 10 1.80078ZM10 0C7.28516 0 6.94531 0.0117187 5.87891 0.0585938C4.81641 0.105469 4.08594 0.277344 3.45313 0.523437C2.79297 0.78125 2.23438 1.12109 1.67969 1.67969C1.12109 2.23438 0.78125 2.79297 0.523438 3.44922C0.277344 4.08594 0.105469 4.8125 0.0585938 5.875C0.0117188 6.94531 0 7.28516 0 10C0 12.7148 0.0117188 13.0547 0.0585938 14.1211C0.105469 15.1836 0.277344 15.9141 0.523438 16.5469C0.78125 17.207 1.12109 17.7656 1.67969 18.3203C2.23438 18.875 2.79297 19.2188 3.44922 19.4727C4.08594 19.7188 4.8125 19.8906 5.875 19.9375C6.94141 19.9844 7.28125 19.9961 9.99609 19.9961C12.7109 19.9961 13.0508 19.9844 14.1172 19.9375C15.1797 19.8906 15.9102 19.7188 16.543 19.4727C17.1992 19.2188 17.7578 18.875 18.3125 18.3203C18.8672 17.7656 19.2109 17.207 19.4648 16.5508C19.7109 15.9141 19.8828 15.1875 19.9297 14.125C19.9766 13.0586 19.9883 12.7188 19.9883 10.0039C19.9883 7.28906 19.9766 6.94922 19.9297 5.88281C19.8828 4.82031 19.7109 4.08984 19.4648 3.45703C19.2188 2.79297 18.8789 2.23438 18.3203 1.67969C17.7656 1.125 17.207 0.78125 16.5508 0.527344C15.9141 0.28125 15.1875 0.109375 14.125 0.0625C13.0547 0.0117188 12.7148 0 10 0Z"
                              fill="currentColor"
                            />
                            <path
                              d="M10 4.86328C7.16406 4.86328 4.86328 7.16406 4.86328 10C4.86328 12.8359 7.16406 15.1367 10 15.1367C12.8359 15.1367 15.1367 12.8359 15.1367 10C15.1367 7.16406 12.8359 4.86328 10 4.86328ZM10 13.332C8.16016 13.332 6.66797 11.8398 6.66797 10C6.66797 8.16016 8.16016 6.66797 10 6.66797C11.8398 6.66797 13.332 8.16016 13.332 10C13.332 11.8398 11.8398 13.332 10 13.332Z"
                              fill="currentColor"
                            />
                            <path
                              d="M16.5391 4.66016C16.5391 5.32422 16 5.85938 15.3398 5.85938C14.6758 5.85938 14.1406 5.32031 14.1406 4.66016C14.1406 3.99609 14.6797 3.46094 15.3398 3.46094C16 3.46094 16.5391 4 16.5391 4.66016Z"
                              fill="currentColor"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_312_59">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </SocialIcon>
                    )}

                    {data.socialMedia.youtube && (
                      <SocialIcon
                        href={data.socialMedia.youtube}
                        title="YouTube"
                      >
                        <svg
                          className="group-hover:text-white text-gray-400 transition-colors duration-300"
                          width="24"
                          height="24"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.582 6.188a2.01 2.01 0 0 0-1.414-1.423C16.254 4.5 10 4.5 10 4.5s-6.254 0-8.168.265A2.01 2.01 0 0 0 .418 6.188C.154 8.102.154 12.5.154 12.5s0 4.398.264 6.312a2.01 2.01 0 0 0 1.414 1.423C3.746 20.5 10 20.5 10 20.5s6.254 0 8.168-.265a2.01 2.01 0 0 0 1.414-1.423c.264-1.914.264-6.312.264-6.312s0-4.398-.264-6.312ZM8.25 15.02V9.98l5.5 2.52-5.5 2.52Z"
                            fill="currentColor"
                          />
                        </svg>
                      </SocialIcon>
                    )}

                    {data.socialMedia.twitter && (
                      <SocialIcon
                        href={data.socialMedia.twitter}
                        title="Twitter"
                      >
                        <svg
                          className="group-hover:text-white text-gray-400 transition-colors duration-300"
                          width="24"
                          height="24"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18.258 3.266a6.84 6.84 0 0 1-1.89.518 3.43 3.43 0 0 0 1.504-1.89 6.84 6.84 0 0 1-2.17.83 3.43 3.43 0 0 0-5.84 3.13 9.73 9.73 0 0 1-7.07-3.58 3.43 3.43 0 0 0 1.06 4.58 3.41 3.41 0 0 1-1.55-.43v.04a3.43 3.43 0 0 0 2.75 3.36 3.41 3.41 0 0 1-1.55.06 3.43 3.43 0 0 0 3.2 2.38 6.87 6.87 0 0 1-4.26 1.47c-.28 0-.55-.02-.82-.06a9.7 9.7 0 0 0 5.25 1.54c6.3 0 9.74-5.22 9.74-9.74 0-.15 0-.3-.01-.45a6.96 6.96 0 0 0 1.71-1.77Z"
                            fill="currentColor"
                          />
                        </svg>
                      </SocialIcon>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Footer Links */}
              {safeData?.bottomLinks && safeData.bottomLinks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <ul className="flex flex-wrap items-center justify-center gap-4">
                    {safeData.bottomLinks.map(
                      (linkItem: any, index: number) => (
                        <li
                          className="text-gray-400 font-inter text-sm font-medium leading-[115%]"
                          key={index}
                        >
                          <Anchor
                            href={linkItem.link}
                            target={linkItem.newTab ? '_blank' : '_self'}
                            className="hover:text-white transition-colors duration-300"
                          >
                            {linkItem.text}
                          </Anchor>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div className="mb-5 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="text-zinc-600 font-inter text-sm font-medium leading-[115%]">
                @{CopyrightYear} {safeData?.copyrightText || 'VoiceStack'}
              </span>
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
                <Anchor
                  href="/system-requirements"
                  className="text-zinc-600 font-inter text-sm font-medium leading-[115%] hover:text-white transition-colors duration-300"
                >
                  System Requirements
                </Anchor>
                <Anchor
                  href="/legal/2025-01/privacy-policy"
                  className="text-zinc-600 font-inter text-sm font-medium leading-[115%] hover:text-white transition-colors duration-300"
                >
                  Privacy Policy
                </Anchor>
                <Anchor
                  href="/legal/2024-10/terms-and-conditions"
                  className="text-zinc-600 font-inter text-sm font-medium leading-[115%] hover:text-white transition-colors duration-300"
                >
                  Terms of Service
                </Anchor>
              </div>
            </div>

            </Container>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default Footer
