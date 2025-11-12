import { defineArrayMember, defineField, defineType } from 'sanity'
import { componentSchemas } from './DynamicComponent/Components'

export default defineType({
  title: 'Content Area',
  name: 'customContent',
  type: 'array',
  of: [
    ...componentSchemas.map(schema => defineArrayMember({
      type: schema.name,
      preview: {
        select: {
          title: 'title',
          subtitle: 'subtitle',
          media: 'icon'
        }
      }
    })),
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'H5', value: 'h5' },
        { title: 'H6', value: 'h6' },
        { title: 'Quote', value: 'blockquote' },
      ],

    }),
  ],
})
