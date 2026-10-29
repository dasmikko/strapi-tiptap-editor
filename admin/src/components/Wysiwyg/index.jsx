import React, { useState, useEffect } from 'react';
import { Field, Flex } from '@strapi/design-system';
import { useField } from '@strapi/strapi/admin';
import Editor from '../Editor';
import { useSettings } from '../../utils/useSettings';

// Editor
import {useEditor} from '@tiptap/react'
import {Extension} from '@tiptap/core'
import UnderlineExtension from '@tiptap/extension-underline'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import TextAlignExtension from '@tiptap/extension-text-align'
import {
  Table as TableExtension,
  TableRow as TableRowExtension,
  TableCell as TableCellExtension,
  TableHeader as TableHeaderExtension,
} from '@tiptap/extension-table'
import { TextStyle as TextStyleExtension, Color as ColorExtension } from '@tiptap/extension-text-style'
import YouTubeExtension from '@tiptap/extension-youtube'
import CodeExtension from '@tiptap/extension-code'
import BoldExtension from '@tiptap/extension-bold'
import ItalicExtension from '@tiptap/extension-italic'
import StrikeExtension from '@tiptap/extension-strike'
import {
  OrderedList as OrderedListExtension,
  BulletList as BulletListExtension,
  ListItem as ListItemExtension,
} from '@tiptap/extension-list'
import {
  CharacterCount as CharacterCountExtension,
  Gapcursor as GapcursorExtension,
  UndoRedo as UndoRedoExtension,
} from '@tiptap/extensions'
import BlockquoteExtension from '@tiptap/extension-blockquote'
import CodeBlockExtension from '@tiptap/extension-code-block'
import DocumentExtension from '@tiptap/extension-document'
import HardBreakExtension from '@tiptap/extension-hard-break'
import HeadingExtension from '@tiptap/extension-heading'
import HorizontalRuleExtension from '@tiptap/extension-horizontal-rule'
import ParagraphExtension from '@tiptap/extension-paragraph'
import TextExtension from '@tiptap/extension-text'
import HighlightExtension from '@tiptap/extension-highlight'


const Wysiwyg = React.forwardRef(({ name, label, hint, labelAction, disabled, required }, ref) => {
  const field = useField(name)
  const { settings, isLoading } = useSettings()
  if (isLoading) return null

  return (
    <Field.Root name={name} hint={hint} error={field.error} required={required}>
      <Flex direction="column" alignItems="stretch" gap={1}>
        <Field.Label action={labelAction}>{label}</Field.Label>
        <WysiwygContent
          name={name}
          onChange={field.onChange}
          value={field.value}
          disabled={disabled}
          settings={settings}
        />
        <Field.Hint/>
        <Field.Error/>
      </Flex>
    </Field.Root>
  )
})

const CSSColumnsExtension = Extension.create({
  name: 'cssColumns',
  addOptions() {
    return {
      types: [],
      columnTypes: [2, 3],
      defaultColumnType: 'two',
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          cssColumns: {
            default: null,
            renderHTML: attributes => {
              if (attributes.cssColumns === null) return
              return {
                style: `column-count: ${attributes.cssColumns}`,
              }
            },
            parseHTML: element => element.style.columnCount || null,
          },
        },
      }
    ]
  },
  addCommands() {
    return {
      toggleColumns: (columnType) => ({commands, editor}) => {
        if (!editor.isActive({'cssColumns': columnType})) return this.options.types.every((type) => commands.updateAttributes(type, {cssColumns: columnType}))
        return this.options.types.every((type) => commands.resetAttributes(type, 'cssColumns'))
      },
      unsetColumns: (columnType) => ({commands}) => {
        return this.options.types.every((type) => commands.resetAttributes(type, 'cssColumns'))
      },
    }
  }
})

const CustomOrderedList = OrderedListExtension.extend({
  addInputRules() {
    return []
  }
})

const WysiwygContent = ({ name, onChange, value, disabled, settings }) => {
  const [currentContent, setCurrentContent] = useState('');

  const editor = useEditor({
    extensions: [
      // Text
      DocumentExtension,
      ParagraphExtension,
      TextExtension,
      BoldExtension,
      StrikeExtension,
      ItalicExtension,
      GapcursorExtension,
      ListItemExtension,
      BulletListExtension,
      HeadingExtension,

      settings.disableOrderedListShorthand ? CustomOrderedList : OrderedListExtension,
      settings.code ? CodeBlockExtension : null,
      settings.code ? CodeExtension : null,
      settings.blockquote ? BlockquoteExtension : null,
      settings.horizontal ? HorizontalRuleExtension : null,
      settings.hardbreak ? HardBreakExtension : null,

      UnderlineExtension,
      TextAlignExtension.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyleExtension,
      settings.color ? ColorExtension : null,
      settings.highlight ? HighlightExtension.configure({ multicolor: true }) : null,
      // Links
      settings.links.enabled ? LinkExtension.configure({
        autolink: settings.links.autolink,
        openOnClick: settings.links.openOnClick,
        linkOnPaste: settings.links.linkOnPaste,
        HTMLAttributes: {
          rel: settings.links.HTMLAttributes.rel
        }
      }) : null,

      // Images
      settings.image.enabled ? ImageExtension.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            width: { default: null },
            height: { default: null },
            loading: { default: null },
            renderHTML: (attributes) => {
              return {
                width: attributes.width,
                height: attributes.height,
                loading: attributes.loading
              };
            }
          };
        }
      }).configure({
        inline: settings.image.inline,
        allowBase64: settings.image.allowBase64,
      }) : null,

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

      settings.youtube.enabled ? YouTubeExtension.configure({
        inline: false,
      }) : null,
      UndoRedoExtension
    ].filter(Boolean), // Disabled extensions are null
    // The toolbar and word count read editor state while rendering
    shouldRerenderOnTransaction: true,
    parseOptions: {
      preserveWhitespace: 'full',
    },
    onUpdate(ctx) {
      if (settings.other.saveJson) {
        onChange(name, JSON.stringify(ctx.editor.getJSON()))
      } else {
        onChange(name, ctx.editor.getHTML())
      }


    },
  })

  useEffect(() => {
    if (editor === null) return
    if (currentContent === '') {
      // Content can be 2 things: JSON or String. Be able to display both things.
      if (!value) return

      try {
        // If content is saved as json, parse it
        const json = JSON.parse(value)
        setCurrentContent(value)
        editor.commands.setContent(json, { emitUpdate: false })
      } catch (e) {
        // Use value as is, the content hasn't been converted to json.
        setCurrentContent(value)
        editor.commands.setContent(value, { emitUpdate: false })
      }
    }
  }, [editor])

  useEffect(() => {
    if (editor === null) return
    editor.setEditable(!disabled)
  }, [editor, disabled])

  if (!editor) return null

  return (
    <Editor
      key="editor"
      disabled={disabled}
      name={name}
      editor={editor}
      onChange={onChange}
      value={value}
      settings={settings}
    />
  )
}

export default Wysiwyg;
