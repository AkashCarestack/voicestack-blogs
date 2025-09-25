import { defineField, defineType } from 'sanity'
import { isUniqueOtherThanLanguage } from '~/lib/sanity'

export default defineType({
  name: 'featureList',
  title: 'Feature List',
  type: 'document',
  // This ensures the page works with document internationalization
  i18n: {
    base: 'en',
    languages: ['en', 'en-GB', 'en-AU'],
    fieldNames: {
      lang: 'language'
    }
  },
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

    // Features Section
    defineField({
      name: 'features',
      title: 'Features',
      group: 'features',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'feature',
          title: 'Feature',
          fields: [
            {
              name: 'title',
              title: 'Feature Title',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Feature Description',
              type: 'text',
              rows: 2,
            },
            {
              name: 'shortDescription',
              title: 'Short Description',
              type: 'text',
              rows: 1,
            },
            {
              name: 'icon',
              title: 'Feature Icon',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'image',
              title: 'Feature Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'isHighlighted',
              title: 'Highlight this feature',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'order',
              title: 'Display Order',
              type: 'number',
              description: 'Lower numbers appear first',
            },
            {
              name: 'category',
              title: 'Feature Category',
              type: 'string',
              options: {
                list: [
                  { title: 'Core Features', value: 'core' },
                  { title: 'Advanced Features', value: 'advanced' },
                  { title: 'Integration Features', value: 'integration' },
                  { title: 'Analytics Features', value: 'analytics' },
                  { title: 'Communication Features', value: 'communication' },
                  { title: 'Management Features', value: 'management' },
                ]
              }
            },
            {
              name: 'cta',
              title: 'Call to Action',
              type: 'object',
              fields: [
                {
                  name: 'text',
                  title: 'CTA Text',
                  type: 'string',
                },
                {
                  name: 'link',
                  title: 'CTA Link',
                  type: 'string',
                },
                {
                  name: 'type',
                  title: 'CTA Type',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Primary', value: 'primary' },
                      { title: 'Secondary', value: 'secondary' },
                      { title: 'Link', value: 'link' },
                    ]
                  }
                }
              ]
            }
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'category',
              media: 'icon',
            },
            prepare(selection: any) {
              const { title, subtitle, media } = selection
              return {
                title: title || 'Untitled Feature',
                subtitle: subtitle ? `Category: ${subtitle}` : 'No category',
                media: media
              }
            },
          },
        },
      ],
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
      featuresCount: 'features.length',
    },
    prepare(selection: any) {
      const { lang, title, featuresCount } = selection
      return { 
        ...selection, 
        subtitle: `${lang || 'en'} • ${featuresCount || 0} features`
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
