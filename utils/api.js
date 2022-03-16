import {request} from '@strapi/helper-plugin';

export function getSettings () {
  return request('/strapi-tiptap-editor/')
}

export function updateSettings () {
  return request('/strapi-tiptap-editor/update-settings', {method: 'PUT'})
}
