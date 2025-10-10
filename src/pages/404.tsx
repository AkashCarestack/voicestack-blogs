import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Custom404: NextPage = () => {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | VoiceStack</title>
        <meta name="description" content="The page you are looking for could not be found." />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
            <p className="text-lg text-gray-600 mb-8">
              Sorry, the page you are looking for could not be found.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link 
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Go Back Home
            </Link>
  
          </div>
        </div>
      </div>
    </>
  )
}

export default Custom404
