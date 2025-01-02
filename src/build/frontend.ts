import path from 'path';
import { defineConfig, mergeConfig, UserConfig, build } from 'vite';
import type { FrontendPluginConfig } from '../config';
import { existsSync } from 'fs';
import { FrontendBuildOutput } from '../types';
import { getPluginPackageJson } from '../package';
import { logInfo } from '../utils';

const defaultFrontendConfig = defineConfig({
  build: {
    outDir: '',
    emptyOutDir: true,
    lib: {
      entry: '',
      formats: ['es'],
      fileName: () => 'index.js',
      cssFileName: 'index'
    },
    rollupOptions: {
      external: ['@caido/frontend-sdk']
    }
  }
});

function createFrontendViteConfig(cwd: string, plugin: FrontendPluginConfig): UserConfig {
  // Set the entry point
  const entryPath = path.resolve(cwd, plugin.path, 'src', 'index.ts');

  // Merge with user-provided Vite config
  return mergeConfig(defaultFrontendConfig, {
    root: cwd,
    build: {
      outDir: `${plugin.path}/dist`,
      lib: {
        entry: entryPath
      }
    }
  });
} 

export async function buildFrontendPlugin(cwd: string, pluginConfig: FrontendPluginConfig): Promise<FrontendBuildOutput> {
    const absolutePath = path.resolve(cwd, pluginConfig.path);

    logInfo(`Building frontend plugin: ${absolutePath}`);
    const viteConfig = createFrontendViteConfig(cwd, pluginConfig);
    await build(viteConfig);

    const hasCss = existsSync(`${pluginConfig.path}/dist/index.css`);
    const packageJson = getPluginPackageJson(absolutePath);

    logInfo(`Frontend plugin built successfully`);

    return {
      kind: 'frontend',
      id: packageJson.name,
      name: pluginConfig.name ?? packageJson.name,
      fileName: path.join(cwd, pluginConfig.path, 'dist', 'index.js'),
      cssFileName: hasCss ? path.join(cwd, pluginConfig.path, 'dist', 'index.css') : undefined,
      backendId: pluginConfig.backend?.id
    }
}