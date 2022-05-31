import React, {useRef, useState} from 'react'

// Icons
import Bold from '@strapi/icons/Bold'
import Italic from '@strapi/icons/Italic'
import IndentIncrease from '@strapi/icons/IndentIncrease'
import IndentDecrease from '@strapi/icons/IndentDecrease'


import Strikethrough from '@strapi/icons/StrikeThrough'
import Underline from '@strapi/icons/Underline'
import {AiOutlineAlignCenter, AiOutlineAlignLeft, AiOutlineAlignRight, AiOutlineTable} from 'react-icons/ai'
import BulletList from '@strapi/icons/BulletList'
import NumberList from '@strapi/icons/NumberList'
import {BsLayoutSplit, BsLayoutThreeColumns} from 'react-icons/bs'
import {MdHorizontalRule} from 'react-icons/md'
import {RiFontSize2} from 'react-icons/ri'
import {CgFontHeight} from 'react-icons/cg'
import Code from '@strapi/icons/Code'
import {GrBlockQuote} from 'react-icons/gr'
import Link from '@strapi/icons/Link'
import Landscape from '@strapi/icons/Landscape'
import {FaImage} from 'react-icons/fa'
import PaintBrush from '@strapi/icons/PaintBrush'
import {IconContext} from 'react-icons'


// Layout
import {Box} from '@strapi/design-system/Box';
import {Flex} from '@strapi/design-system/Flex';
import {Button} from '@strapi/design-system/Button';
import {TextInput} from '@strapi/design-system/TextInput';
import {Textarea} from '@strapi/design-system/Textarea';
import {Stack} from '@strapi/design-system/Stack';
import {Dialog, DialogBody, DialogFooter} from '@strapi/design-system/Dialog';
import {IconButton, IconButtonGroup} from '@strapi/design-system/IconButton';
import {Option, Select} from '@strapi/design-system/Select';
import {Field, FieldLabel} from '@strapi/design-system/Field';
import {FakeInput} from './FakeInput'

const onFontFamilyChange = (editor, type) => {
  if (!type) {
    editor.chain().focus().unsetFontFamily().run()
    return
  }
  editor.chain().focus().setFontFamily(type).run()
}
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

export const Toolbar = ({editor, toggleMediaLib, settings}) => {
  const [isVisibleLinkDialog, setIsVisibleLinkDialog] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [linkTargetInput, setLinkTargetInput] = useState('');

  // Base64 Image dialog
  const [base64MediaLibVisible, setBase64MediaLibVisible] = useState(false);
  const [base64Input, setBase64Input] = useState('');
  const handleToggleBase54MediaLib = () => setBase64MediaLibVisible(prev => !prev);

  const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
  const isValidBase64String = base64regex.test(base64Input);

  const openBase64Dialog = () => {
    if (editor.getAttributes('image').src && editor.getAttributes('image').src.includes(';base64')) setBase64Input(editor.getAttributes('image').src)
    setBase64MediaLibVisible(true)
  }

  const onInsertBase64Image = () => {
    editor.chain().focus().setImage({src: base64Input}).run()
    setBase64Input('')
    setBase64MediaLibVisible(false)
  }

  // Color picker
  const [colorPopoverVisible, setColorPopoverVisible] = useState(false);
  const colorInputRef = useRef(null);

  const openLinkDialog = () => {
    const previousUrl = editor.getAttributes('link').href
    const previousTarget = editor.getAttributes('link').target

    // Update fields before showing dialog
    if (previousUrl) setLinkInput(previousUrl)
    if (previousTarget) setLinkTargetInput(previousTarget)


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

  let selectedTextStyle = 'none'

  if (editor.isActive('heading', {level: 1})) selectedTextStyle = 'h1'
  if (editor.isActive('heading', {level: 2})) selectedTextStyle = 'h2'
  if (editor.isActive('heading', {level: 3})) selectedTextStyle = 'h3'
  if (editor.isActive('heading', {level: 4})) selectedTextStyle = 'h4'
  if (editor.isActive('heading', {level: 5})) selectedTextStyle = 'h5'
  if (editor.isActive('heading', {level: 6})) selectedTextStyle = 'h6'
  if (editor.isActive('paragraph')) selectedTextStyle = 'paragraph'

  let selectedFontFamily = editor.getAttributes('textStyle').fontFamily
  const fonts = [
    'PingFang SC',
    'Helvetica Neue',
    'Helvetica',
    '微软雅黑',
    'Verdana',
    'Courier New',
    'monospace',
  ]
  // selectedFontFamily = fonts.find(v=>editor.isActive('textStyle', { fontFamily: v })) || ''

  let selectedFontSize = editor.getAttributes('textStyle').fontSize?.replace('px', '')
  if (selectedFontSize) {
    selectedFontSize = parseInt(selectedFontSize)
  }
  let lineHeight = editor.getAttributes('textStyle').lineHeight
  const fontSizes = [8, 12, 16, 18, 20, 24, 30, 32, 36, 40, 50, 60, 72, 80]
  const lineHeights = [0.8, 1, 1.1, 1.2, 1.5, 1.8, 2.0, 2.5, 3.0]


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
              {settings.headings.includes('h1') ? (<Option value={'h1'}>Heading 1</Option>) : null}
              {settings.headings.includes('h2') ? (<Option value={'h2'}>Heading 2</Option>) : null}
              {settings.headings.includes('h3') ? (<Option value={'h3'}>Heading 3</Option>) : null}
              {settings.headings.includes('h4') ? (<Option value={'h4'}>Heading 4</Option>) : null}
              {settings.headings.includes('h5') ? (<Option value={'h5'}>Heading 5</Option>) : null}
              {settings.headings.includes('h6') ? (<Option value={'h6'}>Heading 6</Option>) : null}
            </Select>
          </Box>

          <Box className="button-group" style={{width: 150}}>
            <Select
              id="select2"
              required size="S"
              placeholder="Font family"
              onChange={(val) => onFontFamilyChange(editor, val)}
              value={selectedFontFamily}
            >
              <Option value={''}>Default</Option>
              {fonts.map((v, i) => <Option key={i} value={v}>{v}</Option>)}
            </Select>
          </Box>

          <Box style={{display: 'flex', alignItems: 'center'}}>
            <RiFontSize2 style={{width: 32, height: 18, paddingLeft: 6, paddingRight: 4}} />
            <FakeInput
              value={selectedFontSize}
              options={fontSizes.map(v => ({value: v}))}
              min={8}
              max={120}
              placeholder={'Auto'}
              onChange={(val) => {
                if (!val) {
                  editor.chain().focus().unsetFontSize().run()
                } else {
                  editor.chain().focus().setFontSize(val).run()
                }
              }}
            />
          </Box>
          <Box style={{display: 'flex', alignItems: 'center'}}>
            <CgFontHeight style={{width: 32, height: 18, paddingLeft: 6, paddingRight: 4}} />
            <FakeInput
              value={lineHeight}
              options={lineHeights.map(v => ({value: v}))}
              min={.5}
              step={.1}
              max={120}
              placeholder={'Auto'}
              onChange={(val) => {
                if (!val) {
                  editor.chain().focus().unsetLineHeight().run()
                } else {
                  editor.chain().focus().setLineHeight(val).run()
                }
              }}
            />
          </Box>

          <IconButtonGroup className={'button-group'} style={{display: 'flex'}}>
            <IconButton icon={<IndentDecrease />} onClick={() => editor.commands.decreaseIndent()} />
            <IconButton icon={<IndentIncrease />} onClick={() => editor.commands.increaseIndent()} />
          </IconButtonGroup>

          <IconButtonGroup className="button-group">
            {settings.bold ? (<IconButton
              icon={<Bold />}
              label="Bold"
              className={editor.isActive('bold') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleBold().run()}
            />) : null}
            {settings.italic ? (<IconButton
              icon={<Italic />}
              label="Italic"
              className={editor.isActive('italic') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />) : null}
            {settings.strikethrough ? (<IconButton
              icon={<Strikethrough />}
              label="Strikethrough"
              className={editor.isActive('strike') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            />) : null}
            {settings.underline ? (<IconButton
              icon={<Underline />}
              label="Underline"
              className={editor.isActive('underline') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            />) : null}
            {settings.color ? (<IconButton
              icon={<PaintBrush />}
              label="Text color"
              onClick={() => {
                setColorPopoverVisible(s => !s)
                setTimeout(() => {
                  colorInputRef.current.value = editor.getAttributes('textStyle').color
                }, 10)
              }}
            />) : null}

            <Dialog onClose={() => setColorPopoverVisible(false)} title="Select color" isOpen={colorPopoverVisible}>
              <DialogBody>
                <Stack spacing={2}>
                  <input
                    style={{width: '100%', height: '2em'}}
                    type="color"
                    ref={colorInputRef}
                  />
                </Stack>
              </DialogBody>
              <DialogFooter startAction={
                <Button onClick={() => {
                  setColorPopoverVisible(false)
                  editor.commands.unsetColor()
                }}
                        variant="tertiary">
                  Remove color
                </Button>
              } endAction={
                <Button
                  onClick={() => {
                    editor.chain().focus().setColor(colorInputRef.current.value).run();
                    setColorPopoverVisible(false)
                  }}
                  variant="success-light">
                  Change color
                </Button>} />
            </Dialog>

          </IconButtonGroup>

          <IconButtonGroup className="button-group">
            {settings.align.includes('left') ? (<IconButton
              icon={<AiOutlineAlignLeft />}
              label="Align left"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
            />) : null}
            {settings.align.includes('center') ? (<IconButton
              icon={<AiOutlineAlignCenter />}
              label="Align center"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
            />) : null}
            {settings.align.includes('right') ? (<IconButton
              icon={<AiOutlineAlignRight />}
              label="Align right"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
            />) : null}
          </IconButtonGroup>

          <IconButtonGroup className="button-group">
            {settings.lists.includes('ul') ? (<IconButton
              icon={<BulletList />}
              label="Bullet list"
              className={editor.isActive('bulletList') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />) : null}
            {settings.lists.includes('ol') ? (<IconButton
              icon={<NumberList />}
              label="Ordered list"
              className={editor.isActive('orderedList') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />) : null}
          </IconButtonGroup>

          <IconContext.Provider value={{color: '#32324D'}}>
            <IconButtonGroup className="button-group">
              {settings.columns.includes('two') ? (<IconButton
                icon={<BsLayoutSplit />}
                label="Two columns"
                className={editor.isActive({'cssColumns': '2'}) ? 'is-active' : ''}
                onClick={() => editor.chain().focus().toggleColumns(2).run()}
              />) : null}
              {settings.columns.includes('three') ? (<IconButton
                icon={<BsLayoutThreeColumns />}
                label="Three columns"
                className={editor.isActive({'cssColumns': '3'}) ? 'is-active' : ''}
                onClick={() => editor.chain().focus().toggleColumns(3).run()}
              />) : null}
            </IconButtonGroup>
          </IconContext.Provider>

          <IconButtonGroup className="button-group">
            {settings.code ? (<IconButton
              icon={<Code />}
              label="Code"
              className={editor.isActive('codeBlock') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            />) : null}

            {settings.blockquote ? (<IconButton
              icon={<GrBlockQuote />}
              label="Blockquote"
              className={editor.isActive('blockquote') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            />) : null}

            <Dialog onClose={() => setIsVisibleLinkDialog(false)} title="Insert link" isOpen={isVisibleLinkDialog}>
              <DialogBody>
                <Stack spacing={2}>
                  <TextInput
                    label="Link URL"
                    placeholder="Write or paste the url here"
                    name="url" onChange={e => setLinkInput(e.target.value)}
                    value={linkInput}
                    aria-label="URL" />
                  <Select
                    id="linkTargetSelect"
                    label="Link target"
                    required
                    placeholder="Select link target"
                    value={linkTargetInput}
                    onChange={setLinkTargetInput}>
                    <Option value={'_self'}>Self</Option>
                    <Option value={'_blank'}>Blank</Option>
                    <Option value={'_parent'}>Parent</Option>
                    <Option value={'_top'}>Top</Option>
                  </Select>
                </Stack>
              </DialogBody>
              <DialogFooter startAction={<Button onClick={() => {
                setLinkInput('');
                setLinkTargetInput('');
                setIsVisibleLinkDialog(false)
              }} variant="tertiary">
                Cancel
              </Button>} endAction={<Button onClick={() => onInsertLink()} variant="success-light">
                Insert link
              </Button>} />
            </Dialog>

            {settings.links.enabled ? (<IconButton
              icon={<Link />}
              label="Link"
              className={editor.isActive('link') ? 'is-active' : ''}
              onClick={() => openLinkDialog()}
            />) : null}

            {settings.image.enabled ? (<IconButton
              icon={<Landscape />}
              label={editor.isActive('image') ? 'Change image' : 'Insert image'}
              className={editor.isActive('image') && !editor.getAttributes('image').src.includes(';base64') ? 'is-active' : ''}
              onClick={toggleMediaLib}
            />) : null}

            <Dialog onClose={() => setBase64MediaLibVisible(false)} title="Insert base64 image"
                    isOpen={base64MediaLibVisible}>
              <DialogBody>
                <Stack spacing={2}>
                  <Textarea
                    label="Base64 content"
                    placeholder="Write or paste the base64 url here"
                    name="url" onChange={e => setBase64Input(e.target.value)}
                    value={base64Input}
                    style={{maxHeight: '200px'}}
                    aria-label="URL" />

                  <Field name="preview">
                    <Stack spacing={1}>
                      <FieldLabel>Preview</FieldLabel>
                      {base64Input.length ? <img style={{maxWidth: '100%'}} src={base64Input} alt="" /> : null}
                    </Stack>
                  </Field>

                </Stack>
              </DialogBody>
              <DialogFooter startAction={<Button onClick={() => {
                setBase64Input('');
                setBase64MediaLibVisible(false)
              }} variant="tertiary">
                Cancel
              </Button>} endAction={<Button disabled={base64Input.length === 0} onClick={() => onInsertBase64Image()}
                                            variant="success-light">
                Insert image
              </Button>} />
            </Dialog>

            {settings.image.allowBase64 ? (<IconButton
              icon={<FaImage />}
              label={editor.isActive('image') ? 'Change image' : 'Insert base64 image'}
              className={editor.isActive('image') && editor.getAttributes('image').src.includes(';base64') ? 'is-active' : ''}
              onClick={openBase64Dialog}
            />) : null}

            {settings.table ? (<IconButton
              icon={<AiOutlineTable />}
              label="Table"
              className={editor.isActive('table') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().insertTable({cols: 3, row: 3, withHeaderRow: false}).run()}
            />) : null}

            <IconButton
              icon={<MdHorizontalRule />}
              label="Horizontal Rule"
              className={editor.isActive('horizontalRule') ? 'is-active' : ''}
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            />
          </IconButtonGroup>
        </Flex>
      </Flex>
    </Box>
  )
}

