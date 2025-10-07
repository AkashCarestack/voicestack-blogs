import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import CustomHead from '~/components/common/CustomHead'

interface PageProps {
  slug: string
}

export default function WhyVoicestackSlugPage({ slug }: PageProps) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
      <CustomHead 
        title={`Why VoiceStack - ${slug}`}
        description="Learn why VoiceStack is the best choice for your dental practice"
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Why VoiceStack - {slug}
            </h1>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Coming Soon
              </h2>
              <p className="text-gray-600">
                This page is under construction. Content for &quot;{slug}&quot; will be available soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string

  return {
    props: {
      slug
    },
    revalidate: 60
  }
}