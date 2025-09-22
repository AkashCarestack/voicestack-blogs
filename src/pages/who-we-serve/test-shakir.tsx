import React from 'react'
import Queries from '~/components/revamp/queries'
import { GetStaticProps } from 'next'
import ListingWithTabs from '~/components/revamp/components/common/listingwithTabs'

interface TestShakirProps {
  data: any
}

export default function TestShakir({ data }: TestShakirProps) {
  console.log( data )
  return (
    <div className='h-screen w-full text-black'>
      <ListingWithTabs list={data} slug="effortlessly-handle" />
    </div>
  )
}
  


export const getStaticProps: GetStaticProps = async () => {
  // easily-handle-referenced
  // easily-handle
  const queries = new Queries('easily-handle')
  const data = await queries.getData()

  return {
    props: {
      data,
    },
  }
}

