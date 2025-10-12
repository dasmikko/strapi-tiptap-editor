import React from 'react';
import { useStrapiApp } from '@strapi/strapi/admin';
import PropTypes from 'prop-types';

const MediaLib = ({ isOpen, onChange, onToggle }) => {
    const components = useStrapiApp('MediaLib', (state) => state.components);
    const MediaLibraryDialog = components?.['media-library'];

    const handleSelectAssets = files => {
        const formattedFiles = files.map(f => {
            // Construct full URL from backend
            const baseUrl = window.strapi?.backendURL || '';
            const url = f.url?.startsWith('http') ? f.url : `${baseUrl}${f.url}`;

            return {
                ...f,
                alt: f.alternativeText || f.name,
                url: url,
                mime: f.mime,
            };
        });

        onChange(formattedFiles);
    };

    if(!isOpen || !MediaLibraryDialog) {
        return null
    };

    return(
        <MediaLibraryDialog onClose={onToggle} onSelectAssets={handleSelectAssets} />
    );
};

MediaLib.defaultProps = {
    isOpen: false,
    onChange: () => {},
    onToggle: () => {},
};

MediaLib.propTypes = {
    isOpen: PropTypes.bool,
    onChange: PropTypes.func,
    onToggle: PropTypes.func,
};

export default MediaLib;
