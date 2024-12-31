import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { existsSync } from 'fs';
import { z } from 'zod';

const RootPackageJsonSchema = z.object({
    name: z.string(),
    version: z.string(),
    description: z.string(),
    author: z.object({
        name: z.string(),
        email: z.string().email(),
        url: z.string().url(),
    }),
});

const PluginPackageJsonSchema = z.object({
    name: z.string(),
});

export type RootPackageJson = z.infer<typeof RootPackageJsonSchema>;
export type PluginPackageJson = z.infer<typeof PluginPackageJsonSchema>;
/**
 * Loads the package.json file from the current working directory
 * @returns The parsed and validated package.json contents or null if not found
 */
export function getRootPackageJson(): RootPackageJson {
    const packagePath = join(process.cwd(), 'package.json');
    
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