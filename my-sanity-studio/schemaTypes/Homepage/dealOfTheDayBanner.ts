import {defineField, defineType} from 'sanity'

export const dealOfTheDayBanner = defineType({
  name: 'dealOfTheDayBanner',
  title: 'Deal of the Day Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Banner Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'discount',
      title: 'Discount Label',
      type: 'string',
      description: 'e.g. -28%',
    }),
    defineField({
      name: 'label',
      title: 'Badge Label',
      type: 'string',
      description: 'e.g. Hot',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      initialValue: 'Deal of the Day',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      description: 'Internal route like /shop or /product/[slug]',
    }),
    defineField({
      name: 'countdownEndDate',
      title: 'Countdown End Date',
      type: 'datetime',
      //   validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Banner Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      //   validation: (rule) => rule.required(),
    }),
  ],
})
