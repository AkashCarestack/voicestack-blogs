import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'featureCategory',
  title: 'Feature Category',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      subheading: 'subheading',
    },
    prepare(selection) {
      const { title, subheading } = selection

      return {
        title: title || 'Untitled Category',
        subtitle: subheading || 'No subheading'
      }
    },
  },

  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: 'subheading',
      title: 'Category Subheading',
      type: 'string',
    }),

    defineField({
      name: 'description',
      title: 'Category Description',
      type: 'text',
      rows: 2,
    }),

    defineField({
      name: 'mainImage',
      title: 'Category Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'icon',
      title: 'Category Icon',
      type: 'image',
      description: 'Upload an image icon for this category',
    }),

    defineField({
      name: 'iconSvgCode',
      title: 'Category Icon SVG Code',
      type: 'text',
      rows: 8,
      description: 'Paste SVG code here to override the image icon. This will automatically change color based on the active state.',
      placeholder: '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">\n  <path d="..."/>\n</svg>',
      validation: (Rule: any) => Rule.custom((value: string) => {
        if (!value) return true; // SVG code is optional
        // Basic validation to check if it looks like SVG
        if (!value.includes('<svg') || !value.includes('</svg>')) {
          return 'Please provide valid SVG code with opening and closing <svg> tags';
        }
        return true;
      }),
    }),

  ],
})
