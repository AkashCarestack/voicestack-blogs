import { SlugValidationContext } from "sanity";
import showCountryFlag from "~/components/utils/common";
import { isUniqueAcrossAllDocuments, isUniqueOtherThanLanguage } from "~/lib/sanity";
import { apiVersion } from "~/lib/sanity.api";

export default {
  name: 'banner',
  title: 'Banner',
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
      name: 'description',
      title: 'Description',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone Primary',
      type: 'string'
    },
    {
      name: 'phoneSecondary',
      title: 'Phone Secondary',
      type: 'string'
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string'
    },
    {
      name: 'salesEmail',
      title: 'Sales Email',
      type: 'string'
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
        return {
          title: ` ${selection?.title}`,
  
        };
      },
    },
}

