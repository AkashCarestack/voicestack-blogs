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
      *[_type == "whoWeServe" && basicInfo.slug.current == $slug][0]{
        'faq':faqRevamp[0]->{faqItems
        },
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

  private fetchAllTabsListingData() {
    return groq`*[_type == "globalData" && dataType == "tabsListingComponent"]{
      _id,
      name,
      "slug": slug.current,
      dataType,
      _createdAt,
      _updatedAt,
      tabsListingComponent {
        headline,
        subheadline,
        subDescription,
        showCTA,
        tabs[] {
          _key,
          tabHeading,
          tabSubHeading,
          description,
          "image": image.asset-> {
            _id,
            url,
            altText,
            title,
            originalFilename,
            size,
            mimeType,
            metadata {
              dimensions {
                width,
                height,
                aspectRatio
              },
              lqip,
              hasAlpha,
              isOpaque
            }
          },
          listItems[] {
            _key,
            subfeatureHeading,
            subfeatureSubheading,
            subfeatureDescription,
            "subfeatureImage": subfeatureImage.asset-> {
              _id,
              url,
              altText,
              title,
              originalFilename,
              size,
              mimeType,
              metadata {
                dimensions {
                  width,
                  height,
                  aspectRatio
                },
                lqip,
                hasAlpha,
                isOpaque
              }
            }
          },
          icon,
          ctaListItems[] {
            _key,
            ctaLink,
            ctaText,
            ctaType
          },
          Link,
          LinkText,
          testimonial-> {
            _id,
            name,
            designation,
            place,
            region,
            locations,
            practiceName,
            thumbnail,
            "logo": logo.asset-> {
              _id,
              url,
              altText,
              title,
              originalFilename,
              size,
              mimeType,
              metadata {
                dimensions {
                  width,
                  height,
                  aspectRatio
                },
                lqip,
                hasAlpha,
                isOpaque
              }
            },
            video[] {
              videoPlatform,
              videoId,
              videotitle
            },
            secondaryVideo[] {
              videoPlatform,
              videoId,
              videotitle
            },
            "testimonialImage": testimonialImage.asset-> {
              _id,
              url,
              altText,
              title,
              originalFilename,
              size,
              mimeType,
              metadata {
                dimensions {
                  width,
                  height,
                  aspectRatio
                },
                lqip,
                hasAlpha,
                isOpaque
              }
            },
            listItems[] {
              listHeading,
              before,
              after,
              description
            },
            testimonialheading,
            testimonialdescription,
            keyFeatures,
            language
          }
        }
      }
    }`
  }
  
  private fetchVerticalTestimonialListing() {
    return groq`*[_type == "verticalTestimonialListing" && language == $region][0]{
      _id,
      heading,
      description,
      'testimonial': testimonial[]->{
        _id,
        name,
        designation,
        testimonialdescription,
        thumbnail,
        locations,
        "logo": logo.asset-> {
          _id,
          url,
          altText,
          title,
          originalFilename,
          size,
          mimeType,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            },
            lqip,
            hasAlpha,
            isOpaque
          }
        },
        secondaryVideo[] {
          videoPlatform,
          videoId,
          videotitle
        }
      }
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

  public async getAllTabsListingData(region: string) {
    const query = this.fetchAllTabsListingData()
    try {
      const result = await this.client.fetch(query)
      if (!result || result.length === 0) {
        console.warn('No tabs listing data found')
      }
      return result
    } catch (error) {
      console.error('Error fetching all tabs listing data', error)
      throw error
    }
  }


  public async getVerticalTestimonialListing(region: string) {
    try {
      const query = this.fetchVerticalTestimonialListing()
      return await this.client.fetch(query, { region })
    } catch (error) {
      console.error('Error fetching vertical testimonial listing data', error)
      throw error
    }
  }
}

export default Queries
