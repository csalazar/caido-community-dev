import { describe, it, expect } from 'vitest';

import { getZipFileContent } from '../../utils';
import path from 'path';

describe('build-backend', () => {
  it("should have manifest.json file", async () => {
    const zipPath = path.resolve(__dirname, '../dist/plugin_package.zip');

    const manifestJsonContent = await getZipFileContent(zipPath, 'manifest.json');

    expect(manifestJsonContent).toEqual(JSON.stringify({
      "id": "build-frontend",
      "name": "build-frontend",
      "version": "1.0.0",
      "description": "",
      "author": {
        "name": "Caido Labs Inc.",
        "email": "hello@caido.com",
        "url": "https://caido.com"
      },
      "plugins": [
        {
          "id": "frontend",
          "kind": "frontend",
          "name": "frontend",
          "js": "frontend/index.js",
          "css": "frontend/index.css",
          "backend": null
        }
      ]
    }, undefined, 2));
  });

  it("should have index.js file", async () => {
    const zipPath = path.resolve(__dirname, '../dist/plugin_package.zip');

    const indexJsContent = (await getZipFileContent(zipPath, 'frontend/index.js'))?.replace(/\s+/g, '');

    const expectedContent = `
      const o = () => {
        console.log("init");
      };
      export {
        o as init
      };
    `.replace(/\s+/g, '');

    expect(indexJsContent).toEqual(expectedContent);
  });

  it("should have index.css file", async () => {
    const zipPath = path.resolve(__dirname, '../dist/plugin_package.zip');

    const indexCssContent = await getZipFileContent(zipPath, 'frontend/index.css');

    expect(indexCssContent).toEqual('body{background-color:red}\n');
  });
});
