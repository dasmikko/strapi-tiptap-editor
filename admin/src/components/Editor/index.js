import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';

// TipTap Editor
import {EditorContent, FloatingMenu, BubbleMenu} from '@tiptap/react'
import {useEditor} from '@tiptap/react'
import {Extension, mergeAttributes, wrappingInputRule} from '@tiptap/core'
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
import {Toolbar} from "./Toolbar";

// Media library
import MediaLib from "../MediaLib";

// Layout
import {Box} from '@strapi/design-system/Box';
import {Flex} from '@strapi/design-system/Flex';
import {IconButton, IconButtonGroup} from '@strapi/design-system/IconButton';

import Wrapper from './styles.js'

// Icons
import {
  AiOutlineTable,
  AiOutlineInsertRowBelow,
  AiOutlineInsertRowAbove,
  AiOutlineInsertRowRight,
  AiOutlineInsertRowLeft,
  AiOutlineDeleteColumn,
  AiOutlineDeleteRow,
  AiOutlineDelete,
  AiOutlineMergeCells,
  AiOutlineSplitCells
} from 'react-icons/ai';


const onHeadingChange = (editor, type) => {
  switch (type) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      editor.chain().focus().toggleHeading({level: parseInt(type.replace('h', ''))}).run()
      break;
    case 'paragraph':
      editor.chain().focus().setParagraph().run()
      break;
  }
}


const TableMenuBar = (editor) => {
  return (
    <Fragment key="tableMenubar">
      <IconButtonGroup className="button-group">
        <IconButton
          icon={<AiOutlineInsertRowBelow/>}
          label="Insert row below"
          onClick={() => editor.chain().focus().addRowAfter().run()}
        />
        <IconButton
          icon={<AiOutlineInsertRowAbove/>}
          label="Insert row above"
          onClick={() => editor.chain().focus().addRowBefore().run()}
        />

        <IconButton
          icon={<AiOutlineInsertRowLeft/>}
          label="Insert Column to the left"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
        />

        <IconButton
          icon={<AiOutlineInsertRowRight/>}
          label="Insert Column to the right"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
        />
      </IconButtonGroup>

      <IconButtonGroup className="button-group">
        <IconButton
          icon={<AiOutlineDeleteRow/>}
          label="Delete row"
          onClick={() => editor.chain().focus().deleteRow().run()}
        />
        <IconButton
          icon={<AiOutlineDeleteColumn/>}
          label="Delete column"
          onClick={() => editor.chain().focus().deleteColumn().run()}
        />
      </IconButtonGroup>

      <IconButtonGroup className="button-group">
        <IconButton
          icon={<AiOutlineMergeCells/>}
          label="Merge cells"
          onClick={() => editor.chain().focus().mergeCells().run()}
        />
        <IconButton
          icon={<AiOutlineSplitCells/>}
          label="Split cells"
          onClick={() => editor.chain().focus().splitCell().run()}
        />
      </IconButtonGroup>

      <IconButtonGroup className="button-group">
        <IconButton
          icon={<AiOutlineDelete/>}
          label="Delete table"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete the table?')) {
              editor.chain().focus().deleteTable().run()
            }
          }}
        />
      </IconButtonGroup>
    </Fragment>
  )
}


// Floating bubble menu for table
const BubbleMenuComponent = ({editor, toggleMediaLib}) => {
  if (editor) {
    let menuBars = []

    if (editor.isActive('table')) {
      menuBars.push(TableMenuBar(editor))
    }

    return (
      <BubbleMenu editor={editor} tippyOptions={{zIndex: 2, maxWidth: '450px'}}>
        {menuBars.length ? (
          <Flex padding={2} className="menu-bar floating" style={{flexWrap: 'wrap'}}>
            {/* Render menu bars */}
            {menuBars}
          </Flex>
        ) : null}
      </BubbleMenu>
    )
  }
  return null
}

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

const Editor = ({onChange, name, value, disabled, settings}) => {
  // Media library handling
  const [mediaLibVisible, setMediaLibVisible] = useState(false);
  const [forceInsert, setForceInsert] = useState(false);
  const handleToggleMediaLib = () => setMediaLibVisible(prev => !prev);

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
          editor.commands.setImage({src: asset.url, alt: asset.alt})
        }
      });
    }

    setForceInsert(false)
    handleToggleMediaLib()
  };


  const editor = useEditor({
    extensions: [
      // Text
      StarterKit.configure({
        gapcursor: true,
        code: settings.code,
        codeBlock: settings.code,
        blockquote: settings.blockquote
      }),
      UnderlineExtension,
      TextAlignExtension.configure({
        types: ['heading', 'paragraph'],
      }),

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

      // Table
      settings.table ? TableExtension.configure({
        allowTableNodeSelection: true,
      }) : null,
      settings.table ? TableRowExtension : null,
      settings.table ? TableCellExtension : null,
      settings.table ? TableHeaderExtension : null,

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

  // Wait till we have the settings before showing the editor
  if (!settings) {
    return null
  }

  return (
    <Wrapper>
      <Box hasRadius={true} overflow={'hidden'} borderWidth="1px" borderStyle="solid" borderColor="neutral300">
        <Toolbar editor={editor} toggleMediaLib={handleToggleMediaLib} settings={settings}/>
        <BubbleMenuComponent editor={editor} toggleMediaLib={handleToggleMediaLib}/>

        <Box padding={2} background="neutral0" maxHeight={'600px'} style={{resize: 'vertical', overflow: 'auto'}}>
          <EditorContent editor={editor}/>
        </Box>
      </Box>

      <MediaLib
        isOpen={mediaLibVisible}
        onChange={handleChangeAssets}
        onToggle={handleToggleMediaLib}
      />
    </Wrapper>
  );
};

Editor.defaultProps = {
  value: '',
  disabled: false
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  settings: PropTypes.object
};

export default Editor;
