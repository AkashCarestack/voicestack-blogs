import Image from 'next/image'
import Logo from 'public/assets/voicestack-logo-black.png'
import LogoSm from 'public/assets/voicestack-logo-sm.svg'
import React, { useState } from 'react'
import { getLegendIcon } from '~/schemas/Comparison/LegendIcons'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'  
import CursorTooltip from './common/CustomTooltip'
import Anchor from './common/anchor'

// SVG Icon Component
const InfoIcon = ({className}:{className?:string}) => (
  <span className={`fex items-center h-full ${className}`}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 10C18 12.1217 17.1571 14.1566 15.6569 15.6569C14.1566 17.1571 12.1217 18 10 18C7.87827 18 5.84344 17.1571 4.34315 15.6569C2.84285 14.1566 2 12.1217 2 10C2 7.87827 2.84285 5.84344 4.34315 4.34315C5.84344 2.84285 7.87827 2 10 2C12.1217 2 14.1566 2.84285 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10ZM11 6C11 6.26522 10.8946 6.51957 10.7071 6.70711C10.5196 6.89464 10.2652 7 10 7C9.73478 7 9.48043 6.89464 9.29289 6.70711C9.10536 6.51957 9 6.26522 9 6C9 5.73478 9.10536 5.48043 9.29289 5.29289C9.48043 5.10536 9.73478 5 10 5C10.2652 5 10.5196 5.10536 10.7071 5.29289C10.8946 5.48043 11 5.73478 11 6ZM9 9C8.80109 9 8.61032 9.07902 8.46967 9.21967C8.32902 9.36032 8.25 9.55109 8.25 9.75C8.25 9.94891 8.32902 10.1397 8.46967 10.2803C8.61032 10.421 8.80109 10.5 9 10.5H9.253C9.29041 10.5 9.32734 10.5084 9.36106 10.5246C9.39479 10.5408 9.42445 10.5643 9.44787 10.5935C9.47128 10.6227 9.48785 10.6567 9.49636 10.6932C9.50486 10.7296 9.50508 10.7675 9.497 10.804L9.038 12.87C8.98108 13.1259 8.98237 13.3913 9.04179 13.6466C9.10121 13.902 9.21723 14.1407 9.38129 14.3452C9.54535 14.5496 9.75325 14.7146 9.98963 14.828C10.226 14.9413 10.4848 15.0001 10.747 15H11C11.1989 15 11.3897 14.921 11.5303 14.7803C11.671 14.6397 11.75 14.4489 11.75 14.25C11.75 14.0511 11.671 13.8603 11.5303 13.7197C11.3897 13.579 11.1989 13.5 11 13.5H10.747C10.7096 13.5 10.6727 13.4916 10.6389 13.4754C10.6052 13.4592 10.5755 13.4357 10.5521 13.4065C10.5287 13.3773 10.5121 13.3433 10.5036 13.3068C10.4951 13.2704 10.4949 13.2325 10.503 13.196L10.962 11.13C11.0189 10.8741 11.0176 10.6087 10.9582 10.3534C10.8988 10.098 10.7828 9.8593 10.6187 9.65483C10.4547 9.45036 10.2468 9.28536 10.0104 9.17201C9.77398 9.05867 9.51515 8.99989 9.253 9H9Z"
        fill="#D1D5DB"
      />
    </svg>
  </span>
)

// Chevron Icon Component
const ChevronIcon = ({ isOpen, className }: { isOpen: boolean; className?: string }) => (
  <span className={`flex items-center transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'} ${className}`}>
    {/* <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="#6B7280"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg> */}
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 9.2002L12 15.2002L18 9.2002" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
  </span>
)

interface ComparisonTableProps {
  data: any
  legendData?: any[]
  demoLink?: string
}

function RowHeading({ heading, description, link }) {
  return (
    <TableCell className="sticky md:static left-0 bg-white  md:w-[352px]" colSpan={1}>
      <div className="flex gap">
        <div className="flex items-center gap-3">
          {description ? (
           
            <CursorTooltip tooltip={description} className='lg:gap-3'>
              {link?.url ? (
                <Anchor href={link.url} className='text-gray-700 flex flex-0 whitespace-normal  lg:text-base text-xs font-normal leading-6 tracking-normal underline decoration-dotted decoration-gray-700 decoration-[10%] underline-offset-[25%] underline-from-font'>
                  {heading}
                </Anchor>
              ) : (
              <p className="text-gray-700 flex flex-0 whitespace-normal  lg:text-base text-xs font-normal leading-6 tracking-normal underline decoration-dotted decoration-gray-700 decoration-[10%] underline-offset-[25%] underline-from-font">
                {heading}sdf {link}
              </p>
              )}
              <InfoIcon className='mt-1' />
          
            </CursorTooltip>
          ) : (

            <p className="text-gray-700 flex flex-0 whitespace-normal  lg:text-base text-xs font-normal leading-6 tracking-normal underline decoration-dotted decoration-gray-700 decoration-[10%] underline-offset-[25%] underline-from-font">
                {heading}
            </p>
          )}
        </div>
      </div>
    </TableCell>
  )
}

function ComparisonRichIcon({ comparisonValue, showBoth = false }) {
  const { icon, text } = comparisonValue
  
  // Check if icon is a string (from comparisonsCustom) or an object with url (from comparisons)
  const isStringIcon = typeof icon === 'string'
  const legendIcon = isStringIcon ? getLegendIcon(icon) : null
  
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {isStringIcon && legendIcon ? (
        <div 
          className="w-5 h-5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
          dangerouslySetInnerHTML={{ __html: legendIcon.svg }}
          title={text}
        />
      ) : icon?.url ? (
        <Image
          className="w-5 h-5 object-contain"
          src={icon.url}
          alt={`${text} icon`}
          width={20}
          height={20}
        />
      ) : null}
      {showBoth && (
        <span className="text-sm text-gray-500 font-medium text-center leading-tight lg:block hidden">
          {text}
        </span>
      )}
    </div>
  )
}

export default function ComparisonTable({ data, legendData = [], demoLink }: ComparisonTableProps) {
  // Initialize all categories as open by default

  console.log('data comparison table', data);
  
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {}
    if (data?.rowCategories) {
      data.rowCategories.forEach((_, index) => {
        initial[index] = true
      })
    }
    return initial
  })

  const toggleCategory = (categoryIndex: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex]
    }))
  }

  const numberOfComparisons = data?.columns?.length || 0

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <Table className="w-full border-collapse">
        <TableCaption className="sr-only">
          Feature Comparison Table
        </TableCaption>
        <TableHeader className="">
          <TableRow className="border-none">
            <TableHead className="sticky left-0 w-48 h-16 text-gray-950 text-left text-base font-medium px-6  border-gray-200 bg-white">
              {data.columnDimensionName}
            </TableHead>
            <TableHead className=" h-16 rounded-t-[12px]  text-center  bg-[#F6F5FD] sticky left-[120px]">
              <div className="flex-col items-center justify-center gap-2 lg:w-[122px] w-[100px] lg:block hidden m-auto">
                <Image
                  src={Logo}
                  alt="VoiceStack"
                  title="VoiceStack"
                />
              </div>
              <div className='m-auto lg:hidden inline-block'> <Image src={LogoSm} width={30} height={30} alt="VoiceStack" title="VoiceStack" /></div>
            </TableHead>
            {(data.columns || [])
              .filter((_, idx) => idx != 0)
              .map((column, index) => (
                index < 3 && // limit to 3 columns
                <TableHead
                  key={index}
                  className="h-16 text-gray-900 text-center text-sm font-semibold  bg-white"
                >
                  <div className="flex flex-col items-center justify-center gap-2 ">
                    {/* {column.logo && (
                      <Image
                        className="w-8 h-6 object-contain"
                        src={column.logo.url}
                        alt={`${column.name} logo`}
                        width={32}
                        height={24}
                      />
                    )} */}
                    <span className="text-[#111827] lg:text-base text-xs font-medium leading-[175%] tracking-normal">
                      {column.name}
                    </span>     
                  </div>
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-100">
          {(data.rowCategories || []).map((category, categoryIndex) => (
            <React.Fragment key={categoryIndex}>
              {data.rowCategories && data.rowCategories.length > 1 && (
                <TableRow className="border-t-[1px] border-b-[1px] border-gray-200 ">
                  <TableCell className="sticky left-0 lg:text-base font-medium text-gray-950 text-sm border-gray-200 bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB]" colSpan={numberOfComparisons + 1}>
                    <button
                      onClick={() => toggleCategory(categoryIndex)}
                      className="flex items-center gap-2 justify-between hover:opacity-80 transition-opacity cursor-pointer w-full text-left py-[18px]"
                    >
                      {category.name}
                      <ChevronIcon isOpen={expandedCategories[categoryIndex]} />
                    </button>
                  </TableCell>
                </TableRow>
              )}
              {expandedCategories[categoryIndex] && category.rows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className=" h-[64px]"
                >
                  <RowHeading
                    heading={row.heading}
                    description={row.description}
                    link={category.link}
                  />
                
                  {(() => {
                    const comparisons = [...(row.comparisons || []), ...(row.comparisonsCustom || [])];
                    return comparisons.length > 0 && comparisons.slice(0, 4).map((comparisonValue, idx) => (
                      <TableCell
                        key={idx}
                        className={`text-center border-0 ${
                          idx === 0 
                            ? 'bg-[#F6F5FD] sticky left-[120px]'
                            : 'bg-white '
                        }`}
                      >
                        <ComparisonRichIcon 
                          comparisonValue={comparisonValue} 
                          showBoth={row.comparisonsCustom ? true : idx === 0}
                        />
                      </TableCell>
                    ));
                  })()}
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      
      {/* Legend Section */}
      <div className="border-t border-gray-200 px-6 py-4 bg-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-wrap items-center gap-6">
            {legendData?.map((legendItem, index) => (
              <div key={legendItem._id || index} className="flex items-center gap-2">
                <Image
                  className="w-4 h-4"
                  src={legendItem.icon?.url}
                  alt={legendItem?.text}
                  width={16}
                  height={16}
                />
                <span className="text-sm text-gray-700 font-medium">{legendItem?.text}</span>
              </div>
            ))}
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 italic">
              *Data from 3rd Party Services.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
