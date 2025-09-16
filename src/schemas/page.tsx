import { SlugValidationContext } from "sanity";
import showCountryFlag from "~/components/utils/common";
import { isUniqueAcrossAllDocuments, isUniqueOtherThanLanguage } from "~/lib/sanity";
import { apiVersion } from "~/lib/sanity.api";

export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  // This ensures the page works with document internationalization
  i18n: true,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      // validation: (Rule) => Rule.required(),
      // options: {
      //   source: 'title', 
      //   isUnique: isUniqueAcrossAllDocuments
      // }
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: isUniqueOtherThanLanguage
      }
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block'
        },
        // Add any other content types you need
      ]
    },
    {
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
      
    }
  ],
  preview: {
      select: {
        title: 'title',
        language:'language',
      },
      prepare(selection) {
        const languageLabel = selection?.language === 'en' ? '🇺🇸' : 
                             selection?.language === 'en-GB' ? '🇬🇧' : 
                             selection?.language === 'en-AU' ? '🇦🇺' : 
                             '📄';
        
        return {
          title: `${languageLabel} ${selection?.title}`
        };
      },
    },
}

