import { BuildOutput } from "../types";
import path from "path";
import fs from "fs";
import { defineBackendPluginManifest } from "../manifest";

/**
 * Bundles the backend plugin
 * @param pluginPackageDir - The directory to bundle the plugin into.
 * @param buildOutput - The build output.
 */
export function bundleBackendPlugin(pluginPackageDir: string, buildOutput: Extract<BuildOutput, { kind: "backend" }>) {
  // Create plugin directory
  const pluginDir = path.join(pluginPackageDir, buildOutput.id);
  fs.mkdirSync(pluginDir, { recursive: true });

  // Copy JS file
  const jsDestPath = path.join(pluginDir, path.basename(buildOutput.fileName));
  fs.copyFileSync(buildOutput.fileName, jsDestPath);
  const jsRelativePath = path.relative(pluginPackageDir, jsDestPath);

  return defineBackendPluginManifest({
    id: buildOutput.id,
    kind: 'backend',
    name: buildOutput.name ?? buildOutput.id,
    entrypoint: jsRelativePath,
    runtime: "javascript"
  });
}