import { createBasePageSchema } from '../basePageSchema'
import { defineField } from 'sanity'
import showCountryFlag from '~/components/utils/common'

const baseSchema = createBasePageSchema('features', 'Features')

// Add featureCategory group and field, and assign groups to base fields
const Features = {
  ...baseSchema,
  fields: [
    {
      ...baseSchema.fields[0], // basicInfo
      fields: [
        ...baseSchema.fields[0].fields,
        defineField({
          name: 'dynamicSvg',
          title: 'Dynamic SVG',
          type: 'text',
          rows: 8,
          description: 'Paste SVG code here to override the image icon. This will be used in feature listings and cards.',
          placeholder: '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">\n  <path d="..."/>\n</svg>',
          validation: (Rule: any) => Rule.custom((value: string) => {
            if (!value) return true; // SVG code is optional
            // Basic validation to check if it looks like SVG
            if (!value.includes('<svg') || !value.includes('</svg>')) {
              return 'Please provide valid SVG code with opening and closing <svg> tags';
            }
            return true;
          }),
        }),
      ],
      group: 'basicInfo',
    },
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Order for sorting features',
      group: 'basicInfo',
    }),
    {
      ...baseSchema.fields[1], // content
      group: 'content',
    },
    {
      name: 'featureCategory',
      title: 'Feature Category',
      type: 'reference',
      to: [{ type: 'featureCategory' }],
      options: {
        disableNew: false,
      },
      description: 'Select an existing feature category or create a new one',
      group: 'featureCategory',
    },
    {
      ...baseSchema.fields[2], // seo
      group: 'seo',
    },
    {
      ...baseSchema.fields[4], // faqReferenced
      group: 'seo',
    },
    baseSchema.fields[3], // language (hidden, no group needed)
  ],
  groups: [
    {
      name: 'basicInfo',
      title: 'Basic Information',
      default: true,
    },
    {
      name: 'content',
      title: 'Page Content',
    },
    {
      name: 'featureCategory',
      title: 'Feature Category',
    },
    {
      name: 'seo',
      title: 'SEO & Meta',
    },
  ],
  preview: {
    select: {
      title: 'basicInfo.title',
      description: 'basicInfo.description',
      icon: 'basicInfo.icon',
      slug: 'basicInfo.slug.current',
      language: 'language',
      category: 'featureCategory.name',
      order: 'order',
    },
    prepare(selection: any) {
      return {
        title: `${selection?.title || 'Untitled Feature'}`,
        subtitle: `${selection?.description || 'No description'}${selection?.category ? ` • ${selection.category}` : ''}${selection?.order ? ` • Order: ${selection.order}` : ''} • /${selection?.slug?.current || ''}`,
        media: selection?.language ? <img src={showCountryFlag(selection?.language)} /> : selection?.icon
      };
    },
  },
  orderings: [
    {
      title: 'Language, Order Asc',
      name: 'languageOrderAsc',
      by: [
        { field: 'language', direction: 'asc' },
        { field: 'order', direction: 'asc' }
      ],
    },
    {
      title: 'Language, Order Desc',
      name: 'languageOrderDesc',
      by: [
        { field: 'language', direction: 'asc' },
        { field: 'order', direction: 'desc' }
      ],
    },
    {
      title: 'Order, Asc',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Order, Desc',
      name: 'orderDesc',
      by: [{ field: 'order', direction: 'desc' }],
    },
    {
      title: 'Language, Title Asc',
      name: 'languageTitleAsc',
      by: [
        { field: 'language', direction: 'asc' },
        { field: 'basicInfo.title', direction: 'asc' }
      ],
    },
  ],
}

export default Features
