import React, { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import PreText from './micro/PreText'
import H2 from '../typography/H2'
import Paragraph from '../typography/Paragraph'
import PhoneIcon from './micro/icons/PhoneIcon'
import Button from '../common/Button'
import ButtonArrow from '../icons/ButtonArrow'
import ListItem from './micro/ListItem'
import { FormModal } from '../common/FormModal'
import useMediaQuery from '~/utils/mediaQuery'

export default function AppearFeature({
  getIndex,
  getIndexfromAppear,
  index,
  dataIndex,
  data,
  props,
}: any) {
  const { scrollY } = useScroll()
  const [openForm, setOpenForm] = useState(false)
  const [scrollPos, setScrollPos] = useState(0)
  const [sectionStartY, setSectionStartY] = useState(0)
  const isMobile: any = useMediaQuery(767)

  const scrollRef = useRef(null)
  const numberOfItems = data?.testimonialSubSection?.length
  const actualScrollStart =
    sectionStartY + scrollRef?.current?.offsetHeight + 160
  const sectionEndY = sectionStartY + scrollRef?.current?.offsetHeight * 4
  const percentScrolled =
    ((actualScrollStart - scrollPos) / (actualScrollStart - sectionEndY)) * 100
  const [activeItemIndex, setActiveItemIndex] = useState(0)

  const switchIndex = (percentage) => {
    if (scrollPos > actualScrollStart) {
      getIndex(percentage)
    }

    let index = 0

    if (percentage <= 25) index = 0
    else if (percentage > 25 && percentage <= 50) index = 1
    else if (percentage > 50 && percentage <= 75) index = 2
    else if (percentage > 75 && percentage <= 100) index = 3
    else if (percentage > 100) index = 3
    else index = 0

    return index
  }

  const handleClick = (e, index, ref) => {
    if (ref?.current) {
      ref.current.style.height = '100%'
      ref.current.style.scrollBehavior = 'smooth'
      ref.current.style.transition = 'all 0.5s ease-in'
    }
    if (activeItemIndex === index) {
      setActiveItemIndex(null)
    } else {
      setActiveItemIndex(index)
      getIndexfromAppear(index)
    }
  }

  useMotionValueEvent(scrollY, 'change', (current) => {
    setScrollPos(current)
  })

  return (
    <div
      style={{
        height: isMobile ? `100%` : `${scrollRef?.current?.offsetHeight * 4}px`,
      }}
    >
      <div
        data-index={index ? index : 1}
        id={dataIndex}
        ref={scrollRef}
        className="sticky top-40 left-0 "
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ root: scrollRef }}
          onViewportEnter={() => {
            sectionStartY > 1 ? '' : setSectionStartY(scrollPos)
          }}
          className="flex flex-col gap-12 w-full"
        >
          <div className="flex flex-col gap-4">
            <PreText>
              <span className=" text-vs-blue">
              {data.testimonialIcon && data.testimonialIcon.url &&
                    <div className=''>
                      <motion.img
                        src={data.testimonialIcon.url}
                        alt="testimonial icon"
                      />
                    </div>
                  }
              </span>
              {data?.testimonialSubheading}
            </PreText>
            <H2>{props?.testimonialheading}</H2>
            <Paragraph>{data?.testimonialDescription}</Paragraph>
          </div>
          <ul className="flex flex-col gap-4">
            {data?.testimonialSubSection &&
              data?.testimonialSubSection?.map((item, i: number) => {
                return (
                  <ListItem
                    onClick={handleClick}
                    key={i}
                    index={i}
                    title={item.featureSubHead}
                    numberOfItems={numberOfItems}
                    percentScrolled={percentScrolled}
                    showDesc={
                      isMobile
                        ? i == activeItemIndex
                        : i == switchIndex(percentScrolled)
                    }
                    desc={item.featureSubDescription}
                  >
                    {' '}
                  </ListItem>
                )
              })}
          </ul>

          <div className="flex md:justify-start justify-center">
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
        </motion.div>
      </div>
      {openForm && (
        <FormModal
          className={`pt-9  flex items-start`}
          onClose={() => setOpenForm(false)}
        />
      )}
    </div>
  )
}
