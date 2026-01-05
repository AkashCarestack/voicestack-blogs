import { defineArrayMember, defineType } from 'sanity'
import listingBlock from './listingBlock'

const HighlightDecorator = (props) => (
  <span style={{ backgroundColor: 'yellow' }}>{props.children}</span>
)
export default defineType({
  title: 'Custom Listing Content',
  name: 'customListingContent',
  type: 'array',
  of: [
    // defineArrayMember({
    //   title: 'Listing Block',
    //   type: 'listingBlock',
    // }),
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
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Number', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Underline', value: 'underline' },
          {
            title: 'Highlight',
            value: 'highlight',
            component: HighlightDecorator,
          },
        ],
        annotations: [
          {
            title: 'Link',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: (Rule) => Rule.uri({
                  allowRelative: true,
                  scheme: ['http', 'https', 'mailto', 'tel']
                })
              },
              {
                title: 'Open in new tab',
                name: 'blank',
                type: 'boolean',
                initialValue: false
              }
            ]
          }
        ]
      },
    }),
  ],
})

