import Image from 'next/image'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import React, { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

function RowHeading({ heading, description }) {
  return (
    <TableCell className="lg:min-w-[330px] w-[100px] md:w-auto pr-2 pl-0 md:px-4 border-b border-b-gray-200 md:border-none">
      <div className='py-4 md:border-b border-b-gray-200'>
        <p className="text-gray-500 font-inter text-[10px] md:text-xs lg:text-[15px] font-normal leading-[150%] capitalize text-left">{heading}</p>
        {/* <p className="flex text-gray-600 text-xs font-normal !p-0">
          {description}
        </p> */}
      </div>
    </TableCell>
  )
}

function ComparisonRichIcon({ comparisonValue, vsIndex }) {
  const { icon, text } = comparisonValue
  return (
    <>
      <div className={`py-4 md:border-b ${vsIndex ? 'border-b-vs-blue/20':'border-b-gray-200'} `}>
        <p className="flex flex-row gap-2 justify-center md:justify-start items-center text-left flex-shrink-0">
          <Image
            className="object-contain"
            src={icon.url}
            alt={`${text} image`}
            width={16}
            height={17}
          />
          <span className="hidden md:inline text-gray-600">{text}</span>
        </p>
      </div>
    </>
  )
}

export default function SiteComparisonTable({ data, mainIndex, currentIndex, isMobile }) {
  
  const [currentChildIndex, setCurrentChildIndex] = useState<number|null>(0);

  const toggle = () =>{
    
    if(mainIndex === currentChildIndex){
      setCurrentChildIndex(null)
    }
    else{
      setCurrentChildIndex(mainIndex)
    }
  }
  
  return (

    <div className='flex flex-col gap-2'>
      <div
        className={`${currentChildIndex === mainIndex ? 'bg-gray-100 text-gray-900' : 'bg-gray-100 text-gray-900 '} flex items-center 
        gap-2 justify-between px-4 py-3 border border-gray-100 bg-gray-50 rounded-[6px] text-center text-sm font-medium leading-[145%] cursor-pointer md:hidden`}
        onClick={toggle}
      >
        <div className='flex items-center gap-2'>
          {data.tableData.iconSvgCode && (
            <span dangerouslySetInnerHTML={{__html: data.tableData.iconSvgCode}}></span>
          )}
          {data.tableData.name}
        </div>
        {currentChildIndex === mainIndex ?  <Minus height={16} width={16}></Minus> : <Plus height={16} width={16}></Plus>}
      </div>
      <div className={`${(mainIndex === currentIndex  && !isMobile) || (mainIndex === currentChildIndex && isMobile) ? 'block' : 'hidden'}`}>

        <Table className={`bg-white w-full overflow-auto mb-[25px]`}>
          {/* <TableCaption className="hidden">
            A list of your recent invoices.
          </TableCaption> */}
          <TableHeader className="">
            <TableRow className="w-full justify-between  py-2 !border-0 hover:bg-inherit">
              <TableHead className="justify-start items-center">
                {/* {data.columnDimensionName}{data.tableData.name} */}
              </TableHead>
              {/* <TableHead className="w-72 text-white flex items-center justify-center">
                <Image
                  className="bg-[#2d0666] rounded-md justify-center items-center px-5 py-3"
                  src="/OSDentalLogo.svg"
                  width={135}
                  height={26}
                  alt="OS Dental Logo"
                />
              </TableHead> */}
              {data.headerLogos
                // .filter((_, idx) => idx != 0)
                .map((column:any, index:number) => (
                  <TableHead
                    key={index}
                    className={`text-white items-center justify-center pt-5 ${index == 0 ? 'bg-vs-blue/10 rounded-tl-[10px] rounded-tr-[10px]' : ''}`}
                  >
                    {/* {column.name} */}
                    {column.logo  && column.logo.url && !isMobile && (

                      <Image
                        className="justify-center items-center py-3 min-h-full w-auto m-auto"
                        src={column.logo.url}
                        width={135}
                        height={26}
                        alt="OS Dental Logo"
                      />
                    )}

                    {column.logoMobile  && column.logoMobile.url && isMobile && (
                      <Image
                      className="justify-center items-center py-3 min-h-full w-auto m-auto"
                      src={column.logoMobile.url}
                      width={135}
                      height={26}
                      alt="OS Dental Logo"
                    />
                    )}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <React.Fragment>
                {/* <TableRow className="bg-[#e9d5ff] hover:bg-purple-300 text-[##2d353e] text-xl font-semibold ">
                  <TableCell>{data.tableData.name}</TableCell>
                </TableRow> */}
                <TableRow
                      key={mainIndex}
                      className="hidden md:table-row flex-row justify-between  border-0"
                    >
                      <TableCell className='text-gray-900 text-base font-medium leading-[145%] py-4'>{data.tableData.name}</TableCell>
                      <TableCell className={`text-center justify-center bg-vs-blue/10`}></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                </TableRow>
                {data?.tableData?.rows?.map((row, index) => {
                  return (
                    <TableRow
                      key={index}
                      className=" flex-row justify-between border-0"
                    >
                      <RowHeading
                        key={index+Math.log(Math.sin(index))}
                        heading={row.heading}
                        description={row.description}
                      />
                      {row.comparisons.map((comparisonValue, idx) => (
                        <TableCell
                          key={idx}
                          className={`text-center lg:min-w-[162px]  justify-center  ${idx == 0 ? 'border-b-vs-blue/20':'border-b-gray-200'} border-b md:border-none
                            ${(idx == 0 && index == data.tableData.rows.length-1) ? 'relative after:content-[""] after:absolute after:bottom-[-20px] after:bg-[rgb(74,60,225,0.1)] after:left-0 after:right-0 after:h-5 after:rounded-b-[10px]' : ''} 
                            ${idx == 0 ? 'bg-vs-blue/10' : ''}`}
                        >
                          {/* {data.tableData.rows.length-1 }{index}{idx} */}
                          <ComparisonRichIcon comparisonValue={comparisonValue} vsIndex={idx == 0}/>
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
              </React.Fragment>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
