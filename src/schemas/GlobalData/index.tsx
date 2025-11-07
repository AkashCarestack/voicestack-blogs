import { defineField } from "sanity";
import { genericListingComponentFields } from "../DynamicComponent/Components/GenericListingComponent";
import showCountryFlag from "~/components/utils/common";

const GlobalData = {
  name: 'globalData',
  title: 'Global Data',
  type: 'document',
  fields: [
    {
      name: 'dataType',
      title: 'Data Type',
      type: 'string',
      options: {
        list: [
          { title: 'Comparison Table', value: 'comparisonTable' },
          { title: 'Tabs Listing', value: 'tabsListingComponent' },
          { title: 'Custom Content', value: 'customContent' },
          { title: 'Feature List', value: 'featureList' },
          { title: 'Generic Listing', value: 'genericListingComponent' },
          { title: 'Integration Listing', value: 'integrationListing' },
          { title: 'Testimonial Listing', value: 'testimonialListing' },
        ],
      },
      // validation: (Rule: any) => Rule.required(),
    },
   
     {
      name: 'name',
      title: 'Data Name',
      type: 'string',
      // validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'dataSlug',
      title: 'Data Slug',
      type: 'string',
      // validation: (Rule: any) => Rule.required(),
    },
    // Comparison Table Fields - Using the same structure as comparisonTable schema
    
    // Tabs Listing Component Fields
    {
      name: 'tabsListingComponent',
      title: 'Tabs Listing Component Data',
      type: 'object',
      hidden: ({ parent }: any) => !parent || parent.dataType !== 'tabsListingComponent',
      fields: [
        {
          name: 'headline',
          title: 'Headline',
          type: 'string',
        },
        {
          name: 'subheadline',
          title: 'SubHeadline',
          type: 'string',
        },
        {
          name: 'showCTA',
          title: 'Show CTA',
          type: 'boolean',
        },
        {
          name: 'subDescription',
          title: 'Description',
          type: 'string',
        },
        {
          name: 'tabs',
          title: 'Tabs',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'tabHeading',
                  title: 'Heading',
                  type: 'string',
                },
                {
                  name: 'tabSubHeading',
                  title: 'SubHeading',
                  type: 'string',
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'blockContent',
                },
                {
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                },
                {
                  name:'listItems',
                  title: 'Feature List Items',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        {
                          name: 'subfeatureHeading',
                          title: 'Heading',
                          type: 'string',
                        },
                        {
                          name: 'subfeatureSubheading',
                          title: 'Subheading ',
                          type: 'string',
                        },
                        {
                          name: 'subfeatureDescription',
                          title: 'Description',
                          type: 'string',
                        },
                        {
                          name: 'subfeatureImage',
                          title: 'Image',
                          type: 'image',
                        },
                        {
                          name: 'svgCode',
                          title: 'SVG Code',
                          type: 'text',
                        }
                      ],
                    
                    },
                  ],
                },
                {
                  name: 'icon',
                  title: 'Icon (SVG)',
                  type: 'text',
                },
                {
                  name: 'ctaListItems',
                  title: 'Call to Action List',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        {
                          name: 'ctaText',
                          title: 'CTA Text',
                          type: 'string',
                        },
                        {
                          name: 'ctaLink',
                          title: 'CTA Link',
                          type: 'string',
                        },
                        {
                          name: 'ctaType',
                          title: 'Button type',
                          type: 'string',
                          options: {
                            list: [
                              { title: 'Primary', value: 'primary' },
                              { title: 'Secondary', value: 'secondary' },
                              { title: 'Outline', value: 'outline' },
                              { title: 'Ghost', value: 'ghost' },
                            ],
                          },
                        },
                      ],
                    },
                  ],
               
                },
                {
                  name: 'Link',
                  title: 'Link (href)',
                  type: 'string',
                },
                {
                  name: 'LinkText',
                  title: 'Link Text',
                  type: 'string',
                },
                {
                  name: 'testimonial',
                  title: 'Testimonial Reference',
                  type: 'reference',
                  to: [{ type: 'testimonialSection' }],
                  options: {
                    filter: 'defined(_id)',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    // Custom Content Fields (fallback)
    {
      name: 'customContent',
      title: 'Custom Content Data',
      type: 'object',
      hidden: ({ parent }: any) => !parent || parent.dataType !== 'customContent',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
        },
        {
          name: 'content',
          title: 'Content',
          type: 'text',
          rows: 4,
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
        },
        {
          name: 'buttonLink',
          title: 'Button Link',
          type: 'url',
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'backgroundColor',
          title: 'Background Color',
          type: 'string',
          options: {
            list: [
              { title: 'White', value: 'white' },
              { title: 'Gray', value: 'gray' },
              { title: 'Blue', value: 'blue' },
              { title: 'Green', value: 'green' },
            ],
          },
          initialValue: 'white',
        },
      ],
    },
    // Feature List Fields
    {
      name: 'featureList',
      title: 'Feature List Data',
      type: 'object',
      hidden: ({ parent }: any) => !parent || parent.dataType !== 'featureList',
      fields: [
        {
          name: 'title',
          title: 'Feature List Title',
          type: 'string',
          // validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'description',
          title: 'Feature List Description',
          type: 'text',
          rows: 3,
        },
        {
          name: 'selectAllFeatures',
          title: 'Select All Features',
          type: 'boolean',
          description: 'Check this to automatically include ALL features from the Features section',
          initialValue: true,
        },
        {
          name: 'featureListReference',
          title: 'Feature List Reference (Optional)',
          type: 'reference',
          to: [{ type: 'features' }],
          options: {
            filter: 'defined(slug.current)',
          },
          description: 'Select a specific feature list to display (only if you want to show specific features instead of all)',
          hidden: ({ parent }: any) => parent?.selectAllFeatures === true,
        },
      ],
    },
    // Generic Listing Component Fields
    {
      name: 'genericListingComponent',
      title: 'Generic Listing Component Data',
      type: 'object',
      hidden: ({ parent }: any) => !parent || parent.dataType !== 'genericListingComponent',
      fields: genericListingComponentFields,
    },
    // Integration Listing Fields
    {
      name: 'integrationListing',
      title: 'Integration Listing Data',
      type: 'object',
      hidden: ({ parent }: any) => !parent || parent.dataType !== 'integrationListing',
      fields: [
        {
          name: 'title',
          title: 'Integration Listing Title',
          type: 'string',
          description: 'Title for the integration listing section',
        },
        {
          name: 'description',
          title: 'Integration Listing Description',
          type: 'text',
          rows: 3,
          description: 'Description for the integration listing section',
        },
        {
          name: 'integrationListReferences',
          title: 'Integration List References',
          type: 'array',
          of: [
            {
              type: 'reference',
              to: [{ type: 'integrationList' }],
              options: {
                filter: ({ document }: any) => {
                  const language = document?.language || 'en'
                  return {
                    filter: 'language == $language',
                    params: { language }
                  }
                }
              }
            }
          ],
          options: {
            // Show all available integration lists
            filter: ({ parent }: any) => {
              // If showAllIntegrations is true, show all integration lists
              if (parent?.showAllIntegrations) {
                return undefined // No filter, show all
              }
              // Otherwise, show all available integration lists
              return undefined
            }
          },
          description: 'Select one or more integration lists to display',
          hidden: ({ parent }: any) => parent?.showAllIntegrations === true,
          // validation: (Rule: any) => Rule.custom((value, context) => {
          //   const parent = context.parent
          //   if (parent?.showAllIntegrations === false && (!value || value.length === 0)) {
          //     return 'At least one integration list must be selected when not showing all integrations'
          //   }
          //   return true
          // }),
        },
        {
          name: 'showAllIntegrations',
          title: 'Show All Integrations',
          type: 'boolean',
          description: 'Check this to automatically include ALL integrations from the Integration List. When enabled, all available integration lists will be automatically selected.',
          initialValue: false,
          options: {
            layout: 'checkbox'
          },
        },
      ],
    },
    // Testimonial Listing Fields
    {
      name: 'testimonialListing',
      title: 'Testimonial Listing Data',
      type: 'object',
      hidden: ({ parent }: any) => !parent || parent.dataType !== 'testimonialListing',
      fields: [
        {
          name: 'hideTitle',
          title: 'Hide Section Title',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'title',
          title: 'Testimonial Listing Title',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Testimonial Listing Description',
          type: 'text',
          rows: 3,
        },
        {
          name: 'testimonialListReferences',
          title: 'Testimonial List References',
          type: 'array',
          of: [
            {
              type: 'reference',
              to: [{ type: 'testimonialSection' }],
              options: {
                filter: ({ document }: any) => {
                  const language = document?.language || 'en'
                  return {
                    filter: 'language == $language',
                    params: { language }
                  }
                }
              },
            },
          ],
        },
      ],
    },
    // Language field (hidden and read-only)
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      dataType: 'dataType',
      subtitle: 'comparisonTable.title',
      language: 'language',
    },
    prepare(selection: any) {
      const { title, dataType, subtitle, pullAllIntegrations, language } = selection
      const languageLabel = language === 'en' ? '🇺🇸' : 
                           language === 'en-GB' ? '🇬🇧' : 
                           language === 'en-AU' ? '🇦🇺' : 
                           '🌐';
      
      let displaySubtitle = subtitle || 'Global data';
   
      
      return {
        title: `${languageLabel} ${title || 'Global Data'}`,
        subtitle: `${dataType || 'Unknown'} - ${displaySubtitle}`,
        media:<img src={showCountryFlag(selection?.language)}/>
      };
    },
  }
}

export default GlobalData
