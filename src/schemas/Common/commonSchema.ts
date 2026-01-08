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
        defineField({
          name: 'uploadedVideo',
          title: 'Upload Video',
          type: 'file',
          description: 'Upload a video file directly (MP4, MOV, WebM)',
          options: {
            accept: 'video/*',
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
    defineField({
      name: 'uploadedVideo',
      title: 'Upload Video',
      type: 'file',
      description: 'Upload a video file directly (MP4, MOV, WebM)',
      options: {
        accept: 'video/*',
      },
    }),
  ],
  preview: {
    select: {
      videoUrl: 'videoUrl',
      videoPlatform: 'videoPlatform',
      uploadedVideo: 'uploadedVideo',
    },
    prepare({ videoUrl, videoPlatform, uploadedVideo }) {
      const source = uploadedVideo?.asset?._ref 
        ? 'Uploaded Video' 
        : videoUrl 
          ? `Video (${videoPlatform || 'Unknown Platform'})` 
          : 'No Video'
      return {
        title: source,
        subtitle: videoUrl || uploadedVideo?.asset?._ref || 'No URL',
      }
    },
  },
}

/**
 * Custom Listing Item Schema
 * Reusable schema for custom listing items with nested list items
 */
export const customListingItemSchema = {
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    
    defineField({
      name: 'listItems',
      title: 'List Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'previewHeading',
              title: 'Preview Heading',
              type: 'string',
              description: 'This is used for previewing the item in the listing',
            }),
            defineField({
              name: 'itemHeading',
              title: 'Item Heading',
              type: 'string',
            }),
            defineField({
              name: 'subTitle',
              title: 'Sub Title',
              type: 'string',
            }),
            defineField({
              name: 'dynamicSvgCode',
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
              }
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'customListingContent',
              description: 'Rich text content with h4 headings, subheadings, lists, and highlights',
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
                  description: 'The URL to link to. The entire card will be clickable.',
                }),
              ],
            }),
            
          ],
          preview: {
            select: {
              previewHeading: 'previewHeading',
              title: 'itemHeading',
            },
            prepare({ previewHeading, title }: any) {
              return {
                title: previewHeading || title || 'Untitled',
              };
            },
          },
        },
      ],
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
      name: 'cardType',
      title: 'Card Type',
      type: 'string',
      options: {
        list: [
          { title: 'Numbered Cards', value: 'numbered' },
          { title: 'Specialty Cards', value: 'specialty' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'specialty',
      description: 'Select whether cards should be numbered or specialty cards with icons',
    }),
    defineField({
      name: 'columnCount',
      title: 'Number of Columns',
      type: 'number',
      options: {
        list: [
          { title: '2 Columns', value: 2 },
          { title: '3 Columns', value: 3 },
          { title: '4 Columns', value: 4 },
        ],
        layout: 'dropdown',
      },
      initialValue: 3,
      description: 'Select the number of columns for the grid layout',
    }),
    defineField({
      name: 'listIconSvgCode',
      title: 'List Icon SVG Code',
      type: 'text',
      description: 'Paste your SVG code here for list item icons',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      itemCount: 'listItems',
    },
    prepare({ title, itemCount }: any) {
      return {
        title: title || 'Untitled Industry',
        subtitle: itemCount ? `${itemCount.length} list item${itemCount.length !== 1 ? 's' : ''}` : 'No items',
      };
    },
  },
}

