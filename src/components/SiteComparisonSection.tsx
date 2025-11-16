import React, { useEffect, useState } from 'react'
import Section from './structure/Section'
import Container from './structure/Container'
import Button from './common/Button'
import { useRouter } from 'next/router'
import LegendSection from './common/LegendSection'
import ComparisonTable from './ComparisonTable'
import SectionHeader from './revamp/components/common/sectionHeader'

function SiteComparisonSection({ data, legendData, refer=null }) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const [hideTable, setHideTable] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkWidth();

    window.addEventListener('resize', checkWidth);
    
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  
  return (
    hideTable ? (
      <></> 
    ):(
      <Section id="comparison" className="py-sm md:py-md lg:py-lg scroll-m-16 bg-[#F9F9F9]">
        <Container className="flex flex-col items-center gap-16">
          <SectionHeader
            heading={data?.strip}
            description={data.header}
          />
          
          <div className='flex flex-col gap-12 items-center w-full'>
            {/* <TableTabset
              tabs={data?.table.rowCategories}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            /> */}
  
            <div className='w-full flex flex-col gap-2 '>
              {/* {data.table.rowCategories.length && (
                data.table.rowCategories.map((tableData:any, index:number) =>{
                  return (
                    <>
                    
                    <SiteComparisonTable 
                      key={index+1}
                      mainIndex={index}
                      currentIndex={currentIndex}
                      isMobile={isMobile}
                      data={{
                        columnDimensionName: data.columnDimensionName,
                        headerLogos: data.table.columns,
                        tableData,
                      }}
                    />

                    
                    </>
                  )
                })
              )} */}
              {/* <SiteComparisonTable
                data={{
                  columnDimensionName: data.columnDimensionName,
                  ...data.table,
                }}
              /> */}
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
         
          <div className='flex gap-4 items-center'>
              <Button type="primary" link="/demo">
                {/* <ButtonArrow></ButtonArrow> */}
                <span className="">{`Book Free Demo`}</span>
              </Button>
             
            </div>
        </Container>
      </Section>
    )

  )
}

export default SiteComparisonSection
