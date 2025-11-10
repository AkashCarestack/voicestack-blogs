import groq from 'groq'
import { getClient } from '~/lib/sanity.client'
import { SanityClient } from '@sanity/client'

/**
 * Queries class for handling Sanity CMS data fetching operations
 * Provides methods to fetch various types of content including pages, hero sections,
 * testimonials, tabs listing, and FAQ data with proper error handling and data transformation.
 */
class Queries {
  slug?: string
  client = getClient()
  region?: string

  constructor(slug: string, region: string) {
    this.slug = slug
    this.region = region
  }

  // ==================== COMMON QUERY PATTERNS ====================
  
  /**
   * Standard image metadata fields for consistent image data fetching
   */
  private IMAGE_METADATA_FIELDS = groq`
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
  `

  private CTA_FIELDS = groq`
    ctaLink,
    ctaText,
    ctaType
  `

  /**
   * Standard video fields for consistent video data fetching
   */
  private readonly VIDEO_FIELDS = groq`
    videoPlatform,
    videoId,
    videotitle
  `

  // ==================== PRIVATE QUERY METHODS ====================
  /**
   * Fetches common page data for "whoWeServe" type pages
   * Includes FAQ data and content sections with dynamic component handling
   * 
   * @param _slug - The page slug to fetch data for
   * @returns GROQ query string for fetching page data
   */
  private fetchCommonData(_slug: string) {
    return groq`
      *[_type == "whoWeServe" && basicInfo.slug.current == $slug && language == $region][0] {
        // Fetch FAQ data from referenced FAQ document
        'faq': faqRevamp[0]-> {
          faqItems
        },
        
        // Fetch page content sections
        content {
          sections[] {
            'componentType': component.componentType,
            
            // Dynamically select component data based on type
            'data': select(
              component.componentType == "TabsListing" => component.tabsListingComponent,
              component.componentType == "Custom" => component.customComponent
            ) {
              ...,
              // Include referenced global data
              globalData-> { ... }
            }
          }
        }
      }
    `
  }

  /**
   * Fetches hero section data from home settings
   * Includes hero content, images, videos, and testimonial data
   * 
   * @param _region - The language/region to fetch data for
   * @returns GROQ query string for fetching hero data
   */
  private fetchHeroData(_region: string) {
    return groq`
      *[_type == "homeSettings" && language == $region][0] {
        // Include all base fields
        ...,
        
        // Hero content fields
        heroheading,
        heroDescription,
        heroStrip,
        
        // Primary hero image with metadata
        "heroImage": heroImage.asset-> {
          ${this.IMAGE_METADATA_FIELDS}
        },
        
        // Secondary hero image with metadata
        "heroImageSecondary": heroImageSecondary.asset-> {
          ${this.IMAGE_METADATA_FIELDS}
        },
        
        // Book button content references
        "bookBtnContent": bookBtnContent[]-> {
          buttonText,
          buttonLink
        },
        
        // Video content with thumbnails
        "video": video[] {
          ${this.VIDEO_FIELDS},
          "videoThumbnail": videoThumbnail.asset-> {
            _id,
            url,
            originalFilename,
            size,
            mimeType
          }
        },
        
        // Featured testimonial with complete data
        "testimonial": testimonialVideo-> {
          _id,
          name,
          designation,
          thumbnail,
          
          // Testimonial logo
          "logo": logo.asset-> {
            ${this.IMAGE_METADATA_FIELDS}
          },
          
          // Testimonial videos
          video[] {
            ${this.VIDEO_FIELDS}
          },
          
          // Testimonial image
          "testimonialImage": testimonialImage.asset-> {
            ${this.IMAGE_METADATA_FIELDS}
          },
          
          testimonialdescription,
          language,
          keyStatement,
          practiceName
        }
      }
    `
  }

  /**
   * Fetches all tabs listing components from global data
   * Includes complete tab data with images, testimonials, and CTA items
   * 
   * @returns GROQ query string for fetching tabs listing data
   */
  private fetchAllTabsListingData() {
    return groq`
      *[_type == "globalData" && dataType == "tabsListingComponent"] {
        // Basic document metadata
        _id,
        name,
        "slug": slug.current,
        dataType,
        _createdAt,
        _updatedAt,
        subheadline,
        subDescription,
        
        // Tabs listing component data
        tabsListingComponent {
          headline,
          subheadline,
          subDescription,
          showCTA,
          
          // Individual tabs with complete data
          tabs[] {
            _key,
            tabHeading,
            tabSubHeading,
            description,
            
            // Tab image with metadata
            "image": image.asset-> {
              ${this.IMAGE_METADATA_FIELDS}
            },
            
            // List items within the tab
            listItems[] {
              _key,
              subfeatureHeading,
              subfeatureSubheading,
              subfeatureDescription,
              
              // Subfeature image with metadata
              "subfeatureImage": subfeatureImage.asset-> {
                ${this.IMAGE_METADATA_FIELDS}
              }
            },
            
            // Tab icon and CTA items
            icon,
            ctaListItems[] {
              _key,
              ctaLink,
              ctaText,
              ctaType
            },
            
            // Tab links
            Link,
            LinkText,
            
            // Associated testimonial with complete data
            testimonial-> {
              _id,
              name,
              designation,
              place,
              region,
              locations,
              practiceName,
              thumbnail,
              
              // Testimonial logo
              "logo": logo.asset-> {
                ${this.IMAGE_METADATA_FIELDS}
              },
              "secondaryLogo": secondaryLogo.asset-> {
                ${this.IMAGE_METADATA_FIELDS}
              },
              
              // Primary and secondary videos
              video[] {
                ${this.VIDEO_FIELDS}
              },
              secondaryVideo[] {
                ${this.VIDEO_FIELDS}
              },
              
              // Testimonial image
              "testimonialImage": testimonialImage.asset-> {
                ${this.IMAGE_METADATA_FIELDS}
              },
              
              // Testimonial list items
              listItems[] {
                listHeading,
                before,
                after,
                description,
                isHighlighted
              },
              
              // Testimonial content
              testimonialheading,
              testimonialdescription,
              keyFeatures,
              language,
              mainStatement,
              subStatement,
              keyStatement,
              isHighlighted
            }
          }
        }
      }
    `
  }

  /**
   * Fetches vertical testimonial listing data
   * Includes section heading and array of testimonial references with complete data
   * 
   * @param _region - The language/region to fetch data for
   * @returns GROQ query string for fetching vertical testimonial listing
   */
  private fetchVerticalTestimonialListing(_region: string) {
    return groq`
      *[_type == "verticalTestimonialListing" && language == $region][0] {
        _id,
        heading,
        description,
        
        // Array of testimonial references with complete data
        'testimonial': testimonial[]-> {
          _id,
          name,
          designation,
          testimonialdescription,
          thumbnail,
          locations,
          practiceName,
          keyStatement,
          // Testimonial logo with metadata
          "logo": logo.asset-> {
            ${this.IMAGE_METADATA_FIELDS}
          },
          
          // Primary testimonial videos
          video[] {
            ${this.VIDEO_FIELDS}
          },
          
          // Additional testimonial thumbnail
          testimonialThumbnail,
          
          // Testimonial image with metadata
          "testimonialImage": testimonialImage.asset-> {
            ${this.IMAGE_METADATA_FIELDS}
          },
          
          // Secondary testimonial videos
          secondaryVideo[] {
            ${this.VIDEO_FIELDS}
          }
        }
      }
    `
  }

  /**
   * Fetches page data with dynamic component handling
   * Supports multiple component types: TabsListing, Custom, Hero, and GenericListing
   * 
   * @param _type - The document type to fetch
   * @param _slug - The page slug to fetch data for
   * @returns GROQ query string for fetching page data with component-specific data
   */
  private fetchPageData() {
    return groq`
      *[_type == $type && basicInfo.slug.current == $slug && language == $language][0] {
        // Basic page information
        "title": basicInfo.title,
        "description": basicInfo.description,
        "breadCrumb": basicInfo.breadCrumb,
        "faqData": faqReferenced[]->,
        
        // Page content sections
        content {
          sections[] {
            slug,
            component {
              componentType,
              ...,
              
              // Dynamic component data selection based on component type
              "componentData": select(
                // TabsListing Component
                componentType == "TabsListing" => tabsListingComponent {
                  _type,
                  "headline": headline,
                  "subHeading": Subheading,
                  "description": Subheading,
                  "cardImage": cardImage.asset-> {
                    ${this.IMAGE_METADATA_FIELDS}
                  },
                  subheadline,
                  subDescription,
                  "refData": globalData-> {
                    _id,
                    name,
                    dataType,
                    dataSlug,
                    ...,
                    // Explicitly fetch tabsListingComponent structure when dataType matches
                    "tabsListingComponent": select(
                      dataType == "tabsListingComponent" => tabsListingComponent {
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
                            ${this.IMAGE_METADATA_FIELDS}
                          },
                          listItems[] {
                            _key,
                            subfeatureHeading,
                            subfeatureSubheading,
                            subfeatureDescription,
                            svgCode,
                            "subfeatureImage": subfeatureImage.asset-> {
                              ${this.IMAGE_METADATA_FIELDS}
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
                              ${this.IMAGE_METADATA_FIELDS}
                            },
                            "secondaryLogo": secondaryLogo.asset-> {
                              ${this.IMAGE_METADATA_FIELDS}
                            },
                            video[] {
                              ${this.VIDEO_FIELDS}
                            },
                            secondaryVideo[] {
                              ${this.VIDEO_FIELDS}
                            },
                            "testimonialImage": testimonialImage.asset-> {
                              ${this.IMAGE_METADATA_FIELDS}
                            },
                            listItems[] {
                              listHeading,
                              before,
                              after,
                              description,
                              isHighlighted
                            },
                            testimonialheading,
                            testimonialdescription,
                            keyFeatures,
                            language,
                            mainStatement,
                            subStatement,
                            keyStatement,
                            isHighlighted
                          }
                        }
                      }
                    ),
                    // Explicitly fetch testimonialListing structure when dataType matches
                    "testimonialListing": select(
                      dataType == "testimonialListing" => testimonialListing {
                        title,
                        description,
                        hideTitle,
                        "testimonial": testimonialListReferences[]-> {
                          _id,
                          name,
                          designation,
                          "logo": logo.asset-> {
                            ${this.IMAGE_METADATA_FIELDS}
                          },
                          "secondaryLogo": secondaryLogo.asset-> {
                              ${this.IMAGE_METADATA_FIELDS}
                          },
                          video[] {
                            ${this.VIDEO_FIELDS}
                          },
                          secondaryVideo[] {
                            ${this.VIDEO_FIELDS}
                          },
                          thumbnail,
                          testimonialImage {
                            asset-> {
                              ${this.IMAGE_METADATA_FIELDS}
                            }
                          },
                          keyStatement,
                          testimonialdescription,
                          designation,
                          place,
                          practiceName,
                          mainStatement,
                          subStatement,
                          keyStatement,
                          isHighlighted
                        }
                      }
                    ),
                    // Explicitly fetch integrationListing structure when dataType matches
                    "integrationListing": select(
                      dataType == "integrationListing" => integrationListing {
                        title,
                        description,
                        showAllIntegrations,
                        "integrationList": select(
                          showAllIntegrations == true => 
                            *[_type == "integrationList" && language == $language] | order(order asc, title asc) {
                              _id,
                              title,
                              headline,
                              description,
                              shortDescription,
                              slug,
                              order,
                              language,
                              "image": image.asset-> {
                                ${this.IMAGE_METADATA_FIELDS}
                              },
                              link,
                              "integrationCategory": integrationCategory-> {
                                _id,
                                name,
                                subheading,
                                description,
                                "mainImage": mainImage.asset-> {
                                  ${this.IMAGE_METADATA_FIELDS}
                                },
                                "icon": icon.asset-> {
                                  ${this.IMAGE_METADATA_FIELDS}
                                },
                                iconSvgCode,
                                language
                              }
                            },
                          integrationListReferences[]-> {
                            _id,
                            title,
                            headline,
                            description,
                            shortDescription,
                            slug,
                            order,
                            language,
                            "image": image.asset-> {
                              ${this.IMAGE_METADATA_FIELDS}
                            },
                            link,
                            "integrationCategory": integrationCategory-> {
                              _id,
                              name,
                              subheading,
                              description,
                              "mainImage": mainImage.asset-> {
                                ${this.IMAGE_METADATA_FIELDS}
                              },
                              "icon": icon.asset-> {
                                ${this.IMAGE_METADATA_FIELDS}
                              },
                              iconSvgCode,
                              language
                            }
                          }
                        )
                      }
                    ),
                    // Explicitly fetch customContent structure when dataType matches
                    "customContent": select(
                      dataType == "customContent" => customContent {
                        title,
                        subtitle,
                        content,
                        buttonText,
                        buttonLink,
                        "image": image.asset-> {
                          ${this.IMAGE_METADATA_FIELDS}
                        },
                        backgroundColor
                      }
                    ),
                    // Explicitly fetch featureList structure when dataType matches
                    "featureList": select(
                      dataType == "featureList" => featureList {
                        title,
                        description,
                        selectAllFeatures,
                        "featureListReference": featureListReference-> {
                          _id,
                          name,
                          slug,
                          description,
                          "image": image.asset-> {
                            ${this.IMAGE_METADATA_FIELDS}
                          },
                          features[]-> {
                            _id,
                            name,
                            slug,
                            description,
                            "image": image.asset-> {
                              ${this.IMAGE_METADATA_FIELDS}
                            },
                            category,
                            language
                          },
                          language
                        }
                      }
                    ),
                    // Explicitly fetch genericListingComponent structure when dataType matches
                    "genericListingComponent": select(
                      dataType == "genericListingComponent" => genericListingComponent {
                        heading,
                        description,
                        useReference,
                        "blocksListingReference": blocksListingReference-> {
                          _type,
                          _id,
                          name,
                          language,
                          heading,
                          description,
                          logoSectionHeader,
                          logoSectionHeaderDescptn,
                          'image': logo[]->image.asset-> {
                            ${this.IMAGE_METADATA_FIELDS}
                          },
                          testimonial[]-> {
                            _id,
                            name,
                            designation,
                            thumbnail,
                            testimonialdescription,
                            "logo": logo.asset-> {
                              ${this.IMAGE_METADATA_FIELDS}
                            },
                            video[] {
                              ${this.VIDEO_FIELDS}
                            },
                            testimonialImage {
                              asset-> {
                                ${this.IMAGE_METADATA_FIELDS}
                              }
                            }
                          },
                          subHeading,
                          cardItems[] {
                            "heading": cardItemHeading,
                            "description": cardItemContent,
                            "iconSvg": cardItemSvg,
                            "image": cardItemImage.asset-> {
                              ${this.IMAGE_METADATA_FIELDS}
                            }
                          },
                          items[] {
                            _key,
                            heading,
                            subheading,
                            description,
                            "image": image.asset-> {
                              ${this.IMAGE_METADATA_FIELDS}
                            },
                            link
                          }
                        },
                        items[] {
                          _key,
                          heading,
                          subheading,
                          description,
                          "image": image.asset-> {
                            ${this.IMAGE_METADATA_FIELDS}
                          },
                          "icon": icon.asset-> {
                            ${this.IMAGE_METADATA_FIELDS}
                          },
                          dynamicSvg,
                          link {
                            url,
                            text,
                            buttonType
                          }
                        },
                        ctaListItems[] {
                          _key,
                          ctaLink,
                          ctaText,
                          ctaType
                        },
                        "testimonial": testimonial-> {
                          _id,
                          name,
                          designation,
                          practiceName,
                          keyStatement,
                          "logo": logo.asset-> {
                            ${this.IMAGE_METADATA_FIELDS}
                          },
                          "testimonialImage": testimonialImage.asset-> {
                            ${this.IMAGE_METADATA_FIELDS}
                          },
                          language
                        }
                      }
                    )
                  },
                  heading,
                  tabs[] {
                    _key,
                    tabHeading,
                    description,
                    tabSubHeading,
                    // Tab image with metadata
                    "image": image.asset-> {
                      ${this.IMAGE_METADATA_FIELDS}
                    },
                    
                    // Tab list items
                    listItems[] {
                      _key,
                      subfeatureHeading
                    },
                    
                    // CTA items for the tab
                    ctaListItems[] {
                     ${this.CTA_FIELDS}
                    },
                    
                    // Tab links
                    Link,
                    LinkText,
                    
                    // Associated testimonial
                    testimonial-> {
                      _id,
                      name,
                      designation,
                      
                      // Testimonial logo
                      "logo": logo.asset-> {
                        ${this.IMAGE_METADATA_FIELDS}
                      },
                      "secondaryLogo": secondaryLogo.asset-> {
                        ${this.IMAGE_METADATA_FIELDS}
                      },
                      // Testimonial image
                      "testimonialImage": testimonialImage.asset-> {
                        ${this.IMAGE_METADATA_FIELDS}
                      },
                      
                      // Testimonial list items
                      listItems[] {
                        listHeading,
                        before,
                        after,
                        description,
                        isHighlighted
                      },
                      
                      // Testimonial content
                      testimonialheading,
                      testimonialdescription,
                      keyStatement,
                      keyFeatures,
                      language,
                      practiceName,
                      mainStatement,
                      subStatement,
                      keyStatement,
                      isHighlighted
                    }
                  }
                },
                
                // Custom Component
                componentType == "Custom" => customComponent {
                  _type,
                  "heading": title,
                  "subHeading": subtitle,
                  "description": content,
                  "testimonial": testimonial[]-> {
                      _id,
                      name,
                      designation,
                      practiceName,
                      keyStatement,
                      // Testimonial logo
                      "logo": logo.asset-> {
                        ${this.IMAGE_METADATA_FIELDS}
                      },
                      
                      // Testimonial image
                      "testimonialImage": testimonialImage.asset-> {
                        ${this.IMAGE_METADATA_FIELDS}
                      },
                      video[] {
                        ${this.VIDEO_FIELDS}
                      },
                      secondaryVideo[] {
                        ${this.VIDEO_FIELDS}
                      },
                      thumbnail,
                      mainStatement,
                      subStatement,
                      
                      // Testimonial list items
                      listItems[] {
                        listHeading,
                        before,
                        after,
                        description,
                        isHighlighted
                      },
                      
                      // Testimonial content
                      testimonialheading,
                      testimonialdescription,
                      keyStatement,
                      keyFeatures,
                      language
                    },
                  
                  "refData": referenceGlobalSchema->{
                   
                    
                    // Integration Listing specific data
                    dataType == "integrationListing" => {
                     
                      integrationListing {
                        title,
                        description,
                        showAllIntegrations,
                        
                        // Integration List References with full data
                        // Use conditional logic: if showAllIntegrations is true, fetch all integrations for the language
                        // Otherwise, use the manually selected integrationListReferences
                        "integrationList": select(
                          showAllIntegrations == true => 
                            *[_type == "integrationList" && language == $language] | order(order asc, title asc) {
                              _id,
                              title,
                              headline,
                              description,
                              shortDescription,
                              slug,
                              order,
                              language,
                              
                              // Integration image
                              "image": image.asset-> {
                                ${this.IMAGE_METADATA_FIELDS}
                              },
                              
                              // Integration link
                              link,
                              
                              // Integration category with full data
                              "integrationCategory": integrationCategory-> {
                                _id,
                                name,
                                subheading,
                                description,
                                
                                // Category image
                                "mainImage": mainImage.asset-> {
                                  ${this.IMAGE_METADATA_FIELDS}
                                },
                                
                                // Category icon
                                "icon": icon.asset-> {
                                  ${this.IMAGE_METADATA_FIELDS}
                                },
                                
                                iconSvgCode,
                                language
                              }
                            },
                          // Default case: use manually selected integrationListReferences
                          integrationListReferences[]->{
                            _id,
                            title,
                            headline,
                            description,
                            shortDescription,
                            slug,
                            order,
                            language,
                            
                            // Integration image
                            "image": image.asset-> {
                              ${this.IMAGE_METADATA_FIELDS}
                            },
                            
                            // Integration link
                            link,
                            
                            // Integration category with full data
                            "integrationCategory": integrationCategory-> {
                              _id,
                              name,
                              subheading,
                              description,
                              
                              // Category image
                              "mainImage": mainImage.asset-> {
                                ${this.IMAGE_METADATA_FIELDS}
                              },
                              
                              // Category icon
                              "icon": icon.asset-> {
                                ${this.IMAGE_METADATA_FIELDS}
                              },
                              
                              iconSvgCode,
                              language
                            }
                          }
                        )
                      }
                    },
                    dataType == "testimonialListing" => {
                      testimonialListing {
                        title,
                        description,
                        "testimonial": testimonialListReferences[]->{
                          _id,
                          name,
                          designation,
                          // Logo images
                          "logo": logo.asset-> {
                            ${this.IMAGE_METADATA_FIELDS}
                          },
                          "secondaryLogo": secondaryLogo.asset-> {
                            ${this.IMAGE_METADATA_FIELDS}
                          },
                          
                          // Testimonial image
                          "testimonialImage": testimonialImage.asset-> {
                            ${this.IMAGE_METADATA_FIELDS}
                          },
                          
                          // Video data
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
                          
                          // Thumbnail video
                          thumbnail,
                          // Testimonial content
                          testimonialdescription,
                          keyStatement,
                          keyFeatures,
                          practiceName,
                        
                        }
                      }
                    }
                  }
                },
                
                // Hero Component
                componentType == "Hero" => heroComponent {
                  _type,
                  ...,
                  "heroImage" : heroImage.asset-> {
                    ${this.IMAGE_METADATA_FIELDS}
                  },
                  "heroImageSecondary" : heroImageSecondary.asset-> {
                    ${this.IMAGE_METADATA_FIELDS}
                  },
                  // Featured testimonial
                  "testimonial": testimonialVideo-> {
                    _id,
                    name,
                    designation,
                    thumbnail,
                    
                    // Testimonial logo
                    "logo": logo.asset-> {
                      ${this.IMAGE_METADATA_FIELDS}
                    },
                    
                    // Testimonial videos
                    video[] {
                      ${this.VIDEO_FIELDS}
                    },
                    
                    // Testimonial image
                    "testimonialImage": testimonialImage.asset-> {
                      ${this.IMAGE_METADATA_FIELDS}
                    },
                    
                    testimonialdescription,
                    language
                  }
                },
                
                // GenericListing Component
                componentType == "GenericListing" => genericListingComponent {
                  _type,
                  heading,
                  description,
                  useReference,
                  ctaListItems[] {
                    ${this.CTA_FIELDS}
                  },
                  
                  // Listing items (when not using reference)
                  items[] {
                    _key,
                    heading,
                    subheading,
                    description,
                    
                    // Item link
                    link {
                      url,
                      text,
                      buttonType
                    },
                    
                    dynamicSvg,
                    
                    // Item image with metadata
                    "image": image.asset-> {
                      ${this.IMAGE_METADATA_FIELDS}
                    },
                    "icon": icon.asset-> {
                      ${this.IMAGE_METADATA_FIELDS}
                    },
                    ctaListItems[] {
                      ${this.CTA_FIELDS}
                    }
                  },
                  testimonial-> {
                      _id,
                      name,
                      designation,
                      thumbnail,
                      testimonialdescription,
                  
                    "secondaryLogo": secondaryLogo.asset-> {
                          ${this.IMAGE_METADATA_FIELDS}
                      },
                      video[] {
                        ${this.VIDEO_FIELDS}
                      },
                    secondaryVideo[] {
                      ${this.VIDEO_FIELDS}
                    },
                    "testimonialImage": testimonialImage.asset-> {
                          ${this.IMAGE_METADATA_FIELDS}
                    },
                    listItems[] {
                      listHeading,
                      before,
                      after,
                      description,
                      isHighlighted
                    },
                  },
                  // Blocks & Lists Reference (all types)
                  "blocksListingData": blocksListingReference-> {
                    _type,
                    _id,
                    
                    // Common fields across most schemas
                    heading,
                    description,
                    
                    // logoListing specific
                    logoSectionHeader,
                    logoSectionHeaderDescptn,
                    'image':logo[]->image.asset->{url,_id,altText,   metadata {
                      dimensions {
                        width,
                        height,
                        aspectRatio
                      }
                    }},
                    
                    
                    // verticalTestimonialListing specific
                    testimonial[]-> {
                      _id,
                      name,
                      designation,
                      thumbnail,
                      testimonialdescription,
                      logo {
                        asset-> {
                          ${this.IMAGE_METADATA_FIELDS}
                        }
                      },
                      video[] {
                        ${this.VIDEO_FIELDS}
                      },
                      testimonialImage {
                        asset-> {
                          ${this.IMAGE_METADATA_FIELDS}
                        }
                      }
                    },
                    
                    // csCardsListing specific
                    subHeading,
                    cardItems[] {
                      "heading": cardItemHeading,
                      "description": cardItemContent,
                      "iconSvg": cardItemSvg,
                      "image": cardItemImage.asset-> {
                        ${this.IMAGE_METADATA_FIELDS}
                      }
                    },
                    
                    // whoWeServeListing specific
                    items[] {
                      _key,
                      heading,
                      subheading,
                      description,
                      
                      // Item link
                      link {
                        url,
                        text,
                        buttonType
                      },
                      
                      dynamicSvg,
                      
                      // Item image with metadata
                      "image": image.asset-> {
                        ${this.IMAGE_METADATA_FIELDS}
                      },
                      "icon": icon.asset-> {
                        ${this.IMAGE_METADATA_FIELDS}
                      },
                      ctaListItems[] {
                        ${this.CTA_FIELDS}
                      }
                    },
                    
                    // CTA list items from reference
                    ctaListItems[] {
                      ${this.CTA_FIELDS}
                    }
                  }
                },
                
               
              )
            }
          }
        }
      }
    `
  }

  /**
   * Fetches home card list data from home settings
   * Includes global data references for home page cards
   * 
   * @param _region - The language/region to fetch data for
   * @returns GROQ query string for fetching home card data
   */
  private fetchHomeCardList(_region: string) {
    return groq`
      *[_type == "homeSettings" && language == $region][0] {
        // Global data references for home cards (array)
        'globalDataReference': globalDataReference[]-> {
          _id,
          name,
          dataType,
          dataSlug,
          // Include all data types
          ...,
          // Explicitly fetch tabsListingComponent structure when dataType matches
          "tabsListingComponent": select(
            dataType == "tabsListingComponent" => tabsListingComponent {
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
                  ${this.IMAGE_METADATA_FIELDS}
                },
                listItems[] {
                  _key,
                  subfeatureHeading,
                  subfeatureSubheading,
                  subfeatureDescription,
                  "subfeatureImage": subfeatureImage.asset-> {
                    ${this.IMAGE_METADATA_FIELDS}
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
                    ${this.IMAGE_METADATA_FIELDS}
                  },
                  "secondaryLogo": secondaryLogo.asset-> {
                    ${this.IMAGE_METADATA_FIELDS}
                  },
                  video[] {
                    ${this.VIDEO_FIELDS}
                  },
                  secondaryVideo[] {
                    ${this.VIDEO_FIELDS}
                  },
                  "testimonialImage": testimonialImage.asset-> {
                    ${this.IMAGE_METADATA_FIELDS}
                  },
                  listItems[] {
                    listHeading,
                    before,
                    after,
                    description,
                    isHighlighted
                  },
                  testimonialheading,
                  testimonialdescription,
                  keyFeatures,
                  language,
                  mainStatement,
                  subStatement,
                  keyStatement,
                  isHighlighted
                }
              }
            }
          ),
          // Explicitly fetch testimonialListing structure when dataType matches
          "testimonialListing": select(
            dataType == "testimonialListing" => testimonialListing {
              title,
              description,
              hideTitle,
              "testimonial": testimonialListReferences[]-> {
                _id,
                name,
                designation,
                "logo": logo.asset-> {
                  ${this.IMAGE_METADATA_FIELDS}
                },
                "secondaryLogo": secondaryLogo.asset-> {
                    ${this.IMAGE_METADATA_FIELDS}
                },
                video[] {
                  ${this.VIDEO_FIELDS}
                },
                secondaryVideo[] {
                  ${this.VIDEO_FIELDS}
                },
                thumbnail,
                testimonialImage {
                  asset-> {
                    ${this.IMAGE_METADATA_FIELDS}
                  }
                },
                keyStatement,
                testimonialdescription,
                designation,
                place,
                practiceName
              }
            }
          ),
          // Explicitly fetch integrationListing structure when dataType matches
          "integrationListing": select(
            dataType == "integrationListing" => integrationListing {
              title,
              description,
              showAllIntegrations,
              "integrationList": select(
                showAllIntegrations == true => 
                  *[_type == "integrationList" && language == $region] | order(order asc, title asc) {
                    _id,
                    title,
                    headline,
                    description,
                    shortDescription,
                    slug,
                    order,
                    language,
                    "image": image.asset-> {
                      ${this.IMAGE_METADATA_FIELDS}
                    },
                    link,
                    "integrationCategory": integrationCategory-> {
                      _id,
                      name,
                      subheading,
                      description,
                      "mainImage": mainImage.asset-> {
                        ${this.IMAGE_METADATA_FIELDS}
                      },
                      "icon": icon.asset-> {
                        ${this.IMAGE_METADATA_FIELDS}
                      },
                      iconSvgCode,
                      language
                    }
                  },
                integrationListReferences[]-> {
                  _id,
                  title,
                  headline,
                  description,
                  shortDescription,
                  slug,
                  order,
                  language,
                  "image": image.asset-> {
                    ${this.IMAGE_METADATA_FIELDS}
                  },
                  link,
                  "integrationCategory": integrationCategory-> {
                    _id,
                    name,
                    subheading,
                    description,
                    "mainImage": mainImage.asset-> {
                      ${this.IMAGE_METADATA_FIELDS}
                    },
                    "icon": icon.asset-> {
                      ${this.IMAGE_METADATA_FIELDS}
                    },
                    iconSvgCode,
                    language
                  }
                }
              )
            }
          ),
          // Explicitly fetch customContent structure when dataType matches
          "customContent": select(
            dataType == "customContent" => customContent {
              title,
              subtitle,
              content,
              buttonText,
              buttonLink,
              "image": image.asset-> {
                ${this.IMAGE_METADATA_FIELDS}
              },
              backgroundColor
            }
          ),
          // Explicitly fetch featureList structure when dataType matches
          "featureList": select(
            dataType == "featureList" => featureList {
              title,
              description,
              selectAllFeatures,
              "featureListReference": featureListReference-> {
                _id,
                name,
                slug,
                description,
                "image": image.asset-> {
                  ${this.IMAGE_METADATA_FIELDS}
                },
                features[]-> {
                  _id,
                  name,
                  slug,
                  description,
                  "image": image.asset-> {
                    ${this.IMAGE_METADATA_FIELDS}
                  },
                  category,
                  language
                },
                language
              }
            }
          ),
          // Explicitly fetch genericListingComponent structure when dataType matches
          "genericListingComponent": select(
            dataType == "genericListingComponent" => genericListingComponent {
              heading,
              description,
              useReference,
              "blocksListingReference": blocksListingReference-> {
                _type,
                _id,
                name,
                language,
                // Common fields across most schemas
                heading,
                description,
                // logoListing specific
                logoSectionHeader,
                logoSectionHeaderDescptn,
                'image': logo[]->image.asset-> {
                  ${this.IMAGE_METADATA_FIELDS}
                },
                // verticalTestimonialListing specific
                testimonial[]-> {
                  _id,
                  name,
                  designation,
                  thumbnail,
                  testimonialdescription,
                  "logo": logo.asset-> {
                    ${this.IMAGE_METADATA_FIELDS}
                  },
                  video[] {
                    ${this.VIDEO_FIELDS}
                  },
                  testimonialImage {
                    asset-> {
                      ${this.IMAGE_METADATA_FIELDS}
                    }
                  }
                },
                // csCardsListing specific
                subHeading,
                cardItems[] {
                  "heading": cardItemHeading,
                  "description": cardItemContent,
                  "iconSvg": cardItemSvg,
                  "image": cardItemImage.asset-> {
                    ${this.IMAGE_METADATA_FIELDS}
                  }
                },
                // whoWeServeListing specific
                items[] {
                  _key,
                  heading,
                  subheading,
                  description,
                  "image": image.asset-> {
                    ${this.IMAGE_METADATA_FIELDS}
                  },
                  link
                }
              },
              items[] {
                _key,
                heading,
                subheading,
                description,
                "image": image.asset-> {
                  ${this.IMAGE_METADATA_FIELDS}
                },
                "icon": icon.asset-> {
                  ${this.IMAGE_METADATA_FIELDS}
                },
                dynamicSvg,
                link {
                  url,
                  text,
                  buttonType
                }
              },
              ctaListItems[] {
                _key,
                ctaLink,
                ctaText,
                ctaType
              },
              "testimonial": testimonial-> {
                _id,
                name,
                designation,
                practiceName,
                keyStatement,
                "logo": logo.asset-> {
                  ${this.IMAGE_METADATA_FIELDS}
                },
                "testimonialImage": testimonialImage.asset-> {
                  ${this.IMAGE_METADATA_FIELDS}
                },
                language
              }
            }
          )
        }
      }
    `
  }

  /**
   * Fetches FAQ referenced data for a specific page
   * Includes FAQ categories and visibility settings
   * 
   * @returns GROQ query string for fetching FAQ referenced data
   */
  private fetchFaqReferencedData() {
    return groq`
      *[_type == $page && language == $region][0] {
        // FAQ referenced data - handle both single reference and array
        faqReferenced,
        "faqData": faqReferenced-> {
          faqCategories,
          hideCategory
        }
      }
    `
  }

  // ==================== PUBLIC DATA FETCHING METHODS ====================

  /**
   * Fetches common page data for the current slug and region
   * Includes FAQ data and content sections with dynamic component handling
   * 
   * @returns Promise resolving to page data object
   */
  public async getData() {
    const query = this.fetchCommonData(this.slug)
    const params = { slug: this.slug, region: this.region }
    return await this.client.fetch(query, params)
  }

  /**
   * Fetches hero section data for the specified region
   * Includes hero content, images, videos, and testimonial data
   * 
   * @param region - The language/region to fetch hero data for
   * @returns Promise resolving to hero data object
   */
  public async getHeroData(region: string) {
    const query = this.fetchHeroData(region)
    const params = { region }
    return await this.client.fetch(query, params)
  }

  /**
   * Fetches all tabs listing components from global data
   * Includes complete tab data with images, testimonials, and CTA items
   * 
   * @param _region - The language/region (currently unused but kept for consistency)
   * @returns Promise resolving to array of tabs listing data
   * @throws Error if data fetching fails
   */
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

  /**
   * Fetches vertical testimonial listing data for the specified region
   * Includes section heading and array of testimonial references with complete data
   * 
   * @param region - The language/region to fetch testimonial data for
   * @returns Promise resolving to vertical testimonial listing data
   * @throws Error if data fetching fails
   */
  public async getVerticalTestimonialListing(region: string) {
    try {
      const query = this.fetchVerticalTestimonialListing(region)
      return await this.client.fetch(query, { region })
    } catch (error) {
      console.error('Error fetching vertical testimonial listing data', error)
      throw error
    }
  }

  /**
   * Fetches page data with dynamic component handling
   * Supports multiple component types and transforms sections into a keyed object
   * 
   * @param type - The document type to fetch
   * @param slug - The page slug to fetch data for
   * @returns Promise resolving to transformed page sections object
   */
  public async getPageData(type: string, slug: string) {
    const query = this.fetchPageData()
    const params = { type, slug, language: this.region }
    const result = await this.client.fetch(query, params)

    // Transform sections array into keyed object for easier access
    const transformedSections = result?.content?.sections?.reduce(
      (acc: any, section: any) => {
        if (section.slug?.current) {
          acc[section.slug.current] = section.component
        }
        return acc || {}
      },
      {},
    )

    // Include FAQ data and other page-level data
    return {
      ...transformedSections,
      faqData: result?.faqData || null,
      faqReferenced: result?.faqReferenced || null,
      title: result?.title || null,
      description: result?.description || null,
      breadCrumb: result?.breadCrumb || null,
    }
  }

  /**
   * Fetches home card data for the specified region
   * Includes global data references for home page cards
   * 
   * @param region - The language/region to fetch home card data for
   * @returns Promise resolving to home card data object
   */
  public async fetchHomeCardData(region: string) {
    const query = this.fetchHomeCardList(region)
    return await this.client.fetch(query, { region: region })
  }

  /**
   * Fetches FAQ referenced data for a specific page and region
   * Includes FAQ categories and visibility settings
   * 
   * @param page - The page type to fetch FAQ data for
   * @param region - The language/region to fetch FAQ data for
   * @returns Promise resolving to FAQ referenced data object
   */
  public async fetchFaqData(page: string, region: string) {
    const query = this.fetchFaqReferencedData()
    return await this.client.fetch(query, { region: region, page: page })
  }

  // Integrations Grid Query - Basic
  private fetchIntegrationsQuery() {
    return `
      *[_type == "integrationList" && (language == $language || language == null)] | order(order asc) {
        _id,
        title,
        headline,
        image {
          asset-> {
            _id,
            url,
            altText
          }
        },
        link,
        shortDescription,
        order,
        language
      }
    `
  }

  // Complete Integrations Query with Categories
  private fetchCompleteIntegrationsQuery() {
    return `
      *[_type == "integrationList" && language == $language] | order(order asc, title asc) {
        _id,
        title,
        headline,
        description,
        shortDescription,
        image {
          asset-> {
            _id,
            url,
            altText
          }
        },
        link,
        order,
        language,
        integrationCategory-> {
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
          iconSvgCode
        }
      }
    `
  }

  public async fetchIntegrationsData(language: string = 'en') {
    const query = this.fetchIntegrationsQuery()
    return await this.client.fetch(query, { language })
  }

  public async fetchCompleteIntegrationsData(language: string = 'en') {
    const query = this.fetchCompleteIntegrationsQuery()
    return await this.client.fetch(query, { language })
  }

  /**
   * Fetches integration data for FeaturesSectionWithNavigation component
   * Returns both categories and integrations in a single optimized query
   * 
   * @param language - The language to fetch data for
   * @returns Promise resolving to integration data object with categories and integrations
   */
  public async fetchIntegrationData(language: string = 'en') {
    const query = groq`
      {
        "categories": *[_type == "integrationCategory" && language == $language] | order(name asc) {
          _id,
          name,
          subheading,
          description,
          mainImage {
            asset-> {
              _id,
              url,
              altText
            }
          },
          icon {
            asset-> {
              _id,
              url,
              altText
            }
          },
          iconSvgCode,
          language
        },
        "integrations": *[_type == "integrationList" && language == $language] | order(order asc, title asc) {
          _id,
          title,
          headline,
          description,
          shortDescription,
          image {
            asset-> {
              _id,
              url,
              altText
            }
          },
          link,
          order,
          language,
          integrationCategory-> {
            _id,
            name,
            subheading,
            description,
            mainImage {
              asset-> {
                _id,
                url,
                altText
              }
            },
            icon {
              asset-> {
                _id,
                url,
                altText
              }
            },
            iconSvgCode
          }
        }
      }
    `
    return await this.client.fetch(query, { language })
  }
}

export default Queries
