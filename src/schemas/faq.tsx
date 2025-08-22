import { defineField, defineType } from 'sanity'
import showCountryFlag from '~/components/utils/common';
export default defineType({
  name: 'faq',
  title: 'Faq',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
    }),
    defineField({
        name: 'order',
        title: 'Faq Order',
        type: 'number',
      }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'string',
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
      title: 'question',
      language:'language',
    },
          prepare(selection) {
        return {
          title: ` ${selection?.title}`
        };
      },
  },
})
