import showCountryFlag from "~/components/utils/common"

const DentalSoftware = {
  name: 'dentalSoftware',
  title: 'Dental Software',
  type: 'document',
  // This ensures the page works with document internationalization
  i18n: true,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'heroTitle',
          title: 'Hero Title',
          type: 'string',
        },
        {
          name: 'heroSubtitle',
          title: 'Hero Subtitle',
          type: 'text',
        },
        {
          name: 'heroImage',
          title: 'Hero Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'heroBackground',
          title: 'Hero Background',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image' },
      ],
    },
    {
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'section',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Section Title',
              type: 'string',
            },
            {
              name: 'sectionContent',
              title: 'Section Content',
              type: 'array',
              of: [
                { type: 'block' },
                { type: 'image' },
              ],
            },
            {
              name: 'sectionOrder',
              title: 'Section Order',
              type: 'number',
            },
          ],
        },
      ],
    },
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Title for SEO purposes',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'Description for SEO purposes',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule: any) => Rule.positive().integer(),
    },
    {
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    },
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      icon: 'icon',
      slug: 'slug.current',
      language: 'language',
    },
    prepare(selection) {
      return {
        title: `${selection?.title}`,
        subtitle: `${selection?.description || 'No description'} • /${selection?.slug}`,
        media: selection?.language ? <img src={showCountryFlag(selection?.language)} /> : selection?.icon,
      }
    },
  },
}

export default DentalSoftware
