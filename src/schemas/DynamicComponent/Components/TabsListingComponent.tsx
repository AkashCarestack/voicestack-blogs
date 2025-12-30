import { sectionHeadingDynamicSchema } from '~/schemas/Common/commonSchema'

const TabsListingComponent = {
  name: 'tabsListingComponent',
  title: 'Tabs Listing Component',
  type: 'object',
  fields: [
    {
      name: 'globalData',
      title:
        'Global Data (if not provided, data will be fetched from Selected global data)',
      type: 'reference',
      to: [{ type: 'globalData' }],
      options: {
        filter: 'defined(_id)',
      },
    },
    {
      name: 'slug',
      title: 'slug',
      type: 'slug',
      options: {
        source: 'headline',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },

    {
      name: 'headline',
      title: 'Heading',
      type: 'string',
    },
    sectionHeadingDynamicSchema,
    {
      name: 'subheadline',
      title: 'Subheading',
      type: 'string',
    },

    {
      name: 'showCTA',
      title: 'Show CTA',
      type: 'boolean',
    },
    {
      name: 'subDescription',
      title: 'Description',
      type: 'string',
    },
    {
      name:'cardImage',
      title: 'Card Image',
      type: 'image',
    },
    {
      name: 'overviewVideo',
      title: 'Overview Video',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'videoDetails',
          title: 'Video Details',
          fields: [
            {
              name: 'videoPlatform',
              title: 'Video Platform',
              type: 'string',
              description: 'vimeo, vidyard and youtube',
              options: {
                list: [
                  { title: 'Vimeo', value: 'vimeo' },
                  { title: 'Vidyard', value: 'vidyard' },
                  { title: 'YouTube', value: 'youtube' },
                ],
                layout: 'dropdown',
              },
            },
            {
              name: 'videoId',
              title: 'Video Id',
              type: 'string',
            },
            {
              name: 'videotitle',
              title: 'Video Title',
              type: 'string',
            },
            {
              name: 'videoThumbnail',
              title: 'Video Thumbnail',
              type: 'file',
            },
            {
              name: 'uploadVideos',
              title: 'Upload Videos',
              type: 'array',
              of: [{
                type: 'object',
                name: 'uploadVideo',
                title: 'Upload Video',
                fields: [
                  {
                    name: 'type',
                    title: 'File Type',
                    type: 'string',
                    options: {
                      list: [
                        { title: 'Mov', value: 'mov' }, 
                        { title: 'Mp4', value: 'mp4' },
                        { title: 'Webm', value: 'webm' },
                      ],
                    },
                  },
                  {
                    name: 'url',
                    title: 'URL',
                    type: 'string',
                  },
                ],
              }],
            },
          ],
          preview: {
            select: {
              title: 'videotitle',
            },
            prepare(selection: any) {
              const { title } = selection
              return {
                title: title || 'Untitled Video',
              }
            },
          },
        },
      ],
    },
    {
      name: 'tabs',
      title: 'Tabs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'tabHeading',
              title: 'Heading',
              type: 'string',
            },
            {
              name: 'tabSubHeading',
              title: 'SubHeading',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'customBlockContent',
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
            },
            {
              name: 'listItems',
              title: 'Feature List Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'subfeatureHeading',
                      title: 'Heading',
                      type: 'string',
                    },
                    {
                      name: 'subfeatureSubheading',
                      title: 'Subheading ',
                      type: 'string',
                    },
                    {
                      name: 'subfeatureDescription',
                      title: 'Description',
                      type: 'string',
                    },
                    {
                      name: 'subfeatureImage',
                      title: 'Image',
                      type: 'image',
                    },
                    {
                      name: 'svgCode',
                      title: 'SVG Code',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
            {
              name: 'icon',
              title: 'Icon (SVG)',
              type: 'text',
            },
            {
              name: 'ctaListItems',
              title: 'Call to Action List',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'ctaText',
                      title: 'CTA Text',
                      type: 'string',
                    },
                    {
                      name: 'ctaLink',
                      title: 'CTA Link',
                      type: 'string',
                    },
                    {
                      name: 'ctaType',
                      title: 'Button type',
                      type: 'string',
                    },
                  ],
                },
              ],
            },
            {
              name: 'Link',
              title: 'Link (href)',
              type: 'string',
            },
            {
              name: 'LinkText',
              title: 'Link Text',
              type: 'string',
            },

            {
              name: 'testimonial',
              title: 'testimonial (referenced region Based)',
              type: 'reference',
              to: [{ type: 'testimonialSection' }],
              options: {
                filter: ({ document }) => {
                  // Filter testimonials based on the current document's language
                  const currentLanguage = document?.language || 'en'

                  return {
                    filter: `language == "${currentLanguage}"`,
                    params: { language: currentLanguage },
                  }
                },
              },
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      image: 'image',
      alignment: 'contentAlignment',
    },
    prepare(selection: any) {
      return {
        title: selection.title || 'Right Image Component',
        subtitle: `${selection.alignment || 'center'} aligned`,
        media: selection.image,
      }
    },
  },
}

export default TabsListingComponent
