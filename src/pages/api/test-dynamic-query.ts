import { NextApiRequest, NextApiResponse } from 'next'
import { getClient } from '~/lib/sanity.client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = getClient()
    
    console.log('Testing dynamic component query...')
    
    // Test the updated query with conditional component selection
    const dynamicQuery = `
      *[_type == "whoWeServe" && basicInfo.slug.current == "dev-adolf-h"][0]{
        content {
          sections[]{
            ...,
            'componentType':component.componentType,
            'data': select(
              component.componentType == "TabsListing" => component.tabsListingComponent{
                ...,
                'globalData':globalData->{
                  ...,
                }
              },
              component.componentType == "RightImage" => component.rightImageComponent{
                ...,
                'globalData':globalData->{
                  ...,
                }
              },
              component.componentType == "Listing" => component.listingComponent{
                ...,
                'globalData':globalData->{
                  ...,
                }
              },
              component.componentType == "FeatureGrid" => component.featureGridComponent{
                ...,
                'globalData':globalData->{
                  ...,
                }
              },
              component.componentType == "Testimonial" => component.testimonialComponent{
                ...,
                'globalData':globalData->{
                  ...,
                }
              },
              component.componentType == "Custom" => component.customComponent{
                ...,
                'globalData':globalData->{
                  ...,
                }
              },
              null
            )
          }
        }
      }
    `
    
    const result = await client.fetch(dynamicQuery)
    
    // Analyze the result to show what component types we got and their data
    const analysis = result?.content?.sections?.map((section: any) => ({
      componentType: section.componentType,
      hasData: !!section.data,
      dataKeys: section.data ? Object.keys(section.data) : [],
      dataSize: section.data ? JSON.stringify(section.data).length : 0
    })) || []
    
    console.log('Query result analysis:', analysis)
    
    res.status(200).json({
      success: true,
      message: 'Dynamic component query test completed',
      analysis,
      fullResult: result,
      query: dynamicQuery
    })
  } catch (error) {
    console.error('Dynamic query test error:', error)
    res.status(500).json({ 
      message: 'Error testing dynamic query',
      error: error.message 
    })
  }
}
