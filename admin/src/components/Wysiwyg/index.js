import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Stack } from '@strapi/design-system/Stack';
import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';
import { Typography } from '@strapi/design-system/Typography';
import Landscape from '@strapi/icons/Landscape';
import MediaLib from '../MediaLib/index.js';
import Editor from '../Editor';
import { useIntl } from 'react-intl';
import {getSettings} from "../../../../utils/api";
import {defaultSettings} from "../../../../utils/defaults";
import { useQuery } from 'react-query';

// TipTap
import { useEditor } from '@tiptap/react'
import { Extension, mergeAttributes, wrappingInputRule } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExtension from '@tiptap/extension-underline'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import TextAlignExtension from '@tiptap/extension-text-align'
import TableExtension from '@tiptap/extension-table'
import TableRowExtension from '@tiptap/extension-table-row'
import TableCellExtension from '@tiptap/extension-table-cell'
import TableHeaderExtension from '@tiptap/extension-table-header'
import packageInfo from '../../../../package.json'

const CSSColumnsExtension = Extension.create({
  name: 'cssColumns',
  addOptions () {
    return {
      types: [],
      columnTypes: [2, 3],
      defaultColumnType: 'two',
    };
  },
  addGlobalAttributes () {
    return [
      {
        types: this.options.types,
        attributes: {
          cssColumns: {
            default: 1,
            renderHTML: attributes => {
              return {
                style: `column-count: ${attributes.cssColumns}`,
              }
            },
            parseHTML: element => element.style.columnCount || 1,
          },
        },
      }
    ]
  },
  addCommands () {
    return {
      toggleColumns: (columnType) => ({ commands, editor }) => {
        if (!editor.isActive({'cssColumns': columnType})) return this.options.types.every((type) => commands.updateAttributes(type, {cssColumns: columnType}))
        return this.options.types.every((type) => commands.resetAttributes(type, 'cssColumns'))
      },
      unsetColumns: (columnType) => ({ commands }) => {
        return this.options.types.every((type) => commands.resetAttributes(type, 'cssColumns'))
      },
    }
  }
})


const Wysiwyg = ({ name, onChange, value, intlLabel, disabled, error, description, required }) => {
  const { formatMessage } = useIntl();
  const [mediaLibVisible, setMediaLibVisible] = useState(false);
  const [forceInsert, setForceInsert] = useState(false);
  const {data: settings, isLoading} = useQuery('settings', getSettings)

  const mergedSettings = {...defaultSettings, ...settings}

  const handleToggleMediaLib = () => setMediaLibVisible(prev => !prev);

  console.log(mergedSettings)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        gapcursor: true,
      }),
      UnderlineExtension,
      mergedSettings.links.enabled ? LinkExtension.configure({
        autolink: mergedSettings.links.autolink,
        openOnClick: mergedSettings.links.openOnClick,
        linkOnPaste: mergedSettings.links.linkOnPaste,
      }) : null,
      mergedSettings.image.enabled ? ImageExtension.configure({
        inline: mergedSettings.image.inline,
        allowBase64: mergedSettings.image.allowBase64,
      }) : null,
      TextAlignExtension.configure({
        types: ['heading', 'paragraph'],
      }),
      TableExtension.configure({
        allowTableNodeSelection: true,
      }),
      TableRowExtension,
      TableCellExtension,
      TableHeaderExtension,
      CSSColumnsExtension.configure({
        types: ['paragraph']
      }),
    ],
    onUpdate(ctx) {
      console.log('Change')
      onChange({ target: { name, value: ctx.editor.getHTML() } })
    },
  })



  // Update content if value is changed outside
  useEffect(() => {
    if (editor !== null && editor.getHTML() !== value && value !== null) {
      editor.commands.setContent(value)
    }

    if (!isLoading) {
    }
  })

  const handleChangeAssets = assets => {
    if (!forceInsert && editor.isActive('image')) {
      assets.map(asset => {
        if (asset.mime.includes('image')) {
          editor.chain().focus().setImage({src: asset.url}).run()
        }
      })
    } else {
      assets.map(asset => {
        if (asset.mime.includes('image')) {
          editor.commands.setImage({ src: asset.url, alt: asset.alt })
        }
      });
    }

    setForceInsert(false)
    handleToggleMediaLib()
  };

  if (isLoading) {
    return null
  }

  return (
      <>
        <Stack spacing={1}>
          <Box>
            <Typography variant="pi" fontWeight="bold">
              {formatMessage(intlLabel)}
            </Typography>
            {required &&
                <Typography variant="pi" fontWeight="bold" textColor="danger600">*</Typography>
            }
          </Box>
          {/*<Button startIcon={<Landscape />} variant='secondary' fullWidth onClick={() => {setForceInsert(true); handleToggleMediaLib()}}>Media library</Button>*/}
          <Editor
              disabled={disabled}
              name={name}
              onChange={onChange}
              value={value}
              editor={editor}
              toggleMediaLib={handleToggleMediaLib}
              settings={mergedSettings}
          />
          {error &&
              <Typography variant="pi" textColor="danger600">
                {formatMessage({ id: error, defaultMessage: error })}
              </Typography>
          }
          {description &&
              <Typography variant="pi">
                {formatMessage(description)}
              </Typography>
          }
        </Stack>
        <MediaLib
            isOpen={mediaLibVisible}
            onChange={handleChangeAssets}
            onToggle={handleToggleMediaLib}
        />
      </>
  );
};

Wysiwyg.defaultProps = {
  description: '',
  disabled: false,
  error: undefined,
  intlLabel: '',
  required: false,
  value: '',
};

Wysiwyg.propTypes = {
  description: PropTypes.shape({
    id: PropTypes.string,
    defaultMessage: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  error: PropTypes.string,
  intlLabel: PropTypes.shape({
    id: PropTypes.string,
    defaultMessage: PropTypes.string,
  }),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
};

export default Wysiwyg;
