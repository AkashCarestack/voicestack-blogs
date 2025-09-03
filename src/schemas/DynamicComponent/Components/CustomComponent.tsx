const CustomComponent = {
  name: 'customComponent',
  title: 'Custom Component',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'text',
      rows: 4,
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
    },
    {
      name: 'buttonLink',
      title: 'Button Link',
      type: 'url',
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
          { title: 'Green', value: 'green' },
        ],
      },
      initialValue: 'white',
    },
    {
      name: 'image',
      title: 'Optional Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'image',
    },
    prepare(selection: any) {
      return {
        title: selection.title || 'Custom Component',
        subtitle: selection.subtitle || 'Custom component section',
        media: selection.media,
      };
    },
  },
};

export default CustomComponent;
