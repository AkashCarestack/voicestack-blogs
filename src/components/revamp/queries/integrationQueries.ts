import groq from 'groq'

/**
 * Integration-specific queries for FeaturesSectionWithNavigation component
 * Handles fetching integration categories and integration lists with proper data structure
 */

export const integrationQueries = {
  /**
   * Fetches integration categories with complete metadata
   * Includes icons, images, and language-specific data
   */
  getIntegrationCategories: groq`
    *[_type == "integrationCategory" && language == $language] | order(name asc) {
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
    }
  `,

  /**
   * Fetches integration list with category references
   * Includes complete integration data with category information
   */
  getIntegrationList: groq`
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
  `,

  /**
   * Fetches both categories and integrations in a single query
   * Optimized for FeaturesSectionWithNavigation component
   */
  getIntegrationData: groq`
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
}
