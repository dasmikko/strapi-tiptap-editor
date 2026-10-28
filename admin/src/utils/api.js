import { getFetchClient } from '@strapi/strapi/admin';
import { PLUGIN_ID } from '../pluginId';

// Shared between every editor instance on a page, so the settings are only fetched once
let settingsRequest = null;

export function getSettings () {
  if (!settingsRequest) {
    settingsRequest = getFetchClient()
      .get(`/${PLUGIN_ID}/`)
      .then(res => res.data)
      .catch(err => {
        settingsRequest = null;
        throw err;
      });
  }
  return settingsRequest;
}

export async function updateSettings (settings) {
  const res = await getFetchClient().put(`/${PLUGIN_ID}/update-settings`, settings);
  settingsRequest = null;
  return res.data;
}
