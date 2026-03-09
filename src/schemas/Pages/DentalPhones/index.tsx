import { createBasePageSchema } from '../basePageSchema'

const baseSchema = createBasePageSchema('dentalPhones', 'Phone System')

const DentalPhones = {
  ...baseSchema,
  fields: [
    ...baseSchema.fields,
  ],
}

export default DentalPhones
