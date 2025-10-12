# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Strapi v5 plugin that provides a custom field replacement for the built-in WYSIWYG editor using TipTap. It saves content as plain HTML (or optionally JSON) and integrates with Strapi's admin panel and media library.

**Migration Status**: This plugin has been migrated from Strapi v4 to v5 on the `v5-migration` branch.

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
   - Main entry point registered via `app.customFields.register()` (Strapi v5 API)
   - Uses `useFetchClient` hook to initialize API client for settings retrieval
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

**Settings registration** (`admin/src/index.js`)
- Creates settings section at `/settings/strapi-tiptap-editor`
- Lazy loads settings page component via dynamic import

**Custom field registration** (`admin/src/index.js`)
- Registers as a custom field using `app.customFields.register()` (Strapi v5)
- Type: `richtext`, Name: `wysiwyg`, PluginId: `strapi-tiptap-editor`

**Media library integration** (`admin/src/components/MediaLib/index.js`)
- Uses `useStrapiApp` hook to access media-library component (Strapi v5)
- Constructs full URLs for images using window.strapi.backendURL
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
- **Node compatibility**: Requires Node.js 18.x - 22.x
- **Strapi version**: Migrated to Strapi v5
- **Currently on v5-migration branch**: This branch contains the v5 migration
- **Maintenance status**: Project is not actively maintained per README notice

## Strapi v5 Migration Changes

### Breaking Changes Addressed

1. **Custom Field Registration**: Changed from `app.addFields()` to `app.customFields.register()`
2. **Helper Plugin Removal**: All `@strapi/helper-plugin` imports replaced with `@strapi/strapi/admin`
3. **API Client**: Replaced `request` utility with `useFetchClient` hook pattern
4. **Notifications**: Updated `useNotification` to return object with `toggleNotification` method
5. **Overlay Blocker**: Removed `useOverlayBlocker` (no replacement available in v5)
6. **Loading Component**: Changed from `LoadingIndicatorPage` to `Page.Loading`
7. **Error Component**: Changed from `NotFound` to `Page.Error`
8. **React Router**: Updated from v5 to v6 (Switch→Routes, component→element prop)
9. **Media Library**: Changed from `useLibrary` to `useStrapiApp` hook
10. **Peer Dependencies**: Added explicit dependencies for react, react-dom, react-router-dom, styled-components

### API Changes

**utils/api.js**:
- Now uses `useFetchClient` from `@strapi/strapi/admin`
- Requires initialization via `initFetchClient(client)` before use
- Returns `response.data` explicitly from fetch client

**admin/src/pages/HomePage/index.js**:
- Uses `useFetchClient` and passes to `initFetchClient`
- Notification messages must be strings (use `formatMessage()` instead of message objects)
- Removed loading/unlocking UI blocking behavior

**admin/src/components/Wysiwyg/index.js**:
- Initializes fetch client on mount using `useEffect`

**admin/src/components/MediaLib/index.js**:
- Uses `useStrapiApp('MediaLib', (state) => state.components)` to access media library
- Manually constructs full URLs using `window.strapi.backendURL`
