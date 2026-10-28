import { useEffect, useState } from 'react';
import { getSettings } from './api';
import { mergeDeep } from './merge';
import defaultSettings from '../../../utils/defaults';

// Merge saved settings with default values, in case new ones are added
export const withDefaults = (savedSettings) => mergeDeep(structuredClone(defaultSettings), savedSettings);

export function useSettings () {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getSettings()
      .catch(err => {
        // Keep the editor usable with the default settings
        console.error('[strapi-tiptap-editor] Could not load settings', err);
        return {};
      })
      .then(saved => { if (!cancelled) setSettings(withDefaults(saved)); });
    return () => { cancelled = true; };
  }, []);

  return { settings, isLoading: settings === null };
}
