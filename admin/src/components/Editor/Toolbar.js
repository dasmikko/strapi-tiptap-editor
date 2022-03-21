import React, {useState} from "react";

// Icons
import Bold from "@strapi/icons/Bold";
import Italic from "@strapi/icons/Italic";
import Strikethrough from "@strapi/icons/StrikeThrough";
import Underline from "@strapi/icons/Underline";
import {AiOutlineAlignCenter, AiOutlineAlignLeft, AiOutlineAlignRight, AiOutlineTable} from "react-icons/ai";
import BulletList from "@strapi/icons/BulletList";
import NumberList from "@strapi/icons/NumberList";
import {FiColumns} from "react-icons/fi";
import {BsLayoutThreeColumns} from "react-icons/bs";
import Code from "@strapi/icons/Code";
import {GrBlockQuote} from "react-icons/gr";
import Link from "@strapi/icons/Link";
import Landscape from "@strapi/icons/Landscape";


// Layout
import { Box } from '@strapi/design-system/Box';
import { Flex } from '@strapi/design-system/Flex';
import { Button } from '@strapi/design-system/Button';
import { TextInput } from '@strapi/design-system/TextInput';
import { Stack } from '@strapi/design-system/Stack';
import { Dialog, DialogBody, DialogFooter } from '@strapi/design-system/Dialog';
import { IconButton, IconButtonGroup } from '@strapi/design-system/IconButton';
import { Select, Option } from '@strapi/design-system/Select';

export const Toolbar = ({ editor, toggleMediaLib, settings }) => {
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
            { settings.align.includes('right') ? (<IconButton
              icon={<AiOutlineAlignRight/>}
              label="Align right"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
            />) : null }
          </IconButtonGroup>

          <IconButtonGroup className="button-group">
            { settings.lists.includes('ul') ? (<IconButton
              icon={<BulletList/>}
              label="Bullet list"
              className={editor.isActive('bulletList') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />) : null }
            { settings.lists.includes('ol') ? (<IconButton
              icon={<NumberList/>}
              label="Ordered list"
              className={editor.isActive('orderedList') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />) : null }
          </IconButtonGroup>

          <IconButtonGroup className="button-group">
            { settings.columns.includes('two') ? (<IconButton
              icon={<FiColumns fillOpacity={0} />}
              label="Two columns"
              className={editor.isActive({'cssColumns': '2'}) ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleColumns(2).run()}
            />) : null }
            { settings.columns.includes('three') ? (<IconButton
              icon={<BsLayoutThreeColumns />}
              label="Three columns"
              className={editor.isActive({'cssColumns': '3'}) ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleColumns(3).run()}
            />) : null }
          </IconButtonGroup>

          <IconButtonGroup className="button-group">
            { settings.code ? (<IconButton
              icon={<Code/>}
              label="Code"
              className={editor.isActive('codeBlock') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            />) : null }

            { settings.blockquote ? (<IconButton
              icon={<GrBlockQuote/>}
              label="Blockquote"
              className={editor.isActive('blockquote') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            />) : null }

            <Dialog onClose={() => setIsVisibleLinkDialog(false)} title="Insert link" isOpen={isVisibleLinkDialog}>
              <DialogBody>
                <Stack spacing={2}>
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

            { settings.links.enabled ? (<IconButton
              icon={<Link/>}
              label="Link"
              className={editor.isActive('link') ? 'is-active' : ''}
              onClick={() => openLinkDialog()}
            />) : null }

            { settings.image.enabled ? (<IconButton
              icon={<Landscape/>}
              label={editor.isActive('image') ? 'Change image' : 'Insert image'}
              className={editor.isActive('image') ? 'is-active' : ''}
              onClick={toggleMediaLib}
            />) : null }

            { settings.table ? (<IconButton
              icon={<AiOutlineTable/>}
              label="Table"
              className={editor.isActive('table') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().insertTable({cols: 3, row: 3, withHeaderRow: false}).run()}
            />) : null }
          </IconButtonGroup>
        </Flex>
      </Flex>
    </Box>
  )
}
