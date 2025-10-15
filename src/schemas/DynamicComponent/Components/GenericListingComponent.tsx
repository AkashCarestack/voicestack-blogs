const GenericListingComponent = {
  name: 'genericListingComponent',
  title: 'Generic Listing Component',
  type: 'object',
  fields: [
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
          ],
        },
      ],
    },
  ],
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

