export default {
  name: 'testimonialCard',
  title: 'Testimonial Card',
  type: 'object',
  fields: [
    {
      name: 'testimonial',
      title: 'Testimonial',
      type: 'reference',
      to: [{ type: 'testimonial' }],
      validation: (Rule) => Rule.required().error('A testimonial is required'),
    },
  ],
  preview: {
    select: {
      title: 'testimonialTitle',
      authors: 'author',
    },
    prepare(selection) {
      const { title, authors } = selection
      return {
        title: title || 'Untitled Testimonial',
        subtitle:
          authors && authors.length > 0
            ? `by ${authors.length} author${authors.length > 1 ? 's' : ''}`
            : 'No authors selected',
      }
    },
  },
}
