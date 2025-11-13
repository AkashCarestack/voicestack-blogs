import { defineField, defineType } from 'sanity'
import showCountryFlag from '~/components/utils/common';
export default defineType({
  name: 'miscellaneous',
  title: 'Miscellaneous',
  type: 'document',
  fields: [
    defineField({
      name: 'heroSectionHeader',
      title: 'Hero Section Header',
      type: 'string',
    }),
    defineField({
      name: 'heroSectionSlug',
      title: 'Hero Section Slug',
      type: 'slug',
      options: {
        source: 'heroSectionHeader',
      },
    }),
    defineField({
      name: 'heroSectionHeading',
      title: 'Hero Section Heading',
      type: 'string',
    }),
    defineField({
      name: 'heroSectionHeadingDesc',
      title: 'Hero Section Description',
      type: 'string',
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
        title: 'heroSectionHeader',
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
