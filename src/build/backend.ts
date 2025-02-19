import { builtinModules } from "module";
import path from "path";

import { build, defineConfig, type Options } from "tsup";

import type { BackendBuildOutput, BackendPluginConfig } from "../types";
import { logInfo, slash } from "../utils";

/**
 * Creates a tsup config for the backend plugin.
 * @param cwd - The current working directory.
 * @param plugin - The backend plugin configuration.
 * @returns The tsup config.
 */
function createTsupConfig(cwd: string, plugin: BackendPluginConfig) {
  const userConfiguredExternal = plugin.tsup?.external || [];

  const root = path.resolve(cwd, plugin.root);
  return defineConfig({
    target: "esnext",
    entry: [slash(path.resolve(root, "src/index.ts"))],
    outDir: slash(path.resolve(root, "dist")),
    outExtension: (ctx) => {
      return { js: ".js" };
    },
    format: ["esm"],
    config: false,
    clean: true,
    sourcemap: false,
    external: [/caido:.+/, ...builtinModules, ...userConfiguredExternal],
  }) as Options;
}

/**
 * Builds the backend plugin.
 * @param cwd - The current working directory.
 * @param pluginConfig - The backend plugin configuration.
 * @returns The build output.
 */
export async function buildBackendPlugin(
  cwd: string,
  pluginConfig: BackendPluginConfig,
): Promise<BackendBuildOutput> {
  const pluginRoot = path.resolve(cwd, pluginConfig.root);

  logInfo(`Building backend plugin: ${pluginRoot}`);
  const tsupConfig = createTsupConfig(cwd, pluginConfig);
  await build(tsupConfig);
  logInfo("Backend built successfully");

  return {
    kind: "backend",
    id: pluginConfig.id,
    name: pluginConfig.name ?? "backend",
    fileName: path.join(pluginRoot, "dist", "index.js"),
    assets: pluginConfig.assets ?? [],
  };
}
