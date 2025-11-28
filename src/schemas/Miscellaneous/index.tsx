import { defineField, defineType } from 'sanity'
import showCountryFlag from '~/components/utils/common';
export default defineType({
  name: 'miscellaneous',
  title: 'Miscellaneous',
  type: 'document',
  fields: [
    defineField({
      name: 'heroStrip',
      title: 'Hero Section Header',
      type: 'string',
    }),
    defineField({
      name: 'heroSectionSlug',
      title: 'Hero Section Slug',
      type: 'slug',
      options: {
        source: 'heroStrip',
      },
    }),
    defineField({
      name: 'heroheading',
      title: 'Hero Section Heading',
      type: 'customBlockContent',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Section Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'bookBtnContent',
      title: 'CTA Button',
      type: 'array',
      of: [{ type: 'button' }],
    }),
    defineField({
      name: 'contentArea',
      title: 'Content Area',
      type: 'customContentNew',
    }),
    {
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
      
    }
],
preview: {
      select: {
        title: 'heroStrip',
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
