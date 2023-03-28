
# Strapi TipTap Editor
[![npm](https://img.shields.io/npm/v/strapi-tiptap-editor)](https://www.npmjs.com/package/strapi-tiptap-editor)
[![NPM](https://img.shields.io/npm/l/strapi-tiptap-editor)](https://www.npmjs.com/package/strapi-tiptap-editor)
[![GitHub issues](https://img.shields.io/github/issues/dasmikko/strapi-tiptap-editor)](https://github.com/dasmikko/strapi-tiptap-editor/issues)

A drop-in replacement for the strapi editor.

![Screenshot of the editor](./screenshot.png?raw=true "Screenshot")

## What is this?
It's a dead simple, and easy to use drop-in replacement for the built-in strapi WYSIWYG editor. It's build upon the [TipTap editor](https://tiptap.dev/).
It saves as plain HTML, making it easy to use with various frontends.


## Why make this?
The main reason was, that I thought that the built-in WYSIWYG editor in strapi could be better. I needed to support tables and css columns. Another requirement was also make it outputted pure html, and has a nice and easy to user interface. I don't want to keep toggling between editor mode and preview mode, just to see what I'm making.

## Requirements
It's build for Strapi **v4**. 

It has been tested to work with **v4.5.5** and I assume it should keep working with later versions.


## Cool! But how do I use it?
Luckily it's very easy to use. Just follow these instructions:

```
# Install the dependency
npm install strapi-tiptap-editor

# Add the following to the webpack config (/src/admin/webpack.config.js)
# This is due to tippy.js doesn't have an ES6 module, and a tiptap depencency imports it (thanks for the help @giu1io)
config.plugins.push(new webpack.NormalModuleReplacementPlugin(
  /^tippy\.js$/,
  'tippy.js/dist/tippy-bundle.umd.min.js'
))

# Build the Strapi Admin
npm run build
```

You are now using the new editor!

You can verify it, by looking at the plugins page inside Strapi

![Strapi plugin page](./screenshot2.png?raw=true "Screenshot")

## I'm having issues, or have a suggestion!
Ouch, that's no good if you have an issue!
Suggestions are more than welcome, and feel free to go to the issues tab, and submit your issue/suggestion, and I will look at it as soon as possible!

