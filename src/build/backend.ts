import path from 'path';
import { defineConfig, UserConfig, build } from 'vite';
import type { BackendPluginConfig, BackendBuildOutput } from '../types';
import { getPluginPackageJson } from '../package';
import { logInfo } from '../utils';

/**
 * Creates a tsup config for the backend plugin.
 * @param cwd - The current working directory.
 * @param plugin - The backend plugin configuration.
 * @returns The tsup config.
 */
function createViteConfig(cwd: string, plugin: BackendPluginConfig): UserConfig {
  // Set the entry point
  const root = path.resolve(cwd, plugin.root);
  return defineConfig({
    root,
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      lib: {
        entry: 'src/index.ts',
        formats: ['es'],
        fileName: () => 'index.js',
        cssFileName: 'index'
      },
      rollupOptions: {
        external: ['@caido/frontend-sdk']
      }
    }
  })
} 

/**
 * Builds the backend plugin.
 * @param cwd - The current working directory.
 * @param pluginConfig - The backend plugin configuration.
 * @returns The build output.
 */
export async function buildBackendPlugin(cwd: string, pluginConfig: BackendPluginConfig): Promise<BackendBuildOutput> {
    const pluginRoot = path.resolve(cwd, pluginConfig.root);

    logInfo(`Building backend plugin: ${pluginRoot}`);
    const viteConfig = createViteConfig(cwd, pluginConfig);
    await build(viteConfig);

    const packageJson = getPluginPackageJson(pluginRoot);

    logInfo(`Frontend backend built successfully`);

    return {
      kind: 'backend',
      id: packageJson.name,
      name: pluginConfig.name ?? packageJson.name,
      fileName: path.join(pluginRoot, 'dist', 'index.js'),
    }
}