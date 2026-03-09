import { defineField, defineType } from 'sanity'

export default defineType({
  title: 'Rotating Practice Types',
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
        title: 'Rotating Practice Types',
        subtitle: 'Enterprise, Dental, Optometry, Physical Therapy, Veterinary',
      }
    },
  },
})

