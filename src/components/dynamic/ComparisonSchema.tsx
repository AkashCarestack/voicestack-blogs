import React from 'react'
import ComparisonSection from '~/components/ComparisonSection'

/**
 * COMPARISON SCHEMA COMPONENT
 * 
 * Displays phone comparison data as an array of listing schemas.
 * Each listing schema contains description list, device type, Yealink list, and Polycom list.
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

interface ComparisonSchemaProps {
  data: any
  slugData?: any
}

const ComparisonSchema: React.FC<ComparisonSchemaProps> = ({ data, slugData }) => {
  // Handle missing data gracefully
  if (!data || !data.items || !Array.isArray(data.items) || data.items.length === 0) {
    return null
  }

  return <ComparisonSection data={data} />
}

export default ComparisonSchema

