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
      title: 'Feature List',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'feature',
          title: 'Feature',
          fields: [
            {
              name: 'title',
              title: 'Feature Title',
              type: 'string',
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
          ],
        },
      ],
      description: 'Add features to display in the grid',
      validation: (Rule: any) => Rule.max(12),
    },
    {
      name: 'filterByCategory',
      title: 'Filter by Category',
      type: 'string',
      options: {
        list: [
          { title: 'All Categories', value: 'all' },
          { title: 'Communication', value: 'communication' },
          { title: 'Scheduling', value: 'scheduling' },
          { title: 'Analytics', value: 'analytics' },
          { title: 'Integration', value: 'integration' },
          { title: 'Automation', value: 'automation' },
          { title: 'Support', value: 'support' },
          { title: 'Security', value: 'security' },
          { title: 'Reporting', value: 'reporting' },
        ],
      },
      initialValue: 'all',
      description: 'Optionally filter features by category',
    },
    {
      name: 'sortBy',
      title: 'Sort Features By',
      type: 'string',
      options: {
        list: [
          { title: 'Priority (High to Low)', value: 'priority' },
          { title: 'Title A-Z', value: 'title' },
          { title: 'Category', value: 'category' },
        ],
      },
      initialValue: 'priority',
      description: 'How to sort the selected features',
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

