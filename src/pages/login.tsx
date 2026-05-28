import Head from 'next/head'
import { useRouter } from 'next/router'
import Button from '~/components/common/Button'
import { buildUrl, getSiteBaseUrl } from '~/components/utils/alternatePaths'

export default function LoginPage() {
  
  const router = useRouter();
  const locale = router.locale;
  const notEnGB= router.locale =="en-AU" || router.locale =="en"
  const name= notEnGB ? "VoiceStack®" : "VoiceStack"
  const  metadescptn= notEnGB ? "Login securely to your VoiceStack® account. Owners, managers, & team members can login to their VoiceStack® user account or reset their password.":"Login securely to your VoiceStack account. Owners, managers, & team members can login to their VoiceStack user account or reset their password."
  const title= notEnGB ? "Login | VoiceStack® Login | VoiceStack® Secure Login":"Login | VoiceStack Login | VoiceStack Secure Login"
  const canonicalUrl = buildUrl('login', locale || 'en', getSiteBaseUrl())
  const loginUrl = locale === 'en' ? 'https://id.voicestack.com/Account/Login' : locale === 'en-AU' ? 'https://id.voicestack.au/Account/Login' : locale === 'en-GB' ? 'https://id.voicestack.co.uk/Account/Login' : 'https://id.voicestack.com/Account/Login';
  const canonical = locale === 'en' ? 'https://voicestack.com/login' : locale === 'en-AU' ? 'https://voicestack.com/en-AU/login' : locale === 'en-GB' ? 'https://voicestack.com/en-GB/login' : 'https://voicestack.com/login';
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={metadescptn} />
        <meta property="og:description" content={metadescptn} />
        <meta name="keywords" content={title} />
        <meta name="author" content={name} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title}/>
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="index, follow, archive" />
        
      </Head>
      <div className="py-24 px-4">
        <div className="w-full gap-16 flex flex-col justify-center items-center min-h-[500px]">
          <div className="flex flex-col w-full items-center text-center gap-4 pb-8 m\ax-w-[1020px]">
            <div className="flex flex-col gap-4 w-full">
              <h1 className="text-2xl font-semibold leading-6 text-gray-900">
                VoiceStack Login
              </h1>
              <p className="text-gray-500">
                If you are a VoiceStack user, click to login.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-5 justify-center items-center w-full">
                <Button
                  type="primary"
                  className="w-fit"
                  link={loginUrl}
                >
                  <span>Log in to VoiceStack</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

