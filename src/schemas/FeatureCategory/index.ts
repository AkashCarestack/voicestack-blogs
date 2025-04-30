import { defineField, defineType } from 'sanity'
export default defineType({
  name: 'featureCategory',
  title: 'Feature',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
    }),
    defineField({
      name: 'featureOrder',
      title: 'Feature Order',
      type: 'number',
    }),
    defineField({
      name: 'heading',
      title: 'Category Heading',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Category Description',
      type: 'text',
    }),
    defineField({
        name: 'icon',
        title: 'Category Icon',
        type: 'image',
      }),
    defineField({
        name: 'mainImage',
        title: 'Main Image',
        type: 'image',
      }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    
  ],
  preview: {
    select: {
      title: 'name',
      lang: 'language',
      media: 'icon',
    },
    prepare(selection) {
      const { lang, title } = selection
      return { ...selection, subtitle: lang && `${lang}` }
    },
      },
})
