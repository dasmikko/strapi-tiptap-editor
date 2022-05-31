build:
	node build.cjs
	grep '^// ' ./admin/dist/Wysiwyg.js

dev:
	WATCH=true node build.cjs
