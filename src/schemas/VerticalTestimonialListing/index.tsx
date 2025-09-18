import { defineField, defineType } from 'sanity'
import showCountryFlag from '~/components/utils/common';
export default defineType({
  name: 'verticalTestimonialListing',
  title: 'Vertical Testimonial Listing',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      description: 'Select testimonials that match the current document language',
      type:'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'testimonialSection' }],
          options: {
            filter: ({ document }) => {
              // Filter testimonials based on the current document's language
              const currentLanguage = document?.language || 'en'
              
              // Handle different language scenarios
              // if (currentLanguage === 'en') {
              //   // For US English, also include default language testimonials
              //   return {
              //     filter: `language == "en" || language == "default"`,
              //     params: { language: currentLanguage }
              //   }
              // } else {
                // For other languages, only show testimonials in that specific language
                return {
                  filter: `language == "${currentLanguage}"`,
                  params: { language: currentLanguage }
                }
              //  }
            }
          }
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
    title: 'heading',
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
