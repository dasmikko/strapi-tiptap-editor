import React, {useState, Fragment} from 'react';

// TipTap Editor
import {EditorContent, BubbleMenu} from '@tiptap/react'
import {Toolbar} from "./Toolbar";

// Media library
import MediaLib from "../MediaLib";

// Layout
import {Box, Flex, IconButton, IconButtonGroup} from '@strapi/design-system';

import Wrapper from './styles.js'

// Icons
import {
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

const TableMenuBar = (editor) => {
  return (
    <Fragment key="tableMenubar">
      <IconButtonGroup className="button-group">
        <IconButton
          label="Insert row below"
          onClick={() => editor.chain().focus().addRowAfter().run()}
        >
          <AiOutlineInsertRowBelow/>
        </IconButton>
        <IconButton
          label="Insert row above"
          onClick={() => editor.chain().focus().addRowBefore().run()}
        >
          <AiOutlineInsertRowAbove/>
        </IconButton>

        <IconButton
          label="Insert Column to the left"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
        >
          <AiOutlineInsertRowLeft/>
        </IconButton>

        <IconButton
          label="Insert Column to the right"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
        >
          <AiOutlineInsertRowRight/>
        </IconButton>
      </IconButtonGroup>

      <IconButtonGroup className="button-group">
        <IconButton
          label="Delete row"
          onClick={() => editor.chain().focus().deleteRow().run()}
        >
          <AiOutlineDeleteRow/>
        </IconButton>
        <IconButton
          label="Delete column"
          onClick={() => editor.chain().focus().deleteColumn().run()}
        >
          <AiOutlineDeleteColumn/>
        </IconButton>
      </IconButtonGroup>

      <IconButtonGroup className="button-group">
        <IconButton
          label="Merge cells"
          onClick={() => editor.chain().focus().mergeCells().run()}
        >
          <AiOutlineMergeCells/>
        </IconButton>
        <IconButton
          label="Split cells"
          onClick={() => editor.chain().focus().splitCell().run()}
        >
          <AiOutlineSplitCells/>
        </IconButton>
      </IconButtonGroup>

      <IconButtonGroup className="button-group">
        <IconButton
          label="Delete table"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete the table?')) {
              editor.chain().focus().deleteTable().run()
            }
          }}
        >
          <AiOutlineDelete/>
        </IconButton>
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


const Editor = ({onChange, name, value = '', editor, disabled = false, settings}) => {
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

export default Editor;
