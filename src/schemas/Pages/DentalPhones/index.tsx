import { createBasePageSchema } from '../basePageSchema'

const baseSchema = createBasePageSchema('dentalPhones', 'Dental Phones')

const DentalPhones = {
  ...baseSchema,
  fields: [
    ...baseSchema.fields,
  ],
}

export default DentalPhones
