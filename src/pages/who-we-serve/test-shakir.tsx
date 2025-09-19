import React from 'react'
import Queries from '~/components/revamp/queries'
import { GetStaticProps } from 'next'
import ListingWithTabs from '~/components/revamp/components/common/listingwithTabs'

interface TestShakirProps {
  data: any
}

export default function TestShakir({ data }: TestShakirProps) {
  console.log({ data })
  return (
    <div className='h-screen w-full bg-black text-white'>
      <ListingWithTabs list={data} slug="test-data" />
      <h1>call the looping component here</h1>
    </div>
  )
}
  


export const getStaticProps: GetStaticProps = async () => {
  const queries = new Queries('dev-adolf-h')
  const data = await queries.getData()

  return {
    props: {
      data,
    },
  }
}

