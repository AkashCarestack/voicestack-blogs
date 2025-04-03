import React, { useState, useEffect, useRef, useContext, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section from '../structure/Section'
import Container from '../structure/Container'
import H2 from '../typography/H2'
import Paragraph from '../typography/Paragraph'
import TickIcon from './micro/icons/TickIcon'
import PillItem from './micro/PillItem'
import PreText from './micro/PreText'
import AppearFeature from './AppearFeature'
import Button from '../common/Button'
import ButtonArrow from '../icons/ButtonArrow'
import { FormModal } from '../common/FormModal'
import useMediaQuery from '~/utils/mediaQuery'
import { BookDemoContext } from '~/providers/BookDemoProvider'
import { useRouter } from 'next/router'

export default function FeatureSection({ data, refer=null }) {
  
  const [openForm, setOpenForm] = useState(false)
  const testimonialIndex: number = data?.findIndex(
    (e: any) => e.name == "Conversational AI",
  )
  const router = useRouter();
  const sampleImages = useMemo(() => {
    return (
      data[testimonialIndex]?.features.map((e) => ({
        url: e.secondaryImage?.url,
        altText: e.secondaryImage?.altText,
        title: e.secondaryImage?.title,
      })) || []
    );
  }, [data, testimonialIndex]);

  const [activeImage, setActiveImage] = useState(null)
  const [currentIndex, setActiveIndex] = useState(0)
  const featureRefs = useRef([])
  const isMobile: any = useMediaQuery(767);
  const imageRef = useRef(null);
  const { isDemoPopUpShown } = useContext(BookDemoContext);

  const switchIndex = (percentage = 25) => {    
    if (isMobile || sampleImages.length === 0) {
      return;
    }

    let selectedImage = null;

    if (percentage <= 25 && percentage > 0) {
      selectedImage = sampleImages[0];
    } else if (percentage > 25 && percentage <= 50) {
      selectedImage = sampleImages[1];
    } else if (percentage > 50 && percentage <= 75) {
      selectedImage = sampleImages[2];
    } else if (percentage > 75 && percentage <= 100) {
      selectedImage = sampleImages[3];
    }

    if (selectedImage) {
      setActiveImage(selectedImage);
    }
  };
  const getIndexfromAppear = (index) => {
    setActiveIndex(index);
    if (isMobile) {
      const selectedImage = sampleImages[index]?.url;
      setActiveImage(selectedImage);
    }
  };

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.children[currentIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentIndex]);

  const sortedItems = useMemo(() => {
    return [...data].sort((a, b) => a.featureOrder - b.featureOrder);
  }, [data]);

  return (
    <Section className="relative bg-[#f9f9f9] " id="features">
      {!isMobile && <div className='bg-white md:bg-vs-lemon-green w-1/2 h-full absolute top-0 right-0 z-0'></div>}
      <Container className={`relative flex md:gap-28 md:flex-row flex-col`}>
        <div className="flex md:gap-0 gap-12 md:w-1/2 w-full flex-col flex-1 pt-16">
          {sortedItems?.map((feature, index) =>
            feature.name  === "Conversational AI" ? (
              <>
                <AppearFeature
                  refer={refer}
                  key={feature?._id+index}
                  getIndex={(percentage) => switchIndex(percentage)}
                  getIndexfromAppear={(index) => getIndexfromAppear(index)}
                  index={index}
                  data-index={1}
                  data={feature}
                  props={data[index]}
                />
                {isMobile &&
                  <>
                    <div
                      className={`relative mx-[-16px] bg-vs-lemon-green md:w-1/2 w-auto h-full`}
                    >
                      <div className="w-full pt-[87.1071%] relative " ref={imageRef}>
                        <AnimatePresence>
                          {sampleImages?.map((image, index) => (
                            <motion.img
                              key={image + index}
                              src={image?.url}
                              alt={image?.altText}
                              title={image?.title}
                              animate={{ opacity: currentIndex === index ? 1 : 0 }}
                              transition={{ duration: 0.300 }}
                              className={`absolute top-0 left-0 w-auto h-auto rounded-lg max-w-full bg-black/5 md:max-h-[538px]`}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className=' mb-16 md:m-0 flex md:justify-start justify-center'>
                    {refer == "carestack" ? (
                      <Button type="primary" link={`/demo?region=${router.locale}`} locale={false} target='_blank'>
                        <ButtonArrow></ButtonArrow>
                        <span className="text-base font-medium">
                          {`Book free demo`}
                        </span>
                      </Button>
                      ):(
                      <Button type="primary" onClick={() => { setOpenForm(true) }}>
                        <ButtonArrow></ButtonArrow>
                        <span className="text-base font-medium">{`Book free demo`}</span>
                      </Button>
                    )}
                      
                    </div>
                  </>
                }
              </>
            ) : (
              <div className={`md:h-[100vh] relative flex flex-col items-center ${index == 0 ? "md:mb-40" : ""} `} key={feature?._rev} >
                <div ref={(el) => (featureRefs.current[index] = el)} className={`${index == 0 ? "md:pt-20 lg:pt-40 md-maxh-800:pt-20 md-maxh-700:pt-0" : "md:top-[50%] md:h-[50vh] md:-translate-y-[50%] md:sticky"} mt-5 left-0 self-start flex flex-col justify-center transform`}   >
                  <motion.div
                    key={index}
                    data-index={index}
                    className={`md:cursor-auto cursor-pointer gap-4 flex flex-col self-start justify-center transform`}
                    onViewportEnter={() => {
                      if (feature.mainImage) {
                        const { url, altText, title } = feature.mainImage;
                        setActiveImage({
                          url: url,
                          altText: altText || '',
                          title: title || ''
                        })
                      }
                    }}
                  >
                    <PreText>
                      <span className="text-vs-blue">
                        {feature.icon && feature.icon.url &&
                          <div className=''>
                            <motion.img
                              key={activeImage}
                              src={feature.icon.url}
                              title={feature.icon.title}
                              alt={feature.icon.altText}
                            />
                          </div>
                        }
                      </span>{' '}
                      {feature.name}
                    </PreText>
                    <H2>{feature.heading}</H2>
                    <Paragraph>{feature.description}</Paragraph>
                    <ul className="flex flex-wrap gap-3 mt-4 mb-8 ">
                      {feature?.features &&
                        feature?.features?.map((item, i) => (
                          <PillItem key={i+item}>
                            <span className="text-green-500">
                              <TickIcon />
                            </span>{' '}
                            {item.name}
                          </PillItem>
                        ))}
                    </ul>
                    {!isMobile && <div className='mt-8 mb-12 md:m-0 flex md:justify-start justify-center'>

                      {refer == "carestack" ? (
                        <Button type="primary" link={`/demo?region=${router.locale}`} locale={false} target='_blank'>
                          <ButtonArrow></ButtonArrow>
                          <span className="text-base font-medium">
                            {`Book free demo`}
                          </span>
                        </Button>
                        ):(
                        <Button type="primary" onClick={() => { setOpenForm(true) }}>
                          <ButtonArrow></ButtonArrow>
                          <span className="text-base font-medium">{`Book free demo`}</span>
                        </Button>
                      )}
                      
                    </div>}
                    {isMobile && feature?.mainImage && feature?.mainImage.url &&
                      <div className='bg-vs-lemon-green mx-[-16px] h-full z-0'>
                        <motion.img
                          key={activeImage}
                          src={feature.mainImage.url}
                          title={feature.mainImage.title}
                          alt={feature.mainImage.altText}
                        />
                      </div>
                    }
                    {isMobile && <div className='mt-8 mb-12 md:m-0 flex md:justify-start justify-center'>
                      {refer == "carestack" ? (
                        <Button type="primary" link={`/demo?region=${router.locale}`} locale={false} target='_blank'>
                          <ButtonArrow></ButtonArrow>
                          <span className="text-base font-medium">
                            {`Book free demo`}
                          </span>
                        </Button>
                        ):(
                        <Button type="primary" onClick={() => { setOpenForm(true) }}>
                          <ButtonArrow></ButtonArrow>
                          <span className="text-base font-medium">{`Book free demo`}</span>
                        </Button>
                      )}
                      
                    </div>}
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
                src={activeImage?.url}
                alt={activeImage?.altText}
                title={activeImage?.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.300 }}
                className="w-auto h-auto  rounded-lg max-w-full bg-black/5 md:max-h-[538px] "
              />
            </AnimatePresence>
          </div>
        </div>}
      </Container>
      {openForm && (
        <FormModal
          className={`pt-9  flex items-start`}
          onClose={() => setOpenForm(false)}
          source1="feature"
          data={isDemoPopUpShown}
        />
      )}
    </Section>
  )
}
