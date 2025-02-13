import path from "path";

import { describe, expect, it } from "vitest";

import { getZipFileContent } from "../../utils";

describe("build-backend", () => {
  it("should have manifest.json file", async () => {
    const zipPath = path.resolve(__dirname, "../dist/plugin_package.zip");

    const manifestJsonContent = await getZipFileContent(
      zipPath,
      "manifest.json",
    );

    expect(manifestJsonContent).toEqual(
      JSON.stringify(
        {
          id: "build-backend",
          name: "Backend",
          version: "1.0.0",
          description: "Backend plugin",
          author: {
            name: "John Doe",
            email: "john.doe@example.com",
            url: "https://example.com",
          },
          links: {},
          plugins: [
            {
              id: "backend",
              kind: "backend",
              name: "backend",
              entrypoint: "backend/index.js",
              runtime: "javascript",
              assets: "backend/assets",
            },
          ],
        },
        undefined,
        2,
      ),
    );
  });

  it("should have index.js file", async () => {
    const zipPath = path.resolve(__dirname, "../dist/plugin_package.zip");

    const indexJsContent = (
      await getZipFileContent(zipPath, "backend/index.js")
    )?.replace(/\s+/g, "");

    const expectedContent = `
      //packages/backend/src/index.ts
      function init() {
      }
      export {
        init
      };
    `.replace(/\s+/g, "");

    expect(indexJsContent).toEqual(expectedContent);
  });

  it("should have asset txt", async () => {
    const zipPath = path.resolve(__dirname, "../dist/plugin_package.zip");

    const assetContent = await getZipFileContent(
      zipPath,
      "backend/assets/test.txt",
    );

    expect(assetContent).toEqual("Hello world");
  });

  it("should not have asset bin", async () => {
    const zipPath = path.resolve(__dirname, "../dist/plugin_package.zip");

    const assetContent = await getZipFileContent(
      zipPath,
      "backend/assets/other.bin",
    );

    expect(assetContent).toBeUndefined();
  });
});
