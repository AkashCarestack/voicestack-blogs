export default {
  name: 'asideBannerBlock',
  title: 'Aside Banner Block',
  type: 'object',
  fields: [
    {
      name: 'statOne',
      title: 'First Statistic',
      type: 'string',
      description: 'The first statistic percentage, e.g. 40%',
      initialValue: '40%',
    },
    {
      name: 'descriptionOne',
      title: 'First Description',
      type: 'text',
      description: 'A brief description for the first statistic',
      initialValue: 'Reduction in accounts receivable days from 20 days to 12.',
    },
    {
      name: 'statTwo',
      title: 'Second Statistic',
      type: 'string',
      description: 'The second statistic percentage, e.g. Less than 10%',
      initialValue: 'Less than 10%',
    },
    {
      name: 'descriptionTwo',
      title: 'Second Description',
      type: 'text',
      description: 'A brief description for the second statistic',
      initialValue:
        'Avg Broken Appt Rates, going as low as 2% (Against National Average of 18%)',
    },
    {
      name: 'statThree',
      title: 'Third Statistic',
      type: 'string',
      description: 'The third statistic label, e.g. #1',
      initialValue: '#1',
    },
    {
      name: 'descriptionThree',
      title: 'Third Description',
      type: 'text',
      description: 'A brief description for the third statistic',
      initialValue:
        'Central Billing Team to manage claims and payments at all offices',
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Text for the call-to-action button',
      initialValue: 'Book Free Demo',
    },
  ],
  preview: {
    select: {
      title: 'statOne',
      subtitle: 'descriptionOne',
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title,
        subtitle: subtitle,
      }
    },
  },
}
