// /schemas/pages/homePage.js
import {defineType, defineField} from 'sanity'

export const aboutpage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
    }),
    defineField({
      name: 'sections',
      title: 'About Page Sections',
      type: 'aboutPageSections',
    }),
  ],
})
