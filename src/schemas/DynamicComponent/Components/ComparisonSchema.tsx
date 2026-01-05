import { defineArrayMember, defineField, defineType } from 'sanity'

// Listing Schema - individual item in the comparison array
export const ListingSchema = defineType({
  name: 'comparisonListingSchema',
  title: 'Listing Schema',
  type: 'object',
  fields: [
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'deviceType',
      title: 'Device Type',
      type: 'string',
      options: {
        list: [
          { title: 'Desk Phone', value: 'deskPhone' },
          { title: 'Cordless Phone', value: 'cordlessPhone' },
        ],
        layout: 'radio', // Radio button layout
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'yealinkList',
      title: 'Yealink List',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'polycomList',
      title: 'Polycom List',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
    }),
  ],
  preview: {
    select: {
      deviceType: 'deviceType',
      yealinkCount: 'yealinkList',
      polycomCount: 'polycomList',
    },
    prepare({ deviceType, yealinkCount, polycomCount }) {
      const deviceTypeLabel = deviceType === 'deskPhone' ? 'Desk Phone' : deviceType === 'cordlessPhone' ? 'Cordless Phone' : 'Unknown'
      const yealinkCountText = yealinkCount ? `${yealinkCount.length} Yealink` : '0 Yealink'
      const polycomCountText = polycomCount ? `${polycomCount.length} Polycom` : '0 Polycom'
      
      return {
        title: deviceTypeLabel,
        subtitle: `${yealinkCountText}, ${polycomCountText}`,
      }
    },
  },
})

// Main Comparison Schema - object with array field of listing schemas
const ComparisonSchema = defineType({
  name: 'comparisonSchema',
  title: 'Comparison Schema',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'comparisonTable',
      title: 'Comparison Table Reference',
      type: 'reference',
      to: [{ type: 'comparisonTable' }],
      description: 'Reference to a comparison table from Comparisons & Analysis (only shows tables matching the current document language)',
      options: {
        filter: ({ document }: any) => {
          // Get the current document's language
          const currentLanguage = document?.language || 'en'
          
          return {
            filter: 'language == $language',
            params: { language: currentLanguage }
          }
        }
      },
    }),
    defineField({
      name: 'items',
      title: 'Comparison Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'comparisonListingSchema',
        }),
      ],
      validation: (Rule) => Rule.min(1).error('At least one comparison item is required'),
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({ items }) {
      const itemCount = items ? items.length : 0
      return {
        title: 'Comparison Schema',
        subtitle: `${itemCount} item${itemCount !== 1 ? 's' : ''}`,
      }
    },
  },
})

export default ComparisonSchema

