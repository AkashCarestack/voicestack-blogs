export const genericListingComponentFields = [
  {
    name: 'heading',
    title: 'Section Heading',
    type: 'string',
  },
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
    of: [
      {
        type: 'object',
        fields: [
          {
            name: 'heading',
            title: 'Item Heading',
            type: 'string',
          },
          {
            name: 'subheading',
            title: 'Item Subheading',
            type: 'string',
          },
          {
            name: 'description',
            title: 'Item Description',
            type: 'text',
          },
          {
            name: 'link',
            title: 'Link',
            type: 'object',
            options: {
              collapsible: true,
              collapsed: true,
            },
            fields: [
              {
                name: 'url',
                title: 'URL',
                type: 'string',
              },
              {
                name: 'text',
                title: 'Link Text',
                type: 'string',
              },
              {
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
              },
            ],
          },
          {
            name: 'dynamicSvg',
            title: 'Dynamic SVG Code',
            type: 'text',
            description: 'Paste your SVG code here',
          },
          {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
              hotspot: true,
            },
          },
          {
            name: 'icon',
            title: 'Icon',
            type: 'image',
            
          },
        ],
      },
    ],
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

