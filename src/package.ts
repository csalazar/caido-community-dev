import { readFileSync } from 'fs';
import { join } from 'path';
import { existsSync } from 'fs';
import { type RootPackageJson, RootPackageJsonSchema, PluginPackageJsonSchema, PluginPackageJson } from './types';


/**
 * Loads the package.json file from the current working directory
 * @returns The parsed and validated package.json contents or null if not found
 */
export function getRootPackageJson(cwd: string): RootPackageJson {
    const packagePath = join(cwd, 'package.json');
    
    if (existsSync(packagePath)) {
        try {
            const contents = readFileSync(packagePath, 'utf-8');
            const parsed = JSON.parse(contents);
            return RootPackageJsonSchema.parse(parsed);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Missing fields in package.json: ${error.message}`);
            }
            throw new Error(`Could not parse ${packagePath}`);
        }
    } else {
        throw new Error(`Could not find package.json in ${process.cwd()}`);
    }
}

export function getPluginPackageJson(path: string): PluginPackageJson {
    const packagePath = join(path, 'package.json');
    const contents = readFileSync(packagePath, 'utf-8');
    return PluginPackageJsonSchema.parse(JSON.parse(contents));
}