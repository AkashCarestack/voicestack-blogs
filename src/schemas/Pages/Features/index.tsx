import { defineField, defineType } from 'sanity'
import { isUniqueOtherThanLanguage } from '~/lib/sanity'
import showCountryFlag from '~/components/utils/common'

export default defineType({
  name: 'features',
  title: 'Features',
  type: 'document',
  // This ensures the page works with document internationalization
  // i18n: {
  //   base: 'en',
  //   languages: ['en', 'en-GB', 'en-AU'],
  //   fieldNames: {
  //     lang: 'language'
  //   }
  // },
  groups: [
    {
      name: 'basic',
      title: 'Basic Information',
      default: true,
    },
    {
      name: 'content',
      title: 'Feature Content',
    },
    {
      name: 'categories',
      title: 'Feature Categories',
    },
    {
      name: 'benefits',
      title: 'Benefits & Pricing',
    },
    {
      name: 'related',
      title: 'Related Features',
    },
    {
      name: 'seo',
      title: 'SEO Settings',
    },
  ],

  fields: [
    defineField({
      name: 'title',
      title: 'Feature Title',
      group: 'basic',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    {
      name: 'slug',
      title: 'Slug',
      group: 'basic',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: isUniqueOtherThanLanguage
      },
      validation: (Rule: any) => Rule.required().custom(async (value, context) => {
        if (!value?.current) return true;
        
        const { document, getClient } = context;
        const client = getClient({ apiVersion: '2023-01-01' });
        
        const language = document?.language || 'en';
        const id = document?._id;
        
        const query = `*[_type == "features" && slug.current == $slug && language == $language && _id != $id][0]`;
        const params = { slug: value.current, language, id };
        
        const duplicate = await client.fetch(query, params);
        
        if (duplicate) {
          return `A feature with this slug already exists in ${language}. Please choose a different slug.`;
        }
        
        return true;
      }),
    },
    defineField({
      name: 'order',
      title: 'Order',
      group: 'basic',
      type: 'number',
      description: 'Order for sorting features',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      group: 'basic',
      type: 'string',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      group: 'basic',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      group: 'basic',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Feature Image',
      group: 'basic',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'secondaryImage',
      title: 'Secondary Image',
      group: 'basic',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'heroTheme',
      title: 'Hero Theme',
      group: 'basic',
      type: 'string',
      options: {
        list: [
          { title: 'Blue', value: 'blue' },
          { title: 'Green', value: 'green' },
          { title: 'Purple', value: 'purple' },
        ]
      },
      initialValue: 'blue'
    }),

    // Content Section
    defineField({
      name: 'overview',
      title: 'Feature Overview',
      group: 'content',
      type: 'portableContent',
    }),
    defineField({
      name: 'description',
      title: 'Feature Description',
      group: 'content',
      type: 'portableContent',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      group: 'content',
      type: 'portableContent',
    }),

    // Categories Section
    defineField({
      name: 'featureCategories',
      title: 'Feature Categories',
      group: 'categories',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Category Name',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'subheading',
              title: 'Category Subheading',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Category Description',
              type: 'text',
              rows: 2,
            },
            {
              name: 'mainImage',
              title: 'Category Main Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'icon',
              title: 'Category Icon',
              type: 'image',
            },
          ],
        },
      ],
    }),

    // Benefits & Pricing Section
    defineField({
      name: 'benefits',
      title: 'Key Benefits',
      group: 'benefits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Benefit Title',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Benefit Description',
              type: 'text',
              rows: 2,
            },
            {
              name: 'icon',
              title: 'Benefit Icon',
              type: 'image',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'pricing',
      title: 'Pricing Information',
      group: 'benefits',
      type: 'object',
      fields: [
        {
          name: 'isFree',
          title: 'Is Free Feature',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'price',
          title: 'Price',
          type: 'string',
          hidden: ({ parent }: any) => parent?.isFree,
        },
        {
          name: 'billingPeriod',
          title: 'Billing Period',
          type: 'string',
          options: {
            list: [
              { title: 'One-time', value: 'one-time' },
              { title: 'Monthly', value: 'monthly' },
              { title: 'Yearly', value: 'yearly' },
            ],
          },
          hidden: ({ parent }: any) => parent?.isFree,
        },
        {
          name: 'trialAvailable',
          title: 'Free Trial Available',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'trialPeriod',
          title: 'Trial Period',
          type: 'string',
          hidden: ({ parent }: any) => !parent?.trialAvailable,
        },
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action',
      group: 'benefits',
      type: 'object',
      fields: [
        {
          name: 'primaryText',
          title: 'Primary CTA Text',
          type: 'string',
        },
        {
          name: 'primaryLink',
          title: 'Primary CTA Link',
          type: 'string',
        },
        {
          name: 'secondaryText',
          title: 'Secondary CTA Text',
          type: 'string',
        },
        {
          name: 'secondaryLink',
          title: 'Secondary CTA Link',
          type: 'string',
        },
      ],
    }),

    // Related Features Section
    defineField({
      name: 'relatedFeatures',
      title: 'Related Features',
      group: 'related',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'features' }],
          options: {
            filter: ({ document }) => ({
              filter: '_type == "features" && language == $language && _id != $id',
              params: { 
                language: document.language || 'en',
                id: document._id 
              }, 
            }),
            disableNew: true,
          },
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
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      group: 'seo',
      type: 'url',
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
      media: 'heroImage',
      order: 'order',
    },
    prepare(selection: any) {
      const { lang, title, order } = selection
      return { 
        ...selection, 
        subtitle: `${lang || 'en'}${order ? ` • Order: ${order}` : ''}`,
        media: selection?.lang ? <img src={showCountryFlag(selection?.lang)} /> : selection?.media
      }
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
      title: 'Language, Title Asc',
      name: 'languageTitleAsc',
      by: [
        { field: 'language', direction: 'asc' },
        { field: 'title', direction: 'asc' }
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
      title: 'Title, Asc',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})