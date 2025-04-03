import { defineField, defineType } from 'sanity'
import { isUniqueOtherThanLanguage } from '~/lib/sanity'
import { seoFields } from '../Heroes'
export default defineType({
  name: 'featureList',
  title: 'Feature List',
  type: 'document',
  groups: [
    {
      name: 'basic',
      title: 'Basic',
      default: true,
    }, 
    {
      name: 'featureDetailed',
      title: 'Feature Detailed Section',
    },
    {
      name: 'featureBenefits',
      title: 'Feature Benefits Section',
    },
    {
      name: 'relatedFeature',
      title: 'Related Features Section',
    },
    {
      name: 'faqSection',
      title: 'FAQ Section',
    },
    {
      name: 'seo',
      title: 'Seo',
    },
    {
      name: 'preference',
      title: 'Preference',
    },
  ],

  fields: [
    defineField({
      name: 'name',
      title: 'Feature Name',
      group: 'basic',
      type: 'string',
    }),
    defineField({
      name: 'isLink',
      title: 'Is Link',
      description: 'Enable for external link',
      group: 'basic',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'contentType',
      title: 'Content Type',
      description: 'This is used in sitemap and for internal reference',
      validation: (Rule) => Rule.required(),
      group: 'basic',
      type: 'string',
    }),
    {
      name: 'slug',
      title: 'Page Path',
      group: 'basic',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        maxLength: 96,
        isUnique: isUniqueOtherThanLanguage
      },
    },

    defineField({
      name: 'heading',
      title: 'Feature Heading',
      group: 'basic',
      type: 'portableContent',
    }),
    defineField({
      name: 'description',
      title: 'Feature Description',
      group: 'basic',
      type: 'portableContent',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Feature Short Description',
      type: 'portableContent',
      group: 'basic',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      group: 'basic',
    }),
    defineField({
      name: 'secondaryImage',
      title: 'Secondary Image',
      type: 'image',
      group: 'basic',
    }),
    defineField({
      name: 'featureCategory',
      title: 'featureCategory',
      type: 'reference',
      group: 'basic',
      to: [{ type: 'featureCategory' }],
      options: {
        filter: ({ document }) => ({
          filter: '_type == "featureCategory" && language == $language',
          params: { language: document.language }, 
        }),
      }
    }),
    defineField({
      name: "heroTheme",
      title: "Hero Theme",
      type: "string",
      group: 'basic',
      options: {
        list: [
          { title: "Blue", value: "blue" },
          { title: "Pink", value: "pink" },
        ]
      },
      initialValue: "1" 
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      group: 'basic',
    }),
    defineField({
      name: 'featureSubSection',
      title: 'Feature Sub Section',
      type: 'array',
      group: 'featureDetailed',
      of: [
        {
          type: 'reference',
          to: [{ type: 'listingAtom' }],
        },
      ],
    }),
    defineField({
      name: 'featureBenefitsSection',
      title: 'Feature Benefits Section',
      type: 'reference',
      group: 'featureBenefits',
      to: [{ type: 'listingAtom' }],
    }),

    defineField({
      name: 'relatedFeaturesSection',
      title: 'Related Features Section',
      type: 'array',
      group: 'relatedFeature',
      of: [
        {
          type: 'reference',
          to: [{ type: 'featureList' }],
          options: {
            filter: ({ document }) => ({
              filter: '_type == "featureList" && language == $language',
              params: { language: document.language }, 
            }),
            disableNew: true,
          },
        },
      ],
    }),
    {
      name: 'hideChildPage',
      title: 'Hide Child Page',
      description: 'Hide Child Page from sitemap',
      type: 'boolean',
      group: 'preference',
    },
    defineField({
      name: 'featureFAQSection',
      title: 'FAQ Section',
      type: 'array',
      group: 'faqSection',
      of: [
        {
          type: 'reference',
          to: [{ type: 'faq' }],
          options: {
            filter: ({ document }) => ({
              filter: '_type == "faq" && language == $language',
              params: { language: document.language }, 
            }),
            disableNew: true,
          },
        },
      ],
    }),
    ...seoFields,
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      lang: 'language',
      media: 'mainImage',
    },
    prepare(selection) {
      const { lang, title } = selection
      return { ...selection, subtitle: lang && `${lang}` }
    },
      },
})
