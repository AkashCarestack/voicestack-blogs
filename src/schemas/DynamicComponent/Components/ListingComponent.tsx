const ListingComponent = {
  name: 'listingComponent',
  title: 'Listing Component',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'items',
      title: 'List Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Item Title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Item Description',
              type: 'text',
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Vertical List', value: 'vertical' },
          { title: 'Grid', value: 'grid' },
          { title: 'Cards', value: 'cards' },
        ],
      },
      initialValue: 'vertical',
    },
  ],
  preview: {
    select: {
      title: 'title',
      layout: 'layout',
      itemCount: 'items',
    },
    prepare(selection: any) {
      const itemCount = selection.itemCount?.length || 0;
      return {
        title: selection.title || 'Listing Component',
        subtitle: `${selection.layout || 'vertical'} layout • ${itemCount} items`,
      };
    },
  },
}

export default ListingComponent

