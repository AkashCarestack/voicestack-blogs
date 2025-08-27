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
      title: 'Content',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          name: 'mainContent',
          title: 'Main Content',
          type: 'array',
          of: [
            { type: 'block' },
            { type: 'image' },
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
