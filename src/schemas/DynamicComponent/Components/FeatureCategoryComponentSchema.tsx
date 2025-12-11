const FeatureCategoryComponentSchema = {
  name: 'featureCategoryComponent',
  title: 'Feature Category Component',
  type: 'object',
  fields: [
    {
      name: 'globalData',
      title: 'Global Data (optional)',
      type: 'reference',
      to: [{ type: 'globalData' }],
      options: {
        filter: 'defined(_id)',
      },
    },
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
  ],
}

export default FeatureCategoryComponentSchema
