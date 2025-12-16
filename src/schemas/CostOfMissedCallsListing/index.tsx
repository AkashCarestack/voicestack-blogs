
import { defineField, defineType } from 'sanity'
import showCountryFlag from '~/components/utils/common';
import { listingItemSchema, ctaListItemSchema, sectionHeadingDynamicSchema } from '~/schemas/Common/commonSchema'

export default defineType({
  name: 'costOfMissedCallsListing',
  title: 'Cost of Missed Calls',
  type: 'document',
  fields: [
    sectionHeadingDynamicSchema,
    defineField({
      name: 'description',
      title: 'Section Description',
      type: 'text',
    }),
    defineField({
      name: 'items',
      title: 'Listing Items',
      type: 'array',
      of: [listingItemSchema],
    }),
    defineField({
      name: 'ctaListItems',
      title: 'Call to Action List',
      type: 'array',
      of: [ctaListItemSchema],
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
      title: 'heading',
      language: 'language',
      itemCount: 'items',
    },
    prepare(selection) {
      const itemCount = selection.itemCount?.length || 0;
      return {
        title: selection?.title || 'Cost of Missed Calls',
        subtitle: `${itemCount} items`,
        media: <img src={showCountryFlag(selection?.language)}/>
      };
    },
  },
})

