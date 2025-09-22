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
      *[_type == "whoWeServe" && basicInfo.slug.current == $slug][0]{
        content {
          sections[]{
            'componentType': component.componentType,
            'data': select(
              component.componentType == "TabsListing" => component.tabsListingComponent,
              component.componentType == "Custom" => component.customComponent
            ){
              ...,
              globalData->{...}
            }
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
