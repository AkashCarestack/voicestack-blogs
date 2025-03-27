// pages/[slug].tsx
import { GetStaticProps, GetStaticPaths } from 'next'
import { groq } from 'next-sanity'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import type { SanityClient } from 'next-sanity'
import Header from '~/components/common/Header'
import { getALLHomeSettings } from '~/lib/sanity.queries'
import { getHeroSectionData } from '~/lib/sanity.queries'
import { useContext, useEffect } from 'react'
import { BookDemoContext } from '~/providers/BookDemoProvider'

interface PageProps {
  page: {
    title: string
    content: any[]
    // Add other fields you need
  }
  homeSettings:any;
  heroData:any;
  region: string
}

export default function Page({ page, homeSettings, heroData, region }: PageProps) {
  const { isDemoPopUpShown, setIsDemoPopUpShown } = useContext(BookDemoContext);
  
  useEffect(() => {
    setIsDemoPopUpShown(heroData);
  },[heroData])
  
  if (!page) return <div>Page not found</div>
  return (
    <>
      <Header data={homeSettings} />
      <div>
        <h1>{page.title}{region}</h1>
        {/* Add your content rendering here */}
      </div>
    </>
  )
}

// Helper function for page data fetching
async function getPageData(client: SanityClient, slug: string, region: string) {
  const query = groq`*[_type == "page" && slug.current == $slug && language == $region][0]{
    title,
    content,
    // Add other fields you need
  }`
  
  return await client.fetch(query, { slug, region })
}



export const getStaticProps: GetStaticProps<PageProps> = async ({
  params,
  locale,
  draftMode = false,
}) => {
  const region = locale
  const slug = params?.slug as string
  
  const client = getClient(draftMode ? { token: readToken } : undefined) as SanityClient
  const [page, homeSettings, heroData] = await Promise.all([
    getPageData(client, slug, region),
    getALLHomeSettings(client, region),
    getHeroSectionData(client, region),

  ])

  if (!page) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      page,
      homeSettings,
      heroData,
      region
    },
    // revalidate: 60
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient()
  
  // Get all pages with their slugs and languages
  const query = groq`*[_type == "page"]{
    "slug": slug.current,
    language
  }`
  
  const pages = await client.fetch(query)
  
  // Create paths for each page in each language
  const paths = pages.map((page: any) => ({
    params: { 
      slug: page.slug
    },
    // This matches your existing locale pattern
    locale: page.language 
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}

