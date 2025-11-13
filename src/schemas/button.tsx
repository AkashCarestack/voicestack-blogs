import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'button',
  title: 'Button',
  type: 'document',
  fields: [
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
    }),
    defineField({
      name: 'buttonType',
      title: 'Button Type',
      type: 'string',
    }),
    defineField({
      name: 'buttonIcon',
      title: 'Button Icon',
      type: 'text',
    }),
    defineField({
      name: 'buttonVariant',
      title: 'Button Variant',
      type: 'string',
      options: {
        list: [
          { title: 'mail', value: 'mail' },
          { title: 'tel', value: 'tel' },
        ],
      },
    }),

  ],
  preview: {
    select: {
      title: 'buttonText',
    },
    prepare(selection) {
      return {
        title: ` ${selection?.title}`,
      }
    },
  },
})
