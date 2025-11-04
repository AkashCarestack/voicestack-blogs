import { defineField } from 'sanity'

export const heroFields = [
  defineField({
    name: 'heroStrip',
    title: 'Hero Strip',
    type: 'string',
  }),
  defineField({
    name: 'heroheading',
    title: 'Hero Heading',
    type: 'customBlockContent',
  }),
  defineField({
    name: 'heroDescription',
    title: 'Hero Description',
    type: 'blockContent',
  }),
  defineField({
    name: 'bookBtnContent',
    title: 'CTA Button',
    type: 'array',
    of: [{ type: 'button' }],
  }),
  defineField({
    name: 'heroImage',
    title: 'Hero Section Image',
    type: 'image',
  }),
  defineField({
    name: 'heroImageSecondary',
    title: 'Hero Section Image Secondary',
    type: 'image',
  }),
  defineField({
    name: 'video',
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
        ],
        preview: {
          select: {
            title: 'videotitle',
          },
          prepare(selection) {
            const { title } = selection
            return {
              title: title || 'Untitled Video',
            }
          },
        },
      },
    ],
  }),
  defineField({
    name: 'testimonialVideo',
    title: 'Testimonial',
    type: 'reference',
    to: [{ type: 'testimonialSection' }],
    options: {
      filter: ({ document }) => {
        // Filter testimonials based on the current document's language
        const currentLanguage = document?.language || 'en'
        
        return {
          filter: `language == "${currentLanguage}"`,
          params: { language: currentLanguage }
        }
      }
    }
  }),
]
