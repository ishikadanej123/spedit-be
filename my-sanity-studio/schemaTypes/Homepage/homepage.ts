// /schemas/pages/homePage.js
import {defineType, defineField} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
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
      title: 'Page Sections',
      type: 'pageSections',
    }),
  ],
})
