import { defineField } from 'sanity'

/**
 * Common Schema Definitions
 * Reusable schemas for various components
 */

/**
 * Listing Item Schema
 * Reusable schema for listing items used in GenericListingComponent and other listing components
 */
export const listingItemSchema = {
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
    defineField({
      name: 'genericVideo',
      title: 'Generic Video',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: 'videoId',
          title: 'Video ID',
          type: 'string',
          description: 'The ID of the video (e.g., YouTube video ID)',
        }),
        defineField({
          name: 'videoUrl',
          title: 'Video URL',
          type: 'url',
          description: 'The full URL of the video',
        }),
        defineField({
          name: 'videoPlatform',
          title: 'Video Platform',
          type: 'string',
          options: {
            list: [
              { title: 'YouTube', value: 'youtube' },
              { title: 'Vimeo', value: 'vimeo' },
              { title: 'Other', value: 'other' },
            ],
          },
        }),
      ],
    }),
    defineField({
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
    }),
  ],
}

/**
 * CTA List Item Schema
 * Reusable schema for call-to-action list items
 */
export const ctaListItemSchema = {
  type: 'object',
  fields: [
    defineField({
      name: 'ctaText',
      title: 'CTA Text',
      type: 'string',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Link',
      type: 'string',
    }),
    defineField({
      name: 'ctaType',
      title: 'Button type',
      type: 'string',
    }),
  ],
}

/**
 * Section Heading Dynamic Schema
 * Rich text heading with formatting options
 */
export const sectionHeadingDynamicSchema = defineField({
  name: 'sectionHeadingDynamic',
  title: 'Section Heading Dynamic',
  type: 'customBlockContent',
  description: 'Rich text heading with formatting options ',
})

/**
 * Generic Video Schema
 * Reusable schema for video assets
 */
export const genericVideoSchema = {
  type: 'object',
  name: 'genericVideo',
  title: 'Generic Video',
  fields: [
    defineField({
      name: 'videoId',
      title: 'Video ID',
      type: 'string',
      description: 'The ID of the video (e.g., YouTube video ID)',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'The full URL of the video',
    }),
    defineField({
      name: 'videoPlatform',
      title: 'Video Platform',
      type: 'string',
      options: {
        list: [
          { title: 'YouTube', value: 'youtube' },
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      videoUrl: 'videoUrl',
      videoPlatform: 'videoPlatform',
    },
    prepare({ videoUrl, videoPlatform }) {
      return {
        title: `Video (${videoPlatform || 'Unknown Platform'})`,
        subtitle: videoUrl || 'No URL',
      }
    },
  },
}

