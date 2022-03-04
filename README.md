
# Strapi TipTap Editor
![npm](https://img.shields.io/npm/v/strapi-tiptap-editor)
![NPM](https://img.shields.io/npm/l/strapi-tiptap-editor)
![GitHub issues](https://img.shields.io/github/issues/dasmikko/strapi-tiptap-editor)

A drop-in replacement for the strapi editor.

![Screenshot of the editor](./screenshot.png?raw=true "Screenshot")

## What is this?
It's a dead simple, and easy to use drop-in replacement for the built in strapi WYSIWYG editor. It's build upon the [TipTap editor](https://tiptap.dev/).
It saves as plain HTML, making it easy to use with various frontends.

A goal is to make it more configurable and make it fit your needs.

The project is fully usable, but I still consider it beta at this stage.


## Why make this?
The main reason was, that I thought that the built in WYSIWYG editor in strapi could be better. I needed to support tables and css columns. Another requirement was also make it outputted pure html, and has a nice and easy to user interface. I don't want to keep toggling between editor mode and preview mode, just to see what I'm making.

## Requirements
It's build with Strapi **v4** in mind. 

It has been tested to work with **v4.1.1** and I assume it should keep working with later versions.


## Cool! But how do I use it?
Luckily it's very easy to use. Just follow these instructions:

```
# Install the dependency
npm install strapi-tiptap-editor

# Add the plugin to strapi plugin.js config file, located inside the strapi project folder: ./config/plugins.js
# It should look something like this
module.exports = {
  // ...
  'strapi-tiptap-editor': {
    enabled: true,
    resolve: './node_modules/strapi-tiptap-editor'
  },
  // ...
}

# Build the Strapi Admin
npm run build
```

You are now using the new editor!

You can verify it, by looking at the plugins page inside Strapi

![Strapi plugin page](./screenshot2.png?raw=true "Screenshot")

## I'm having issues, or have a suggestion!
Ouch, that's no good if you have an issue!
Suggestions are more than welcome, and feel free to go to the issues tab, and submit your issue/suggestion, and I will look at it as soon as possible!

