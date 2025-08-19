import { SchemaTypeDefinition } from 'sanity'

const WhoWeServe: SchemaTypeDefinition = {
  name: 'whoWeServe',
  title: 'Who We Serve',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
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
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image' },
      ],
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule: any) => Rule.positive().integer(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      icon: 'icon',
    },
    prepare({ title, description, icon }: { title: string; description: string; icon: any }) {
      return {
        title,
        subtitle: description,
        media: icon,
      }
    },
  },
}

export default WhoWeServe
