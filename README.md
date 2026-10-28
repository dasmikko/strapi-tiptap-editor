
# Strapi TipTap Editor
[![npm](https://img.shields.io/npm/v/strapi-tiptap-editor)](https://www.npmjs.com/package/strapi-tiptap-editor)
[![NPM](https://img.shields.io/npm/l/strapi-tiptap-editor)](https://www.npmjs.com/package/strapi-tiptap-editor)
[![GitHub issues](https://img.shields.io/github/issues/dasmikko/strapi-tiptap-editor)](https://github.com/dasmikko/strapi-tiptap-editor/issues)

A drop-in replacement for the strapi editor.

![Screenshot of the editor](./screenshot.png?raw=true "Screenshot")

## Notice!
**This project isn't actively maintained, as I want to move away from Strapi. If you are interested in taking over this project, feel free to contact me.**

## What is this?
It's a dead simple, and easy to use drop-in replacement for the built-in strapi WYSIWYG editor. It's build upon the [TipTap editor](https://tiptap.dev/).
It saves as plain HTML, making it easy to use with various frontends.


## Why make this?
The main reason was, that I thought that the built-in WYSIWYG editor in strapi could be better. I needed to support tables and css columns. Another requirement was also make it outputted pure html, and has a nice and easy to user interface. I don't want to keep toggling between editor mode and preview mode, just to see what I'm making.

## Requirements
It's build for Strapi **v5**.

If you are still on Strapi **v4**, use the `0.9.x` releases of this plugin (`npm install strapi-tiptap-editor@0.9`).


## Cool! But how do I use it?
Luckily it's very easy to use. Just follow these instructions:

```
# Install the dependency
npm install strapi-tiptap-editor

# Build the Strapi Admin
npm run build
```

The editor replaces the built-in editor for every **Rich text (Markdown)** field. The older webpack workaround for `tippy.js` is no longer needed, as Strapi v5 builds the admin panel with Vite.

You are now using the new editor!

You can verify it, by looking at the plugins page inside Strapi

![Strapi plugin page](./screenshot2.png?raw=true "Screenshot")

## Developing the plugin
The plugin is built with the [Strapi Plugin SDK](https://github.com/strapi/sdk-plugin):

```
npm install
npm run build        # build to ./dist
npm run watch:link   # link into a local Strapi project while developing
npm run verify       # check the package before publishing
```

## I'm having issues, or have a suggestion!
Ouch, that's no good if you have an issue!
Suggestions are more than welcome, and feel free to go to the issues tab, and submit your issue/suggestion, and I will look at it as soon as possible!

