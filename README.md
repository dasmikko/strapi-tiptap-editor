# Strapi TipTap Editor
[![npm](https://img.shields.io/npm/v/strapi-tiptap-editor)](https://www.npmjs.com/package/strapi-tiptap-editor)
[![NPM](https://img.shields.io/npm/l/strapi-tiptap-editor)](https://www.npmjs.com/package/strapi-tiptap-editor)
[![GitHub issues](https://img.shields.io/github/issues/dasmikko/strapi-tiptap-editor)](https://github.com/dasmikko/strapi-tiptap-editor/issues)

A drop-in replacement for the strapi editor.

![Screenshot of the editor](./screenshot.png?raw=true "Screenshot")

## Notice!
**This project isn't actively maintained, as I want to move away from Strapi. If you are interested in taking over this project, feel free to contact me.**

## What is this?
It's a dead simple, and easy to use drop-in replacement for the built-in Strapi rich text editor. It's built upon the [TipTap editor](https://tiptap.dev/).
It saves as plain HTML (or optionally TipTap JSON), making it easy to use with various frontends.

Features include:
- Headings, bold, italic, underline, strikethrough, text color and highlight
- Text alignment, bullet and ordered lists, blockquotes and code blocks
- Links, images from the Strapi media library (or base64), and YouTube embeds
- Tables, CSS columns, horizontal rules and hard breaks
- Optional word count

Everything can be turned on or off from the plugin's settings page.

## Why make this?
The main reason was, that I thought that the built-in WYSIWYG editor in strapi could be better. I needed to support tables and css columns. Another requirement was also make it outputted pure html, and has a nice and easy to user interface. I don't want to keep toggling between editor mode and preview mode, just to see what I'm making.

## Requirements
| Plugin version | Strapi version |
| -------------- | -------------- |
| `2.x`          | v5             |
| `0.9.x`        | v4             |

Node.js 20 or newer is required, same as Strapi v5.

If you are still on Strapi **v4**, install the `0.9.x` releases (`npm install strapi-tiptap-editor@0.9`).

## Cool! But how do I use it?
Luckily it's very easy to use. Just follow these instructions:

```
# Install the dependency
npm install strapi-tiptap-editor

# Build the Strapi Admin
npm run build
```

Strapi v5 enables installed plugins automatically, so there is nothing to add to `config/plugins.js`.

The editor replaces the built-in editor for every **Rich text (Markdown)** field. You are now using the new editor!

### Settings
Go to **Settings → Strapi TipTap Editor → Settings** in the admin panel to choose which tools are available in the editor.

Under **Other** you can choose to save the content as JSON instead of HTML. Changing this does not convert content that is already saved, so entries have to be saved again.

### Upgrading from Strapi v4
- Your saved plugin settings carry over.
- The old `tippy.js` webpack workaround is no longer needed, as Strapi v5 builds the admin panel with Vite. Remove it from `src/admin/webpack.config.js`.
- The editor now attaches to Strapi v5's `richtext` field type, which is what **Rich text (Markdown)** fields use. The newer **Rich text (Blocks)** field is not affected.

## Developing the plugin
The plugin is built with the [Strapi Plugin SDK](https://github.com/strapi/sdk-plugin):

```
npm install          # also builds ./dist via the prepare script
npm run build        # build to ./dist
npm run watch:link   # link into a local Strapi project while developing
npm run verify       # check the package before publishing
```

Because the `prepare` script builds the plugin, you can also test an unreleased branch directly in a Strapi project:

```
npm install github:dasmikko/strapi-tiptap-editor#<branch>
```

If the admin panel keeps showing an old version of the plugin, delete the `.strapi` and `node_modules/.strapi` folders in the Strapi project and rebuild.

`npm publish` runs `npm run verify` first, through the `prepublishOnly` script.

## I'm having issues, or have a suggestion!
Ouch, that's no good if you have an issue!
Suggestions are more than welcome, and feel free to go to the issues tab, and submit your issue/suggestion, and I will look at it as soon as possible!

