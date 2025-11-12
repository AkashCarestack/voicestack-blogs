import { defineField, defineType } from 'sanity'

export default defineType({
  title: 'Listing Block',
  name: 'listingBlock',
  type: 'object',
  fields: [
    defineField({
      name: 'itemHeading',
      title: 'Item Heading',
      type: 'string',
    }),
    defineField({
      name: 'listingItem',
      title: 'Listing Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'key',
              title: 'Key',
              type: 'string',
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              key: 'key',
              value: 'value',
            },
            prepare({ key, value }) {
              return {
                title: key || 'Untitled',
                subtitle: value,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'itemHeading',
      items: 'listingItem',
    },
    prepare({ title, items }) {
      return {
        title: title || 'Listing Block',
        subtitle: items ? `${items.length} items` : 'No items',
      }
    },
  },
})

