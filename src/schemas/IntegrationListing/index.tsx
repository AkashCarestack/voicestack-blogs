import { defineField, defineType } from 'sanity'
import { isUniqueOtherThanLanguage } from '~/lib/sanity'

export default defineType({
  name: 'integrationListing',
  title: 'Integration Listing',
  type: 'document',
  groups: [
    {
      name: 'basic',
      title: 'Basic Information',
      default: true,
    },
    {
      name: 'integrations',
      title: 'Integration Categories',
    },
  ],

  fields: [
    // Integration Category (Single Selection)
    defineField({
      name: 'integrationCategory',
      title: 'Integration Category',
      type: 'reference',
      to: [{ type: 'integrationCategory' }],
      options: {
        disableNew: true,
      },
      description: 'Select one integration category to include in this listing',
    }),

    // Integration List Items Array
    defineField({
      name: 'integrationListItems',
      title: 'Integration List Items',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'integrationList' }],
          options: {
            disableNew: true,
          },
        },
      ],
      description: 'Select individual integration list items to include',
      validation: (Rule: any) => Rule.max(100).error('Maximum 100 integration list items allowed'),
    }),

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
      category: 'integrationCategory.name',
      items: 'integrationListItems',
      language: 'language'
    },
    prepare(selection) {
      const { category, items, language } = selection
      const itemCount = items?.length || 0
      return {
        title: `Integration Listing (${language || 'en'})`,
        subtitle: `${category || 'No category'}, ${itemCount} items`,
      }
    },
  },
})
