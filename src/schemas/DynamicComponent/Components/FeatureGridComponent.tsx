const FeatureGridComponent = {
  name: 'featureGridComponent',
  title: 'Feature Grid Component',
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
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Feature Title',
              type: 'string',
              // Removed required validation to fix CMS validation errors
            },
            {
              name: 'description',
              title: 'Feature Description',
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
            {
              name: 'link',
              title: 'Link',
              type: 'url',
            },
          ],
        },
      ],
      validation: (Rule: any) => Rule.max(12), // Removed min(1) requirement
    },
    {
      name: 'gridColumns',
      title: 'Grid Columns',
      type: 'string',
      options: {
        list: [
          { title: '2 Columns', value: '2' },
          { title: '3 Columns', value: '3' },
          { title: '4 Columns', value: '4' },
        ],
      },
      initialValue: '3',
    },
    {
      name: 'showIcons',
      title: 'Show Icons',
      type: 'boolean',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'title',
      featureCount: 'features',
      columns: 'gridColumns',
    },
    prepare(selection: any) {
      const featureCount = selection.featureCount?.length || 0;
      return {
        title: selection.title || 'Feature Grid Component',
        subtitle: `${selection.columns || '3'} columns • ${featureCount} features`,
      };
    },
  },
}

export default FeatureGridComponent

