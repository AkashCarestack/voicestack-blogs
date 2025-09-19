import groq from 'groq'
import { getClient } from '~/lib/sanity.client'


 class Queries {
    slug: string
    client = getClient()

    public fetchCommonData(slug: string) {
        return groq`*[_type == "whoWeServe" && basicInfo.slug.current == "${this.slug}"][0]{
           content {
             sections[0]{
              'tabs': component.tabsListingComponent.globalData->{
                ...,
              }
             }
           }
         }`
   }
   
 }

 export default Queries