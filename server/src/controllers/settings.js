import defaultSettings from '../../../utils/defaults';

const getStore = (strapi) => strapi.store({ type: 'plugin', name: 'strapi-tiptap-editor', key: 'settings' });

export default ({ strapi }) => ({
  async index(ctx) {
    const savedSettings = await getStore(strapi).get();
    if (savedSettings !== null) {
      ctx.send(savedSettings);
    } else {
      ctx.send(defaultSettings);
    }
  },
  async updateSettings(ctx) {
    const newSettings = ctx.request.body;
    await getStore(strapi).set({ value: newSettings });
    ctx.send({ res: 'ok' });
  },
});
