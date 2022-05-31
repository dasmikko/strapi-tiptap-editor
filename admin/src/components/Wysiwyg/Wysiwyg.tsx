import React from 'react';
import PropTypes from 'prop-types';
import {Stack} from '@strapi/design-system/Stack';
import {Box} from '@strapi/design-system/Box';
import {FieldLabel} from '@strapi/design-system/Field';
import {Typography} from '@strapi/design-system/Typography';
import Editor from '../Editor';
import {useIntl} from 'react-intl';
import {getSettings} from '../../../../utils/api';
import {useQuery} from 'react-query';

// Editor
import {useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import UnderlineExtension from '@tiptap/extension-underline'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import TextAlignExtension from '@tiptap/extension-text-align'
import TableExtension from '@tiptap/extension-table'
import TableRowExtension from '@tiptap/extension-table-row'
import TableCellExtension from '@tiptap/extension-table-cell'
import TableHeaderExtension from '@tiptap/extension-table-header'
import TextStyleExtension from '@tiptap/extension-text-style'
import CharacterCountExtension from '@tiptap/extension-character-count'
import HorizontalRuleExtension from '@tiptap/extension-horizontal-rule'
import {Color as ColorExtension} from '@tiptap/extension-color'
import FontFamilyExtension from '@tiptap/extension-font-family'
import {IndentExtension} from './extensions/indent';
import CSSColumnsExtension from './extensions/css-columns'
import VideoExtension from './extensions/video'
import {BlockStyles, TextFormats} from './extensions/text-styles';

export const Wysiwyg = ({name, onChange, value, intlLabel, labelAction, disabled, error, description, required}) => {
  const {data: settings, isLoading} = useQuery('settings', getSettings)
  if (isLoading) return null

  return (
    <WysiwygContent
      name={name}
      onChange={onChange}
      value={value}
      intlLabel={intlLabel}
      labelAction={labelAction}
      disabled={disabled}
      error={error}
      description={description}
      required={required}
      settings={settings}
    />
  )
}

const WysiwygContent = ({
                          name,
                          onChange,
                          value,
                          intlLabel,
                          labelAction,
                          disabled,
                          error,
                          description,
                          required,
                          settings
                        }) => {
  const {formatMessage} = useIntl();

  const editor = useEditor({
    extensions: [
      // Text
      StarterKit.configure({
        // gapcursor: true,
        code: settings.code,
        codeBlock: settings.code,
        blockquote: settings.blockquote,
      }),
      UnderlineExtension,
      TextAlignExtension.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyleExtension,
      FontFamilyExtension,
      // FontSizeExtension,
      // FontWeightExtension,
      // LineHeightExtension,
      ...TextFormats,
      ...BlockStyles.map((v) => v.configure({types: ['listItem', 'heading', 'paragraph']})),
      IndentExtension,
      settings.color ? ColorExtension : null,

      HorizontalRuleExtension,

      // Links
      settings.links.enabled ? LinkExtension.configure({
        autolink: settings.links.autolink,
        openOnClick: settings.links.openOnClick,
        linkOnPaste: settings.links.linkOnPaste,
      }) : null,

      // Images
      settings.image.enabled ? ImageExtension.configure({
        inline: settings.image.inline,
        allowBase64: settings.image.allowBase64,
      }) : null,
      VideoExtension,

      // Table
      settings.table ? TableExtension.configure({
        allowTableNodeSelection: true,
      }) : null,
      settings.table ? TableRowExtension : null,
      settings.table ? TableCellExtension : null,
      settings.table ? TableHeaderExtension : null,

      settings.other && settings.other.wordcount ? CharacterCountExtension.configure() : null,

      // CSS Columns
      CSSColumnsExtension.configure({
        types: ['paragraph']
      }),
    ],
    content: value,
    onUpdate(ctx) {
      onChange({target: {name, value: ctx.editor.getHTML()}})
    },
  })

  if (editor === null) {
    return null
  }

  // Update content if value is changed outside (Mainly for i18n)
  if (editor !== null && editor.getHTML() !== value) {
    editor.commands.setContent(value)
  }

  return (
    <>
      <Stack spacing={1}>
        <Box>
          <FieldLabel action={labelAction} required={required}> {formatMessage(intlLabel)}</FieldLabel>
        </Box>
        <Editor
          key="editor"
          disabled={disabled}
          name={name}
          editor={editor}
          onChange={onChange}
          value={value}
          settings={settings}
        />
        {error &&
          <Typography variant="pi" textColor="danger600">
            {formatMessage({id: error, defaultMessage: error})}
          </Typography>
        }
        {description &&
          <Typography variant="pi">
            {formatMessage(description)}
          </Typography>
        }
      </Stack>
    </>
  )
}

Wysiwyg.defaultProps = {
  description: '',
  disabled: false,
  error: undefined,
  intlLabel: '',
  required: false,
  value: '',
  settings: {}
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
  labelAction: PropTypes.object,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
  settings: PropTypes.object
};

