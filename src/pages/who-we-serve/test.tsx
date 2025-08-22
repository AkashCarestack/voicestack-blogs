import { GetStaticProps } from 'next'
import SimpleHead from '~/components/common/SimpleHead'

interface TestPageProps {
  message: string
}

export default function TestPage({ message }: TestPageProps) {
  return (
    <div className="min-h-screen bg-white p-8">
      <SimpleHead
        title="Test Page"
        description="A simple test page to debug routing"
      />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          Test Page Working! 🎉
        </h1>
        
        <div className="bg-green-100 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Success!</h2>
          <p className="text-green-700">
            This test page is working correctly. The routing is functioning.
          </p>
        </div>

        <div className="bg-blue-100 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Message from Server</h2>
          <p className="text-blue-700">{message}</p>
        </div>

        <div className="bg-yellow-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Next Steps</h2>
          <p className="text-yellow-700">
            If you can see this page, the routing is working. The issue is likely in the dynamic page rendering or Sanity queries.
          </p>
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      message: "Hello from the server! This page was generated at build time."
    }
  }
}




