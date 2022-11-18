# GrapesJS Signature Plugin

[DEMO](https://codepen.io/askyy/pen/PoaJBgE)

## Summary

* Plugin name: `grapesjs-signature-pad`



## Download

* CDN
  * `https://unpkg.com/grapesjs-signature-pad`
* NPM
  * `npm i grapesjs-signature-pad`
* GIT
  * `git clone https://github.com/AdamTorma/grapesjs-signature-pad.git`



## Usage

Directly in the browser
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
<script src="https://unpkg.com/grapesjs"></script>
<script src="path/to/grapesjs-signature-pad.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container: '#gjs',
      // ...
      plugins: ['grapesjs-signature-pad'],
      pluginsOpts: {
        'grapesjs-signature-pad': { /* options */ }
      }
  });
</script>
```

Modern javascript
```js
import grapesjs from 'grapesjs';
import plugin from 'grapesjs-signature-pad';
import 'grapesjs/dist/css/grapes.min.css';

const editor = grapesjs.init({
  container : '#gjs',
  // ...
  plugins: [plugin],
  pluginsOpts: {
    [plugin]: { /* options */ }
  }
  // or
  plugins: [
    editor => plugin(editor, { /* options */ }),
  ],
});
```



## Development

Clone the repository

```sh
$ git clone https://github.com/AdamTorma/grapesjs-signature-pad.git
$ cd grapesjs-signature-pad
```

Install dependencies

```sh
$ npm i
```

Start the dev server

```sh
$ npm start
```

Build the source

```sh
$ npm run build
```



## License

MIT
