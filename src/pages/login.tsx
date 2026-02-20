import Head from 'next/head'
import { useRouter } from 'next/router';
import Button from '~/components/common/Button'

export default function LoginPage() {
  const  metadescptn="Login securely to your VoiceStack® account. Owners, managers, & team members can login to their VoiceStack® user account or reset their password."
  const router = useRouter();
  const locale = router.locale;
  const loginUrl = locale === 'en' ? 'https://id.voicestack.com/Account/Login' : locale === 'en-AU' ? 'https://id.voicestack.au/Account/Login' : locale === 'en-GB' ? 'https://id.voicestack.co.uk/Account/Login' : 'https://id.voicestack.com/Account/Login';
  return (
    <>
      <Head>
        <title>Login | VoiceStack® Login | VoiceStack® Secure Login</title>
        <meta name="title" content="Login | VoiceStack® Login | VoiceStack® Secure Login" />
        <meta name="description" content={metadescptn} />
        <meta property="og:description" content={metadescptn} />
        <meta name="keywords" content="login, voicestack login, voicestack log in, voicestack provider login" />
        <meta name="author" content="VoiceStack®" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Login | VoiceStack® Login | VoiceStack® Secure Login" />
        <link rel="canonical" href="https://www.voicestack.com/login" />
        <meta name="robots" content="index, follow, archive" />
        
      </Head>
      <div className="py-24 px-4">
        <div className="w-full gap-16 flex flex-col justify-center items-center min-h-[500px]">
          <div className="flex flex-col w-full items-center text-center gap-4 pb-8 max-w-[1020px]">
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

