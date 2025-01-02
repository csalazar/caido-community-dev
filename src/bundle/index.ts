import path from 'path';
import fs from 'fs/promises';
import { validateManifest } from '@caido/plugin-manifest';
import { createManifest, defineFrontendPluginManifest } from '../manifest';
import { RootPackageJson } from '../package';
import { BuildOutput } from '../types';
import JSZip from 'jszip';
import { addDirectoryToZip, logInfo } from '../utils';
import { bundleFrontendPlugin } from './frontend';

async function createDistDirectories(cwd: string) {
  const distDir = path.resolve(cwd, 'dist');
  await fs.rm(distDir, { recursive: true, force: true });

  const pluginPackageDir = path.join(distDir, 'plugin_package');
  await fs.mkdir(pluginPackageDir, { recursive: true });

  return { distDir, pluginPackageDir };
}

export async function bundlePackage(options: {
    cwd: string,
    packageJson: RootPackageJson,
    buildOutputs: BuildOutput[]
}): Promise<void> {
  logInfo('Bundling plugin package');
  const { cwd, packageJson, buildOutputs } = options;

  // Create dist directories
  const { distDir, pluginPackageDir } = await createDistDirectories(cwd);

  // Create manifest
  const manifest = createManifest({ packageJson });

  // Copy build outputs to dist directory
  for (const buildOutput of buildOutputs) {
    if (buildOutput.kind === 'frontend') {
      const pluginManifest = bundleFrontendPlugin(pluginPackageDir, buildOutput);
      manifest.plugins.push(pluginManifest);
    }
  }

  // Assert that the manifest is valid  
  if (!validateManifest(manifest)) {
    throw new Error('Manifest is not valid:' + JSON.stringify(manifest, null, 2));
  }

  // Write manifest to dist directory
  const manifestPath = path.join(pluginPackageDir, 'manifest.json');
  const manifestContent = JSON.stringify(manifest, null, 2);
  await fs.writeFile(manifestPath, manifestContent);

  // Generate zip file
  const zip = new JSZip();

  // Zip all the contents of the plugin package directory
  await addDirectoryToZip(zip, pluginPackageDir);

  // Write zip file to dist directory
  const zipPath = path.join(distDir, 'plugin_package.zip');
  const zipFile = await fs.open(zipPath, 'w');
  zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(zipFile.createWriteStream())
    .on('finish', () => {
      console.log('Plugin package zip file created successfully');
    });
} 
