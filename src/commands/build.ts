import { loadConfig } from '../config';
import { bundlePackage } from '../bundle';
import { getRootPackageJson } from '../package';
import { buildFrontendPlugin, buildBackendPlugin } from '../build';
import type { BuildOutput } from '../types';
import { logInfo, logSuccess } from '../utils';

export async function build(options: {
    path?: string;
    config?: string;
}) {
    logInfo('Building plugin package');
    const { path: cwd = process.cwd(), config: configPath } = options;

    // Load configuration
    const config = await loadConfig(cwd, configPath);

    // Build plugins
    const buildOutputs: BuildOutput[] = [];
    for (const plugin of config.plugins) {
      switch (plugin.kind) {
        case 'frontend':
          buildOutputs.push(await buildFrontendPlugin(cwd, plugin));
          break;
        case 'backend':
          buildOutputs.push(await buildBackendPlugin(cwd, plugin));
          break;
      }
    }

    // Bundle the plugin
    const packageJson = getRootPackageJson(cwd);
    await bundlePackage({ 
        cwd,
        packageJson,
        buildOutputs
    });
    logSuccess('Plugin package built successfully');
} 