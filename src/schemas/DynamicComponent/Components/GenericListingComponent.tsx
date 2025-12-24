import { listingItemSchema, ctaListItemSchema, sectionHeadingDynamicSchema } from '~/schemas/Common/commonSchema'

export const genericListingComponentFields = [
  {
    name: 'heading',
    title: 'Section Heading',
    type: 'string',
  },
    sectionHeadingDynamicSchema,
  {
    name: 'description',
    title: 'Section Description',
    type: 'text',
  },
  {
    name: 'useReference',
    title: 'Use Reference from Blocks & Lists',
    type: 'boolean',
    initialValue: false,
    description: 'Enable this to reference data from a Blocks & Lists document instead of inline items',
  },
  {
    name: 'blocksListingReference',
    title: 'Blocks & Lists Reference',
    type: 'reference',
    to: [
      { type: 'logoListing' },
      { type: 'verticalTestimonialListing' },
      { type: 'csCardsListing' },
      { type: 'whoWeServeListing' },
      { type: 'genericItemsListing' },
      { type: 'partnerListing' },
    ],
    options: {
      filter: ({ document, parent }: any) => {
        // Get the parent document's language by going up the tree
        const currentLanguage = document?.language || 'en'
        
        return {
          filter: 'language == $language',
          params: { language: currentLanguage }
        }
      }
    },
    hidden: ({ parent }: any) => !parent?.useReference,
  },
  {
    name: 'items',
    title: 'Listing Items',
    type: 'array',
    of: [listingItemSchema],
    hidden: ({ parent }: any) => parent?.useReference === true,
  },
  {
    name: 'customListingItems',
    title: 'Custom Listing Items',
    type: 'array',
    of: [
      {
        type: 'object',
        fields: [
          {
            name: 'heading',
            title: 'Heading',
            type: 'string',
            // description: 'Industry name (e.g., "Dental", "Physical Therapy")',
          },
          {
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
          },
          {
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
          },
          {
            name: 'listIconSvgCode',
            title: 'List Icon SVG Code',
            type: 'text',
            description: 'Paste your SVG code here for list item icons',
          },
          {
            name: 'listItems',
            title: 'List Items',
            type: 'array',
            of: [
              {
                type: 'object',
                fields: [
                  {
                    name: 'itemHeading',
                    title: 'Item Heading',
                    type: 'string',
                  },
                  {
                    name: 'dynamicSvgCode',
                    title: 'Dynamic SVG Code',
                    type: 'text',
                    description: 'Paste your SVG code here',
                  },
                  {
                    name: 'content',
                    title: 'Content',
                    type: 'customListingContent',
                    description: 'Rich text content with h4 headings, subheadings, lists, and highlights',
                  },
                ],
              },
            ],
          },
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
      },
    ],
  },
  {
    name: 'customText',
    title: 'Custom Text',
    type: 'string',
    description: 'Custom text to display in the footer section',
  },
  {
    name: 'ctaListItems',
    title: 'Call to Action List',
    type: 'array',
    of: [ctaListItemSchema],
    hidden: ({ parent }: any) => parent?.useReference === true,
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
  {
    name: 'showRelatedFeatures',
    title: 'Show Related Features',
    type: 'boolean',
    initialValue: false,
    description: 'Enable this to show related features section',
  },
  {
    name: 'relatedFeatures',
    title: 'Related Features',
    type: 'array',
    of: [
      {
        type: 'reference',
        to: [{ type: 'features' }],
        options: {
          filter: ({ document }) => {
            // Filter features based on the current document's language
            const currentLanguage = document?.language || 'en'

            return {
              filter: `language == $language && _id != $id`,
              params: { 
                language: currentLanguage,
                id: document?._id || ''
              },
            }
          },
        },
      },
    ],
    hidden: ({ parent }: any) => !parent?.showRelatedFeatures,
  },
  {
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
    name: 'referenceGlobalSchema',
    title: 'Reference Global Schema',
    type: 'reference',
    to: [
      { type: 'globalData' }
    ],
    description: 'Reference data from global common schemas - data flows automatically!',
  },
];

const GenericListingComponent = {
  name: 'genericListingComponent',
  title: 'Generic Listing Component',
  type: 'object',
  fields: genericListingComponentFields,
  preview: {
    select: {
      title: 'heading',
      itemCount: 'items',
    },
    prepare(selection: any) {
      const itemCount = selection.itemCount?.length || 0;
      return {
        title: selection.title || 'Generic Listing Component',
        subtitle: `${itemCount} items`,
      };
    },
  },
}

export default GenericListingComponent

