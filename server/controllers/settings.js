'use strict';

module.exports = {
  async index(ctx) {
    ctx.send(await strapi.store({type: 'plugin', name: 'strapi-tiptap-editor', key: 'settings'}).get())
  },
  async updateSettings(ctx) {
    await strapi.store({type: 'plugin', name: 'strapi-tiptap-editor', key: 'settings'}).set({value: {settings: 'default value'}})
    ctx.send({res: 'ok'})
  },

};
