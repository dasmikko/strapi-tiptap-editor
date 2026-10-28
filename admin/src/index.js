import Wysiwyg from './components/Wysiwyg';
import { PLUGIN_ID } from './pluginId';
import { getTranslation } from './utils/getTranslation';

export default {
  register(app) {
    app.addSettingsLink(
      { id: PLUGIN_ID, intlLabel: { id: getTranslation('plugin.name'), defaultMessage: 'Strapi TipTap Editor' } }, // Section to create
      {
        intlLabel: { id: getTranslation('settings.link'), defaultMessage: 'Settings' },
        id: 'Settings',
        to: PLUGIN_ID,
        Component: () => import('./pages/Settings'),
        permissions: [],
      }
    );

    // Replace the built-in rich text (markdown) editor
    app.addFields({ type: 'richtext', Component: Wysiwyg });

    app.registerPlugin({
      id: PLUGIN_ID,
      isReady: true,
      name: PLUGIN_ID,
    });
  },

  bootstrap() {},

  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          const newData = {};
          for (const key of Object.keys(data)) {
            newData[getTranslation(key)] = data[key];
          }

          return { data: newData, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
