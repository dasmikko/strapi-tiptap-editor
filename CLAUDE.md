# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Strapi v4 plugin that provides a drop-in replacement for the built-in WYSIWYG editor using TipTap. It saves content as plain HTML (or optionally JSON) and integrates with Strapi's admin panel and media library.

## Key Commands

```bash
# Build Strapi admin (required after plugin changes)
npm run build

# No tests are currently configured
npm test  # exits with error
```

## Architecture

### Plugin Structure

The plugin follows Strapi v4 plugin architecture with separate admin and server components:

- **strapi-admin.js** - Entry point that loads `admin/src/index.js`
- **strapi-server.js** - Entry point that loads `server/index.js`

### Admin Side (`admin/src/`)

The admin panel integration is split into three main React components:

1. **Wysiwyg component** (`admin/src/components/Wysiwyg/index.js`)
   - Main entry point registered via `app.addFields({ type: 'wysiwyg', Component: Wysiwyg })`
   - Fetches settings from server and merges with defaults
   - Initializes TipTap editor with configurable extensions based on settings
   - Handles both HTML and JSON content formats (auto-detects on load)
   - Conditionally loads extensions based on settings (links, images, tables, YouTube, etc.)

2. **Editor component** (`admin/src/components/Editor/index.js`)
   - Wraps TipTap's `EditorContent` with Strapi design system components
   - Contains `BubbleMenu` for contextual table editing
   - Integrates with Strapi's MediaLib for image uploads
   - Includes Toolbar for formatting controls

3. **Settings page** (`admin/src/pages/HomePage/index.js`)
   - Tabbed interface (Text, Layout, Embeds, Other)
   - Uses Formik for form management
   - Saves configuration via `PUT /update-settings` endpoint

### Custom TipTap Extensions

**CSSColumnsExtension** (`admin/src/components/Wysiwyg/index.js:74-113`)
- Adds CSS column support to paragraphs
- Commands: `toggleColumns(columnType)`, `unsetColumns(columnType)`
- Renders as inline `column-count` CSS style

**CustomOrderedList** (`admin/src/components/Wysiwyg/index.js:115-119`)
- Disables input rules for ordered lists when `disableOrderedListShorthand` is enabled
- Used to prevent accidental list creation from numbered text

### Server Side (`server/`)

**Settings controller** (`server/controllers/settings.js`)
- `GET /` - Returns saved settings or defaults from `utils/defaults.js`
- `PUT /update-settings` - Persists settings to Strapi store under `plugin.strapi-tiptap-editor.settings`

**Configuration system**
- Default settings in `utils/defaults.js` define all available features
- Settings are deep-merged with saved values to support backwards compatibility
- Uses `mergeDeep` utility (`admin/src/utils/merge.js`)

### Key Integration Points

**Settings registration** (`admin/src/index.js:16-29`)
- Creates settings section at `/settings/strapi-tiptap-editor`
- Lazy loads settings page component via dynamic import

**Field registration** (`admin/src/index.js:31`)
- Replaces Strapi's default wysiwyg field type with TipTap editor

**Media library integration** (`admin/src/components/MediaLib/index.js`)
- Wrapper around Strapi's prefab MediaLib component
- Handles image selection and insertion into editor
- Supports updating existing images or inserting new ones

## Content Format

The editor can save in two formats (controlled by `settings.other.saveJson`):

- **HTML mode** (default): Saves as HTML string via `editor.getHTML()`
- **JSON mode**: Saves as JSON string via `JSON.stringify(editor.getJSON())`

The Wysiwyg component auto-detects format on load by attempting JSON parse.

## Extension Configuration

Extensions are conditionally loaded based on settings. Key configurable features:

- Text formatting: bold, italic, underline, strikethrough, code, color, highlight
- Structure: headings (h1-h6), lists (ordered/unordered), blockquote, horizontal rule
- Layout: text alignment, CSS columns (2 or 3 column layout)
- Links: autolink, link on paste, rel attributes
- Images: inline mode, base64 support, lazy loading, width/height attributes
- Tables: full table editing with bubble menu
- Embeds: YouTube videos
- Other: word count, hard breaks

## Important Notes

- **Webpack configuration required**: Host projects must add `NormalModuleReplacementPlugin` for tippy.js to work (see README)
- **Node compatibility**: Requires Node.js 18.x - 21.x
- **Strapi version**: Built for Strapi v4 (tested with v4.5.5)
- **Currently on v5-migration branch**: Working branch for Strapi v5 compatibility
- **Maintenance status**: Project is not actively maintained per README notice
