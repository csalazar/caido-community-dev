import path from 'path';
import { defineConfig, mergeConfig, UserConfig, build } from 'vite';
import type { FrontendPluginConfig } from '../config';
import { existsSync } from 'fs';
import { FrontendBuildOutput } from '../types';
import { getPluginPackageJson } from '../package';

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

function createFrontendViteConfig(plugin: FrontendPluginConfig): UserConfig {
  // Set the entry point
  const entryPath = path.resolve(process.cwd(), plugin.path, 'src', 'index.ts');

  // Merge with user-provided Vite config
  return mergeConfig(defaultFrontendConfig, {
    build: {
      outDir: `${plugin.path}/dist`,
      lib: {
        entry: entryPath
      }
    }
  });
} 

export async function buildFrontendPlugin(config: FrontendPluginConfig): Promise<FrontendBuildOutput> {
    const viteConfig = createFrontendViteConfig(config);
    await build(viteConfig);

    const hasCss = existsSync(`${config.path}/dist/index.css`);
    const packageJson = getPluginPackageJson(config.path);

    return {
      kind: 'frontend',
      id: packageJson.name,
      name: config.name ?? packageJson.name,
      fileName: `${config.path}/dist/index.js`,
      cssFileName: hasCss ? `${config.path}/dist/index.css` : undefined,
      backendId: config.backend?.id
    }
}