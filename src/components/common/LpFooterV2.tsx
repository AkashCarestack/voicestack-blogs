import Image from 'next/image'
import { useRouter } from 'next/router'
import VoicestackLogo from 'public/assets/voicestack-logo.svg'
import VoicestackLogoWhite from 'public/assets/voicestack-logo-white.svg'
import MacIcon from 'public/assets/reactive/macIcon'
import PlayIcon from 'public/assets/reactive/playIcon'
import Anchor from '~/components/common/anchor'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import FooterBottom from '~/v2/components/FooterBottom'

const LpFooterV2 = ({ data }) => {
  const copyrightYear = new Date().getFullYear()
  const router = useRouter()
  const isUk = router.locale === 'en-GB'
  const isAu = router.locale === 'en-AU'

  const safeData = data || {
    title: 'VoiceStack',
    appStoreLinks: {},
    copyrightText: 'VoiceStack. All rights reserved.',
  }
  const googlePlayLink = safeData?.appStoreLinks?.googlePlay || '/download-app'
  const appStoreLink = safeData?.appStoreLinks?.appStore || '/download-app'
  const logoUrl =
    safeData?.logo?.asset?.url ||
    safeData?.logo?.url ||
    safeData?.logoUrl ||
    null
  const logoAlt = safeData?.logo?.alt || safeData?.logo?.altText || 'VoiceStack'

  return (
    <>
      <Section id="footer" className="bg-black">
        <div className="flex justify-center w-full px-4 md:px-12">
          <div className="w-full">
            <FooterBottom data={data} />
              <div className="w-full rounded-xl bg-zinc-900 mt-3 md:pt-8 pt-3 md:pb-3 pb-3 ">
              <Container className="flex flex-col gap-3 justify-center   md:px-0 px-4 border-t border-dotted border-white/10">

                <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:py-6 py-4 px-4 md:px-8 border-b border-dotted border-white/10">
                  <Anchor href="/" className="flex-shrink-0">
                    
                      <Image
                        src={VoicestackLogoWhite}
                        alt="VoiceStack"
                        className="h-8 w-auto"
                      />
                  </Anchor>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={googlePlayLink}
                      target={googlePlayLink.startsWith('http') ? '_blank' : '_self'}
                      rel={googlePlayLink.startsWith('http') ? 'noreferrer' : undefined}
                      className="inline-flex items-center gap-2.5 px-3 py-2 text-white rounded-lg transition-colors duration-300 bg-white/10 hover:bg-white/15"
                    >
                      <PlayIcon width={20} height={20} />
                      <div className="flex flex-col leading-none">
                        <span className="text-[9px] text-gray-300">GET IT ON</span>
                        <span className="text-sm font-semibold">Google Play</span>
                      </div>
                    </a>
                    <a
                      href={appStoreLink}
                      target={appStoreLink.startsWith('http') ? '_blank' : '_self'}
                      rel={appStoreLink.startsWith('http') ? 'noreferrer' : undefined}
                      className="inline-flex items-center gap-2.5 px-3 py-2 text-white rounded-lg transition-colors duration-300 bg-white/10 hover:bg-white/15"
                    >
                      <MacIcon width={20} height={20} />
                      <div className="flex flex-col leading-none">
                        <span className="text-[9px] text-gray-300">DOWNLOAD ON</span>
                        <span className="text-sm font-semibold">App Store</span>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 md:px-8 py-4">
                  <span className="text-zinc-600 font-inter text-xs md:text-sm font-medium leading-[115%]">
                    @{copyrightYear} {safeData?.copyrightText || 'VoiceStack'}
                  </span>
                  <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-zinc-600">
                    <Anchor
                      href="/system-requirements"
                      className="text-zinc-600 font-inter text-xs md:text-sm font-medium leading-[115%] hover:text-white transition-colors duration-300"
                    >
                      System Requirements
                    </Anchor>
                    <span className="text-zinc-700">•</span>
                    {isAu ? (
                      <>
                        <Anchor
                          href="/legal/aus/2024-11/privacy-policy"
                          className="text-zinc-600 font-inter text-xs md:text-sm font-medium leading-[115%] hover:text-white transition-colors duration-300"
                          locale={false}
                        >
                          Privacy Policy
                        </Anchor>
                        <span className="text-zinc-700">•</span>
                        <Anchor
                          href="/legal/aus/2024-11/saas-customer-agreement"
                          className="text-zinc-600 font-inter text-xs md:text-sm font-medium leading-[115%] hover:text-white transition-colors duration-300"
                          locale={false}
                        >
                          Terms of Service
                        </Anchor>
                      </>
                    ) : isUk ? (
                      <>
                        <Anchor
                          href="/legal/uk/2024-11/privacy-policy"
                          className="text-zinc-600 font-inter text-xs md:text-sm font-medium leading-[115%] hover:text-white transition-colors duration-300"
                          locale={false}
                        >
                          Privacy Policy
                        </Anchor>
                        <span className="text-zinc-700">•</span>
                        <Anchor
                          href="/legal/uk/2024-11/terms-and-conditions"
                          className="text-zinc-600 font-inter text-xs md:text-sm font-medium leading-[115%] hover:text-white transition-colors duration-300"
                          locale={false}
                        >
                          Terms of Service
                        </Anchor>
                      </>
                    ) : (
                      <>
                        <Anchor
                          href="/legal/2026-1/privacy-policy"
                          className="text-zinc-600 font-inter text-xs md:text-sm font-medium leading-[115%] hover:text-white transition-colors duration-300"
                          locale={false}
                        >
                          Privacy Policy
                        </Anchor>
                        <span className="text-zinc-700">•</span>
                        <Anchor
                          href="/legal/2026-2/terms-and-conditions"
                          className="text-zinc-600 font-inter text-xs md:text-sm font-medium leading-[115%] hover:text-white transition-colors duration-300"
                          locale={false}
                        >
                          Terms of Service
                        </Anchor>
                      </>
                    )}
                  </div>
                </div>
                </Container>
              </div>
            
          </div>
        </div>
      </Section>
    </>
  )
}

export default LpFooterV2
