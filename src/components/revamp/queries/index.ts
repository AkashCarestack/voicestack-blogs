import groq from 'groq'
import { getClient } from '~/lib/sanity.client'

class Queries {
  slug: string
  client = getClient()
  constructor(slug: string) {
    this.slug = slug
  }

  public fetchCommonData(slug: string) {

    return groq`
      *[_type == "whoWeServe" && basicInfo.slug.current == "${this.slug}"][0]{
        content {
          sections[0]{
            'referencedTab': component.tabsListingComponent.globalData->{
              ...,
            },
            'tabs': component.tabsListingComponent{
              ...
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
