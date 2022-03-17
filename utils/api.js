import {request} from '@strapi/helper-plugin';

export function getSettings () {
  return request('/strapi-tiptap-editor/')
}

export function updateSettings (settings) {
  return request('/strapi-tiptap-editor/update-settings', {method: 'PUT', body: settings })
}
