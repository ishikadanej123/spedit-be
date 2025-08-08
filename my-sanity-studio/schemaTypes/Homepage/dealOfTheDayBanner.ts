import {defineField, defineType} from 'sanity'

export const dealOfTheDayBanner = defineType({
  name: 'dealOfTheDayBanner',
  title: 'Deal of the Day Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Deal of the Day',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Button Link',
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
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      //   validation: (rule) => rule.required(),
    }),
  ],
})
