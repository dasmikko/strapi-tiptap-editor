import React, {useState, useRef, useEffect} from "react"

// Icons
import {
  Bold,
  BulletList,
  Code,
  Image as Landscape,
  Italic,
  Link,
  NumberList,
  PaintBrush,
  Pencil,
  StrikeThrough as Strikethrough,
  Underline,
} from "@strapi/icons"
import {AiOutlineAlignCenter, AiOutlineAlignLeft, AiOutlineAlignRight, AiOutlineTable} from "react-icons/ai"
import {BsLayoutSplit} from "react-icons/bs"
import {BsLayoutThreeColumns} from "react-icons/bs"
import {GrBlockQuote} from "react-icons/gr"
import {AiFillYoutube, AiOutlineLine} from "react-icons/ai"
import {FaImage} from "react-icons/fa"
import { IconContext } from "react-icons"

// Layout
import {
  Box,
  Button,
  Field,
  Flex,
  IconButton,
  IconButtonGroup,
  Modal,
  SingleSelect,
  SingleSelectOption,
} from '@strapi/design-system';
import { TextInput, Textarea } from '../Fields';

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

export const Toolbar = ({ editor, toggleMediaLib, settings }) => {
  const [isVisibleLinkDialog, setIsVisibleLinkDialog] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [linkTargetInput, setLinkTargetInput] = useState('');

  // YouTube
  const [isVisibleYouTubeDialog, setIsVisibleYouTubeDialog] = useState(false);
  const [youTubeInput, setYouTubeInput] = useState('');
  const [youTubeHeightInput, setYouTubeHeightInput] = useState(settings.youtube.height);
  const [youTubeWidthInput, setYouTubeWidthInput] = useState(settings.youtube.width);

  const onInsertYouTubeEmbed = () => {
    editor.chain().focus().setYoutubeVideo({
      src: youTubeInput,
      width: youTubeWidthInput,
      height: youTubeHeightInput,
    }).run()
    setYouTubeInput('')
    setIsVisibleYouTubeDialog(false)
  }

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
  const [highlightPopoverVisible, setHighlightPopoverVisible] = useState(false);
  const colorInputRef = useRef();
  const highlightInputRef = useRef();

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
            <SingleSelect
              id="select1"
              aria-label="Text style"
              size="S"
              placeholder="Text style"
              onChange={(val) => onHeadingChange(editor, val)}
              value={selectedTextStyle}
            >
              <SingleSelectOption value={'paragraph'}>Paragraph</SingleSelectOption>
              { settings.headings.includes('h1') ? (<SingleSelectOption value={'h1'}>Heading 1</SingleSelectOption>) : null}
              { settings.headings.includes('h2') ? (<SingleSelectOption value={'h2'}>Heading 2</SingleSelectOption>) : null}
              { settings.headings.includes('h3') ? (<SingleSelectOption value={'h3'}>Heading 3</SingleSelectOption>) : null}
              { settings.headings.includes('h4') ? (<SingleSelectOption value={'h4'}>Heading 4</SingleSelectOption>) : null}
              { settings.headings.includes('h5') ? (<SingleSelectOption value={'h5'}>Heading 5</SingleSelectOption>) : null}
              { settings.headings.includes('h6') ? (<SingleSelectOption value={'h6'}>Heading 6</SingleSelectOption>) : null}
            </SingleSelect>
          </Box>

          <IconButtonGroup className="button-group">
            { settings.bold ? (<IconButton
              label="Bold"
              className={['large-icon', editor.isActive('bold') ? 'is-active' : ''].join(' ')}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold/>
            </IconButton>) : null }
            { settings.italic ? (<IconButton
              label="Italic"
              className={['large-icon', editor.isActive('italic') ? 'is-active' : ''].join(' ')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic/>
            </IconButton>) : null }
            { settings.strikethrough ? (<IconButton
              label="Strikethrough"
              className={['large-icon', editor.isActive('strike') ? 'is-active' : ''].join(' ')}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough/>
            </IconButton>) : null }
            { settings.underline ? (<IconButton
              label="Underline"
              className={['large-icon', editor.isActive('underline') ? 'is-active' : ''].join(' ')}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <Underline/>
            </IconButton>) : null }
            { settings.color ? (<IconButton
              label="Text color"
              onClick={() => setColorPopoverVisible(s => !s)}
            >
              <PaintBrush/>
            </IconButton>) : null }

            {settings.highlight ? (<IconButton
              label="Highlight"
              onClick={() => setHighlightPopoverVisible(s => !s)}
            >
              <Pencil />
            </IconButton>) : null}
            {/* text color input dialog */}
            <Modal.Root open={colorPopoverVisible} onOpenChange={setColorPopoverVisible}>
              <Modal.Content>
                <Modal.Header>
                  <Modal.Title>Select color</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Flex direction="column" alignItems="stretch" gap={2}>
                    <input
                      style={{width: '100%', height: '2em'}}
                      type="color"
                      ref={colorInputRef}
                      defaultValue={editor.getAttributes('textStyle').color || '#000000'}
                    />
                  </Flex>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={() => {
                    setColorPopoverVisible(false)
                    editor.commands.unsetColor()
                  }}
                    variant="tertiary">
                  Remove color
                  </Button>
                  <Button
                    onClick={() => {
                      editor.chain().focus().setColor(colorInputRef.current.value).run();
                      setColorPopoverVisible(false)
                    }}
                    variant="success-light">
                  Change color
                </Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Root>

            {/* highlight color input dialog */}
            <Modal.Root open={highlightPopoverVisible} onOpenChange={setHighlightPopoverVisible}>
              <Modal.Content>
                <Modal.Header>
                  <Modal.Title>Select color</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Flex direction="column" alignItems="stretch" gap={2}>
                    <input
                      style={{ width: '100%', height: '2em' }}
                      type="color"
                      ref={highlightInputRef}
                      defaultValue={editor.getAttributes('highlight').color || '#000000'}
                    />
                  </Flex>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={() => {
                    setHighlightPopoverVisible(false)
                    editor.commands.unsetHighlight()
                  }}
                    variant="tertiary">
                    Remove color
                  </Button>
                  <Button
                    onClick={() => {
                      editor.chain().focus().toggleHighlight({ color: highlightInputRef.current.value }).run();
                      setHighlightPopoverVisible(false)
                    }}
                    variant="success-light">
                    Change color
                  </Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Root>
          </IconButtonGroup>

          <IconButtonGroup className="button-group">
            { settings.align.includes('left') ? (<IconButton
              label="Align left"
              className={['medium-icon'].join(' ')}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
              <AiOutlineAlignLeft/>
            </IconButton>) : null }
            { settings.align.includes('center') ? (<IconButton
              label="Align center"
              className={['medium-icon'].join(' ')}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
              <AiOutlineAlignCenter/>
            </IconButton>) : null }
            { settings.align.includes('right') ? (<IconButton
              label="Align right"
              className={['medium-icon'].join(' ')}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
              <AiOutlineAlignRight/>
            </IconButton>) : null }
          </IconButtonGroup>

          <IconButtonGroup className="button-group">
            { settings.lists.includes('ul') ? (<IconButton
              label="Bullet list"
              className={['large-icon', editor.isActive('bulletList') ? 'is-active' : ''].join(' ')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <BulletList/>
            </IconButton>) : null }
            { settings.lists.includes('ol') ? (<IconButton
              label="Ordered list"
              className={['large-icon', editor.isActive('orderedList') ? 'is-active' : ''].join(' ')}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <NumberList/>
            </IconButton>) : null }
          </IconButtonGroup>

          <IconContext.Provider value={{ color: "#32324D"}}>
            <IconButtonGroup className="button-group">
              { settings.columns.includes('two') ? (<IconButton
                label="Two columns"
                className={['medium-icon', editor.isActive({'cssColumns': '2'}) ? 'is-active' : ''].join(' ')}
                onClick={() => editor.chain().focus().toggleColumns(2).run()}
              >
                <BsLayoutSplit />
              </IconButton>) : null }
              { settings.columns.includes('three') ? (<IconButton
                label="Three columns"
                className={['medium-icon', editor.isActive({'cssColumns': '3'}) ? 'is-active' : ''].join(' ')}
                onClick={() => editor.chain().focus().toggleColumns(3).run()}
              >
                <BsLayoutThreeColumns />
              </IconButton>) : null }
            </IconButtonGroup>
          </IconContext.Provider>

          <IconButtonGroup className="button-group">
            { settings.code ? (<IconButton
              label="Code"
              className={['large-icon', editor.isActive('codeBlock') ? 'is-active' : ''].join(' ')}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <Code/>
            </IconButton>) : null }

            { settings.blockquote ? (<IconButton
              label="Blockquote"
              className={['large-icon', editor.isActive('blockquote') ? 'is-active' : ''].join(' ')}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <GrBlockQuote/>
            </IconButton>) : null }

            <Modal.Root open={isVisibleLinkDialog} onOpenChange={setIsVisibleLinkDialog}>
              <Modal.Content>
                <Modal.Header>
                  <Modal.Title>Insert link</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Flex direction="column" alignItems="stretch" gap={2}>
                    <TextInput
                      label="Link URL"
                      placeholder="Write or paste the url here"
                      name="url" onChange={e => setLinkInput(e.target.value)}
                      value={linkInput}
                      aria-label="URL"/>
                    <Field.Root name="linkTarget" required>
                      <Field.Label>Link target</Field.Label>
                      <SingleSelect
                        id="linkTargetSelect"
                        placeholder="Select link target"
                        value={linkTargetInput}
                        onChange={setLinkTargetInput} >
                        <SingleSelectOption value={'_self'}>Self</SingleSelectOption>
                        <SingleSelectOption value={'_blank'}>Blank</SingleSelectOption>
                        <SingleSelectOption value={'_parent'}>Parent</SingleSelectOption>
                        <SingleSelectOption value={'_top'}>Top</SingleSelectOption>
                      </SingleSelect>
                    </Field.Root>
                  </Flex>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={() =>  {setLinkInput(''); setLinkTargetInput(''); setIsVisibleLinkDialog(false)}} variant="tertiary">
                  Cancel
                </Button>
                  <Button onClick={() => onInsertLink()} variant="success-light">
                  Insert link
                </Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Root>

            { settings.links.enabled ? (<IconButton
              label="Link"
              className={['medium-icon', editor.isActive('link') ? 'is-active' : ''].join(' ')}
              onClick={() => openLinkDialog()}
            >
              <Link/>
            </IconButton>) : null }

            { settings.image.enabled ? (<IconButton
              label={editor.isActive('image') ? 'Change image' : 'Insert image'}
              className={['medium-icon', editor.isActive('image') && !editor.getAttributes('image').src.includes(';base64') ? 'is-active' : ''].join(' ')}
              onClick={toggleMediaLib}
            >
              <Landscape/>
            </IconButton>) : null }

            <Modal.Root open={base64MediaLibVisible} onOpenChange={setBase64MediaLibVisible}>
              <Modal.Content>
                <Modal.Header>
                  <Modal.Title>Insert base64 image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Flex direction="column" alignItems="stretch" gap={2}>
                    <Textarea
                      label="Base64 content"
                      placeholder="Write or paste the base64 url here"
                      name="url" onChange={e => setBase64Input(e.target.value)}
                      value={base64Input}
                      style={{maxHeight: '200px'}}
                      aria-label="URL"/>

                    <Field.Root name="preview">
                      <Flex direction="column" alignItems="stretch" gap={1}>
                        <Field.Label>Preview</Field.Label>
                        {base64Input.length ? <img style={{maxWidth: '100%'}} src={base64Input} alt=""/>: null}
                      </Flex>
                    </Field.Root>

                  </Flex>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={() =>  {setBase64Input(''); setBase64MediaLibVisible(false)}} variant="tertiary">
                  Cancel
                </Button>
                  <Button disabled={base64Input.length === 0} onClick={() => onInsertBase64Image()} variant="success-light">
                  Insert image
                </Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Root>

            { settings.image.allowBase64 ? (<IconButton
              label={editor.isActive('image') ? 'Change image' : 'Insert base64 image'}
              className={['medium-icon', editor.isActive('image') && editor.getAttributes('image').src.includes(';base64') ? 'is-active' : ''].join(' ')}
              onClick={openBase64Dialog}
            >
              <FaImage/>
            </IconButton>) : null }

            { settings.table ? (<IconButton
              label="Table"
              className={['large-icon', editor.isActive('table') ? 'is-active' : ''].join(' ')}
              onClick={() => editor.chain().focus().insertTable({cols: 3, row: 3, withHeaderRow: false}).run()}
            >
              <AiOutlineTable/>
            </IconButton>) : null }

            { settings.youtube.enabled ? (<IconButton
              label="YouTube"
              className={['large-icon', editor.isActive('youtube') ? 'is-active' : ''].join(' ')}
              onClick={() => setIsVisibleYouTubeDialog(true)}
            >
              <AiFillYoutube/>
            </IconButton>) : null }

            { settings.horizontal ? (<IconButton
              label="Horizontal line"
              className={['large-icon'].join(' ')}
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              <AiOutlineLine/>
            </IconButton>) : null }

            <Modal.Root open={isVisibleYouTubeDialog} onOpenChange={setIsVisibleYouTubeDialog}>
              <Modal.Content>
                <Modal.Header>
                  <Modal.Title>Insert YouTube embed</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Flex direction="column" alignItems="stretch" gap={2}>
                    <TextInput
                      label="YouTube URL"
                      placeholder="Write or paste the url here"
                      name="url" onChange={e => setYouTubeInput(e.target.value)}
                      value={youTubeInput}
                      aria-label="YouTube URL"/>


                    <Flex gap={2}>
                      <TextInput
                        label="YouTube video width"
                        type="number"
                        placeholder="width of the embed"
                        name="url" onChange={e => setYouTubeWidthInput(e.target.value)}
                        value={youTubeWidthInput}
                        aria-label="YouTube video width"/>

                      <TextInput
                        label="YouTube video height"
                        type="number"
                        placeholder="height of the embed"
                        name="url" onChange={e => setYouTubeHeightInput(e.target.value)}
                        value={youTubeHeightInput}
                        aria-label="YouTube video height"/>
                    </Flex>
                  </Flex>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={() =>  {setYouTubeInput(''); setIsVisibleYouTubeDialog(false)}} variant="tertiary">
                  Cancel
                </Button>
                  <Button disabled={youTubeInput.length === 0} onClick={() => onInsertYouTubeEmbed()} variant="success-light">
                  Insert YouTube embed
                </Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Root>
          </IconButtonGroup>
        </Flex>
      </Flex>
    </Box>
  )
}
