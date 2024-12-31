import path from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';
import ora from 'ora';
import { loadConfig } from '../config';
import { bundlePackage } from '../bundle';
import { getRootPackageJson } from '../package';
import { buildFrontendPlugin } from '../build/frontend';
import { BuildOutput } from '../types';

export async function build(options: {
    config?: string;
}) {
  const spinner = ora('Loading configuration').start();

  try {
    // Load configuration
    const config = await loadConfig(options.config);
    spinner.succeed('Configuration loaded');

    // Build plugins
    const buildOutputs: BuildOutput[] = [];
    for (const plugin of config.plugins) {
      switch (plugin.kind) {
        case 'frontend':
          spinner.start(`Building frontend plugin at ${plugin.path}`);
          const output = await buildFrontendPlugin(plugin);
          buildOutputs.push(output);
          spinner.succeed(`Frontend plugin ${plugin.path} built successfully`);
          break;
      }
    }

    // Bundle the plugin
    spinner.start('Bundling plugins');
    const packageJson = getRootPackageJson();
    await bundlePackage({ 
        packageJson,
        buildOutputs
    });
    spinner.succeed('Plugin package created successfully');
    console.log(chalk.green('\n✨ Build completed successfully!'));
  } catch (error) {
    spinner.fail('Build failed');
    const buildError = error instanceof Error ? error : new Error('Unknown error occurred');
    console.error(chalk.red(`\n${buildError.message}`));
    process.exit(1);
  }
} 