import type { Manifest, ManifestPlugin } from '@caido/plugin-manifest';
import { RootPackageJson } from './types';

export function createManifest(options: {
    packageJson: RootPackageJson
}): Manifest {
  const { packageJson } = options;
  return {
    id: packageJson.name,
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    author: {
        name: packageJson.author.name,
        email: packageJson.author?.email,
        url: packageJson.author?.url,
    },
    plugins: []
  };
}

export function defineFrontendPluginManifest(pluginManifest: Extract<ManifestPlugin, { kind: 'frontend' }>) {
    return pluginManifest;
}