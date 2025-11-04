import { defineField, defineType } from 'sanity'
import showCountryFlag from '~/components/utils/common';
export default defineType({
  name: 'faqRevamp',
  title: 'Page Faqs',
  type: 'document',
  fields: [
    defineField({
        name: 'sectionName',
        title: 'Section Name',
        type: 'string',
      }),
      defineField({
        name: 'faqCategories',
        title: 'FAQ Categories',
        type: 'array',
        of: [
          {
            type: 'object',
            name: 'faqCategory',
            title: 'FAQ Category',
            fields: [
              defineField({
                name: 'categoryName',
                title: 'Category Name',
                type: 'string',
                validation: (Rule: any) => Rule.required(),
              }),
              defineField({
                name: 'questions',
                title: 'Questions & Answers',
                type: 'array',
                of: [
                  {
                    type: 'object',
                    name: 'faqItem',
                    title: 'FAQ Item',
                    fields: [
                      defineField({
                        name: 'question',
                        title: 'Question',
                        type: 'string',
                        validation: (Rule: any) => Rule.required(),
                      }),
                      defineField({
                        name: 'answer',
                        title: 'Answer',
                        type: 'customBlockContent',
                        validation: (Rule: any) => Rule.required(),
                      }),
                    ],
                    preview: {
                      select: {
                        title: 'question',
                      },
 
                    },
                  },
                ],
                
              }),
            ],
            preview: {
              select: {
                title: 'categoryName',
                questionCount: 'faqItem.length',
              },
              prepare(selection: any) {
                return {
                  title: selection?.title || 'Untitled Category',
                  // subtitle: `${selection?.questionCount || 0} questions`,
                }
              },
            },
          },
        ],
      }),
      defineField({
        name: 'hideCategory',
        title: 'Hide Category',
        type: 'boolean',
        initialValue: false,
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
