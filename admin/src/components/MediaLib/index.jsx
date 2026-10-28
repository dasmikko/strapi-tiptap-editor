import React from 'react';
import { useStrapiApp } from '@strapi/strapi/admin';

const prefixFileUrlWithBackendUrl = (fileURL) =>
  !!fileURL && fileURL.startsWith('/') ? `${window.strapi.backendURL}${fileURL}` : fileURL;

const MediaLib = ({ isOpen = false, onChange = () => {}, onToggle = () => {} }) => {
    const components = useStrapiApp('MediaLib', state => state.components);
    const MediaLibraryDialog = components['media-library'];

    const handleSelectAssets = files => {
        const formattedFiles = files.map(f => ({
            ...f,
            alt: f.alternativeText || f.name,
            url: prefixFileUrlWithBackendUrl(f.url),
            mime: f.mime,
        }));

        onChange(formattedFiles);
    };

    if(!isOpen) {
        return null
    };

    return(
        <MediaLibraryDialog onClose={onToggle} onSelectAssets={handleSelectAssets} />
    );
};

export default MediaLib;
