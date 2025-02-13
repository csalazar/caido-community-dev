import fs from "fs";
import path from "path";

import { defineBackendPluginManifest } from "../manifest";
import { type BackendBuildOutput } from "../types";
import { cp } from "../utils";

/**
 * Bundles the backend plugin
 * @param pluginPackageDir - The directory to bundle the plugin into.
 * @param buildOutput - The build output.
 */
export function bundleBackendPlugin(
  cwd: string,
  pluginPackageDir: string,
  buildOutput: BackendBuildOutput,
) {
  // Create plugin directory
  const pluginDir = path.join(pluginPackageDir, buildOutput.id);
  fs.mkdirSync(pluginDir, { recursive: true });

  // Copy JS file
  const jsDestPath = path.join(pluginDir, path.basename(buildOutput.fileName));
  fs.copyFileSync(buildOutput.fileName, jsDestPath);
  const jsRelativePath = path.relative(pluginPackageDir, jsDestPath);

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

  return defineBackendPluginManifest({
    id: buildOutput.id,
    kind: "backend",
    name: buildOutput.name ?? buildOutput.id,
    entrypoint: jsRelativePath,
    runtime: "javascript",
    assets: assetsRelativePath,
  });
}
