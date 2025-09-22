import groq from 'groq'
import { getClient } from '~/lib/sanity.client'
import { SanityClient } from '@sanity/client'

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

  private fetchHeroData(region: string) {
    return groq`*[_type == "homeSettings" && language == $region][0]{
      ...,
      heroheading,
      heroDescription,
      heroStrip,
      "heroImage": heroImage.asset-> {
        _id,
        url,
        altText,
        title,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      "heroImageSecondary": heroImageSecondary.asset-> {
        _id,
        url,
        altText,
        title,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      "bookBtnContent": bookBtnContent[]->{
        buttonText,
        buttonLink
      },
      "video": video[]{
        videoPlatform,
        videoId,
        videotitle,
        "videoThumbnail": videoThumbnail.asset->{
          _id,
          url,
          originalFilename,
          size,
          mimeType
        }
      },
      
    }`
  }


  public async getData() {
    const query = this.fetchCommonData(this.slug)
    const params = { slug: this.slug }
    return await this.client.fetch(query, params)
  }

  public async getHeroData(region: string) {
    const query = this.fetchHeroData(region)
    const params = { region }
    return await this.client.fetch(query, params)
  }
}

export default Queries
