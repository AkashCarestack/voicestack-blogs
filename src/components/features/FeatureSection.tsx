import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from '../structure/Section'
import Container from '../structure/Container'
import H2 from '../typography/H2'
import Paragraph from '../typography/Paragraph'
import TickIcon from './micro/icons/TickIcon'
import PillItem from './micro/PillItem'
import PreText from './micro/PreText'
import PhoneIcon from './micro/icons/PhoneIcon'
import AppearFeature from './AppearFeature'
import Button from '../common/Button'
import ButtonArrow from '../icons/ButtonArrow'
import { FormModal } from '../common/FormModal'
import useMediaQuery from '~/utils/mediaQuery'

export default function FeatureSection({ data }) {
  const [openForm, setOpenForm] = useState(false)
  const testimonialIndex: number = data?.findIndex(
    (e: any) => e.testimonialSubSection != null,
  )
  const sampleImages = data[testimonialIndex]?.testimonialSubSection.map(
    (e: any) => e.image.url,
  );
  const [activeImage, setActiveImage] = useState(null)
  const [currentIndex, setActiveIndex] = useState(0)
  const featureRefs = useRef([])
  const isMobile: any = useMediaQuery(767);
  const imageRef = useRef(null);

  // const featureData = data.sort(
  //   (a, b) => a.testimonialOrder - b.testimonialOrder,
  // )

  // useEffect(() => {
  //   const observerOptions = {
  //     root: null,
  //     rootMargin: '0px',
  //     threshold: 0.5,
  //   }

  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         const index = entry.target.getAttribute('data-index')
  //         setActiveImage(data[index].testimonialImage.url) // Update active image
  //       }
  //     })
  //   }, observerOptions)

  //   featureRefs.current.forEach((ref) => {
  //     if (ref) observer.observe(ref)
  //   })

  //   return () => {
  //     if (observer) observer.disconnect()
  //   }
  // }, [data])


  


  const openModal = () => {
    setOpenForm(true)
  }


  

  const switchIndex = (percentage) => {
    if (isMobile) return

    if (percentage <= 25 && percentage > 0) {
      setActiveImage(sampleImages[0])
    } else if (percentage > 25 && percentage <= 50)
      setActiveImage(sampleImages[1])
    else if (percentage > 50 && percentage <= 75)
      setActiveImage(sampleImages[2])
    else if (percentage > 75 && percentage <= 100)
      setActiveImage(sampleImages[3])
  }

  const getIndexfromAppear = (index) => {
    setActiveIndex(index)
    setActiveImage(isMobile && sampleImages[currentIndex])
  }


  useEffect(() => {
    setActiveIndex(0)
  },[isMobile])

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.children[currentIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentIndex]);

  return (
    <Section className="relative bg-[#f9f9f9] " id="features">
      {!isMobile && <div className='bg-white md:bg-vs-lemon-green w-1/2 h-full absolute top-0 right-0 z-0'></div>}
      <Container className="relative flex gap-16 md:flex-row flex-col">

        <div className="flex md:gap-0 gap-6  md:w-1/2 w-full flex-col flex-1 md:py-20 md:pb-40">
          {data.map((feature, index) =>
            feature?.testimonialSubSection?.length ? (
              <AppearFeature
                key={feature?._id}
                getIndex={(percentage) => switchIndex(percentage)}
                getIndexfromAppear={(index) => getIndexfromAppear(index)}
                index={index}
                data-index={1}
                data={feature}
                props={data[index]}
              />
            ) : (

              <div className='md:h-[100vh]  relative flex' key={feature?._rev}>

                <div className="md:mt-40 mt-5 left-0 self-start flex flex-col justify-center">
                  <motion.div
                    key={index}
                    ref={(el) => (featureRefs.current[index] = el)}
                    data-index={index}
                    className={`md:cursor-auto cursor-pointer gap-4 flex flex-col  self-start justify-center transform`}
                    onViewportEnter={() => setActiveImage(feature.testimonialImage.url)}
                  >
                    <PreText>
                      <span className="text-vs-blue">
                      { feature.testimonialIcon && feature.testimonialIcon.url &&
                      <div className=''>
                        <motion.img
                          key={activeImage}
                          src={feature.testimonialIcon.url}
                          alt="testimonial icon"
                        />
                      </div>
                    }
                      </span>{' '}
                      {feature.testimonialSubheading}
                    </PreText>
                    <H2>{feature.testimonialheading}</H2>
                    <Paragraph>{feature.testimonialDescription}</Paragraph>
                    <ul className="flex flex-wrap gap-2 mt-4">
                      {feature?.testimonialChip &&
                        feature?.testimonialChip?.map((item, i) => (
                          <PillItem key={i}>
                            <span className="text-green-500">
                              <TickIcon />
                            </span>{' '}
                            {item}
                          </PillItem>
                        ))}
                    </ul>

                    <div className='mt-4 flex md:justify-start justify-center'>
                      <Button type="primary" onClick={() => { setOpenForm(true) }}>
                        <ButtonArrow></ButtonArrow>
                        <span className="text-base font-medium">{`Book free demo`}</span>
                      </Button>
                    </div>

                    {isMobile && feature.testimonialImage && feature.testimonialImage.url &&
                      <div className='bg-vs-lemon-green mx-[-16px] h-full z-0'>
                        <motion.img
                          key={activeImage}
                          src={feature.testimonialImage.url}
                          alt="Active Feature"
                        />
                      </div>
                    }
                  </motion.div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Sticky Image Section */}
        {!isMobile && <div
          className={`relative mx-[-16px]   bg-vs-lemon-green md:w-1/2 w-auto h-full`}
        >
          <div className="sticky top-0 md:py-24 md:h-[100vh] flex flex-col justify-center md:pl-12 ">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={activeImage}
                alt="Active Feature"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.300 }}
                className="w-auto h-auto  rounded-lg max-w-full bg-black/5 md:max-h-[538px] "
              />
            </AnimatePresence>
          </div>
          
        </div>}
        {isMobile &&  <div
          className={`relative mx-[-16px] bg-vs-lemon-green md:w-1/2 w-auto h-full`}
        >
          <div className="w-full pt-[87.1071%] relative " ref={imageRef}>
            <AnimatePresence>
              {sampleImages?.map((image, index) => (
                <motion.img
                  key={image}
                  src={image}
                  alt="Feature Image"
                  animate={{ opacity: currentIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.300 }}
                  className={`absolute top-0 left-0 w-auto h-auto rounded-lg max-w-full bg-black/5 md:max-h-[538px]`}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>}

      </Container>

      {openForm && (
        <FormModal
          className={`pt-9  flex items-start`}
          onClose={() => setOpenForm(false)}
        />
      )}


    </Section>
  )
}
