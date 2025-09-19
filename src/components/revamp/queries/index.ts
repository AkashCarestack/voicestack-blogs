import groq from 'groq'
import { getClient } from '~/lib/sanity.client'

class Queries {
  slug: string
  client = getClient()
  constructor(slug: string) {
    this.slug = slug
  }

  private fetchCommonData(slug: string) {

    return groq`
      *[_type == "whoWeServe" && basicInfo.slug.current == "dev-adolf-h"][0]{
        content {
          sections[]{
            
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
  }


  public async getData() {
    const query = this.fetchCommonData(this.slug)
    const params = { slug: this.slug }
    return await this.client.fetch(query, params)
  }
}

export default Queries
