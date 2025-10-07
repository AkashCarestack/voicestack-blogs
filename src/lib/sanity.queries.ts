import type { PortableTextBlock } from '@portabletext/types'
import type { ImageAsset, Slug } from '@sanity/types'
import groq from 'groq'
import { type SanityClient } from 'next-sanity'

// ##############################################common fragments

const bodyFragment = `
  body[] {
    ...,
    },
    _type == "image" => {
      ...,
      asset->,
    },
  }
`

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`

export async function getPosts(client: SanityClient): Promise<Post[]> {
  return await client.fetch(postsQuery)
}

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]`

export async function getPost(
  client: SanityClient,
  slug: string,
): Promise<Post> {
  return await client.fetch(postBySlugQuery, {
    slug,
  })
}

export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`

export const LegalSlugsQuery = groq`
*[_type == "legal" && defined(slug.current)][].slug.current
`

/*########################### QUERIES ##########################*/
export const metaDataQuery_ = groq` 
*[_type == "siteSettings"] | order(_createdAt desc)[0]{
  demoBtnUrl,
  loginBtnUrl,
  ogTitle,
  "ogFavicon":ogFavicon.asset->url,
  "ogImage" :ogImage.asset->url,
  ogUrl,
  ogDescription,

}`

export const integrationListQuery = groq`*[_type == "integration" ]{
  "image": integrationProductImage.asset-> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      "altText": image.altText,
      "title": image.title,
      _createdAt,
      _id
    
   
  }`
export const testimonialQuery = groq`*[_type == "testimonial"]{...,"AuthorImage":authorimage.asset->url}`
export const heroSectionQuery_ = groq`
  *[_type == "siteSettings"][0]{
    homeSettings[0],
    "about":ogDescription
  }
`

export const AboutQuery = groq`*[_type == "siteSettings"]{"about":ogDescription
}`

export async function getHeroSectionData(client: SanityClient, region: string) {
  const query = groq`*[_type == "homeSettings" && language == $region][0]{
      ...,
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
      
    }
  `

  return await client.fetch(query, { region })
}

export async function getContactAndVideoInfo(
  client: SanityClient,
  region: string,
) {
  const query = groq`*[_type == "homeSettings" && language == $region][0]{
      contactEmail,
      video,
      phoneNumber
    }
  `

  return await client.fetch(query, { region })
}

export async function getMiscellaneousData(
  client: SanityClient,
  region: string,
) {
  const query = groq` *[_type == 'miscellaneous' && language == $region][0]{
    ...,
    contentArea[] {
      ...,
      _type == "dynamicComponent" => {
        listingBlock {
          itemHeading,
          listingItem[] {
          ...,
            key,
            value
          }
        },
        browserList {
        ...,
          mainHeading,
          listingItem[] {
            name,
              "image": image.asset-> {
                _id,
                url,
                altText,
                metadata {
                  dimensions {
                    width,
                    height,
                    aspectRatio
                  }
                }
              },
              
          }
        }
      }
    }
  }`

  const result = await client.fetch(query, { region })

  return result
}
export async function getTestimonialSecitonData(
  client: SanityClient,
  region: string,
) {
  const query = groq`*[_type == "testimonialSection" && language == $region]{
      ...,
      "logo": logo.asset-> {
        _id,
        url,
        altText,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      "image": testimonialImage.asset-> {
        _id,
        url,
        altText,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      }
    } | order( order asc)
  `

  return await client.fetch(query, { region })
}

export async function logoSection(client: SanityClient, region: string) {
  const query = groq` *[_type == "logoListing" && language == $region][0]{
    ...,
  'image':logo[]->image.asset->{url,_id,altText,   metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }},
    logoSectionHeader,
    logoSectionHeaderDescptn,
    'testimonial': testimonial[]->{
      ...,
      thumbnail,
      locations,
      
    }
}`
  return await client.fetch(query, { region })
}

export async function getVerticalTestimonialListing(client: SanityClient, region: string) {
  const query = groq` *[_type == "verticalTestimonialListing" && language == $region][0]{
    ...,
  
    heading,
    description,
    'testimonial': testimonial[]->{
      ...,
      thumbnail,
      locations,
      
    }
}`
  return await client.fetch(query, { region })
}

export async function getCardsSectionData(
  client: SanityClient,
  region: string,
) {
  const query = groq` *[_type == "cardsListing" && language == $region][0]{
    heading,
    cardItems[]{
      "heading": cardItemHeading,
      "description": cardItemContent,
      "iconSvg": cardItemSvg,
      "icon": cardItemIcon.asset->url
    }
    
}`
  return await client.fetch(query, { region })
}

export async function getFooterData(client: SanityClient, region: string) {
  const query = groq` *[_type == "footer" && language == $region][0]{
    title,
    ctaBanner {
      title,
      buttonText,
      buttonLink,
      showBanner
    },
    footerColumns[] {
      title,
      links[] {
        text,
        link,
        newTab
      }
    },
    socialMedia {
      linkedin,
      facebook,
      instagram,
      youtube,
      twitter
    },
    appStoreLinks {
      googlePlay,
      appStore
    },
    bottomLinks[] {
      text,
      link,
      newTab
    },
    copyrightText,
    logo {
      asset-> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      alt
    }
  }`
  return await client.fetch(query, { region })
}

export async function getBannerData(client: SanityClient, region: string) {
  const query = groq` *[_type == "banner" && language == $region][0]{
    ...,
  }`
  return await client.fetch(query, { region })
}

export async function getCsCardsSectionData(
  client: SanityClient,
  region: string,
) {
  const query = groq` *[_type == "csCardsListing" && language == $region][0]{
    heading,
    subHeading,
    cardItems[]{
      "heading": cardItemHeading,
      "description": cardItemContent,
      "iconSvg": cardItemSvg,
      "image": cardItemImage.asset->url
    }
    
}`
  return await client.fetch(query, { region })
}

export async function getTestimonialHighlightSectionData(
  client: SanityClient,
  region: string,
) {
  const query = groq` *[_type == "testimonialHighlightSection" && language == $region][0]{
    ...,
    testimonials[]{
      ...,
      "testimonialThumbnail": testimonialThumbnail.asset-> {
        _id,
        url,
        altText,
        title
      },
      "clientLogo": clientLogo.asset -> {
        _id,
        url,
        altText,
        title
      },
    }
    
    
}`
  return await client.fetch(query, { region })
}

export async function featureSectionQuery(
  client: SanityClient,
  region: string,
) {
  const query = groq`*[_type == "testimonial" && language == $region]{...,
   
    "testimonialImage":testimonialImage.asset->{url,_id,altText,title,
    metadata {
           dimensions {
             width,
             height,
             aspectRatio
           }
    }
  },
  "testimonialIcon":testimonialIcon.asset->{url,_id,altText,title,
    metadata {
           dimensions {
             width,
             height,
             aspectRatio
           }
    }
  },
  "testimonialSubSection":testimonialSubSection[]->{
    featureSubDescription,
    featureSubHead,
    "image":featureChipImage.asset->{url,_id,altText,title,
    metadata {
           dimensions {
             width,
             height,
             aspectRatio
           }
    }
  },
  }
  } | order(testimonialOrder asc)`
  return await client.fetch(query, { region })
}
export const getFounderDetails = (region) => groq`*[_type == "person"]{
  'name':personName,
  'socialMediaLinks':socialMediaLinks,
  'image': personImage.asset->{
       _id,
       url,
       metadata {
         dimensions {
           width,
           height,
           aspectRatio
         }
       }
     },
    'designation':personDesignation,
    'description':personDescription
}`

export async function getFeatureList(client: SanityClient, region: string) {
  const query = groq`*[_type == "featureList" && language == $region]{
    language,
    name,
    description,
    shortDescription,
    slug,
    _id
  }`

  return await client.fetch(query, { region })
}

export async function getFeaturePageData(
  client: SanityClient,
  slug: string,
  region: string,
) {
  const query = groq`*[_type == "featureList" && slug.current == $slug && language == $region][0]{
    name,
    title,
    slug,
    content,
    "heroSection":{
      name,
      slug,
      heading,
      description,
      shortDescription,
      "mainImage": mainImage.asset->{
        _id,
        url,
        "altText": mainImage.altText,
        "title": mainImage.title,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      "secondaryImage": secondaryImage.asset->{
        _id,
        url,
        "altText": secondaryImage.altText,
        "title": secondaryImage.title,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      "featureCategory": featureCategory->,
      heroTheme
    },
    featureBenefitsSection->{
      ...,
      "mainImage": mainImage.asset->{
        _id,
        url,
        "altText": mainImage.altText,
        "title": mainImage.title,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      "secondaryImage": secondaryImage.asset->{
        _id,
        url,
        "altText": secondaryImage.altText,
        "title": secondaryImage.title,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
    },
    featureFAQSection[]->,
    "featureSubSection": featureSubSection[]->{
      title,
      ...,
      "mainImage": mainImage.asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        },
        "altText": mainImage.altText,
        "title": mainImage.title,
        _createdAt,
        _id
      },
  }`

  return await client.fetch(query, { slug, region })
}

export async function fetchFaq(
  client: SanityClient,
  region: string,
): Promise<any> {
  const query = groq`*[_type == "faq" && language == $region] |order(order asc)`
  return await client.fetch(query, { region })
}

export const SeoQuery = groq`*[_type == "siteSettings"]
| order(_createdAt desc)[0].seoSettings
`

/*########################### END  ##########################*/

export async function metaDataQuery(client: SanityClient): Promise<any> {
  return await client.fetch(metaDataQuery_)
}

export async function fetchIntegrationList(client: SanityClient): Promise<any> {
  return await client.fetch(integrationListQuery)
}

export async function heroSectionQuery(
  client: SanityClient,
): Promise<HomeSettings | null> {
  return await client.fetch(heroSectionQuery_)
}

export async function fetchAboutSection(client: SanityClient): Promise<any> {
  return await client.fetch(AboutQuery)
}

// export async function fetchHeroSectionData(client: SanityClient): Promise<any> {
//   return await client.fetch(heroSection)
// }

export async function getLegalInformation(
  client: SanityClient,
  informationType: string,
): Promise<LegalInformation> {
  const information = {
    businessAgreement: 'businessAgreement',
    privacyPolicy: 'privacyPolicy',
    termsAndCondition: 'termsAndCondition',
  }
  const informationTypeToFetch = information[informationType]
  const query = groq` *[_type == "legal"]{
   ${informationTypeToFetch}
 }`
  return await client.fetch(query)
}

export async function fetchSeoSettings(client: SanityClient): Promise<any> {
  return await client.fetch(SeoQuery)
}

export async function fetchTermsAndCondition(
  client: SanityClient,
  docType: string,
): Promise<any> {
  const query = groq`*[_type == "legal" && slug.current == $docType][0] {
    termsAndCondition,title
  }`

  return await client.fetch(query, { docType })
}

export async function getALLHomeSettings(client: SanityClient, region: string) {
  const query = groq`*[_type == "homeSettings" && language == $region][0]{
    ...,
   "selectedIntegrations": integration[]->{
        "image": integrationProductImage.asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        },
        "altText": image.altText,
        "title": image.title,
        _createdAt,
        _id
      },
    "selectedFeatures": selectedfeatures[]->{
        ...,
        "imageUrl": categoryImage.asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        },
        "altText": image.altText,
        "title": image.title,
        "features": features[]->
      },
    "selectedTestimonials": selectedTestimonial[]->{
        ...,
        "AuthorImage": authorimage.asset->url
      },
    "selectedPartners": selectedPartner[]->{
        partnerName,
        "image": partnerLogo.asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        }
      },
    "selectedBenefits": selectedBenefits[]->{
        "benefitHeading":benefitHeading,
        "benifitSectionImage": benefitImageSection.asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        },
        "benefitPoints": benefitPoints
      }
  }`
  return await client.fetch(query, { region })
}

export async function getHeaderData(client: SanityClient, region: string) {
  const query = groq`*[_type == "homeSettings" && language == $region][0]{
    navigationMenu,
    topNavigationMenu,
    phoneNumber,
    ctabutton
  }`
  return await client.fetch(query, { region })
}

export const getALLSiteSettings = (region) =>
  groq`*[_type == "siteSettings"] | order(_createdAt desc)[0]`

export const getComparisonTableData = (region) =>
  groq`*[_type == "comparisonTable"] {
    ..., 
    "columns": columns[] {
        ..., "logo": logo.asset-> {
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        },
        "logoMobile":logoMobile.asset-> {
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        },
        "logoMobile":logoMobile.asset-> {
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        }
    },
    
    "rowCategories": rowCategories[] { 
      ..., "rows": rows[] {
        ..., "comparisons": comparisons[] -> {
          ..., "icon": icon.asset-> {
            _id,
            url,
            metadata {
              dimensions {
                width,
                height,
                aspectRatio
              }
            }
          }
        }
      }
    }
  } | order(_createdAt desc)[0]`

export const getAllComparisonValues = (region) =>
  groq`*[_type == "comparisonValue"] {
    _id,
    text,
    "icon": icon.asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height,
          aspectRatio
        }
      }
    }
  } | order(text asc)`

export async function getIntegrationList(client: SanityClient, region: string) {
  const query = groq`*[_type == "platform" && language == $region] {
    ...,
      _id,
      _createdAt,
      integrationHeading,
      integrationSubHeading,
      integrationDescription,
      "integrationImage": integrationImage.asset-> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      bgVideoUrl,
      bgVideoUrlMobile,
      analytics[]->{
        ..., "image": image.asset-> {
            _id,
            url,
            metadata {
              dimensions {
                width,
                height,
                aspectRatio
              }
            },
            ...,

          }
      },
      pms[]->{
        ..., "image": image.asset-> {
            _id,
            url,
            metadata {
              dimensions {
                width,
                height,
                aspectRatio
              }
            },
            ...,

          }

      },
      crm[]->{
        ..., "image": image.asset-> {
            _id,
            url,
            metadata {
              dimensions {
                width,
                height,
                aspectRatio
              }
            },
            ...,

          }
      }

  } | order(_createdAt desc)[0]`
  return await client.fetch(query, { region })
}

/*####################################### INTERFACES    ###########################*/
export interface Post {
  _type: 'post'
  _id: string
  _createdAt: string
  title?: string
  slug: Slug
  excerpt?: string
  mainImage?: ImageAsset
  body: PortableTextBlock[]
}

export interface HomeSettings {
  buttonText?: string
  heroSectionHeader?: string
  heroDescription?: string
  heroSubHeading?: string
}

export interface LegalInformation {
  businessAgreement: string
  privacyPolicy: string
  termsAndCondition: string
}

// Who We Serve Queries
export const whoWeServeQueries = {
  // Get the home page content for Who We Serve
  getWhoWeServeHome: `
    *[_type in ["whoWeServe", "whoWeServePage"] && basicInfo.slug.current == "landing" && (language == $language || language == null)] {
      _id,
      basicInfo {
        title,
        slug,
        description,
        icon
      },
      content,
      seo {
        metaTitle,
        metaDescription
      },
      language
    }[0]
  `,

  // Get all Who We Serve pages for listing
  getAllWhoWeServePages: `
    *[_type in ["whoWeServe", "whoWeServePage"] && (language == $language || language == null)] | order(basicInfo.title asc) {
      _id,
      basicInfo {
        title,
        slug,
        description,
        icon
      },
      content,
      seo {
        metaTitle,
        metaDescription
      },
      language
    }
  `,

  // Get specific Who We Serve page by slug
  getWhoWeServePageBySlug: `
    *[_type in ["whoWeServe", "whoWeServePage"] && basicInfo.slug.current == $slug && (language == $language || language == null)] {
      _id,
      basicInfo {
        title,
        slug,
        description,
        icon
      },
      content {
        sections[] {
          title,
          slug,
          component {
            componentType,
            tabsListingComponent {
              headline,
              subheadline,
              subDescription,
              showCTA,
              globalData-> {
                _id,
                title,
                comparisonTable,
                dataType
              },
              tabs[] {
                tabHeading,
                tabSubHeading,
                description,
                image,
                listItems[] {
                  subfeatureHeading,
                  subfeatureSubheading,
                  subfeatureDescription,
                  subfeatureImage
                },
                icon,
                ctaListItems[] {
                  ctaLink,
                  ctaText,
                  ctaType
                },
                Link,
                LinkText,
                testimonial
              }
            },
            customComponent {
              title,
              subtitle,
              content,
              buttonText,
              buttonLink,
              backgroundColor,
              image,
              referenceGlobalSchema-> {
                _id,
                title,
                comparisonTable,
                dataType
              }
            }
          }
        }
      },
      seo {
        metaTitle,
        metaDescription
      },
      language
    }[0]
  `,

  // Get Who We Serve page slugs for routing
  getWhoWeServeSlugs: `
    *[_type in ["whoWeServe", "whoWeServePage"] && (language == $language || language == null)] {
      basicInfo {
        slug
      }
    }
  `,

  // Create landing page from existing data if no landing page exists
  createLandingPageFromExisting: `
    *[_type in ["whoWeServe", "whoWeServePage"] && (language == $language || language == null)] | order(_createdAt asc)[0] {
      _id,
      basicInfo {
        title,
        slug,
        description,
        icon
      },
      content,
      seo {
        metaTitle,
        metaDescription
      },
      language
    }
  `
}

// Dental Software Queries
export const dentalSoftwareQueries = {
  // Get the home page content for Dental Software
  getDentalSoftwareHome: `
    *[_type == "dentalSoftware" && basicInfo.slug.current == "landing" && (language == $language || language == null)] {
      _id,
      basicInfo {
        title,
        slug,
        description,
        icon
      },
      content {
        mainContent,
        sections[] {
          title,
          slug,
          component {
            componentType,
            tabsListingComponent {
              headline,
              subheadline,
              subDescription,
              showCTA,
              globalData-> {
                _id,
                title,
                comparisonTable,
                dataType
              },
              tabs[] {
                tabHeading,
                tabSubHeading,
                description,
                image,
                listItems[] {
                  subfeatureHeading,
                  subfeatureSubheading,
                  subfeatureDescription,
                  subfeatureImage
                },
                icon,
                ctaListItems[] {
                  ctaLink,
                  ctaText,
                  ctaType
                },
                Link,
                LinkText,
                testimonial
              }
            },
            customComponent {
              title,
              subtitle,
              content,
              buttonText,
              buttonLink,
              backgroundColor,
              image,
              referenceGlobalSchema-> {
                _id,
                title,
                comparisonTable,
                dataType
              }
            }
          }
        }
      },
      seo {
        metaTitle,
        metaDescription
      },
      language
    }[0]
  `,

  // Get all Dental Software pages for listing
  getAllDentalSoftwarePages: `
    *[_type == "dentalSoftware" && (language == $language || language == null)] | order(basicInfo.title asc) {
      _id,
      basicInfo {
        title,
        slug,
        description,
        icon
      },
      language
    }
  `,

  // Get specific Dental Software page by slug
  getDentalSoftwarePageBySlug: `
    *[_type == "dentalSoftware" && basicInfo.slug.current == $slug && (language == $language || language == null)] {
      _id,
      basicInfo {
        title,
        slug,
        description,
        icon
      },
      content {
        mainContent,
        sections[] {
          title,
          slug,
          component {
            componentType,
            tabsListingComponent {
              headline,
              subheadline,
              subDescription,
              showCTA,
              globalData-> {
                _id,
                title,
                comparisonTable,
                dataType
              },
              tabs[] {
                tabHeading,
                tabSubHeading,
                description,
                image,
                listItems[] {
                  subfeatureHeading,
                  subfeatureSubheading,
                  subfeatureDescription,
                  subfeatureImage
                },
                icon,
                ctaListItems[] {
                  ctaLink,
                  ctaText,
                  ctaType
                },
                Link,
                LinkText,
                testimonial
              }
            },
            customComponent {
              title,
              subtitle,
              content,
              buttonText,
              buttonLink,
              backgroundColor,
              image,
              referenceGlobalSchema-> {
                _id,
                title,
                comparisonTable,
                dataType
              }
            }
          }
        }
      },
      seo {
        metaTitle,
        metaDescription
      },
      language
    }[0]
  `,

  // Get Dental Software page slugs for routing
  getDentalSoftwareSlugs: `
    *[_type == "dentalSoftware" && (language == $language || language == null)] {
      basicInfo {
        slug
      }
    }
  `,

  // Create landing page from existing data if no landing page exists
  createLandingPageFromExisting: `
    *[_type == "dentalSoftware" && (language == $language || language == null)] | order(_createdAt asc)[0] {
      _id,
      basicInfo {
        title,
        slug,
        description,
        icon
      },
      content,
      seo {
        metaTitle,
        metaDescription
      },
      language
    }
  `
}

export const whyVoicestackQueries = {
  // Get the home page content for Dental Software
  getDentalSoftwareHome: `
    *[_type == "whyVoicestack" && basicInfo.slug.current == "landing" && (language == $language || language == null)] {
      _id,
      basicInfo {
        title,
        slug,
        description,
        icon
      },
      content {
        mainContent,
        sections[] {
          title,
          slug,
          component {
            componentType,
            tabsListingComponent {
              headline,
              subheadline,
              subDescription,
              showCTA,
              globalData-> {
                _id,
                title,
                comparisonTable,
                dataType
              },
              tabs[] {
                tabHeading,
                tabSubHeading,
                description,
                image,
                listItems[] {
                  subfeatureHeading,
                  subfeatureSubheading,
                  subfeatureDescription,
                  subfeatureImage
                },
                icon,
                ctaListItems[] {
                  ctaLink,
                  ctaText,
                  ctaType
                },
                Link,
                LinkText,
                testimonial
              }
            },
            customComponent {
              title,
              subtitle,
              content,
              buttonText,
              buttonLink,
              backgroundColor,
              image,
              referenceGlobalSchema-> {
                _id,
                title,
                comparisonTable,
                dataType
              }
            }
          }
        }
      },
      seo {
        metaTitle,
        metaDescription
      },
      language
    }[0]
  `,

  // Get all Dental Software pages for listing
  whyVoiceStackPages: `
    *[_type == "whyVoicestack" && (language == $language || language == null)] | order(basicInfo.title asc) {
      _id,
      basicInfo {
        title,
        slug,
        description,
        icon
      },
      language
    }
  `,

  // Get specific Dental Software page by slug
  getVoicestackPageBySlug: `
    *[_type == "dentalSoftware" && basicInfo.slug.current == $slug && (language == $language || language == null)] {
      _id,
      basicInfo {
        title,
        slug,
        description,
        icon
      },
      content {
        mainContent,
        sections[] {
          title,
          slug,
          component {
            componentType,
            tabsListingComponent {
              headline,
              subheadline,
              subDescription,
              showCTA,
              globalData-> {
                _id,
                title,
                comparisonTable,
                dataType
              },
              tabs[] {
                tabHeading,
                tabSubHeading,
                description,
                image,
                listItems[] {
                  subfeatureHeading,
                  subfeatureSubheading,
                  subfeatureDescription,
                  subfeatureImage
                },
                icon,
                ctaListItems[] {
                  ctaLink,
                  ctaText,
                  ctaType
                },
                Link,
                LinkText,
                testimonial
              }
            },
            customComponent {
              title,
              subtitle,
              content,
              buttonText,
              buttonLink,
              backgroundColor,
              image,
              referenceGlobalSchema-> {
                _id,
                title,
                comparisonTable,
                dataType
              }
            }
          }
        }
      },
      seo {
        metaTitle,
        metaDescription
      },
      language
    }[0]
  `,

  // Get Dental Software page slugs for routing
  getDentalSoftwareSlugs: `
    *[_type == "dentalSoftware" && (language == $language || language == null)] {
      basicInfo {
        slug
      }
    }
  `,

  // Create landing page from existing data if no landing page exists
  createLandingPageFromExisting: `
    *[_type == "dentalSoftware" && (language == $language || language == null)] | order(_createdAt asc)[0] {
      _id,
      basicInfo {
        title,
        slug,
        description,
        icon
      },
      content,
      seo {
        metaTitle,
        metaDescription
      },
      language
    }
  `
}


// Content Section Queries
export const contentSectionQueries = {
  // Get content section by slug from Who We Serve pages
  getWhoWeServeSectionBySlug: `
    *[_type == "whoWeServe" && (language == $language || language == null)] {
      content {
        sections[] {
          title,
          slug,
          component
        }
      }
    }[0].content.sections[slug.current == $sectionSlug][0]
  `,

  // Get content section by slug from Dental Software pages
  getDentalSoftwareSectionBySlug: `
    *[_type == "dentalSoftware" && (language == $language || language == null)] {
      content {
        sections[] {
          title,
          slug,
          component
        }
      }
    }[0].content.sections[slug.current == $sectionSlug][0]
  `,

  // Get all content sections with slugs for listing
  getAllContentSections: `
    *[_type in ["whoWeServe", "dentalSoftware"] && (language == $language || language == null)] {
      _type,
      basicInfo {
        title,
        slug
      },
      content {
        sections[] {
          title,
          slug,
          component {
            componentType
          }
        }
      }
    }
  `,

  // Features queries
  getFeaturesList: `
    *[_type == "features" && (language == $language || language == null)] | order(language asc, order asc, title asc) {
      _id,
      title,
      slug,
      language,
      order,
      heroTitle,
      heroSubtitle,
      heroImage {
        asset-> {
          _id,
          url
        }
      },
      mainImage {
        asset-> {
          _id,
          url
        }
      },
      shortDescription,
      featureCategory-> {
        name,
        description,
        icon {
          asset-> {
            _id,
            url
          }
        },
        iconSvgCode,
        features[] {
          title,
          description,
          icon,
          isHighlighted
        }
      }
    }
  `,

  getFeatureBySlug: `
    *[_type == "features" && slug.current == $slug && (language == $language || language == null)][0] {
      _id,
      title,
      slug,
      language,
      order,
      heroTitle,
      heroSubtitle,
      heroImage {
        asset-> {
          _id,
          url
        }
      },
      mainImage {
        asset-> {
          _id,
          url
        }
      },
      secondaryImage {
        asset-> {
          _id,
          url
        }
      },
      overview,
      description,
      shortDescription,
      featureCategory-> {
        name,
        description,
        icon {
          asset-> {
            _id,
            url
          }
        },
        iconSvgCode,
        features[] {
          title,
          description,
          icon,
          isHighlighted
        }
      },
      benefits[] {
        title,
        description,
        icon {
          asset-> {
            _id,
            url
          }
        }
      },
      pricing {
        isFree,
        price,
        billingPeriod,
        trialAvailable,
        trialPeriod
      },
      cta {
        primaryText,
        primaryLink,
        secondaryText,
        secondaryLink
      },
      relatedFeatures[]-> {
        _id,
        title,
        slug,
        heroImage {
          asset-> {
            _id,
            url
          }
        },
        shortDescription
      },
      metaTitle,
      metaDescription,
      keywords,
      canonicalUrl
    }
  `
}

// Features queries
export const getFeaturesListQuery = groq`
  *[_type == "features" && (language == $language || language == null)] | order(language asc, order asc, title asc) {
    _id,
    title,
    slug,
    language,
    order,
    heroTitle,
    heroSubtitle,
    heroImage {
      asset-> {
        _id,
        url
      }
    },
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    shortDescription,
    featureCategory-> {
      name,
      subheading,
      description,
      mainImage {
        asset-> {
          _id,
          url
        }
      },
      icon {
        asset-> {
          _id,
          url
        }
      },
      iconSvgCode,
    }
  }
`

export const getFeatureBySlugQuery = groq`
  *[_type == "features" && slug.current == $slug && (language == $language || language == null)][0] {
    _id,
    title,
    slug,
    language,
    order,
    heroTitle,
    heroSubtitle,
    heroImage {
      asset-> {
        _id,
        url
      }
    },
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    secondaryImage {
      asset-> {
        _id,
        url
      }
    },
    overview,
    description,
    shortDescription,
    featureCategory-> {
      name,
      subheading,
      description,
      mainImage {
        asset-> {
          _id,
          url
        }
      },
      icon {
        asset-> {
          _id,
          url
        }
      },
      iconSvgCode,
    },
    benefits[] {
      title,
      description,
      icon {
        asset-> {
          _id,
          url
        }
      }
    },
    pricing {
      isFree,
      price,
      billingPeriod,
      trialAvailable,
      trialPeriod
    },
    cta {
      primaryText,
      primaryLink,
      secondaryText,
      secondaryLink
    },
    relatedFeatures[]-> {
      _id,
      title,
      slug,
      heroImage {
        asset-> {
          _id,
          url
        }
      },
      shortDescription
    },
    metaTitle,
    metaDescription,
    keywords,
    canonicalUrl
  }
`

// Features query functions
export async function getFeaturesList(client: SanityClient, language: string = 'en'): Promise<any[]> {
  return await client.fetch(getFeaturesListQuery, { language })
}

export async function getFeatureBySlug(client: SanityClient, slug: string, language: string = 'en'): Promise<any> {
return await client.fetch(getFeatureBySlugQuery, { slug, language })
}

// Get features by category ID
export async function getFeaturesByCategory(client: SanityClient, categoryId: string): Promise<any[]> {
  return await client.fetch(getFeaturesByCategoryQuery, { categoryId })
}

// Get all feature categories with their associated features
export async function getFeatureCategoriesWithCount(client: SanityClient): Promise<any[]> {
  return await client.fetch(getFeatureCategoriesWithCountQuery)
}

// Feature List queries
export const getFeatureListQuery = groq`
  *[_type == "featureList" && (language == $language || language == null)] | order(language asc, title asc) {
    _id,
    title,
    description,
    slug,
    language,
    featureReferences[]-> {
      _id,
      title,
      slug,
      heroTitle,
      heroSubtitle,
      heroImage {
        asset-> {
          _id,
          url
        }
      },
      mainImage {
        asset-> {
          _id,
          url
        }
      },
      shortDescription,
      featureCategory-> {
        name,
        subheading,
        description,
        mainImage {
          asset-> {
            _id,
            url
          }
        },
        icon {
          asset-> {
            _id,
            url
          }
        },
        iconSvgCode
      },
      language
    },
    displaySettings {
      layout,
      itemsPerRow,
      showCategories,
      showSearch,
      showCTAs,
      highlightedFeaturesFirst
    },
    metaTitle,
    metaDescription,
    keywords
  }
`

// Query for GlobalData with feature list
export const getGlobalDataFeatureListQuery = groq`
  *[_type == "globalData" && dataType == "featureList" && (language == $language || language == null)] | order(_createdAt desc) {
    _id,
    name,
    dataType,
    featureList {
      title,
      description,
      featureListReference-> {
        _id,
        title,
        description,
        slug,
        language,
        featureReferences[]-> {
          _id,
          title,
          slug,
          heroTitle,
          heroSubtitle,
          heroImage {
            asset-> {
              _id,
              url
            }
          },
          mainImage {
            asset-> {
              _id,
              url
            }
          },
          shortDescription,
          featureCategory-> {
            name,
            subheading,
            description,
            mainImage {
              asset-> {
                _id,
                url
              }
            },
            icon {
              asset-> {
                _id,
                url
              }
            },
            iconSvgCode
          },
          language
        },
        displaySettings {
          layout,
          itemsPerRow,
          showCategories,
          showSearch,
          showCTAs,
          highlightedFeaturesFirst
        }
      },
      selectAllFeatures
    },
    language
  }
`

// Query to get all features for bulk selection
export const getAllFeaturesQuery = groq`
  *[_type == "features" && (language == $language || language == null)] | order(title asc) {
    _id,
    title,
    slug,
    heroTitle,
    heroSubtitle,
    heroImage {
      asset-> {
        _id,
        url
      }
    },
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    shortDescription,
    featureCategory-> {
      name,
      subheading,
      description,
      mainImage {
        asset-> {
          _id,
          url
        }
      },
      icon {
        asset-> {
          _id,
          url
        }
      },
      iconSvgCode
    },
    language
  }
`

// Query to get features by category
export const getFeaturesByCategoryQuery = groq`
  *[_type == "features" && references($categoryId)] | order(title asc) {
    _id,
    title,
    slug,
    heroTitle,
    heroSubtitle,
    heroImage {
      asset-> {
        _id,
        url
      }
    },
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    shortDescription,
    language
  }
`

// Query to get all feature categories with their associated features count
export const getFeatureCategoriesWithCountQuery = groq`
  *[_type == "featureCategory"] | order(name asc) {
    _id,
    name,
    subheading,
    description,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    icon {
      asset-> {
        _id,
        url
      }
    },
    iconSvgCode,
    "featuresCount": count(*[_type == "features" && references(^._id)]),
    "features": *[_type == "features" && references(^._id)] | order(title asc) {
      _id,
      title,
      slug,
      language
    }
  }
`

export const getFeatureListBySlugQuery = groq`
  *[_type == "featureList" && slug.current == $slug && (language == $language || language == null)][0] {
    _id,
    title,
    description,
    slug,
    language,
    featureReferences[]-> {
      _id,
      title,
      slug,
      heroTitle,
      heroSubtitle,
      heroImage {
        asset-> {
          _id,
          url
        }
      },
      mainImage {
        asset-> {
          _id,
          url
        }
      },
      shortDescription,
      featureCategory-> {
        name,
        subheading,
        description,
        mainImage {
          asset-> {
            _id,
            url
          }
        },
        icon {
          asset-> {
            _id,
            url
          }
        },
        iconSvgCode
      },
      language
    },
    displaySettings {
      layout,
      itemsPerRow,
      showCategories,
      showSearch,
      showCTAs,
      highlightedFeaturesFirst
    },
    metaTitle,
    metaDescription,
    keywords
  }
`

export const getFeatureListSlugsQuery = groq`
  *[_type == "featureList" && (language == $language || language == null)] {
    slug
  }
`

// Feature List query functions

export async function getFeatureListBySlug(client: SanityClient, slug: string, language: string = 'en'): Promise<any> {
  return await client.fetch(getFeatureListBySlugQuery, { slug, language })
}

export async function getFeatureListSlugs(client: SanityClient, language: string = 'en'): Promise<any[]> {
  return await client.fetch(getFeatureListSlugsQuery, { language })
}

export async function getAllFeatures(client: SanityClient, language: string = 'en'): Promise<any[]> {
  return await client.fetch(getAllFeaturesQuery, { language })
}

export async function getGlobalDataFeatureList(client: SanityClient, language: string = 'en'): Promise<any[]> {
  return await client.fetch(getGlobalDataFeatureListQuery, { language })
}
