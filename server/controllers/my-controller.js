'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('wysiwyg')
      .service('myService')
      .getWelcomeMessage();
  },
};
