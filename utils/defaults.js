module.exports = {
  headings: ['h1', 'h2', 'h3', 'h4', 'h4', 'h5', 'h6'],
  bold: true,
  italic: true,
  strikethrough: true,
  underline: true,
  code: true,
  blockquote: true,
  color: true,
  highlight:true,
  align: ['left', 'center', 'right'],
  lists: ['ol', 'ul'],
  disableOrderedListShorthand: false,
  columns: ['two', 'three'],
  table: true,
  hardbreak: true,
  horizontal: true,
  links: {
    enabled: true,
    autolink: false,
    openOnClick: false,
    linkOnPaste: true,
    relAttribute: false,
    HTMLAttributes: {
      rel: ''
    }
  },
  image: {
    enabled: true,
    inline: true,
    allowBase64: false,
  },
  other: {
    wordcount: false,
    saveJson: false,
  },
  youtube: {
    enabled: true,
    height: 480,
    width: 640
  }
}
