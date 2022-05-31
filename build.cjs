const path = require('path');
const pkg = require(path.resolve('./package.json'));

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'react',
  'react-dom',
  'react-intl',
  'prop-types',
  'react-is',
  'shallowequal',
  'hoist-non-react-statics',
  'prosemirror-model',
  'prosemirror-transform',
  'prosemirror-state',
  'orderedmap',
  '@emotion',
  'styled-components',
].sort();

console.log(`externals`, external)

require('esbuild').build({
  entryPoints: ['admin/src/components/Wysiwyg/index.ts'],
  loader: {'.js': 'jsx'},
  jsx: 'preserve',
  format: 'esm',
  charset: 'utf8',
  minify: false,
  sourcemap: false,
  target: ['esnext'],
  // outdir: 'admin/dist',
  bundle: true,
  outfile: 'admin/dist/Wysiwyg.js',
  external,
  watch: process.env.WATCH === 'true',
  logLevel: 'info',
});
