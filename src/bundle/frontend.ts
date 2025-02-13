import fs from "fs";
import path from "path";

import { defineFrontendPluginManifest } from "../manifest";
import { type FrontendBuildOutput } from "../types";
import { cp } from "../utils";
/**
 * Bundles the frontend plugin
 * @param pluginPackageDir - The directory to bundle the plugin into.
 * @param buildOutput - The build output.
 */
export function bundleFrontendPlugin(
  cwd: string,
  pluginPackageDir: string,
  buildOutput: FrontendBuildOutput,
) {
  // Create plugin directory
  const pluginDir = path.join(pluginPackageDir, buildOutput.id);
  fs.mkdirSync(pluginDir, { recursive: true });

  // Copy JS file
  const jsDestPath = path.join(pluginDir, path.basename(buildOutput.fileName));
  fs.copyFileSync(buildOutput.fileName, jsDestPath);
  const jsRelativePath = path.relative(pluginPackageDir, jsDestPath);

  // Copy CSS file if it exists
  let cssRelativePath: string | undefined;
  if (buildOutput.cssFileName) {
    const cssDestPath = path.join(
      pluginDir,
      path.basename(buildOutput.cssFileName),
    );
    fs.copyFileSync(buildOutput.cssFileName, cssDestPath);
    cssRelativePath = path.relative(pluginPackageDir, cssDestPath);
  }

  // Copy assets if required
  let assetsRelativePath: string | undefined;
  if (buildOutput.assets.length > 0) {
    // Create assets directory
    const assetsDir = path.join(pluginDir, "assets");
    fs.mkdirSync(assetsDir, { recursive: true });

    // Copy assets
    for (const asset of buildOutput.assets) {
      cp(cwd, asset, assetsDir);
    }

    assetsRelativePath = path.relative(pluginPackageDir, assetsDir);
  }

  return defineFrontendPluginManifest({
    id: buildOutput.id,
    kind: "frontend",
    name: buildOutput.name ?? buildOutput.id,
    entrypoint: jsRelativePath,
    style: cssRelativePath,
    backend: buildOutput.backendId ? { id: buildOutput.backendId } : null,
    assets: assetsRelativePath,
  });
}
