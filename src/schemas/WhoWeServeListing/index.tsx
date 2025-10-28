
import { defineField, defineType } from 'sanity'
import showCountryFlag from '~/components/utils/common';

export default defineType({
  name: 'whoWeServeListing',
  title: 'Who We Serve',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Section Description',
      type: 'text',
    }),
    defineField({
      name: 'items',
      title: 'Listing Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'heading',
              title: 'Item Heading',
              type: 'string',
            }),
            defineField({
              name: 'subheading',
              title: 'Item Subheading',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Item Description',
              type: 'text',
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'object',
              options: {
                collapsible: true,
                collapsed: true,
              },
              fields: [
                defineField({
                  name: 'url',
                  title: 'URL',
                  type: 'string',
                }),
                defineField({
                  name: 'text',
                  title: 'Link Text',
                  type: 'string',
                }),
                defineField({
                  name: 'buttonType',
                  title: 'Button Type',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Primary', value: 'primary' },
                      { title: 'Secondary', value: 'secondary' },
                      { title: 'Outline', value: 'outline' },
                      { title: 'Text', value: 'text' },
                    ],
                  },
                  initialValue: 'text',
                }),
              ],
            }),
            defineField({
              name: 'dynamicSvg',
              title: 'Dynamic SVG Code',
              type: 'text',
              description: 'Paste your SVG code here',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'ctaListItems',
      title: 'Call to Action List',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'ctaLink',
              title: 'CTA Link',
              type: 'string',
            }),
            defineField({
              name: 'ctaText',
              title: 'CTA Text',
              type: 'string',
            }),
            defineField({
              name: 'ctaType',
              title: 'Button type',
              type: 'string',
            }),
          ],
        },
      ],
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
      title: 'heading',
      language: 'language',
      itemCount: 'items',
    },
    prepare(selection) {
      const itemCount = selection.itemCount?.length || 0;
      return {
        title: selection?.title || 'Who We Serve',
        subtitle: `${itemCount} items`,
        media: <img src={showCountryFlag(selection?.language)}/>
      };
    },
  },
})

