import React, { useEffect, useState } from 'react'
import Section from './structure/Section'
import Container from './structure/Container'
import H2 from './typography/H2'
import Paragraph from './typography/Paragraph'
import SiteComparisonTable from './SiteComparisonTable'
import TableTabset from './TableTabSet'
import Button from './common/Button'
import ButtonArrow from './icons/ButtonArrow'
import { FormModal } from './common/FormModal'
import { useRouter } from 'next/router'

function SiteComparisonSection({ data }) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const [openForm, setOpenForm] = useState(false);
  
  const [isUk, setIsUk] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    setIsUk(router.locale == "en-GB");
  },[router.locale])

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkWidth();

    // Add event listener
    window.addEventListener('resize', checkWidth);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkWidth);
  }, []);
  
  return (
    isUk ? (
      <></> 
    ):(
      <Section id="comparison" className="py-sm md:py-md  scroll-m-16">
        <Container className="flex flex-col items-center">
          
          <div className="flex justify-center w-full mb-12">
            <div className='flex flex-col w-full max-w-[635px] text-center gap-4'>
              <H2>{data?.strip}</H2>
              <Paragraph>{data.header}</Paragraph>
            </div>
          </div>
          <div className='flex flex-col gap-12 items-center w-full'>
            <TableTabset
              tabs={data?.table.rowCategories}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
  
            <div className='w-full flex flex-col gap-2 '>
              {data.table.rowCategories.length && (
                data.table.rowCategories.map((tableData:any, index:number) =>{
                  return (
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
                  )
                })
              )}
              {/* <SiteComparisonTable
                data={{
                  columnDimensionName: data.columnDimensionName,
                  ...data.table,
                }}
              /> */}
            </div>
          </div>
          {/* <CTAButton
            className="px-6 py-3"
            name={data?.cta.name ?? ''}
            url={data?.cta.url ?? '/'}
          /> */}
          <div className="flex justify-end pt-6 w-full">
            <span className='text-[11px] md:text-sm text-gray-600'>*Data from 3rd Party Services.</span>
          </div>
          <div className='flex gap-4 items-center mt-12 lg:mt-16'>
              <Button type='primary'   onClick={() => {setOpenForm(true)}}>
                <ButtonArrow></ButtonArrow>
                <span className="text-base font-medium">{`Book free demo`}</span>
              </Button>
            </div>
        </Container>
          {openForm && (
            <FormModal
              className={`pt-9  flex items-start`}
              onClose={() => setOpenForm(false)}
            />
          )}
      </Section>
    )

  )
}

export default SiteComparisonSection
