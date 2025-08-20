import { SchemaTypeDefinition } from 'sanity'

const WhoWeServe_enAU: SchemaTypeDefinition = {
  name: 'whoWeServe_enAU',
  title: 'Who We Serve (Australia English)',
  type: 'document',
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
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      icon: 'icon',
      slug: 'slug.current',
    },
    prepare({ title, description, icon, slug }: { title: string; description: string; icon: any; slug: string }) {
      return {
        title,
        subtitle: `${description || 'No description'} • /${slug} (AU)`,
        media: icon,
      }
    },
  },
}

export default WhoWeServe_enAU
