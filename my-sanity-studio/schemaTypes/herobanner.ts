import {defineType, defineField} from 'sanity'

export const heroBanner = defineType({
  name: 'heroBanner',
  title: 'Hero Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label (e.g. Hot, New)',
      type: 'string',
    }),
    defineField({
      name: 'discount',
      title: 'Discount (e.g. -28%)',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Main Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Link URL',
      type: 'url',
    }),
    defineField({
      name: 'mainImages',
      title: 'Main Images',
      type: 'array',
      of: [{type: 'image'}],
      options: {
        layout: 'grid',
      },
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Optional (hex code or Tailwind class name)',
    }),
  ],
})
