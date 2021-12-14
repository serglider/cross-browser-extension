## Cross-browser extension template

### Introduction
This template consists of a sample extension and a set of build scripts for cross-browser extensions' development. The project aims at developing extensions for several browsers at once and assumes that you need a build step for your scripts. Though one can use it even targeting one browser or for very simple scripting.

How should I install my extension locally? How to publish my extension? What libraries does this template use and how to configure them? For answers to these questions and many more please see the **Useful links** section.

Please be aware that this template uses `Manifest V2`. Read [here](https://developer.chrome.com/docs/extensions/mv3/mv2-sunset/) and [here](https://blog.mozilla.org/addons/2021/05/27/manifest-v3-update/) to make your choices.

https://developer.apple.com/documentation/safariservices/safari_web_extensions

### Getting started
1. Hit the **Use this template** button on the upper right and create your repository.
2. Clone newly created repository.
3. Install dependencies: `npm i`.
4. See the **Configuration** and **Development** sections.

Rather than steps 1 and 2, you could use:
```bash
npx degit serglider/cross-browser-extension <your-project-dir>
```
In this case, you must initialize Git yourself. If you're using a platform other than Github, this method might be more convenient.

### Configuration
There are two places to adjust the project configuration: [config.js](config.js) file and the `webExt` section in [package.json](package.json). TODO: config props explanation.

### Development
 
#### Chromium-based browsers
1. Run `npm start` or `npm run start:reload`. The latter will watch your `src` directory and reload your extension on files' change.
2. Load your extension as unpacked pointing the browser to your `dist` directory.

#### Firefox
1. Run `npm start`
2. Run `npm run start:firefox`. This will launch an instance of Firefox with your extension installed and will watch the files in your `dist` directory reloading the extension on files' change.

### Releases
Run `npm run release`. After asking a few questions, this will:
- bump the versions in `package.json` and `manifest.json`
- (optionally) commit and push your changes
- build your extension into your `dist` directory
- create a ready for web stores submission archive in your `artifacts` directory

### Useful links

[Browsers usage stats](https://gs.statcounter.com/browser-market-share/desktop/worldwide/)

https://developer.chrome.com/docs/extensions/

https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/

https://dev.opera.com/extensions/

https://extensionworkshop.com/

https://www.extensiontest.com/

https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions

https://github.com/mozilla/webextension-polyfill/

https://github.com/mozilla/web-ext

https://esbuild.github.io/


### Roadmap
- better README
- handle manifest v3

### Licence
The MIT License (MIT)

Copyright (c) 2021 Sergey Chernykh



