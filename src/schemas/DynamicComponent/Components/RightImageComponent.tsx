const RightImageComponent = {
  name: 'rightImageComponent',
  title: 'Right Image Component',
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
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      // Removed required validation to fix CMS validation errors
    },
    {
      name: 'imageAlt',
      title: 'Image Alt Text',
      type: 'string',
    },
    {
      name: 'contentAlignment',
      title: 'Content Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Top', value: 'top' },
          { title: 'Center', value: 'center' },
          { title: 'Bottom', value: 'bottom' },
        ],
      },
      initialValue: 'center',
    },
    {
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Gray', value: 'gray' },
          { title: 'Blue', value: 'blue' },
          { title: 'Custom', value: 'custom' },
        ],
      },
      initialValue: 'white',
    },
  ],
  preview: {
    select: {
      title: 'title',
      image: 'image',
      alignment: 'contentAlignment',
    },
    prepare(selection: any) {
      return {
        title: selection.title || 'Right Image Component',
        subtitle: `${selection.alignment || 'center'} aligned`,
        media: selection.image,
      };
    },
  },
}

export default RightImageComponent

