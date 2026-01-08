import React, { useEffect, useState } from 'react'
import Section from '../../components/structure/Section'
import Container from '../../components/structure/Container'
import Button from '../../components/common/Button'
import { useRouter } from 'next/router'
import LegendSection from '../../components/common/LegendSection'
import ComparisonTable from '../components/ComparisonTable'
import SectionHeader from '../../components/revamp/components/common/sectionHeader'
import SectionHeaderV2 from '../components/common/sectionHeaderV2'

interface SiteComparisonSectionProps {
  data: any
  legendData?: any
  refer?: any
}

function SiteComparisonSection({
  data,
  legendData = null,
  refer = null,
}: SiteComparisonSectionProps) {
  console.log('data comparison section', data)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const [hideTable, setHideTable] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkWidth()

    window.addEventListener('resize', checkWidth)

    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  // console.log('data comparison section', data);
  return hideTable ? (
    <></>
  ) : (
     (
      <Section className="bg-[#ffffff]" border="b">
        <Container
          className="w-full py-sm md:py-md lg:py-lg"
          type="V2"
          border="y-0"
        >
          <div className="flex-col relative w-full flex gap-16">
            <SectionHeaderV2
              className="xl:px-12 md:px-6 px-4"
              heading={data?.strip}
              description={data?.header}
            />

            <div className="flex flex-col items-center w-full mt-12">
              <div className="w-full flex flex-col gap-2 ">
                <ComparisonTable
                  data={{
                    columnDimensionName: data.columnDimensionName,
                    ...data.table,
                  }}
                  legendData={legendData}
                  demoLink={null}
                />
              </div>
              {/* {isMobile ? <LegendSection/> :
              <div className="flex justify-end pt-6 w-full">
              <span className='text-[11px] md:text-sm text-gray-600'>*Data from 3rd Party Services.</span>
              </div>
            } */}
            </div>
          </div>
        </Container>
      </Section>
    )
  )
}

export default SiteComparisonSection
