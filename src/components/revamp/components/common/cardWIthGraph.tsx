import React from 'react'
import Container from '~/components/structure/Container'
import Image from 'next/image'
import CardItemComponent from './CardItem'

export default function cardWIthGraph({ data }: { data: any }) {
    console.log(data,'data')
  return (
    <Container>
        <div>
            <div className='w-full h-full'>
            <Image src="/assets/events/graph.png" width={646} height={247} alt="graph" />
           <>{data?.items?.map((ele:any)=>{
            return (<CardItemComponent item={ele} />)
           })}
           </>
</div>
        </div>

    </Container>
  )
}
