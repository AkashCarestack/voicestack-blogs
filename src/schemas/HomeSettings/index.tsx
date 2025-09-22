import { defineField, defineType } from 'sanity'
import showCountryFlag from '~/components/utils/common'
export default defineType({
  name: 'homeSettings',
  title: 'Home Settings',
  type: 'document',
  options: {
    // Additional options can be added here if needed
  },
  groups: [
    {
      name: 'basic',
      title: 'Basic',
      default: true,
    },
    {
      name: 'hero',
      title: 'Hero',
    },
  ],
  fields: [
    defineField({
      name: 'heroStrip',
      title: 'Hero Strip',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroheading',
      title: 'Hero Heading',
      type: 'blockContent',
      group: 'hero',
    }),

    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'blockContent',
      group: 'hero',
    }),

    defineField({
      name: 'bookBtnContent',
      title: 'CTA Button',
      group: 'hero',
      type: 'array',
      of: [{ type: 'button' }],
    }),

    defineField({
      name: 'heroImage',
      title: 'Hero Section Image',
      type: 'image',
      group: 'hero',
    }),

    defineField({
      name: 'heroImageSecondary',
      title: 'Hero Section Image Secondary',
      type: 'image',
      group: 'hero',
    }),

    defineField({
      name: 'video',
      title: 'Overview Video',
      type: 'array',
      group: 'hero',
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
              // options: {
              //   accept: 'video/mp4',
              // },
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
      title: 'Testimonial Video',
      type: 'array',
      of: [{ type: 'testimonialHighlightSection' }],
      group: 'hero',
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
      title: 'language',
      language: 'language',
    },
    prepare(selection) {
      return {
        title: ` ${selection?.title}`,
      }
    },
  },
})
