// admin/src/components/Wysiwyg/Wysiwyg.tsx
import PropTypes3 from "prop-types";
import { Stack as Stack2 } from "@strapi/design-system/Stack";
import { Box as Box4 } from "@strapi/design-system/Box";
import { FieldLabel as FieldLabel2 } from "@strapi/design-system/Field";
import { Typography } from "@strapi/design-system/Typography";

// admin/src/components/Editor/index.tsx
import { Fragment, useState as useState2 } from "react";
import PropTypes2 from "prop-types";
import { BubbleMenu, Editor as TiptapEditor, EditorContent } from "@tiptap/react";

// admin/src/components/Editor/Toolbar.tsx
import { useRef, useState } from "react";
import Bold from "@strapi/icons/Bold";
import Italic from "@strapi/icons/Italic";
import IndentIncrease from "@strapi/icons/IndentIncrease";
import IndentDecrease from "@strapi/icons/IndentDecrease";
import Strikethrough from "@strapi/icons/StrikeThrough";
import Underline from "@strapi/icons/Underline";
import { AiOutlineAlignCenter, AiOutlineAlignLeft, AiOutlineAlignRight, AiOutlineTable } from "react-icons/ai";
import BulletList from "@strapi/icons/BulletList";
import NumberList from "@strapi/icons/NumberList";
import { BsLayoutSplit, BsLayoutThreeColumns } from "react-icons/bs";
import { MdHorizontalRule } from "react-icons/md";
import { RiFontSize2 } from "react-icons/ri";
import { CgFontHeight } from "react-icons/cg";
import Code from "@strapi/icons/Code";
import { GrBlockQuote } from "react-icons/gr";
import Link from "@strapi/icons/Link";
import Landscape from "@strapi/icons/Landscape";
import { FaImage } from "react-icons/fa";
import PaintBrush from "@strapi/icons/PaintBrush";
import { IconContext } from "react-icons";
import { Box } from "@strapi/design-system/Box";
import { Flex } from "@strapi/design-system/Flex";
import { Button } from "@strapi/design-system/Button";
import { TextInput } from "@strapi/design-system/TextInput";
import { Textarea } from "@strapi/design-system/Textarea";
import { Stack } from "@strapi/design-system/Stack";
import { Dialog, DialogBody, DialogFooter } from "@strapi/design-system/Dialog";
import { IconButton, IconButtonGroup } from "@strapi/design-system/IconButton";
import { Option, Select } from "@strapi/design-system/Select";
import { Field, FieldLabel } from "@strapi/design-system/Field";

// admin/src/components/Editor/FakeInput.tsx
import React from "react";
var FakeInput = (props) => {
  const { value, min, max, options = [], onChange, pattern, placeholder, step = 1 } = props;
  const [edit, setEdit] = React.useState(value ?? "");
  React.useLayoutEffect(() => {
    let next = value ?? "";
    if (next !== edit) {
      setEdit(next);
    }
  }, [value]);
  const doChange = (v) => {
    onChange?.(v ?? edit);
  };
  const setValue = (v, change) => {
    if (pattern && !pattern.test(String(v))) {
      return;
    }
    if (min !== void 0 || max !== void 0) {
      v = parseFloat(String(v));
    }
    if (Number.isNaN(v)) {
      v = 0;
    }
    if (min !== void 0) {
      v = v < min ? min : v;
    }
    if (max !== void 0) {
      v = v > max ? max : v;
    }
    if (change) {
      doChange(String(v));
    }
    setEdit(String(v));
  };
  return <div className="FakeInputGroup">
    <style>{`
        .FakeInputGroup {
          display: inline-flex;
          border: 1px solid #a3a0a0;
          border-radius: 0.2rem;
          position: relative;
          background-color: white;
        }

        .FakeInputGroup ._option {
          padding: 0.1rem;
        }

        .FakeInputGroup ._option:hover {
          background-color: lightgrey;
        }

        .FakeInputGroup ._pop {
          display: none;
          position: absolute;
          z-index: 10;
          top: 100%;
          left: 50%;
          padding: 0.2rem;
          border: 1px #7f7f7f solid;
          border-radius: 0.2rem;
          width: 5rem;
          box-sizing: border-box;
          background-color: white;
          transform: translateX(-50%);

          flex-flow: column;
          gap: 0.2rem;
        }

        .FakeInputGroup:focus-within ._pop,
        .FakeInputGroup:hover ._pop {
          display: flex;
        }

        .FakeInputGroup button:not(._input) {
          width: 1.2rem;
        }

        .FakeInputGroup ._input {
          padding: .4rem 0;
          border: 1px solid #a3a0a0;
          border-top: none;
          border-bottom: none;
          width: 4rem;
        }

        .FakeInputGroup ._input:focus {
          border-color: blue;
        }
      `}</style>
    <button type="button" onClick={() => setValue((parseFloat(edit || "0") - step).toFixed(2), true)}>-</button>
    <button type="button" onKeyUp={(e) => {
      switch (e.key) {
        case "Backspace":
          setEdit(String(edit).substring(0, String(edit).length - 1));
          break;
        case "Enter":
          doChange();
          break;
        case "Esc":
        case "Escape":
          setEdit(value ?? "");
          break;
        default:
          if (e.key.length === 1) {
            let next = String(edit) + e.key;
            setEdit(next);
          }
      }
    }} onBlur={() => setValue(edit, true)} className="_input">{edit || placeholder}</button>
    <button type="button" onClick={() => setValue((parseFloat(edit || "0") + step).toFixed(2), true)}>+</button>
    <div className="_pop">{options.map((v, i) => <div key={i} className="_option" onClick={() => {
      setEdit(v.value);
      onChange?.(v.value);
    }}>{v.label || v.value}</div>)}</div>
  </div>;
};

// admin/src/components/Editor/Toolbar.tsx
var onFontFamilyChange = (editor, type) => {
  if (!type) {
    editor.chain().focus().unsetFontFamily().run();
    return;
  }
  editor.chain().focus().setFontFamily(type).run();
};
var onHeadingChange = (editor, type) => {
  switch (type) {
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      editor.chain().focus().toggleHeading({ level: parseInt(type.replace("h", "")) }).run();
      break;
    case "paragraph":
      editor.chain().focus().setParagraph().run();
      break;
  }
};
var Toolbar = ({ editor, toggleMediaLib, settings }) => {
  const [isVisibleLinkDialog, setIsVisibleLinkDialog] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [linkTargetInput, setLinkTargetInput] = useState("");
  const [base64MediaLibVisible, setBase64MediaLibVisible] = useState(false);
  const [base64Input, setBase64Input] = useState("");
  const handleToggleBase54MediaLib = () => setBase64MediaLibVisible((prev) => !prev);
  const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  const isValidBase64String = base64regex.test(base64Input);
  const openBase64Dialog = () => {
    if (editor.getAttributes("image").src && editor.getAttributes("image").src.includes(";base64"))
      setBase64Input(editor.getAttributes("image").src);
    setBase64MediaLibVisible(true);
  };
  const onInsertBase64Image = () => {
    editor.chain().focus().setImage({ src: base64Input }).run();
    setBase64Input("");
    setBase64MediaLibVisible(false);
  };
  const [colorPopoverVisible, setColorPopoverVisible] = useState(false);
  const colorInputRef = useRef(null);
  const openLinkDialog = () => {
    const previousUrl = editor.getAttributes("link").href;
    const previousTarget = editor.getAttributes("link").target;
    if (previousUrl)
      setLinkInput(previousUrl);
    if (previousTarget)
      setLinkTargetInput(previousTarget);
    setIsVisibleLinkDialog(true);
  };
  const onInsertLink = () => {
    if (linkInput === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkInput, target: linkTargetInput }).run();
    }
    setIsVisibleLinkDialog(false);
    setLinkInput("");
    setLinkTargetInput("");
  };
  if (!editor) {
    return null;
  }
  let selectedTextStyle = "none";
  if (editor.isActive("heading", { level: 1 }))
    selectedTextStyle = "h1";
  if (editor.isActive("heading", { level: 2 }))
    selectedTextStyle = "h2";
  if (editor.isActive("heading", { level: 3 }))
    selectedTextStyle = "h3";
  if (editor.isActive("heading", { level: 4 }))
    selectedTextStyle = "h4";
  if (editor.isActive("heading", { level: 5 }))
    selectedTextStyle = "h5";
  if (editor.isActive("heading", { level: 6 }))
    selectedTextStyle = "h6";
  if (editor.isActive("paragraph"))
    selectedTextStyle = "paragraph";
  let selectedFontFamily = editor.getAttributes("textStyle").fontFamily;
  const fonts = [
    "PingFang SC",
    "Helvetica Neue",
    "Helvetica",
    "微软雅黑",
    "Verdana",
    "Courier New",
    "monospace"
  ];
  let selectedFontSize = editor.getAttributes("textStyle").fontSize?.replace("px", "");
  if (selectedFontSize) {
    selectedFontSize = parseInt(selectedFontSize);
  }
  let lineHeight = editor.getAttributes("textStyle").lineHeight;
  const fontSizes = [8, 12, 16, 18, 20, 24, 30, 32, 36, 40, 50, 60, 72, 80];
  const lineHeights = [0.8, 1, 1.1, 1.2, 1.5, 1.8, 2, 2.5, 3];
  return <Box padding={2} background="neutral100" className="menu-bar"><Flex justifyContent="space-between"><Flex style={{ flexWrap: "wrap" }}>
    <Box className="button-group"><Select id="select1" required size="S" placeholder="Text style" onChange={(val) => onHeadingChange(editor, val)} value={selectedTextStyle}>
      <Option value="paragraph">Paragraph</Option>
      {settings.headings.includes("h1") ? <Option value="h1">Heading 1</Option> : null}
      {settings.headings.includes("h2") ? <Option value="h2">Heading 2</Option> : null}
      {settings.headings.includes("h3") ? <Option value="h3">Heading 3</Option> : null}
      {settings.headings.includes("h4") ? <Option value="h4">Heading 4</Option> : null}
      {settings.headings.includes("h5") ? <Option value="h5">Heading 5</Option> : null}
      {settings.headings.includes("h6") ? <Option value="h6">Heading 6</Option> : null}
    </Select></Box>
    <Box className="button-group" style={{ width: 150 }}><Select id="select2" required size="S" placeholder="Font family" onChange={(val) => onFontFamilyChange(editor, val)} value={selectedFontFamily}>
      <Option value="">Default</Option>
      {fonts.map((v, i) => <Option key={i} value={v}>{v}</Option>)}
    </Select></Box>
    <Box style={{ display: "flex", alignItems: "center" }}>
      <RiFontSize2 style={{ width: 32, height: 18, paddingLeft: 6, paddingRight: 4 }} />
      <FakeInput value={selectedFontSize} options={fontSizes.map((v) => ({ value: v }))} min={8} max={120} placeholder="Auto" onChange={(val) => {
        if (!val) {
          editor.chain().focus().unsetFontSize().run();
        } else {
          editor.chain().focus().setFontSize(val).run();
        }
      }} />
    </Box>
    <Box style={{ display: "flex", alignItems: "center" }}>
      <CgFontHeight style={{ width: 32, height: 18, paddingLeft: 6, paddingRight: 4 }} />
      <FakeInput value={lineHeight} options={lineHeights.map((v) => ({ value: v }))} min={0.5} step={0.1} max={120} placeholder="Auto" onChange={(val) => {
        if (!val) {
          editor.chain().focus().unsetLineHeight().run();
        } else {
          editor.chain().focus().setLineHeight(val).run();
        }
      }} />
    </Box>
    <IconButtonGroup className="button-group" style={{ display: "flex" }}>
      <IconButton icon={<IndentDecrease />} onClick={() => editor.commands.decreaseIndent()} />
      <IconButton icon={<IndentIncrease />} onClick={() => editor.commands.increaseIndent()} />
    </IconButtonGroup>
    <IconButtonGroup className="button-group">
      {settings.bold ? <IconButton icon={<Bold />} label="Bold" className={editor.isActive("bold") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleBold().run()} /> : null}
      {settings.italic ? <IconButton icon={<Italic />} label="Italic" className={editor.isActive("italic") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleItalic().run()} /> : null}
      {settings.strikethrough ? <IconButton icon={<Strikethrough />} label="Strikethrough" className={editor.isActive("strike") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleStrike().run()} /> : null}
      {settings.underline ? <IconButton icon={<Underline />} label="Underline" className={editor.isActive("underline") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleUnderline().run()} /> : null}
      {settings.color ? <IconButton icon={<PaintBrush />} label="Text color" onClick={() => {
        setColorPopoverVisible((s) => !s);
        setTimeout(() => {
          colorInputRef.current.value = editor.getAttributes("textStyle").color;
        }, 10);
      }} /> : null}
      <Dialog onClose={() => setColorPopoverVisible(false)} title="Select color" isOpen={colorPopoverVisible}>
        <DialogBody><Stack spacing={2}><input style={{ width: "100%", height: "2em" }} type="color" ref={colorInputRef} /></Stack></DialogBody>
        <DialogFooter startAction={<Button onClick={() => {
          setColorPopoverVisible(false);
          editor.commands.unsetColor();
        }} variant="tertiary">Remove color</Button>} endAction={<Button onClick={() => {
          editor.chain().focus().setColor(colorInputRef.current.value).run();
          setColorPopoverVisible(false);
        }} variant="success-light">Change color</Button>} />
      </Dialog>
    </IconButtonGroup>
    <IconButtonGroup className="button-group">
      {settings.align.includes("left") ? <IconButton icon={<AiOutlineAlignLeft />} label="Align left" onClick={() => editor.chain().focus().setTextAlign("left").run()} /> : null}
      {settings.align.includes("center") ? <IconButton icon={<AiOutlineAlignCenter />} label="Align center" onClick={() => editor.chain().focus().setTextAlign("center").run()} /> : null}
      {settings.align.includes("right") ? <IconButton icon={<AiOutlineAlignRight />} label="Align right" onClick={() => editor.chain().focus().setTextAlign("right").run()} /> : null}
    </IconButtonGroup>
    <IconButtonGroup className="button-group">
      {settings.lists.includes("ul") ? <IconButton icon={<BulletList />} label="Bullet list" className={editor.isActive("bulletList") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleBulletList().run()} /> : null}
      {settings.lists.includes("ol") ? <IconButton icon={<NumberList />} label="Ordered list" className={editor.isActive("orderedList") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleOrderedList().run()} /> : null}
    </IconButtonGroup>
    <IconContext.Provider value={{ color: "#32324D" }}><IconButtonGroup className="button-group">
      {settings.columns.includes("two") ? <IconButton icon={<BsLayoutSplit />} label="Two columns" className={editor.isActive({ "cssColumns": "2" }) ? "is-active" : ""} onClick={() => editor.chain().focus().toggleColumns(2).run()} /> : null}
      {settings.columns.includes("three") ? <IconButton icon={<BsLayoutThreeColumns />} label="Three columns" className={editor.isActive({ "cssColumns": "3" }) ? "is-active" : ""} onClick={() => editor.chain().focus().toggleColumns(3).run()} /> : null}
    </IconButtonGroup></IconContext.Provider>
    <IconButtonGroup className="button-group">
      {settings.code ? <IconButton icon={<Code />} label="Code" className={editor.isActive("codeBlock") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleCodeBlock().run()} /> : null}
      {settings.blockquote ? <IconButton icon={<GrBlockQuote />} label="Blockquote" className={editor.isActive("blockquote") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleBlockquote().run()} /> : null}
      <Dialog onClose={() => setIsVisibleLinkDialog(false)} title="Insert link" isOpen={isVisibleLinkDialog}>
        <DialogBody><Stack spacing={2}>
          <TextInput label="Link URL" placeholder="Write or paste the url here" name="url" onChange={(e) => setLinkInput(e.target.value)} value={linkInput} aria-label="URL" />
          <Select id="linkTargetSelect" label="Link target" required placeholder="Select link target" value={linkTargetInput} onChange={setLinkTargetInput}>
            <Option value="_self">Self</Option>
            <Option value="_blank">Blank</Option>
            <Option value="_parent">Parent</Option>
            <Option value="_top">Top</Option>
          </Select>
        </Stack></DialogBody>
        <DialogFooter startAction={<Button onClick={() => {
          setLinkInput("");
          setLinkTargetInput("");
          setIsVisibleLinkDialog(false);
        }} variant="tertiary">Cancel</Button>} endAction={<Button onClick={() => onInsertLink()} variant="success-light">Insert link</Button>} />
      </Dialog>
      {settings.links.enabled ? <IconButton icon={<Link />} label="Link" className={editor.isActive("link") ? "is-active" : ""} onClick={() => openLinkDialog()} /> : null}
      {settings.image.enabled ? <IconButton icon={<Landscape />} label={editor.isActive("image") ? "Change image" : "Insert image"} className={editor.isActive("image") && !editor.getAttributes("image").src.includes(";base64") ? "is-active" : ""} onClick={toggleMediaLib} /> : null}
      <Dialog onClose={() => setBase64MediaLibVisible(false)} title="Insert base64 image" isOpen={base64MediaLibVisible}>
        <DialogBody><Stack spacing={2}>
          <Textarea label="Base64 content" placeholder="Write or paste the base64 url here" name="url" onChange={(e) => setBase64Input(e.target.value)} value={base64Input} style={{ maxHeight: "200px" }} aria-label="URL" />
          <Field name="preview"><Stack spacing={1}>
            <FieldLabel>Preview</FieldLabel>
            {base64Input.length ? <img style={{ maxWidth: "100%" }} src={base64Input} alt="" /> : null}
          </Stack></Field>
        </Stack></DialogBody>
        <DialogFooter startAction={<Button onClick={() => {
          setBase64Input("");
          setBase64MediaLibVisible(false);
        }} variant="tertiary">Cancel</Button>} endAction={<Button disabled={base64Input.length === 0} onClick={() => onInsertBase64Image()} variant="success-light">Insert image</Button>} />
      </Dialog>
      {settings.image.allowBase64 ? <IconButton icon={<FaImage />} label={editor.isActive("image") ? "Change image" : "Insert base64 image"} className={editor.isActive("image") && editor.getAttributes("image").src.includes(";base64") ? "is-active" : ""} onClick={openBase64Dialog} /> : null}
      {settings.table ? <IconButton icon={<AiOutlineTable />} label="Table" className={editor.isActive("table") ? "is-active" : ""} onClick={() => editor.chain().focus().insertTable({ cols: 3, row: 3, withHeaderRow: false }).run()} /> : null}
      <IconButton icon={<MdHorizontalRule />} label="Horizontal Rule" className={editor.isActive("horizontalRule") ? "is-active" : ""} onClick={() => editor.chain().focus().setHorizontalRule().run()} />
    </IconButtonGroup>
  </Flex></Flex></Box>;
};

// admin/src/components/MediaLib/index.tsx
import { prefixFileUrlWithBackendUrl, useLibrary } from "@strapi/helper-plugin";
import PropTypes from "prop-types";
var MediaLib = ({ isOpen, onChange, onToggle }) => {
  const { components } = useLibrary();
  const MediaLibraryDialog = components["media-library"];
  const handleSelectAssets = (files) => {
    const formattedFiles = files.map((f) => ({
      alt: f.alternativeText || f.name,
      url: prefixFileUrlWithBackendUrl(f.url),
      mime: f.mime
    }));
    onChange(formattedFiles);
  };
  if (!isOpen) {
    return null;
  }
  return <MediaLibraryDialog onClose={onToggle} onSelectAssets={handleSelectAssets} />;
};
MediaLib.defaultProps = {
  isOpen: false,
  onChange: () => {
  },
  onToggle: () => {
  }
};
MediaLib.propTypes = {
  isOpen: PropTypes.bool,
  onChange: PropTypes.func,
  onToggle: PropTypes.func
};
var MediaLib_default = MediaLib;

// admin/src/components/Editor/index.tsx
import { Box as Box3 } from "@strapi/design-system/Box";
import { Flex as Flex2 } from "@strapi/design-system/Flex";
import { IconButton as IconButton2, IconButtonGroup as IconButtonGroup2 } from "@strapi/design-system/IconButton";

// admin/src/components/Editor/styles.tsx
import styled from "styled-components";
import { Box as Box2 } from "@strapi/design-system/Box";
var Styles_default = styled(Box2)`
  ${({ theme }) => {
}}
  .menu-bar {
    .is-active {
      background: ${({ theme }) => theme.colors.primary200};
      color: ${({ theme }) => theme.colors.neutral0};
    }

    .button-group {
      border: 0.25em solid ${({ theme }) => theme.colors.neutral100};
    }

    &.floating {
      border: 1px solid ${({ theme }) => theme.colors.neutral200};
      background: ${({ theme }) => theme.colors.neutral100};
      box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
      rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
    }
  }

  .ProseMirror {
    outline: none;
    line-height: 1.25rem;
    color: ${({ theme }) => theme.colors.neutral800};
    min-height: 80px;

    > * + * {
      margin-top: 0.75em;
    }

    .ProseMirror-selectednode {
      border: 5px solid ${({ theme }) => theme.colors.neutral800};
      box-sizing: border-box;
    }

    strong {
      font-weight: bold;
    }

    em {
      font-style: italic;
    }

    ul,
    ol {
      margin-left: 1rem;
      padding: 0 1rem;

      li {
        margin-bottom: 0.5rem;

        &:last-child {
          margin-bottom: 0rem;
        }
      }
    }

    ul {
      li {
        list-style: disc;
      }
    }

    ol {
      li {
        list-style: decimal;
      }
    }

    h1 {
      font-size: 2em;
    }

    h2 {
      font-size: 1.75em;
    }

    h3 {
      font-size: 1.5em;
    }

    h4 {
      font-size: 1.25em;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.1;
    }

    code {
      background-color: rgba(#616161, 0.1);
      color: #616161;
    }

    pre {
      background: #0d0d0d;
      color: #fff;
      font-family: "JetBrainsMono", monospace;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;

      code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    blockquote {
      padding-left: 1rem;
      border-left: 2px solid rgba(#0d0d0d, 0.1);
    }

    hr {
      border: 0;
      border-top: 2px solid rgba(13, 13, 13, 0.1);
      margin: 1rem 0;
    }

    table {
      width: 100%;
      table-layout: fixed;
      border: 1px solid ${({ theme }) => theme.colors.neutral600};

      th,
      td {
        border: 1px solid ${({ theme }) => theme.colors.neutral600};
        padding: ${({ theme }) => theme.spaces[2]};

        &.selectedCell {
          background: ${({ theme }) => theme.colors.primary500};
        }
      }

      th {
        background: ${({ theme }) => theme.colors.neutral300};
        vertical-align: middle;
      }
    }

    video {
      max-width: 100%;
    }
  }
`;

// admin/src/components/Editor/index.tsx
import {
  AiOutlineDelete,
  AiOutlineDeleteColumn,
  AiOutlineDeleteRow,
  AiOutlineInsertRowAbove,
  AiOutlineInsertRowBelow,
  AiOutlineInsertRowLeft,
  AiOutlineInsertRowRight,
  AiOutlineMergeCells,
  AiOutlineSplitCells
} from "react-icons/ai";
var TableMenuBar = (editor) => {
  return <Fragment key="tableMenubar">
    <IconButtonGroup2 className="button-group">
      <IconButton2 icon={<AiOutlineInsertRowBelow />} label="Insert row below" onClick={() => editor.chain().focus().addRowAfter().run()} />
      <IconButton2 icon={<AiOutlineInsertRowAbove />} label="Insert row above" onClick={() => editor.chain().focus().addRowBefore().run()} />
      <IconButton2 icon={<AiOutlineInsertRowLeft />} label="Insert Column to the left" onClick={() => editor.chain().focus().addColumnBefore().run()} />
      <IconButton2 icon={<AiOutlineInsertRowRight />} label="Insert Column to the right" onClick={() => editor.chain().focus().addColumnAfter().run()} />
    </IconButtonGroup2>
    <IconButtonGroup2 className="button-group">
      <IconButton2 icon={<AiOutlineDeleteRow />} label="Delete row" onClick={() => editor.chain().focus().deleteRow().run()} />
      <IconButton2 icon={<AiOutlineDeleteColumn />} label="Delete column" onClick={() => editor.chain().focus().deleteColumn().run()} />
    </IconButtonGroup2>
    <IconButtonGroup2 className="button-group">
      <IconButton2 icon={<AiOutlineMergeCells />} label="Merge cells" onClick={() => editor.chain().focus().mergeCells().run()} />
      <IconButton2 icon={<AiOutlineSplitCells />} label="Split cells" onClick={() => editor.chain().focus().splitCell().run()} />
    </IconButtonGroup2>
    <IconButtonGroup2 className="button-group"><IconButton2 icon={<AiOutlineDelete />} label="Delete table" onClick={() => {
      if (window.confirm("Are you sure you want to delete the table?")) {
        editor.chain().focus().deleteTable().run();
      }
    }} /></IconButtonGroup2>
  </Fragment>;
};
var BubbleMenuComponent = ({ editor }) => {
  if (editor) {
    let menuBars = [];
    if (editor.isActive("table")) {
      menuBars.push(TableMenuBar(editor));
    }
    return <BubbleMenu editor={editor} tippyOptions={{ zIndex: 2, maxWidth: "450px" }}>{menuBars.length ? <Flex2 padding={2} className="menu-bar floating" style={{ flexWrap: "wrap" }}>{menuBars}</Flex2> : null}</BubbleMenu>;
  }
  return null;
};
var Editor = ({ editor, settings }) => {
  const [mediaLibVisible, setMediaLibVisible] = useState2(false);
  const [forceInsert, setForceInsert] = useState2(false);
  const handleToggleMediaLib = () => setMediaLibVisible((prev) => !prev);
  const handleChangeAssets = (assets) => {
    if (!forceInsert && (editor.isActive("image") || editor.isActive("video"))) {
      assets.map((asset) => {
        if (asset.mime.includes("image")) {
          editor.chain().focus().setImage({ src: asset.url }).run();
        }
        if (asset.mime.includes("video")) {
          editor.chain().focus().setVideo({ src: asset.url }).run();
        }
      });
    } else {
      assets.map((asset) => {
        if (asset.mime.includes("image")) {
          editor.commands.setImage({ src: asset.url, alt: asset.alt });
        }
        if (asset.mime.includes("video")) {
          editor.commands.setVideo({ src: asset.url, alt: asset.alt });
        }
      });
    }
    setForceInsert(false);
    handleToggleMediaLib();
  };
  if (!settings) {
    return null;
  }
  return <Styles_default>
    <Box3 hasRadius={true} overflow="hidden" borderWidth="1px" borderStyle="solid" borderColor="neutral200">
      <Toolbar editor={editor} toggleMediaLib={handleToggleMediaLib} settings={settings} />
      <BubbleMenuComponent editor={editor} toggleMediaLib={handleToggleMediaLib} />
      <Box3 padding={2} background="neutral0" maxHeight="600px" style={{ resize: "vertical", overflow: "auto" }}><EditorContent editor={editor} /></Box3>
    </Box3>
    {settings.other && settings.other.wordcount ? <Box3 marginTop="5px" color="neutral600">
      {editor.storage.characterCount.words()}
      {" "}
      {editor.storage.characterCount.words() > 1 ? "words" : "word"}
    </Box3> : null}
    <MediaLib_default isOpen={mediaLibVisible} onChange={handleChangeAssets} onToggle={handleToggleMediaLib} />
  </Styles_default>;
};
Editor.defaultProps = {
  value: "",
  disabled: false
};
Editor.propTypes = {
  onChange: PropTypes2.func.isRequired,
  name: PropTypes2.string.isRequired,
  editor: PropTypes2.instanceOf(TiptapEditor).isRequired,
  value: PropTypes2.string,
  disabled: PropTypes2.bool,
  settings: PropTypes2.object
};
var Editor_default = Editor;

// admin/src/components/Wysiwyg/Wysiwyg.tsx
import { useIntl } from "react-intl";

// utils/api.js
import { request } from "@strapi/helper-plugin";
function getSettings() {
  return request("/strapi-tiptap-editor/");
}

// admin/src/components/Wysiwyg/Wysiwyg.tsx
import { useQuery } from "react-query";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import TextAlignExtension from "@tiptap/extension-text-align";
import TableExtension from "@tiptap/extension-table";
import TableRowExtension from "@tiptap/extension-table-row";
import TableCellExtension from "@tiptap/extension-table-cell";
import TableHeaderExtension from "@tiptap/extension-table-header";
import TextStyleExtension from "@tiptap/extension-text-style";
import CharacterCountExtension from "@tiptap/extension-character-count";
import HorizontalRuleExtension from "@tiptap/extension-horizontal-rule";
import { Color as ColorExtension } from "@tiptap/extension-color";
import FontFamilyExtension from "@tiptap/extension-font-family";

// admin/src/components/Wysiwyg/extensions/indent.ts
import { Extension } from "@tiptap/core";
var IndentExtension = Extension.create({
  name: "indent",
  addOptions() {
    return {
      types: ["listItem", "heading", "paragraph", "blockquote"],
      min: 0,
      max: Number.POSITIVE_INFINITY
    };
  },
  addCommands() {
    return {
      decreaseIndent: (backspace) => ({ chain, state }) => {
        const selection = state.selection;
        if (backspace && (selection.$anchor.parentOffset > 0 || selection.from !== selection.to))
          return false;
        return chain().setMarginLeft(update({ step: -1, unit: "rem", min: this.options.min, max: this.options.max })).run();
      },
      increaseIndent: () => ({ chain }) => chain().setMarginLeft(update({ unit: "rem", min: this.options.min, max: this.options.max })).run(),
      unsetIndent: () => ({ commands }) => {
        return commands.unsetMarginLeft();
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.increaseIndent(),
      "Shift-Tab": () => this.editor.commands.decreaseIndent(),
      Backspace: () => this.editor.commands.decreaseIndent(true)
    };
  }
});
function update({ step = 1, min = 0, max = Number.POSITIVE_INFINITY, unit = "" } = {}) {
  return (last, delta = step) => {
    let n;
    if (last === void 0 || last === null) {
      n = 0;
    } else if (typeof last === "number") {
      n = last;
    } else {
      n = parseFloat(last);
      if (Number.isNaN(n)) {
        n = 0;
      }
    }
    n += delta;
    n = clamp(n, min, max);
    let frac = 0;
    let abs = Math.abs(delta);
    if (abs >= 1) {
    } else if (abs >= 0.1) {
      frac = 1;
    } else if (abs >= 0.01) {
      frac = 2;
    } else if (abs >= 1e-3) {
      frac = 3;
    } else {
      frac = 4;
    }
    return `${n.toFixed(frac)}${unit}`;
  };
}
var clamp = (val, min, max) => val < min ? min : val > max ? max : val;

// admin/src/components/Wysiwyg/extensions/css-columns.ts
import { Extension as Extension2 } from "@tiptap/react";
var css_columns_default = Extension2.create({
  name: "cssColumns",
  addOptions() {
    return {
      types: [],
      columnTypes: [2, 3],
      defaultColumnType: "two"
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          cssColumns: {
            default: null,
            renderHTML: (attributes) => {
              if (attributes.cssColumns === null)
                return {};
              return {
                style: `column-count: ${attributes.cssColumns}`
              };
            },
            parseHTML: (element) => element.style.columnCount || null
          }
        }
      }
    ];
  },
  addCommands() {
    return {
      toggleColumns: (columnType) => ({ commands, editor }) => {
        if (!editor.isActive({ cssColumns: columnType }))
          return this.options.types.every((type) => commands.updateAttributes(type, { cssColumns: columnType }));
        return this.options.types.every((type) => commands.resetAttributes(type, "cssColumns"));
      },
      unsetColumns: () => ({ commands }) => {
        return this.options.types.every((type) => commands.resetAttributes(type, "cssColumns"));
      }
    };
  }
});

// admin/src/components/Wysiwyg/extensions/video.ts
import { mergeAttributes, Node } from "@tiptap/core";
var video_default = Node.create({
  name: "video",
  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {}
    };
  },
  inline() {
    return this.options.inline;
  },
  group() {
    return this.options.inline ? "inline" : "block";
  },
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null
      },
      alt: {
        default: null
      },
      title: {
        default: null
      },
      controls: {
        default: true
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: this.options.allowBase64 ? "video[src]" : 'video[src]:not([src^="data:"])'
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["video", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },
  addCommands() {
    return {
      setVideo: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options
        });
      }
    };
  }
});

// admin/src/components/Wysiwyg/extensions/text-styles.ts
import { Extension as Extension3 } from "@tiptap/core";
import "@tiptap/extension-text-style";
var LineHeight = createSubTextStyle({
  name: "lineHeight",
  cssName: "line-height"
});
var renderNumberToPx = (v) => /^\d+$/.test(String(v)) ? `${v}px` : v;
var FontSize = createSubTextStyle({
  name: "fontSize",
  cssName: "font-size",
  renderValue: renderNumberToPx
});
var MarginLeft = createStyle({
  name: "marginLeft",
  cssName: "margin-left",
  renderValue: renderNumberToPx
});
var MarginTop = createStyle({
  name: "marginTop",
  cssName: "margin-top",
  renderValue: renderNumberToPx
});
var MarginRight = createStyle({
  name: "marginRight",
  cssName: "margin-right",
  renderValue: renderNumberToPx
});
var MarginBottom = createStyle({
  name: "marginBottom",
  cssName: "margin-bottom",
  renderValue: renderNumberToPx
});
var TextIndent = createSubTextStyle({
  name: "textIndent",
  cssName: "text-indent",
  renderValue: renderNumberToPx
});
var LetterSpacing = createSubTextStyle({
  name: "letterSpacing",
  cssName: "letter-spacing",
  renderValue: renderNumberToPx
});
var BlockStyles = [MarginLeft, MarginRight, MarginTop, MarginBottom];
var TextFormats = [LetterSpacing, LineHeight, FontSize];
function createSubTextStyle(o) {
  const { name, styleName = name, cssName, renderValue = (v) => v } = o;
  const fn = name.charAt(0).toUpperCase() + name.slice(1);
  return Extension3.create({
    name,
    addOptions() {
      return {
        types: ["textStyle"],
        defaultUnit: ""
      };
    },
    addGlobalAttributes() {
      return [
        {
          types: this.options.types,
          attributes: {
            [name]: {
              default: null,
              parseHTML: (element) => element.style[styleName]?.replace(/['"]+/g, ""),
              renderHTML: (attributes) => {
                let attr = attributes[name];
                if (!attr) {
                  return {};
                }
                return {
                  style: `${cssName}: ${renderValue(attr)}`
                };
              }
            }
          }
        }
      ];
    },
    addCommands() {
      return {
        [`set${fn}`]: (value) => ({ chain }) => {
          return chain().setMark("textStyle", { [name]: value }).run();
        },
        [`toggle${fn}`]: (value) => ({ chain, editor }) => {
          if (editor.isActive("textStyle", { [name]: value })) {
            return chain().setMark("textStyle", { [name]: value }).run();
          }
          return chain().setMark("textStyle", { [name]: null }).removeEmptyTextStyle().run();
        },
        [`unset${fn}`]: () => ({ chain }) => {
          return chain().setMark("textStyle", { [name]: null }).removeEmptyTextStyle().run();
        }
      };
    }
  });
}
function createStyle(o) {
  const { name, styleName = name, cssName, renderValue = (v) => v } = o;
  const fn = name.charAt(0).toUpperCase() + name.slice(1);
  return Extension3.create({
    name,
    addOptions() {
      return {
        types: [],
        defaultUnit: ""
      };
    },
    addGlobalAttributes() {
      return [
        {
          types: this.options.types,
          attributes: {
            [name]: {
              default: null,
              parseHTML: (element) => element.style[styleName] || null,
              renderHTML: (attributes) => {
                let attr = attributes[name];
                if (!attr) {
                  return {};
                }
                try {
                  if (parseFloat(attr) === 0) {
                    return {};
                  }
                } catch (e) {
                }
                return {
                  style: `${cssName}: ${renderValue(attr)}`
                };
              }
            }
          }
        }
      ];
    },
    addCommands() {
      return {
        [`set${fn}`]: (value) => ({ commands, editor }) => {
          return this.options.types.filter((v) => editor.isActive(v)).some((type) => {
            let next = value;
            let last = editor.getAttributes(type)?.[name];
            if (typeof value === "function") {
              next = value(last);
            }
            if (last === next) {
              return false;
            }
            return commands.updateAttributes(type, { [name]: next });
          });
        },
        [`toggle${fn}`]: (value) => ({ editor, commands }) => {
          if (!editor.isActive({ [name]: value }))
            return this.options.types.every((type) => commands.updateAttributes(type, { [name]: value }));
          return this.options.types.every((type) => commands.resetAttributes(type, name));
        },
        [`unset${fn}`]: () => ({ commands }) => {
          return this.options.types.every((type) => commands.resetAttributes(type, name));
        }
      };
    }
  });
}

// admin/src/components/Wysiwyg/Wysiwyg.tsx
var Wysiwyg = ({ name, onChange, value, intlLabel, labelAction, disabled, error, description, required }) => {
  const { data: settings, isLoading } = useQuery("settings", getSettings);
  if (isLoading)
    return null;
  return <WysiwygContent name={name} onChange={onChange} value={value} intlLabel={intlLabel} labelAction={labelAction} disabled={disabled} error={error} description={description} required={required} settings={settings} />;
};
var WysiwygContent = ({
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
  const { formatMessage } = useIntl();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        code: settings.code,
        codeBlock: settings.code,
        blockquote: settings.blockquote
      }),
      UnderlineExtension,
      TextAlignExtension.configure({
        types: ["heading", "paragraph"]
      }),
      TextStyleExtension,
      FontFamilyExtension,
      ...TextFormats,
      ...BlockStyles.map((v) => v.configure({ types: ["listItem", "heading", "paragraph"] })),
      IndentExtension,
      settings.color ? ColorExtension : null,
      HorizontalRuleExtension,
      settings.links.enabled ? LinkExtension.configure({
        autolink: settings.links.autolink,
        openOnClick: settings.links.openOnClick,
        linkOnPaste: settings.links.linkOnPaste
      }) : null,
      settings.image.enabled ? ImageExtension.configure({
        inline: settings.image.inline,
        allowBase64: settings.image.allowBase64
      }) : null,
      video_default,
      settings.table ? TableExtension.configure({
        allowTableNodeSelection: true
      }) : null,
      settings.table ? TableRowExtension : null,
      settings.table ? TableCellExtension : null,
      settings.table ? TableHeaderExtension : null,
      settings.other && settings.other.wordcount ? CharacterCountExtension.configure() : null,
      css_columns_default.configure({
        types: ["paragraph"]
      })
    ],
    content: value,
    onUpdate(ctx) {
      onChange({ target: { name, value: ctx.editor.getHTML() } });
    }
  });
  if (editor === null) {
    return null;
  }
  if (editor !== null && editor.getHTML() !== value) {
    editor.commands.setContent(value);
  }
  return <><Stack2 spacing={1}>
    <Box4><FieldLabel2 action={labelAction} required={required}>
      {" "}
      {formatMessage(intlLabel)}
    </FieldLabel2></Box4>
    <Editor_default key="editor" disabled={disabled} name={name} editor={editor} onChange={onChange} value={value} settings={settings} />
    {error && <Typography variant="pi" textColor="danger600">{formatMessage({ id: error, defaultMessage: error })}</Typography>}
    {description && <Typography variant="pi">{formatMessage(description)}</Typography>}
  </Stack2></>;
};
Wysiwyg.defaultProps = {
  description: "",
  disabled: false,
  error: void 0,
  intlLabel: "",
  required: false,
  value: "",
  settings: {}
};
Wysiwyg.propTypes = {
  description: PropTypes3.shape({
    id: PropTypes3.string,
    defaultMessage: PropTypes3.string
  }),
  disabled: PropTypes3.bool,
  error: PropTypes3.string,
  intlLabel: PropTypes3.shape({
    id: PropTypes3.string,
    defaultMessage: PropTypes3.string
  }),
  labelAction: PropTypes3.object,
  name: PropTypes3.string.isRequired,
  onChange: PropTypes3.func.isRequired,
  required: PropTypes3.bool,
  value: PropTypes3.string,
  settings: PropTypes3.object
};
export {
  Wysiwyg
};
