import { useFetchClient } from '@strapi/strapi/admin';

// Create wrapper functions that work with the new fetch client
let fetchClient = null;

export function initFetchClient(client) {
  fetchClient = client;
}

export async function getSettings() {
  if (!fetchClient) {
    throw new Error('Fetch client not initialized');
  }
  const { get } = fetchClient;
  const response = await get('/strapi-tiptap-editor/');
  return response.data;
}

export async function updateSettings(settings) {
  if (!fetchClient) {
    throw new Error('Fetch client not initialized');
  }
  const { put } = fetchClient;
  const response = await put('/strapi-tiptap-editor/update-settings', settings);
  return response.data;
}
