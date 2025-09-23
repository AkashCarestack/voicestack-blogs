import { defineField, defineType } from 'sanity'
import showCountryFlag from '~/components/utils/common';
export default defineType({
  name: 'faqRevamp',
  title: 'Faq',
  type: 'document',
  fields: [
    defineField({
        name: 'sectionName',
        title: 'Section Name',
        type: 'string',
      }),
      defineField({
        name: 'faqItems',
        title: 'FAQ Items',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'question',
                title: 'Question',
                type: 'string',
              },
              {
                name: 'answer',
                title: 'Answer',
                type: 'customBlockContent',
              },
            ],
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
      title: 'sectionName',
      language:'language',
    },
    prepare(selection) {
      return {
        title: ` ${selection?.title}`,
        media: <img src={showCountryFlag(selection?.language)}/>
      };
    },
  },
})
