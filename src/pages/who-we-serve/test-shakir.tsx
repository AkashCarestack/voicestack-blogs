import React from 'react'
import { GetStaticProps } from 'next'
import { groq } from 'next-sanity'
import { getClient } from '~/lib/sanity.client'
import Head from 'next/head'

interface ShakirPageProps {
  data: {
    id: string
    basicInfo: {
      title: string
      slug: { current: string }
      description?: string
      icon?: any
    }
    content: any[]
    lang: string
  }
}

function Shakir({ data }: ShakirPageProps) {
  if (!data) {
    return (
      <div className="w-32 h-32 mt-96 bg-red-500">
        <h1>Page not found</h1>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{data.basicInfo.title} | VoiceStack</title>
        {data.basicInfo.description && (
          <meta name="description" content={data.basicInfo.description} />
        )}
      </Head>
      {console.log({data})}
      
      <div className="w-32 h-32 mt-96 bg-red-500">
        <h1>HI welcome to {data.basicInfo.title}</h1>
        {data.basicInfo.description && (
          <p>{data.basicInfo.description}</p>
        )}
        <pre>{JSON.stringify(data, null, 2)}</pre>

      </div>

    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const client = getClient()
  
  const query = groq`*[_type == "whoWeServe" && basicInfo.slug.current == "shakir"]{
    'id': _id,
    'basicInfo': basicInfo,
    'content': content,
    'lang': language
  }[0]`

  try {
    const data = await client.fetch(query)
    
    if (!data) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        data,
      },
      // Revalidate every 60 seconds in production
      revalidate: 60,
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      notFound: true,
    }
  }
}

export default Shakir
