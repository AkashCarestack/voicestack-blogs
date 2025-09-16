import showCountryFlag from "~/components/utils/common"

const WhoWeServe = {
  name: 'whoWeServe',
  title: 'Who We Serve',
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
          type: 'text',
        },
        {
          name: 'icon',
          title: 'Icon',
          type: 'image',
          options: {
            hotspot: true,
          },
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
                  componentTitle: 'component.listingComponent.title',
                  rightImageTitle: 'component.rightImageComponent.title',
                  featureGridTitle: 'component.featureGridComponent.title',
                  testimonialTitle: 'component.testimonialComponent.title',
                },
                prepare(selection: any) {
                  const { title, slug, componentType, componentTitle, rightImageTitle, featureGridTitle, testimonialTitle } = selection;
                  
                  let displayTitle = title || 'Untitled Section';
                  let subtitle = componentType || 'No Component';
                  
                  // Get the actual title from the selected component
                  if (componentType === 'listingComponent' && componentTitle) {
                    subtitle = componentTitle;
                  } else if (componentType === 'rightImageComponent' && rightImageTitle) {
                    subtitle = rightImageTitle;
                  } else if (componentType === 'featureGridComponent' && featureGridTitle) {
                    subtitle = featureGridTitle;
                  } else if (componentType === 'testimonialComponent' && testimonialTitle) {
                    subtitle = testimonialTitle;
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
}

export default WhoWeServe
