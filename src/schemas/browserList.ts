import { defineField, defineType } from 'sanity'

export default defineType({
  title: 'Browser List',
  name: 'browserList',
  type: 'object',
  fields: [
    defineField({
      name: 'mainHeading',
      title: 'Main Heading',
      type: 'string',
    }),
    defineField({
      name: 'listingItem',
      title: 'Browser Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Browser Name',
              type: 'string',
            }),
            defineField({
              name: 'image',
              title: 'Browser Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: 'altText',
                  title: 'Alt Text',
                  type: 'string',
                }),
              ],
            }),
          ],
          preview: {
            select: {
              name: 'name',
              media: 'image',
            },
            prepare({ name, media }) {
              return {
                title: name || 'Untitled',
                media,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'mainHeading',
      items: 'listingItem',
    },
    prepare({ title, items }) {
      return {
        title: title || 'Browser List',
        subtitle: items ? `${items.length} browsers` : 'No browsers',
      }
    },
  },
})

