import React from 'react';
import {prefixFileUrlWithBackendUrl, useLibrary} from '@strapi/helper-plugin';
import PropTypes from 'prop-types';

export interface MediaLibProps {
  isOpen: boolean
  onChange: (v:any) => void
  onToggle: () => void
}

const MediaLib: React.FC<MediaLibProps> = ({isOpen, onChange, onToggle}) => {
  const {components} = useLibrary();
  const MediaLibraryDialog = components['media-library'];

  const handleSelectAssets = files => {
    const formattedFiles = files.map(f => ({
      alt: f.alternativeText || f.name,
      url: prefixFileUrlWithBackendUrl(f.url),
      mime: f.mime,
    }));

    onChange(formattedFiles);
  };

  if (!isOpen) {
    return null
  }

  return (
    <MediaLibraryDialog onClose={onToggle} onSelectAssets={handleSelectAssets} />
  );
};

MediaLib.defaultProps = {
  isOpen: false,
  onChange: () => {
  },
  onToggle: () => {
  },
};

MediaLib.propTypes = {
  isOpen: PropTypes.bool,
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
};

export default MediaLib;
