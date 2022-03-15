'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('strapi-tiptap-editor')
      .service('myService')
      .getWelcomeMessage();
  },
};
