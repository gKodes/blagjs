# `@blag/puppeteer-chrome`

> TODO: description

## Usage

Standalone use
```javascript
const { getConnectionDetails } = require('@blag/puppeteer-chrome');

const options = {
  name: 'script-name',
  domains: ['www.example.com', 'example.com', '*.example.com'] // List of domains which would be allowed on this tab
};

const { ws, target } = getConnectionDetails(options);
```

> **NOTE**  *.exmaple.com will not match example.com

API's exposed for puppeteer server
```javascript
const { launchAndGetBrowser, getPageForScript } = require('@blag/puppeteer-chrome');

```
