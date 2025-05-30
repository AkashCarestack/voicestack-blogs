import { defineField, defineType } from 'sanity'
import showCountryFlag from '~/components/utils/common';
export default defineType({
  name: 'logoListing',
  title: 'Logo Listing',
  type: 'document',
  fields: [
    defineField({
      name: 'logoSectionHeader',
      title: 'Logo Section Header',
      type: 'string',
    }),
    defineField({
      name: 'logoSectionHeaderDescptn',
      title: 'Logo Section Description',
      type: 'string',
    }),
    defineField({
      name: 'logoSectionHeaderRef',
      title: 'Logo Section Header Ref',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'logoSectionHeaderDescRef',
      title: 'Logo Section Description Ref',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'logo',
      title: 'Choose Logo',
      type:'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'platformList' }],
        },
      ],
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type:'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'testimonialSection' }],
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
    title: 'logoSectionHeader',
    language:'language',
  },
  prepare(selection) {
    return {
      title: ` ${selection?.title}`,
      media:<img src={showCountryFlag(selection?.language)}/>
    };
  },
},
   
})
