# Using fonteditor-core with Modern ESM Bundlers

> Author: pumpkinzomb

This guide explains how to use `fonteditor-core` in modern ESM-compatible environments like Vite, Next.js, Webpack 5, Rollup, and other modern JavaScript frameworks and bundlers.

## Installation

```bash
npm install fonteditor-core
# or
yarn add fonteditor-core
```

## Importing the Library

The updated library supports both CommonJS and ESM module formats. In modern bundlers, you should use the ESM imports:

```javascript
// Import the whole library
import fonteditorCore from 'fonteditor-core';

// Or import specific modules
import { Font, woff2 } from 'fonteditor-core';
```

## TypeScript Support

The library includes TypeScript declarations. You can use it in TypeScript projects without any additional setup:

```typescript
import fonteditorCore, { Font, woff2 } from 'fonteditor-core';
import { Buffer } from 'buffer'; // If needed in browser environments

// Using Font with type safety
const font = Font.create(buffer, {
  type: 'ttf',
  hinting: true,
  subset: [65, 66, 67], // A, B, C
});

// All properties and methods are properly typed
const fontObject = font.get();
console.log(fontObject.head.xMin);

// Using woff2 with type safety
async function convertFont(ttfBuffer: ArrayBuffer) {
  await woff2.init('/woff2.wasm');
  
  if (woff2.isInited()) {
    const woff2Buffer = fonteditorCore.ttftowoff2(ttfBuffer);
    return woff2Buffer;
  }
  return null;
}
```

## Working with WOFF2

The WOFF2 module requires special initialization to load the WebAssembly binary. You need to provide the path to the wasm file:

```javascript
import { woff2 } from 'fonteditor-core';

// In browser environments
await woff2.init('/path/to/woff2.wasm');

// Make sure to copy the woff2.wasm file from node_modules/fonteditor-core/woff2/ to your public assets
```

### Using with different frameworks

#### React/Next.js

```javascript
import { useEffect, useState } from 'react';
import { woff2 } from 'fonteditor-core';

function FontComponent() {
  const [isWoff2Ready, setIsWoff2Ready] = useState(false);
  
  useEffect(() => {
    // Initialize woff2 module
    woff2.init('/woff2.wasm')
      .then(() => {
        setIsWoff2Ready(true);
      });
  }, []);
  
  // Component logic...
}
```

#### Vue.js

```javascript
import { onMounted, ref } from 'vue';
import { woff2 } from 'fonteditor-core';

export default {
  setup() {
    const isWoff2Ready = ref(false);
    
    onMounted(() => {
      woff2.init('/woff2.wasm')
        .then(() => {
          isWoff2Ready.value = true;
        });
    });
    
    // Component logic...
  }
}
```

## Server-Side Rendering Considerations

When using the library in a server-side rendered context, be aware that:

1. WASM modules can't be used during SSR
2. Some browser-specific APIs might not be available

To prevent SSR issues:

### Next.js

```javascript
// Use the 'use client' directive in Next.js App Router
'use client'; 

import { useEffect } from 'react';
import { Font } from 'fonteditor-core';
```

### Nuxt.js

```javascript
// Use client-only component
<client-only>
  <font-editor />
</client-only>
```

## Example: Convert TTF to WOFF2

```javascript
import { ttftowoff2, woff2 } from 'fonteditor-core';

// Initialize the WOFF2 module first
await woff2.init('/path/to/woff2.wasm');

// Convert TTF to WOFF2
function convertFont(ttfBuffer) {
  try {
    const woff2Buffer = ttftowoff2(ttfBuffer);
    return woff2Buffer;
  }
  catch (error) {
    console.error('Error converting font:', error);
    return null;
  }
}
```

## Bundler Configuration

### Webpack 5

If you encounter issues with the ESM imports, you might need to add fonteditor-core to your transpilation process:

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /node_modules\/fonteditor-core/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
```

### Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['fonteditor-core']
  },
  build: {
    commonjsOptions: {
      include: [/fonteditor-core/, /node_modules/]
    }
  }
});
```

### Rollup

```javascript
// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  plugins: [
    nodeResolve(),
    commonjs({
      include: ['node_modules/fonteditor-core/**']
    })
  ]
};
```

## Troubleshooting

If you encounter issues with the library in modern bundlers:

1. Make sure you're using the latest version of fonteditor-core
2. Check that the WASM file is properly accessible in your public assets
3. For Node.js environments, ensure you're using a version that supports ESM
4. In case of bundling issues, try adding fonteditor-core to your bundler's transpilation list 