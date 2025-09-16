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
      title: 'Select Testimonials',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'testimonialSection' }],
        },
      ],
      description: 'Select testimonials from the centralized testimonial collection',
      validation: (Rule: any) => Rule.max(6),
    },
    {
      name: 'filterByCategory',
      title: 'Filter by Category',
      type: 'string',
      options: {
        list: [
          { title: 'All Categories', value: 'all' },
          { title: 'General Practice', value: 'general-practice' },
          { title: 'Orthodontics', value: 'orthodontics' },
          { title: 'Oral Surgery', value: 'oral-surgery' },
          { title: 'Pediatric Dentistry', value: 'pediatric' },
          { title: 'Endodontics', value: 'endodontics' },
          { title: 'Periodontics', value: 'periodontics' },
          { title: 'Multi-Location', value: 'multi-location' },
          { title: 'DSO', value: 'dso' },
        ],
      },
      initialValue: 'all',
      description: 'Optionally filter testimonials by category',
    },
    {
      name: 'featuredOnly',
      title: 'Show Featured Only',
      type: 'boolean',
      initialValue: false,
      description: 'Only show testimonials marked as featured',
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

