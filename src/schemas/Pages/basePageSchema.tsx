import showCountryFlag from "~/components/utils/common"

export const createBasePageSchema = (name: string, title: string) => ({
  name,
  title,
  type: 'document',
  // This ensures the page works with document internationalization
  i18n: {
    base: 'en',
    languages: ['en', 'en-GB', 'en-AU'],
    fieldNames: {
      lang: 'language'
    }
  },
  fields: [
    {
      name: 'basicInfo',
      title: 'Basic Information',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'slug',
          title: 'Slug',
          type: 'slug',
          options: {
            source: 'basicInfo.title',
            maxLength: 96,
          },
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'description',
          title: 'Description',
          type: title === 'Company Page' ? 'blockContent' : 'text',
        },
        {
          name: 'icon',
          title: 'Icon',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'breadCrumb',
          title: 'Breadcrumb Override',
          type: 'string',
          description: 'Optional comma-separated breadcrumb items (e.g., "Who We Serve, Groups & DSOs"). If empty, breadcrumb will be generated from URL.',
        },
      ],
    },
    {
      name: 'content',
      title: 'Page Content',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          name: 'sections',
          title: 'Content Sections',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'contentSection',
              title: 'Content Section',
              fields: [
                {
                  name: 'title',
                  title: 'Section Title',
                  type: 'string',
                  description: 'Optional title for this section (will be shown in CMS)',
                },
                {
                  name: 'slug',
                  title: 'Section Slug',
                  type: 'slug',
                  options: {
                    maxLength: 96,
                  },
                  description: 'Unique slug for this section (enter manually)',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'component',
                  title: 'Component',
                  type: 'dynamicComponent',
                  validation: (Rule: any) => Rule.required(),
                },
              ],
              preview: {
                select: {
                  title: 'title',
                  slug: 'slug.current',
                  componentType: 'component.componentType',
                  tabsTitle: 'component.tabsListingComponent.headline',
                  customTitle: 'component.customComponent.title',
                },
                prepare(selection: any) {
                  const { title, slug, componentType, tabsTitle, customTitle } = selection;
                  
                  let displayTitle = title || 'Untitled Section';
                  let subtitle = componentType || 'No Component';
                  
                  // Get the actual title from the selected component
                  if (componentType === 'TabsListing' && tabsTitle) {
                    subtitle = tabsTitle;
                  } else if (componentType === 'Custom' && customTitle) {
                    subtitle = customTitle;
                  }
                  
                  return {
                    title: displayTitle,
                    subtitle: `${subtitle}${slug ? ` • /${slug}` : ''}`,
                  };
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'seo',
      title: 'SEO & Meta',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Title for SEO purposes',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          description: 'Description for SEO purposes',
        },
      ],
    },
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      hidden: true,
      initialValue: 'en',
      validation: (Rule: any) => Rule.required(),
      description: 'Language is automatically set by the i18n plugin'
    },
    {
      name:'faqReferenced',
      title: 'FAQ',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{type: 'faqRevamp'}],
        options: {
          filter: ({ document, parent }) => {
            const currentLanguage = document?.language || 'en';
            const selectedIds = (parent || [])
              .map((item: any) => item?._ref)
              .filter(Boolean);
            if (selectedIds.length >= 1) {
              return {
                filter: 'false', // disables all options
                params: {}
              }
            }

            return {
              filter: `language == $language && _id != $id`,
              params: { 
                language: currentLanguage, 
                id: document._id
              }
            }
          }
        },

      }],
    
    }
  ],
  preview: {
    select: {
      title: 'basicInfo.title',
      description: 'basicInfo.description',
      icon: 'basicInfo.icon',
      slug: 'basicInfo.slug.current',
      language: 'language'
    },
    prepare(selection) {
      const languageLabel = selection?.language === 'en' ? '🇺🇸' : 
                           selection?.language === 'en-GB' ? '🇬🇧' : 
                           selection?.language === 'en-AU' ? '🇦🇺' : 
                           '🌐';
      
      return {
        title: `${selection?.title}`,
        subtitle: `${selection?.description || 'No description'} • /${selection?.slug?.current || ''}`,
        media: selection?.language ? <img src={showCountryFlag(selection?.language)} /> : selection?.icon
      };
    },
  },
})
