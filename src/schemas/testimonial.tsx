import { defineField, defineType } from 'sanity'
import showCountryFlag from '~/components/utils/common';

export default defineType({
  name: 'testimonialSection',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Testimonial Order',
      type: 'number',
    }),
    defineField({
      name: 'designation',
      title: 'Designation',
      type: 'string',
    }),
    defineField({
      name: 'place',
      title: 'Place',
      type: 'string',
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
    }),
    defineField({
      name: 'locations',
      title: 'Location Number',
      type: 'number',
    }),
    defineField({
      name: 'logo',
      title: 'Logo(colored logo)',
      type: 'image',
    }),
    defineField({
      name: 'secondaryLogo',
      title: 'Secondary Logo(white logo)',
      type: 'image',
    }),
    defineField({
      name: 'practiceName',
      title: 'Practice Name',
      type: 'string',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'string',
    }),
    defineField({
      name: 'video',
      title: 'Video(vertical video)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'videoDetails',
          title: 'Video Details',
          fields: [
            {
              name: 'videoPlatform',
              title: 'Video Platform',
              type: 'string',
            },
            {
              name: 'videoId',
              title: 'Video Id',
              type: 'string',
            },
            {
              name: 'videotitle',
              title: 'Video Title',
              type: 'string',
            },
          ],
        },
      ],
    }),
     defineField({
      name: 'secondaryVideo',
      title: 'Secondary Video(horizontal video)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'videoDetails',
          title: 'Video Details',
          fields: [
            {
              name: 'videoPlatform',
              title: 'Video Platform',
              type: 'string',
            },
            {
              name: 'videoId',
              title: 'Video Id',
              type: 'string',
            },
            {
              name: 'videotitle',
              title: 'Video Title',
              type: 'string',
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'testimonialImage',
      title: 'Testimonial Image',
      type: 'image',
    }),

    defineField({
      name: 'listItems',
      title: 'List Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'listItem',
          title: 'List Item',
          fields: [
            {
              name: 'listHeading',
              title: 'List Heading',
              type: 'string',
            },
            {
              name: 'before',
              title: 'Before',
              type: 'string',
            },
            {
              name: 'after',
              title: 'After',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'string',
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'testimonialheading',
      title: 'Testimonial Heading',
      type: 'string',
    }),
    defineField({
      name: 'testimonialdescription',
      title: 'Testimonial Description',
      type: 'text',
    }),
    defineField({
      name: 'keyStatement',
      title: 'Key Statement',
      type: 'blockContent',
    }),
    defineField({
      name: 'keyFeatures',
      title: 'key Features',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'mainStatement',
      title: 'Main Statement(review text)',
      type: 'blockContent',
    }),
    defineField({
      name: 'subStatement',
      title: 'Sub Statement(review text)',
      type: 'blockContent',
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
      title: 'name',
      media: 'testimonialImage',
      language:'language'
    },
    prepare(selection) {
        return {
          title: ` ${selection?.title}`,
          media:<img src={showCountryFlag(selection?.language)}/>
        };
      },
  },
})
