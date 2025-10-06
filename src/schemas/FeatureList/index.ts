import { defineField, defineType } from 'sanity'
import { isUniqueOtherThanLanguage } from '~/lib/sanity'

export default defineType({
  name: 'featureList',
  title: 'Feature List',
  type: 'document',
  groups: [
    {
      name: 'basic',
      title: 'Basic Information',
      default: true,
    },
    {
      name: 'features',
      title: 'Features',
    },
    {
      name: 'display',
      title: 'Display Settings',
    },
    {
      name: 'seo',
      title: 'SEO Settings',
    },
  ],

  fields: [
    defineField({
      name: 'title',
      title: 'Feature List Title',
      group: 'basic',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Feature List Description',
      group: 'basic',
      type: 'text',
      rows: 3,
    }),
    {
      name: 'slug',
      title: 'Slug',
      group: 'basic',
      type: 'slug',
      validation: (Rule: any) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: isUniqueOtherThanLanguage
      },
    },

    // Features Section - Reference to Features from Pages & Content Management
    defineField({
      name: 'featureReferences',
      title: 'Feature References',
      group: 'features',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'features' }],
          options: {
            filter: 'defined(slug.current)',
          },
        },
      ],
      description: 'Select features from the Features section (Pages & Content Management) to include in this list',
      validation: (Rule: any) => Rule.required().min(1),
    }),

    // Display Settings
    defineField({
      name: 'displaySettings',
      title: 'Display Settings',
      group: 'display',
      type: 'object',
      fields: [
        {
          name: 'layout',
          title: 'Layout Style',
          type: 'string',
          options: {
            list: [
              { title: 'Grid', value: 'grid' },
              { title: 'List', value: 'list' },
              { title: 'Tabs', value: 'tabs' },
              { title: 'Accordion', value: 'accordion' },
            ]
          },
          initialValue: 'grid'
        },
        {
          name: 'itemsPerRow',
          title: 'Items Per Row (Grid Layout)',
          type: 'number',
          options: {
            list: [
              { title: '2 Columns', value: 2 },
              { title: '3 Columns', value: 3 },
              { title: '4 Columns', value: 4 },
            ]
          },
          initialValue: 3,
          hidden: ({ parent }: any) => parent?.layout !== 'grid'
        },
        {
          name: 'showCategories',
          title: 'Show Category Filtering',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'showSearch',
          title: 'Show Search',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'showCTAs',
          title: 'Show Call-to-Action Buttons',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'highlightedFeaturesFirst',
          title: 'Show Highlighted Features First',
          type: 'boolean',
          initialValue: true,
        },
      ],
    }),

    // SEO Section
    defineField({
      name: 'metaTitle',
      title: 'SEO Meta Title',
      group: 'seo',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Meta Description',
      group: 'seo',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'keywords',
      title: 'SEO Keywords',
      group: 'seo',
      type: 'array',
      of: [{ type: 'string' }],
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
      title: 'title',
      lang: 'language',
      featuresCount: 'featureReferences.length',
    },
    prepare(selection: any) {
      const { lang, title, featuresCount } = selection
      return { 
        ...selection, 
        subtitle: `${lang || 'en'} • ${featuresCount || 0} referenced features`
      }
    },
  },

  orderings: [
    {
      title: 'Language, Title Asc',
      name: 'languageTitleAsc',
      by: [
        { field: 'language', direction: 'asc' },
        { field: 'title', direction: 'asc' }
      ],
    },
    {
      title: 'Title, Asc',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
