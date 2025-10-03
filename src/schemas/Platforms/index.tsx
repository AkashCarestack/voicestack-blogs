import { defineField, defineType } from 'sanity'
import showCountryFlag from '~/components/utils/common';
export default defineType({
  name: 'platform',
  title: 'Platform',
  type: 'document',
  fields: [
    defineField({
      name: 'integrationHeading',
      title: 'Integration Heading',
      type: 'string',
    }),
    defineField({
      name: 'integrationSubHeading',
      title: 'Integration Sub Heading',
      type: 'string',
    }),
    defineField({
      name: 'integrationDescription',
      title: 'Integration Description',
      type: 'string',
    }),
    defineField({
      name: 'integrationSubHeadingRef',
      title: 'Integration Sub Heading Ref',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'integrationDescriptionRef',
      title: 'Integration Description Ref',
      type: 'internationalizedArrayString',
    }),

    defineField({
      name: 'integrationImage',
      title: 'Integration Image',
      type: 'image',
    }),
    defineField({
      name: 'bgVideoUrl',
      title: 'Bg Video Url',
      description: 'Upload video in sanity media and paste url here',
      type: 'url',
    }),
    defineField({
      name: 'bgVideoUrlMobile',
      title: 'Mobile Bg Video Url',
      description: 'Upload video in sanity media and paste url here',
      type: 'url',
    }),

    defineField({
      name: 'crm',
      title: 'CRM',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'platformList' }],
          options: {
            filter: 'defined(_id)',
          },
        },
      ],
    }),
    defineField({
      name: 'analytics',
      title: 'Analytics',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'platformList' }],
          options: {
            filter: 'defined(_id)',
          },
        },
      ],
    }),
    defineField({
      name: 'pms',
      title: 'PMS',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'platformList' }],
          options: {
            filter: 'defined(_id)',
          },
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
      title: 'integrationHeading',
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
