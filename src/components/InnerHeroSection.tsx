import React, { useContext, useEffect, useState } from 'react'
import Section from './structure/Section'
import Container from './structure/Container'
import dynamic from 'next/dynamic'
import ImageLoader from './common/imageLoader/imageLoader'
import SanityPortableText from './blockEditor/sanityBlockEditor'
import H2 from './typography/H2'
import CheckMark from './icons/CheckMark'
import H3 from './typography/H3'
import Image from 'next/image'
import Star from './icons/Star'
import H1 from './typography/H1'
import { PortableText } from '@portabletext/react'
import Button from './common/Button'
import ButtonArrow from './icons/ButtonArrow'
import { BookDemoContext } from '~/providers/BookDemoProvider'
import { FormModal } from './common/FormModal'
import themeData from '~/migrations/theme.json'
import Breadcrumb from './utils/breadCrumb'

const InnerHeroSection = ({ data }) => {
  const { isDemoPopUpShown } = useContext(BookDemoContext)
  const [openForm, setOpenForm] = useState(false)
	const heroTheme = data.heroTheme;
	const selectedTheme = themeData.featureHero.find(item => item.theme === heroTheme);
  if (!data) return null
	
  return (
    <div
      className="bg-cover relative overflow-hidden"
      style={{
        background: selectedTheme?.gradient,
      }}
    >
			{/* {selectedTheme?.imageUrl && <img src={selectedTheme.imageUrl} alt="Hero" width={200} />} */}
			{selectedTheme && selectedTheme?.imageUrl && (
				<div className='absolute -right-[10%] -bottom-[200px] w-[40%]'>
					<Image src={selectedTheme.imageUrl} alt='hero' width={1155} height={1155} className='w-100 h-auto'></Image>
				</div>
			) }
      <Section className={`py-12 md:py-24`}>
        <Container className="flex flex-col relative overflow-hidden pt-16 md:pt-24">
            <Breadcrumb/>
          <div className="grid md:grid-cols-[50%_50%] grid-cols-[50%]">

            <div className='flex !flex-col gap-5 items-start'>
              <H1>
                <PortableText value={data.heading} />
              </H1>
              <div className='text-white'>
                <PortableText value={data.description} />
              </div>
              <Button
                type="primary"
                onClick={() => {
                  setOpenForm(true)
                }}
              >
                <ButtonArrow></ButtonArrow>
                <span className="text-base font-medium">{`Book free demo`}</span>
              </Button>
            </div>
            <div>
              {data?.mainImage && (
                <ImageLoader
                  image={data?.mainImage}
                  alt={data?.name}
                  className="!w-[520px] !h-[455px] !rounded-2xl"
                />
              )}
            </div>
          </div>

          {openForm && (
            <FormModal
              className={`pt-9  flex items-start`}
              onClose={() => setOpenForm(false)}
              data={isDemoPopUpShown}
            />
          )}
        </Container>
      </Section>
    </div>
  )
}

export default InnerHeroSection
