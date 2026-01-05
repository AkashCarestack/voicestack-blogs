import { defineField, defineType } from 'sanity'
import { allowDuplicateSlugs } from '~/lib/sanity'
import showCountryFlag from '~/components/utils/common'
import { getLegendIcon, getLegendIconList } from './LegendIcons'

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
      name: 'slug',
      title: 'Comparison Table Slug',
      type: 'slug',
      options: {
        source: 'title',
        isUnique: allowDuplicateSlugs,
      },
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
                    defineField({
                      name: 'comparisonsCustom',
                      title: 'Comparisons Custom',
                      type: 'array',
                      of: [
                        defineField({
                          name: 'comparisonCustom',
                          type: 'object',
                          fields: [
                            defineField({
                              name: 'icon',
                              title: 'Icon',
                              type: 'string',
                              options: {
                                list: getLegendIconList(),
                              },
                              validation: (Rule) => Rule.required(),
                            }),
                            defineField({
                              name: 'text',
                              title: 'Text',
                              type: 'string',
                              // validation: (Rule) => Rule.required(),
                            }),
                            
                            // defineField({
                            //   name: 'language',
                            //   type: 'string',
                            //   readOnly: true,
                            //   hidden: true,
                            // }),
                          ],
                          preview: {
                            select: {
                              title: 'text',
                              icon: 'icon',
                            },
                            prepare(selection) {
                              return {
                                title: selection?.title,
                                media: <div dangerouslySetInnerHTML={{ __html: getLegendIcon(selection?.icon)?.svg }} />,
                                // subtitle: selection?.icon,
                              };
                            },
                          },
                        } as any),
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
  preview: {
    select: {
      title: 'title',
      language: 'language'
    },
    prepare(selection) {
      return {
        title: ` ${selection?.title || 'Comparison Table'}`,
        media: <img src={showCountryFlag(selection?.language)}/>
      };
    },
  },
})

