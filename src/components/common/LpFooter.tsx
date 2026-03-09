import Image from 'next/image'
import { useRouter } from 'next/router'
import VoicestackLogo from 'public/assets/voicestack-logo-sm.svg'
import Anchor from './anchor'
import Container from '../structure/Container'
import Section from '../structure/Section'
import MacIcon from 'public/assets/reactive/macIcon'
import PlayIcon from 'public/assets/reactive/playIcon'

const LpFooter = ({ data }) => {
  const CopyrightYear = new Date().getFullYear()
  const router = useRouter()

  // Add fallback data if data is null
  const safeData = data || {
    title: 'VoiceStack',
    bottomLinks: [],
    copyrightText: '© 2024 VoiceStack. All rights reserved.',
  }

  return (
    <Section id="footer" className={'bg-black'}>
      <Container className="flex pt justify-center md:pt-12 pt-12">
        <div className="w-full">
          {/* Bottom Footer Section */}
          <div className="py-3 border-gray-800 ">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              {/* Logo and Copyright */}
              <div className="flex md:gap-0 gap-6 flex-col md:flex-row md:h-[84px] items-center justify-between rounded-xl bg-zinc-900 flex-1 py-3 px-3 md:px-8 w-full">
                <div className="flex flex-col md:flex-row items-center gap-4">
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
                  
                </div>
                {/* App Store Links */}
                {/* {data?.appStoreLinks &&
                    (data.appStoreLinks.googlePlay ||
                      data.appStoreLinks.appStore) && (
                      <div className="flex gap-3">
                        {data.appStoreLinks.googlePlay && (
                          <a
                            href={data.appStoreLinks.googlePlay}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 px-4 py-3 text-white transition-colors duration-300"
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
                            className="inline-flex items-center gap-3 px-4 py-3 text-white transition-colors duration-300"
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
                    )} */}
                <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
                 
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
            </div>

           
          </div>
          <div className="mb-5 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-zinc-600 font-inter text-sm font-medium leading-[115%]">
              @{CopyrightYear} {safeData?.copyrightText || 'VoiceStack. All rights reserved'}
            </span>
            
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default LpFooter

