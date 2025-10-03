import { defineField, defineType } from 'sanity';
import showCountryFlag from '~/components/utils/common';



export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'testimonialheading',
      title: 'Feature Heading',
      type: 'string',
    }),
    defineField({
      name: 'testimonialOrder',
      title: 'Feature Order',
      type: 'number',
    }),
    defineField({
      name: 'testimonialSubheading',
      title: 'Feature Sub Heading',
      type: 'string',
    }),
    defineField({
      name: 'testimonialDescription',
      title: 'Feature Description',
      type: 'text',
    }),
    defineField({
      name: 'testimonialIcon',
      title: 'Feature Icon',
      type: 'image',
    }),
    defineField({
      name: 'testimonialImage',
      title: 'Feature Image',
      type: 'image',
    }),
    defineField({
      name: 'testimonialChip',
      title: 'Feature Chip',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'testimonialSubSection',
      title: 'Feature Sub Section',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'featureSubSection' }],
          options: {
            filter: 'defined(_id)',
          },
        },
      ],
    }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'testimonialheading',
      language:'language',
    },
    prepare(selection) {
      return {
        title: ` ${selection?.title}`,
        media:<img src={showCountryFlag(selection?.language)}/>
      };
    },
  },
});
