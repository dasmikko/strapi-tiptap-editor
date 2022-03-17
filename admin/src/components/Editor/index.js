import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { EditorContent, FloatingMenu , BubbleMenu} from '@tiptap/react'


import { Box } from '@strapi/design-system/Box';
import { Flex } from '@strapi/design-system/Flex';
import { Button } from '@strapi/design-system/Button';
import { TextInput } from '@strapi/design-system/TextInput';
import { Stack } from '@strapi/design-system/Stack';
import { Dialog, DialogBody, DialogFooter } from '@strapi/design-system/Dialog';
import { IconButton, IconButtonGroup } from '@strapi/design-system/IconButton';
import { Select, Option } from '@strapi/design-system/Select';

import Wrapper from './styles.js'

// Icons
import Bold from '@strapi/icons/Bold';
import Italic from '@strapi/icons/Italic';
import Strikethrough from '@strapi/icons/StrikeThrough';
import Underline from '@strapi/icons/Underline';
import BulletList from '@strapi/icons/BulletList';
import NumberList from '@strapi/icons/NumberList';
import Code from '@strapi/icons/Code';
import Link from '@strapi/icons/Link';
import Landscape from '@strapi/icons/Landscape';
import { FiColumns } from 'react-icons/fi';
import { BsLayoutThreeColumns, BsBlockquoteLeft } from 'react-icons/bs';
import { GrBlockQuote } from 'react-icons/gr';
import {
  AiOutlineTable,
  AiOutlineInsertRowBelow,
  AiOutlineInsertRowAbove,
  AiOutlineInsertRowRight,
  AiOutlineInsertRowLeft,
  AiOutlineDeleteColumn,
  AiOutlineDeleteRow,
  AiOutlineDelete,
  AiOutlineAlignRight,
  AiOutlineAlignLeft,
  AiOutlineAlignCenter,
  AiOutlineMergeCells,
  AiOutlineSplitCells
} from 'react-icons/ai';
import {Table} from '@tiptap/extension-table'



const onHeadingChange = (editor, type) => {
  console.log(type)

  switch (type) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      editor.chain().focus().toggleHeading({ level: parseInt(type.replace('h', '')) }).run()
      break;
    case 'paragraph':
      editor.chain().focus().setParagraph().run()
      break;
  }
}



const Toolbar = ({ editor, toggleMediaLib, settings }) => {
  const [isVisibleLinkDialog, setIsVisibleLinkDialog] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [linkTargetInput, setLinkTargetInput] = useState('');

  const openLinkDialog = () => {
    const previousUrl = editor.getAttributes('link').href
    const previousTarget = editor.getAttributes('link').target

    // Update fields before showing dialog
    if(previousUrl) setLinkInput(previousUrl)
    if(previousTarget) setLinkTargetInput(previousTarget)


    setIsVisibleLinkDialog(true)
  }

  const onInsertLink = () => {
    console.log(linkInput)

    // empty
    if (linkInput === '') {
      editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .unsetLink()
          .run()

    } else {
      // update link
      editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({href: linkInput, target: linkTargetInput})
          .run()
    }


    setIsVisibleLinkDialog(false)
    setLinkInput('')
    setLinkTargetInput('')
  }

  if (!editor) {
    return null
  }

  let selectedTextStyle = "none"

  if (editor.isActive('heading', {level: 1})) selectedTextStyle = "h1"
  if (editor.isActive('heading', {level: 2})) selectedTextStyle = "h2"
  if (editor.isActive('heading', {level: 3})) selectedTextStyle = "h3"
  if (editor.isActive('heading', {level: 4})) selectedTextStyle = "h4"
  if (editor.isActive('heading', {level: 5})) selectedTextStyle = "h5"
  if (editor.isActive('heading', {level: 6})) selectedTextStyle = "h6"
  if (editor.isActive('paragraph')) selectedTextStyle = "paragraph"

  console.log(settings)

  return (
      <Box padding={2} background="neutral100" className="menu-bar">
        <Flex justifyContent="space-between">
          <Flex style={{flexWrap: 'wrap'}}>
            <Box className="button-group">
              <Select
                  id="select1"
                  required size="S"
                  placeholder="Text style"
                  onChange={(val) => onHeadingChange(editor, val)}
                  value={selectedTextStyle}
              >
                <Option value={'paragraph'}>Paragraph</Option>
                { settings.headings.includes('h1') ? (<Option value={'h1'}>Heading 1</Option>) : null}
                { settings.headings.includes('h2') ? (<Option value={'h2'}>Heading 2</Option>) : null}
                { settings.headings.includes('h3') ? (<Option value={'h3'}>Heading 3</Option>) : null}
                { settings.headings.includes('h4') ? (<Option value={'h4'}>Heading 4</Option>) : null}
                { settings.headings.includes('h5') ? (<Option value={'h5'}>Heading 5</Option>) : null}
                { settings.headings.includes('h6') ? (<Option value={'h6'}>Heading 6</Option>) : null}
              </Select>
            </Box>

            <IconButtonGroup className="button-group">
              { settings.bold ? (<IconButton
                  icon={<Bold/>}
                  label="Bold"
                  className={editor.isActive('bold') ? 'is-active' : ''}
                  onClick={() => editor.chain().focus().toggleBold().run()}
              />) : null }
              { settings.italic ? (<IconButton
                  icon={<Italic/>}
                  label="Italic"
                  className={editor.isActive('italic') ? 'is-active' : ''}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
              />) : null }
              { settings.strikethrough ? (<IconButton
                  icon={<Strikethrough/>}
                  label="Strikethrough"
                  className={editor.isActive('strike') ? 'is-active' : ''}
                  onClick={() => editor.chain().focus().toggleStrike().run()}
              />) : null }
                  { settings.underline ? (<IconButton
                  icon={<Underline/>}
                  label="Underline"
                  className={editor.isActive('underline') ? 'is-active' : ''}
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
              />) : null }
            </IconButtonGroup>

            <IconButtonGroup className="button-group">
              { settings.align.includes('left') ? (<IconButton
                  icon={<AiOutlineAlignLeft/>}
                  label="Align left"
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
              />) : null }
              { settings.align.includes('center') ? (<IconButton
                  icon={<AiOutlineAlignCenter/>}
                  label="Align center"
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
              />) : null }
              { settings.align.includes('center') ? (<IconButton
                  icon={<AiOutlineAlignRight/>}
                  label="Align right"
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
              />) : null }
            </IconButtonGroup>

            <IconButtonGroup className="button-group">
              <IconButton
                  icon={<BulletList/>}
                  label="Bullet list"
                  className={editor.isActive('bulletList') ? 'is-active' : ''}
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
              />
              <IconButton
                  icon={<NumberList/>}
                  label="Ordered list"
                  className={editor.isActive('orderedList') ? 'is-active' : ''}
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
              />
            </IconButtonGroup>

            <IconButtonGroup className="button-group">
              <IconButton
                  icon={<FiColumns fillOpacity={0} />}
                  label="Two columns"
                  className={editor.isActive({'cssColumns': '2'}) ? 'is-active' : ''}
                  onClick={() => editor.chain().focus().toggleColumns(2).run()}
              />
              <IconButton
                  icon={<BsLayoutThreeColumns />}
                  label="Three columns"
                  className={editor.isActive({'cssColumns': '3'}) ? 'is-active' : ''}
                  onClick={() => editor.chain().focus().toggleColumns(3).run()}
              />
            </IconButtonGroup>

            <IconButtonGroup className="button-group">
              <IconButton
                  icon={<Code/>}
                  label="Code"
                  className={editor.isActive('codeBlock') ? 'is-active' : ''}
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              />

              <IconButton
                  icon={<GrBlockQuote/>}
                  label="Blockquote"
                  className={editor.isActive('blockquote') ? 'is-active' : ''}
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
              />

              <Dialog onClose={() => setIsVisibleLinkDialog(false)} title="Insert link" isOpen={isVisibleLinkDialog}>
                <DialogBody>
                  <Stack size={2}>
                    <TextInput
                        label="Link URL"
                        placeholder="Write or paste the url here"
                        name="url" onChange={e => setLinkInput(e.target.value)}
                        value={linkInput}
                        aria-label="URL"/>
                    <Select
                        id="linkTargetSelect"
                        label="Link target"
                        required
                        placeholder="Select link target"
                        value={linkTargetInput}
                        onChange={setLinkTargetInput} >
                      <Option value={'_self'}>Self</Option>
                      <Option value={'_blank'}>Blank</Option>
                      <Option value={'_parent'}>Parent</Option>
                      <Option value={'_top'}>Top</Option>
                    </Select>
                  </Stack>
                </DialogBody>
                <DialogFooter startAction={<Button onClick={() =>  {setLinkInput(''); setLinkTargetInput(''); setIsVisibleLinkDialog(false)}} variant="tertiary">
                  Cancel
                </Button>} endAction={<Button onClick={() => onInsertLink()} variant="success-light">
                  Insert link
                </Button>} />
              </Dialog>

              <IconButton
                  icon={<Link/>}
                  label="Link"
                  className={editor.isActive('link') ? 'is-active' : ''}
                  onClick={() => openLinkDialog()}
              />

              <IconButton
                  icon={<Landscape/>}
                  label={editor.isActive('image') ? 'Change image' : 'Insert image'}
                  className={editor.isActive('image') ? 'is-active' : ''}
                  onClick={toggleMediaLib}
              />

              <IconButton
                  icon={<AiOutlineTable/>}
                  label="Table"
                  className={editor.isActive('table') ? 'is-active' : ''}
                  onClick={() => editor.chain().focus().insertTable({cols: 3, row: 3, withHeaderRow: false}).run()}
              />
            </IconButtonGroup>
          </Flex>
        </Flex>
      </Box>
  )
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



const BubbleMenuComponent = ({editor, toggleMediaLib}) => {
  if (editor) {
    let menuBars = []

    if (editor.isActive('table')) {
      menuBars.push(TableMenuBar(editor))
    }



    return (
        <BubbleMenu editor={editor}  tippyOptions={{zIndex: 2, maxWidth: '450px'}}>
          { menuBars.length ? (
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

const FloatingMenuComponent = ({editor}) => {
  return (
      <FloatingMenu pluginKey="floatingMenu" editor={editor}>
        <IconButtonGroup className="button-group">
          <IconButton
              icon={<Code/>}
              label="Code block"
              className={editor.isActive('codeBlock') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          />

          <IconButton
              icon={<AiOutlineTable/>}
              label="Table"
              className={editor.isActive('table') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().insertTable({cols: 3, row: 3}).run()}
          />
        </IconButtonGroup>
      </FloatingMenu>
  )
}


const Editor = ({ onChange, name, value, disabled, editor, toggleMediaLib, settings }) => {
  // Wait till we have the settings before showing the editor
  if (!settings) {
    return null
  }

  return (
      <Wrapper>
        <Box hasRadius={true} overflow={'hidden'} borderWidth="1px" borderStyle="solid" borderColor="neutral300">
          <Toolbar editor={editor} toggleMediaLib={toggleMediaLib} settings={settings}/>
          <BubbleMenuComponent editor={editor} toggleMediaLib={toggleMediaLib}/>

          { /*editor ? (
          <FloatingMenuComponent editor={editor}/>
        ) : null */ }


          <Box padding={2} background="neutral0" maxHeight={'600px'} style={{resize: 'vertical', overflow: 'auto'}}>
            <EditorContent editor={editor} />
          </Box>
        </Box>
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
