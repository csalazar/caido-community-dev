import { loadConfig } from '../config';
import { bundlePackage } from '../bundle';
import { getRootPackageJson } from '../package';
import { buildFrontendPlugin } from '../build/frontend';
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
          const output = await buildFrontendPlugin(cwd, plugin);
          buildOutputs.push(output);
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