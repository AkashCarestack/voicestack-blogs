import { defineField, defineType } from 'sanity'
import showCountryFlag from '~/components/utils/common';
export default defineType({
  name: 'partnerListing',
  title: 'Partner Listing',
  type: 'document',
  fields: [
    defineField({
      name: 'logoSectionHeader',
      title: 'Logo Section Header',
      type: 'string',
    }),

    defineField({
      name: 'logo',
      title: 'Choose Logo',
      type:'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'platformList' }],
        }
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

