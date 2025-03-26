import { defineField, defineType } from 'sanity'
import { isUniqueOtherThanLanguage } from '~/lib/sanity'

export const seoFields = [
  defineField({
    name: 'seoTitle',
    title: 'Meta Title',
    description: 'Overrides main page title',
    type: 'string',
    group: 'seo'
  }),
  defineField({
    name: 'seoDescription',
    title: 'Meta Description',
    type: 'string',
    validation: (Rule) => [
      Rule.required()
        .min(10)
        .error('A description of at least 10 characters is required'),
      Rule.max(155).warning('Shorter descriptions are usually better'),
    ],
    group: 'seo'
  }),
  defineField({
    name: 'seoKeywords',
    title: 'Meta Keywords',
    type: 'string',
    group: 'seo'
  }),
  defineField({
    name: 'seoJSONLD',
    title: 'Meta JSON-LD',
    type: 'text',
    group: 'seo',
    validation: (Rule: any) =>
      Rule.custom((json) => {
        try {
          JSON.parse(json || '{}')
          return true
        } catch (err) {
          return 'Invalid JSON format'
        }
      }),
  }),
  defineField({
    name: 'seoCanonical',
    title: 'Canonical URL',
    type: 'url',
    group: 'seo'
  }),
]
export default defineType({
  name: 'heroes',
  title: 'Heroes',
  type: 'document',

  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    }, 
    {
      name: 'seo',
      title: 'SEO',
    }, 
    
  ],

  fields: [
    defineField({
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Feature', value: 'feature' },
          { title: 'Integration', value: 'integration' },
          { title: 'System Requirements', value: 'system-requirements' },
        ],
      },
      validation: (Rule) => Rule.required().error('Content type is required.'),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'subHeading',
      title: 'Sub Heading',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'content',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      group: 'content',
    }),
    defineField({
      name: 'bgImage',
      title: 'Background Image',
      type: 'image',
      group: 'content',
    }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    ...seoFields,
  ],
  preview: {
    select: {
      title: 'contentType',
      lang: 'language',
      media: 'icon',
    },
    prepare(selection) {
      const { lang, title } = selection
      return { ...selection, subtitle: lang && `${lang}` }
    },
  },
})
