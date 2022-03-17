'use strict';

module.exports = {
  async index(ctx) {
    ctx.send(await strapi.store({type: 'plugin', name: 'strapi-tiptap-editor', key: 'settings'}).get())
  },
  async updateSettings(ctx) {
    const defaultSettings = {
      headings: ['h1', 'h2', 'h3', 'h4', 'h4', 'h5', 'h6'],
      bold: true,
      italic: true,
      strikethrough: true,
      underline: true,
      align: ['left', 'center', 'right']
    }

    await strapi.store({type: 'plugin', name: 'strapi-tiptap-editor', key: 'settings'}).set({value: defaultSettings})
    ctx.send({res: 'ok'})
  },

};
