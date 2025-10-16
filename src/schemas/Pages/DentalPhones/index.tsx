import { createBasePageSchema } from '../basePageSchema'

const baseSchema = createBasePageSchema('dentalPhones', 'Dental Phones')

const DentalPhones = {
  ...baseSchema,
  fields: [
    ...baseSchema.fields,
    {
      name: 'selectedIntegrations',
      title: 'Selected Integrations',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'integrationList' }],
          options: {
            disableNew: true,
          },
        },
      ],
      description: 'Select which integrations to display on this page',
      validation: (Rule: any) => Rule.max(12).error('Maximum 12 integrations allowed'),
    },
  ],
}

export default DentalPhones
