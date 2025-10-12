import pluginPkg from "../../package.json";
import Wysiwyg from "./components/Wysiwyg";
import pluginId from "./pluginId";

const name = pluginPkg.strapi.name;

const myComponent = async () => {
  const component = await import(
    /* webpackChunkName: "strapi-tiptip-editor-settings-page" */ './pages/App'
    );

  return component;
};

export default {
  register(app) {
    app.createSettingSection(
      { id: 'strapi-tiptap-editor', intlLabel: { id: 'my-plugin.plugin.name', defaultMessage: 'Strapi TipTap Editor' } }, // Section to create
      [
        // links
        {
          intlLabel: { id: 'my-plugin.plugin.name', defaultMessage: 'Settings' },
          id: 'Settings',
          to: '/settings/strapi-tiptap-editor',
          Component: myComponent,
          permissions: [],
        },
      ]
    );

    // Register custom field for wysiwyg in Strapi v5
    app.customFields.register({
      name: 'wysiwyg',
      pluginId: pluginId,
      type: 'richtext',
      intlLabel: {
        id: 'strapi-tiptap-editor.label',
        defaultMessage: 'Rich Text (TipTap)',
      },
      intlDescription: {
        id: 'strapi-tiptap-editor.description',
        defaultMessage: 'A rich text editor powered by TipTap',
      },
      components: {
        Input: async () => ({
          default: Wysiwyg,
        }),
      },
    });

    app.registerPlugin({
      id: pluginId,
      isReady: true,
      name,
    });
  },
  bootstrap() {},
};
