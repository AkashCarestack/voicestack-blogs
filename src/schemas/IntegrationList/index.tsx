import { defineField, defineType } from 'sanity'
import { isUniqueOtherThanLanguage } from '~/lib/sanity'
import showCountryFlag from '~/components/utils/common'

export default defineType({
  name: 'integrationList',
  title: 'Integration List',
  type: 'document',
  groups: [
    {
      name: 'basic',
      title: 'Basic Information',
      default: true,
    },
    {
      name: 'categories',
      title: 'Integration Categories',
    },
  ],

  fields: [
    defineField({
      name: 'title',
      title: 'Integration Title',
      group: 'basic',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Integration Headline',
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
        
        const query = `*[_type == "integrationList" && slug.current == $slug && language == $language && _id != $id][0]`;
        const params = { slug: value.current, language, id };
        
        const duplicate = await client.fetch(query, params);
        
        if (duplicate) {
          return `An integration with this slug already exists in ${language}. Please choose a different slug.`;
        }
        
        return true;
      }),
    },
    defineField({
      name: 'order',
      title: 'Order',
      group: 'basic',
      type: 'number',
      description: 'Order for sorting integrations',
    }),
    defineField({
      name: 'image',
      title: 'Integration Image',
      group: 'basic',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'link',
      title: 'Integration Link',
      group: 'basic',
      type: 'url',
      description: 'External link to the integration or related page',
    }),

    // Content Section
    defineField({
      name: 'description',
      title: 'Integration Description',
      group: 'basic',
      type: 'portableContent',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      group: 'basic',
      type: 'text',
      rows: 3,
    }),

    // Category Section - Single reference to Integration Category document
    defineField({
      name: 'integrationCategory',
      title: 'Integration Category',
      group: 'categories',
      type: 'reference',
      to: [{ type: 'integrationCategory' }],
      options: {
        disableNew: false, // Allow creating new categories
      },
      description: 'Select an existing integration category or create a new one',
      validation: (Rule: any) => Rule.required(),
    }),

    // SEO Section
    defineField({
      name: 'metaTitle',
      title: 'SEO Meta Title',
      group: 'basic',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Meta Description',
      group: 'basic',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'keywords',
      title: 'SEO Keywords',
      group: 'basic',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      group: 'basic',
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
      headline: 'headline',
      lang: 'language',
      media: 'image',
      order: 'order',
    },
    prepare(selection: any) {
      const { lang, title, headline, order } = selection
      return { 
        ...selection, 
        subtitle: `${headline || ''}${lang ? ` • ${lang}` : ''}${order ? ` • Order: ${order}` : ''}`,
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
