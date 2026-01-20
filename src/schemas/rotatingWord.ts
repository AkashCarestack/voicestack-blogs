import { defineField, defineType } from 'sanity'

export default defineType({
  title: 'Rotating Word',
  name: 'rotatingWord',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
      hidden: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Rotating Word',
        subtitle: 'Dental, Optometry, Physical Therapy, Veterinary',
      }
    },
  },
})

