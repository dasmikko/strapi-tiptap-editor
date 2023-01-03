import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';

// TipTap Editor
import {EditorContent, FloatingMenu, BubbleMenu} from '@tiptap/react'
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
import PaintBrush from '@strapi/icons/PaintBrush.js'





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


const Editor = ({onChange, name, value, editor, disabled, settings}) => {
  // Media library handling
  const [mediaLibVisible, setMediaLibVisible] = useState(false);
  const [forceInsert, setForceInsert] = useState(false);
  const handleToggleMediaLib = () => setMediaLibVisible(prev => !prev);

  const getUpdatedImage = (asset) => ({
    src: asset.url,
    alt: asset.alt,
    ...(asset.width && {width: asset.width}),
    ...(asset.height && {height: asset.height}),
    ...(asset.url?.includes('lazy') || asset.caption === 'lazy' && { loading: 'lazy' }),
  })

  const handleChangeAssets = assets => {
    if (!forceInsert && editor.isActive('image')) {
      assets.map(asset => {
        if (asset.mime.includes('image')) {
          editor.chain().focus().setImage(getUpdatedImage(asset)).run()
        }
      })
    } else {
      assets.map(asset => {
        if (asset.mime.includes('image')) {
          editor.commands.setImage(getUpdatedImage(asset))
        }
      });
    }

    setForceInsert(false)
    handleToggleMediaLib()
  };

  // Wait till we have the settings before showing the editor
  if (!settings) {
    return null
  }

  return (
    <Wrapper>
      <Box hasRadius={true} overflow={'hidden'} borderWidth="1px" borderStyle="solid" borderColor="neutral200">
        <Toolbar editor={editor} toggleMediaLib={handleToggleMediaLib} settings={settings}/>
        <BubbleMenuComponent editor={editor} toggleMediaLib={handleToggleMediaLib}/>

        <Box padding={2} background="neutral0" maxHeight={'600px'} style={{resize: 'vertical', overflow: 'auto'}}>
          <EditorContent editor={editor}/>
        </Box>
      </Box>

      { settings.other && settings.other.wordcount ? (<Box marginTop={'5px'} color="neutral600">
        {editor.storage.characterCount.words()} {editor.storage.characterCount.words() > 1 ? 'words' : 'word'}
      </Box>) : null }

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
  editor: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  disabled: PropTypes.bool,
  settings: PropTypes.object
};

export default Editor;
