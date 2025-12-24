import React from 'react'
import Container from '~/components/structure/Container'
import Image from 'next/image'
import CardItemComponent from '../../../../v2/components/common/CardItem'
import Section from '~/components/structure/Section'
import SectionHeaderV2 from './sectionHeaderV2'

export default function cardWIthGraph({ data }: { data: any }) {
  console.log(data,'data cardWIthGraph')
  const borderClasses = 'border-t md:border-r md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0'

  return (
    <Section className='bg-[#ffffff]' border="b">
      <Container className='w-full pt-sm md:pt-md lg:pt-lg' type="V2" border="y-0" >
        <div className="flex-col relative w-full flex gap-16">
          <SectionHeaderV2 className='xl:px-12 md:px-6 px-4'
            heading={data?.sectionHeadingDynamic || ''}
            // heading={pageData['how-voicestack-works2']?.componentData?.heading}
            description={data?.description || ''}
          />
          <div>
            <div className='w-full'>
            {/* <Image src="/assets/events/graph.png" width={646} height={247} alt="graph" /> */}
            <div className='grid md:grid-cols-3'>
              {data?.items?.map((ele:any)=>{
                return (
                  <div key={ele._key || Math.random()} className={`first:col-span-2 ${borderClasses}`}>
                    <CardItemComponent item={ele} key={ele._key} />
                  </div>
              )
              })}
            </div>
          </div>
        </div>

      </div>

      </Container>
    </Section>
  )
}
