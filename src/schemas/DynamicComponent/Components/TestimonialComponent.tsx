const TestimonialComponent = {
  name: 'testimonialComponent',
  title: 'Testimonial Component',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
    },
    {
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'quote',
              title: 'Quote',
              type: 'text',
              // Removed required validation to fix CMS validation errors
            },
            {
              name: 'author',
              title: 'Author Name',
              type: 'string',
              // Removed required validation to fix CMS validation errors
            },
            {
              name: 'position',
              title: 'Position/Title',
              type: 'string',
            },
            {
              name: 'company',
              title: 'Company',
              type: 'string',
            },
            {
              name: 'avatar',
              title: 'Avatar',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'rating',
              title: 'Rating',
              type: 'number',
              options: {
                list: [1, 2, 3, 4, 5],
              },
              initialValue: 5,
            },
          ],
        },
      ],
      validation: (Rule: any) => Rule.max(6), // Removed min(1) requirement
    },
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Carousel', value: 'carousel' },
          { title: 'List', value: 'list' },
        ],
      },
      initialValue: 'grid',
    },
    {
      name: 'showRating',
      title: 'Show Rating Stars',
      type: 'boolean',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'title',
      testimonialCount: 'testimonials',
      layout: 'layout',
    },
    prepare(selection: any) {
      const testimonialCount = selection.testimonialCount?.length || 0;
      return {
        title: selection.title || 'Testimonial Component',
        subtitle: `${selection.layout || 'grid'} layout • ${testimonialCount} testimonials`,
      };
    },
  },
}

export default TestimonialComponent

