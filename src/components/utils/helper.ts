import groq from 'groq'
import { getClient } from '~/lib/sanity.client'

class DataSelector {
  componentType: string
  slug: string
  client = getClient()

  constructor(componentType: string, slug: string) {
    this.componentType = componentType
    this.slug = slug
  }

  private getQuery() {
    return groq`*[_type == "${this.componentType}" && basicInfo.slug.current == "${this.slug}"]{
      'id': _id,
      'basicInfo': basicInfo,
      'content': content[]->,
      'lang': language
    }[0]`
  }

  private getTabsListingQuery() {
    return groq`*[_type == "whoWeServe" && basicInfo.slug.current == "${this.slug}"][0]{
        content {
          sections[]{
            component {
              tabsListingComponent {
                tabs[]{
                  "key": _key,
                  "description": description,
                  "image": image.asset->url,
                  "listItems": listItems[]{
                   listHeading,
                  },
                  "heading": tabHeading,
                  "subheading": tabSubHeading
                }
              }
            }
          }
        }
      }`
      
  }

  public async getData() {
    const query = this.getQuery()
    console.log({query})
    const params = { slug: this.slug }
    return await this.client.fetch(query, params)
  }

  public async getTabsListingData() {
    const query = this.getTabsListingQuery()
  
    const params = { slug: this.slug }
    return await this.client.fetch(query, params)
  }
}

export default DataSelector
