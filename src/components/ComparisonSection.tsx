import React, { useState } from 'react'

/**
 * COMPARISON SECTION COMPONENT
 * 
 * Displays phone comparison data with tabs for Desk Phones and Cordless Phones.
 * Shows data in a table format with Manufacturer and Model Name columns.
 * 
 * DATA STRUCTURE EXPECTED:
 * {
 *   items: [
 *     {
 *       description: string[],
 *       deviceType: 'deskPhone' | 'cordlessPhone',
 *       yealinkList: string[],
 *       polycomList: string[]
 *     },
 *     ...
 *   ]
 * }
 */

interface ComparisonSectionProps {
  data: any
}

const ComparisonSection: React.FC<ComparisonSectionProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'deskPhone' | 'cordlessPhone'>('deskPhone')

  // Handle missing data gracefully
  if (!data || !data.items || !Array.isArray(data.items) || data.items.length === 0) {
    return null
  }

  // Group items by device type
  const deskPhoneItems = data.items.filter((item: any) => item.deviceType === 'deskPhone')
  const cordlessPhoneItems = data.items.filter((item: any) => item.deviceType === 'cordlessPhone')

  // Get active items based on selected tab
  const activeItems = activeTab === 'deskPhone' ? deskPhoneItems : cordlessPhoneItems

  // Combine all models from active items into a flat list for table display
  const tableData: Array<{ manufacturer: string; modelName: string }> = []
  
  activeItems.forEach((item: any) => {
    // Add Yealink models
    if (item.yealinkList && Array.isArray(item.yealinkList)) {
      item.yealinkList.forEach((model: string) => {
        tableData.push({
          manufacturer: 'Yealink',
          modelName: model,
        })
      })
    }
    
    // Add Polycom models
    if (item.polycomList && Array.isArray(item.polycomList)) {
      item.polycomList.forEach((model: string) => {
        tableData.push({
          manufacturer: 'Polycom',
          modelName: model,
        })
      })
    }
  })

  // Get description from first active item
  const description = activeItems.length > 0 ? activeItems[0].description : null

  return (
    <div className="">
      {/* Tabs - Toggle/Segment Control */}
      <div className="flex justify-center md:mb-12 mb-8">
        <div className="rounded-full bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] flex p-1 gap-1">
          <button
            onClick={() => setActiveTab('deskPhone')}
            className={`flex md:py-[10px] py-[10px] md:px-5 px-[10px] items-center gap-1 rounded-full border-2 text-sm font-semibold cursor-pointer transition-all duration-300 ease-in-out ${
              activeTab === 'deskPhone'
                ? 'border-gray-950 bg-gray-950 text-white shadow-[0_0_0_2px_rgba(202,197,255,0.00)]'
                : 'border-transparent bg-transparent text-gray-950'
            }`}
          >
            Desk Phones
          </button>
          <button
            onClick={() => setActiveTab('cordlessPhone')}
            className={`flex py-[10px] px-5 items-center gap-1 rounded-full border-2 text-sm font-semibold cursor-pointer transition-all duration-300 ease-in-out ${
              activeTab === 'cordlessPhone'
                ? 'border-gray-950 bg-gray-950 text-white shadow-[0_0_0_2px_rgba(202,197,255,0.00)]'
                : 'border-transparent bg-transparent text-gray-950'
            }`}
          >
            Cordless Phones
          </button>
        </div>
      </div>

      <div className='max-w-[822px] mx-auto'>
        <p className="font-geist text-center text-lg font-normal leading-[28px] tracking-normal text-gray-600">
          VoiceStacks supports all major {activeTab === 'deskPhone' ? 'desk phone' : 'cordless phone'} brands and models. Explore the supported devices below to find what fits your workspace best.
        </p>
      </div>

      {/* Heading and Description */}
      <div className="md:mb-12 mb-8">
        {/* Description List */}
        {/* {description && description.length > 0 && (
          <ul className="space-y-2 mb-4">
            {description.map((desc: string, index: number) => (
              <li key={index} className="text-gray-600 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        )} */}
      </div>

      {/* Header Row */}
      {tableData.length > 0 && (
        <div className="flex p-3 md:pl-3 md:pr-3 pl-0 pr-0  items-start gap-8 self-stretch border-b border-gray-200">
          <div className="text-sm font-semibold text-gray-900 flex-1 md:w-1/2">
            Manufacturer
          </div>
          <div className="text-sm font-semibold text-gray-900 flex-1 md:w-1/2">
            Model Name
          </div>
        </div>
      )}

      {/* Data Rows */}
      {tableData.length > 0 ? (
        <div>
          {tableData.map((row, index) => (
            <div
              key={index}
              className="flex p-3  md:pl-3 md:pr-3 pl-0 pr-0 items-start gap-8 self-stretch border-b border-gray-200 last:border-b-0"
            >
              <div className="text-sm text-gray-700 flex-1 md:w-1/2">
                {row.manufacturer}
              </div>
              <div className="text-sm text-gray-700 flex-1 md:w-1/2">
                {row.modelName}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No models available for {activeTab === 'deskPhone' ? 'desk phones' : 'cordless phones'}</p>
        </div>
      )}
    </div>
  )
}

export default ComparisonSection

