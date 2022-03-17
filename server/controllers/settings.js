'use strict';

const defaultSettings = {
  headings: ['h1', 'h2', 'h3', 'h4', 'h4', 'h5', 'h6'],
  bold: true,
  italic: true,
  strikethrough: true,
  underline: true,
  align: ['left', 'center', 'right']
}

module.exports = {
  async index(ctx) {
    const savedSettings = await strapi.store({type: 'plugin', name: 'strapi-tiptap-editor', key: 'settings'}).get()
    if (savedSettings !== null) {
      ctx.send(savedSettings)
    } else {
      ctx.send(defaultSettings)
    }
  },
  async updateSettings(ctx) {
    const newSettings = ctx.request.body
    await strapi.store({type: 'plugin', name: 'strapi-tiptap-editor', key: 'settings'}).set({value: newSettings})
    ctx.send({res: 'ok'})
  },

};
