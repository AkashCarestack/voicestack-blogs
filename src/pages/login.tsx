import Head from 'next/head'
import Button from '~/components/common/Button'

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | VoiceStack® Login | VoiceStack® Practice Login</title>
        <meta name="description" content="Login securely to your VoiceStack® account. Dentists, managers, &amp; team members can login to their VoiceStack® user account or reset their password." />
        <meta name="keywords" content="login, voicestack login, voicestack log in, voicestack provider login" />
        <meta name="author" content="VoiceStack®" />
        
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
                  link="https://id.voicestack.com/Account/Login"
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

