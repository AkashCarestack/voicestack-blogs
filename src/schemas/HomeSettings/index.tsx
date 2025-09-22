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
    {
      name: 'menu',
      title: 'Menu',
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
      name: 'dmeoFormId',
      title: 'Demo Form Id',
      type: 'string',
      group: 'basic',
      
    }),
    
    defineField({
      name: 'demoMeetingLink',
      title: 'Demo Meeting Link',
      type: 'string',
      group: 'basic',
    }),
    
    defineField({
      name: 'dmeoFormEventName',
      title: 'Demo Form Event Name',
      type: 'string',
      group: 'basic',
    }),

    defineField({
      name: 'canonical',
      title: 'Canonical',
      type: 'string',
      group: 'basic',
    }),

    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      group: 'basic',
    }),
        
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description:'Support email',
      group: 'basic',
    }),

    defineField({
      name: 'navigationMenu',
      title: 'Navigation Menu',
      type: 'array',
      group: 'menu',
      of: [
        {
          type: 'object',
          name: 'menuItem',
          title: 'Menu Item',
          fields: [
            {
              name: 'label',
              title: 'Menu Label',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'href',
              title: 'Link URL',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'hasSubmenu',
              title: 'Has Submenu',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'submenu',
              title: 'Submenu Items',
              type: 'array',
              hidden: ({ parent }: any) => !parent?.hasSubmenu,
              of: [
                {
                  type: 'object',
                  name: 'submenuItem',
                  title: 'Submenu Item',
                  fields: [
                    {
                      name: 'label',
                      title: 'Submenu Label',
                      type: 'string',
                      validation: (Rule: any) => Rule.required(),
                    },
                    {
                      name: 'href',
                      title: 'Submenu Link URL',
                      type: 'string',
                      validation: (Rule: any) => Rule.required(),
                    },
                    {
                      name: 'description',
                      title: 'Description',
                      type: 'string',
                    },
                  ],
                  preview: {
                    select: {
                      title: 'label',
                      subtitle: 'href',
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href',
              hasSubmenu: 'hasSubmenu',
            },
            prepare(selection: any) {
              const { title, subtitle, hasSubmenu } = selection
              return {
                title: title || 'Untitled Menu Item',
                subtitle: hasSubmenu ? `${subtitle} (with submenu)` : subtitle,
              }
            },
          },
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
