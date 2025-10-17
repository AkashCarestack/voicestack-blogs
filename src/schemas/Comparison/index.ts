import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'comparisonTable',
  title: 'Comparison Table',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [
        defineField({
          name: 'column',
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Column Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'image',
              // validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'logoMobile',
              title: 'Logo Mobile',
              type: 'image',
              // validation: (Rule) => Rule.required(),
            }),
          ],
        } as any),
      ],
    } as any),
    defineField({
      name: 'rowCategories',
      title: 'Row Categories',
      type: 'array',
      of: [
        defineField({
          name: 'rowCategory',
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Category Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'iconSvgCode',
              title: 'Icon Svg Code',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              // validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'rows',
              title: 'Rows',
              type: 'array',
              of: [
                defineField({
                  name: 'row',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'heading',
                      title: 'Row Heading',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'description',
                      title: 'Description',
                      type: 'string',
                    }),
                    defineField({
                      name: 'comparisons',
                      title: 'Comparisons',
                      type: 'array',
                      of: [
                        {
                          type: 'reference',
                          to: [{ type: 'comparisonValue' }],
                          options: {
                            filter: 'defined(_id)',
                          },
                        }
                      ],
                    }),
                   
                  ],
                } as any),
              ],
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'object',
              fields: [
                defineField({
                  name: 'url',
                  title: 'URL',
                  type: 'string',
                }),
              ],
              options: {
                collapsible: true,
                collapsed: true,
              },
            }),
          ],
        } as any),
      ],
    }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
})
