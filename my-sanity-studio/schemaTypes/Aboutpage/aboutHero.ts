// aboutHero.js
import {defineType, defineField, defineArrayMember} from 'sanity'

export const aboutHero = defineType({
  name: 'aboutHero',
  title: 'About Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      options: {accept: 'video/*'},
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Optional: paste a Youtube/Vimeo URL if you prefer',
    }),

    defineField({
      name: 'videoThumbnail',
      title: 'Video Thumbnail',
      type: 'image',
      options: {hotspot: true},
      description: 'Optional: Image that will be shown before playing the video',
    }),

    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),

    defineField({
      name: 'title',
      title: 'Main Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),

    defineField({
      name: 'items',
      title: 'Mission & Vision Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'aboutItem',
          title: 'About Item',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Description',
              type: 'text',
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1).max(4).error('You must have between 1 and 4 items.'),
    }),
  ],
})
