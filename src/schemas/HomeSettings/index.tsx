import { defineField, defineType } from 'sanity'
import showCountryFlag from '~/components/utils/common';
export default defineType({
  name: 'homeSettings',
  title: 'Home Settings',
  type: 'document',
  options: {
      // Additional options can be added here if needed
  },
  fields: [
    defineField({
      name: 'heroStripHeader',
      title: 'Hero Strip Section Header',
      type: 'string',
    }),
    defineField({
      name: 'heroStrip',
      title: 'Hero Strip',
      type: 'string',
    }),

    defineField({
      name: 'heroTitleStatic',
      title: 'Hero Title Static',
      type: 'string',
    }),

    defineField({
      name: 'heroTitleReferrer',
      title: 'Hero Title Referrer',
      type: 'internationalizedArrayString',
      description: '*This data will be shown when referred from carestack website'
    }),

    defineField({
      name: 'heroTitleStaticDynamic',
      title: 'Hero Title Dynamic',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    defineField({
      name: 'bookBtnContent',
      title: 'CTA Button',
      type: 'string',
    }),

    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'customBlockContent',
    }),
    
    // defineField({
    //   name: 'heroDescription2',
    //   title: 'Hero Description2',
    //   type: 'internationalizedArrayCustomBlockContent',
    // }),

    defineField({
      name: 'heroImage',
      title: 'Hero Section Image',
      type: 'image',
    }),

    defineField({
      name: 'heroStripDescription',
      title: 'Hero Strip Description Header',
      type: 'string',
    }),

    defineField({
      name: 'heroHeaderSection',
      title: 'Hero Header Button Content',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'headerMenu',
          title: 'Header Menu',
          fields: [
            {
              name: 'headerMenu',
              title: 'headerMenu',
              type: 'string',
            },
            {
              name: 'href',
              title: 'Hero href',
              type: 'string',
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'ctabutton',
      title: 'CTA Button Title',
      type: 'string',
    }),

    defineField({
      name: 'heroSubFeature',
      title: 'Hero SubFeature',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'heroSubFeature' }],
        },
      ],
    }),

    defineField({
      name: 'selectedTestimonial',
      title: 'Selected Testimonial',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'testimonial' }],
        },
      ],
    }),

    defineField({
      name: 'dmeoFormId',
      title: 'Demo Form Id',
      type: 'string',
      
    }),
    
    defineField({
      name: 'demoMeetingLink',
      title: 'Demo Meeting Link',
      type: 'string',
      
    }),
    
    defineField({
      name: 'dmeoFormEventName',
      title: 'Demo Form Event Name',
      type: 'string',
      
    }),

    defineField({
      name: 'canonical',
      title: 'Canonical',
      type: 'string',
      
    }),

    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
    }),
        
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description:'Support email'
      
    }),

    
    defineField({
      name: 'video',
      title: 'Overview Video',
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
              description: 'vimeo, vidyard and youtube',
              options: {
                list: [
                  { title: 'Vimeo', value: 'vimeo' },
                  { title: 'Vidyard', value: 'vidyard' },
                  { title: 'YouTube', value: 'youtube' }
                ],
                layout: 'dropdown'
              },
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
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'language',
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
