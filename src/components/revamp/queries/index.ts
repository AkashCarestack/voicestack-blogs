import groq from 'groq'
import { getClient } from '~/lib/sanity.client'
import { SanityClient } from '@sanity/client'

class Queries {
  slug?: string
  client = getClient()
  region?: string
  constructor(slug: string, region: string) {
    this.slug = slug
    this.region = region
  }

  /******************  QURIES  ******************/
  private fetchCommonData(_slug: string) {
    return groq`
      *[_type == "whoWeServe" && basicInfo.slug.current == $slug && language == $region][0]{
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

  private fetchHeroData(_region: string) {
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
      "testimonial": testimonialVideo-> {
            _id,
            name,
            designation,
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
            testimonialdescription,
            language
          }
      
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

  private fetchVerticalTestimonialListing(_region: string) {
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
        video[] {
          videoPlatform,
          videoId,
          videotitle
        },
        testimonialThumbnail,
        "testimonialImage":testimonialImage.asset-> {
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

  private fetchPageData(_type: string, _slug: string) {
    return groq`*[_type == $type && basicInfo.slug.current == $slug && language == $language][0]{
    "title": basicInfo.title,
    "description": basicInfo.description,
    "faqData": faqRevamp[]->,
    content {
      sections[]{
        slug,
        component {
          componentType,
          "componentData": select(
            componentType == "TabsListing" => tabsListingComponent {
            
              _type,
              "headline": headline,
              "subHeading":subheadline,
              "description":subDescription,
              "refData": globalData->,
              heading,
             
        tabs[] {
          _key,
          tabHeading,
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
            
          },
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
            keyStatement,
            keyFeatures,
            language
          }
        }
         
            },
            componentType == "Custom" => customComponent {
             _type,
              "heading":title,
              "subHeading":subtitle,
              "description":content,
              "refData":referenceGlobalSchema->
            },
            componentType == "Hero" => heroComponent {
              _type,
              ...,
              "testimonial": testimonialVideo-> {
            _id,
            name,
            designation,
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
            testimonialdescription,
            language
          }
            }
          )
        }
      }
    }
  }`
  }

  private fetchHomeCardList(_region: string) {
    return groq`*[_type == "homeSettings" && language == $region][0]{
      'globalDataReference': globalDataReference->{
        ...,
      }
    }`
  }

  private fetchFaqReferencedData() {
    return groq`*[_type == $page && language == $region][0]{
       faqReferenced->{
        faqCategories,
        hideCategory
      }
    }`
  }

  /******************  DATA FETCHING  ******************/

  public async getData() {
    const query = this.fetchCommonData(this.slug)
    const params = { slug: this.slug, region: this.region }
    return await this.client.fetch(query, params)
  }

  public async getHeroData(region: string) {
    const query = this.fetchHeroData(region)
    const params = { region }
    return await this.client.fetch(query, params)
  }

  public async getAllTabsListingData(_region: string) {
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
      const query = this.fetchVerticalTestimonialListing(region)
      return await this.client.fetch(query, { region })
    } catch (error) {
      console.error('Error fetching vertical testimonial listing data', error)
      throw error
    }
  }

  public async getPageData(type: string, slug: string) {
    const query = this.fetchPageData(type, slug)
    const params = { type, slug, language: this.region }
    const result = await this.client.fetch(query, params)

    const transformedSections = result?.content?.sections?.reduce(
      (acc: any, section: any) => {
        if (section.slug?.current) {
          acc[section.slug.current] = section.component
        }
        return acc
      },
      {},
    )

    return transformedSections
  }

  public async fetchHomeCardData(region: string) {
    const query = this.fetchHomeCardList(region)
    return await this.client.fetch(query, { region: region })
  }

  public async fetchFaqData(page: string, region: string) {
    const query = this.fetchFaqReferencedData()
    return await this.client.fetch(query, { region: region, page: page })
  }
}

export default Queries
