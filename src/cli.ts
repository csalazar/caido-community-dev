#!/usr/bin/env node
import { Command } from 'commander';
import { build } from './commands';

const program = new Command();

program
  .name('caido-dev')
  .description('Development tools for building Caido plugins')
  .version('1.0.0');

program
  .command('build')
  .description('Build the Caido plugin')
  .option('-c, --config <path>', 'Path to caido.config.ts file')
  .action(build);

program
  .command('dev')
  .description('Start development server')
  .option('-c, --config <path>', 'Path to caido.config.ts file')
  .action(() => {});

program.parse(); 