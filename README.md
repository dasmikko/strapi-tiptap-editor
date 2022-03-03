# strapi-tiptap-editor
A drop-in replacement for the strapi editor.

![Screenshot of the editor](./screenshot.png?raw=true "Screenshot")

## What is this?
It's a dead simple, and easy to use drop-in replacement for the built in strapi WYSIWYG editor. It's build upon the [TipTap editor](https://tiptap.dev/).
It saves as plain HTML, making it easy to use with various frontends.


## Cool! But how do I use it?
Luckily it's very easy to use. Just follow these instructions:

```
# Install the dependency
npm install strapi-tiptap-editor

# Add the plugin to strapi plugin.js config file, located at ./config/plugins.js
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