import path from 'path';
import { createJiti } from 'jiti';
import { z } from 'zod';

const DEFAULT_CONFIG_FILE = 'caido.config.ts';

export const backendReferenceConfigSchema = z.strictObject({
  id: z.string(),
});

export const frontendPluginConfigSchema = z.strictObject({
  kind: z.literal('frontend'),
  name: z.string().optional(),
  path: z.string(),
  backend: backendReferenceConfigSchema.nullable().optional(),
});

export const backendPluginConfigSchema = z.strictObject({
  kind: z.literal('backend'),
  id: z.string(),
  name: z.string().nullable().optional(),
  entry: z.string(),
});

export const workflowPluginConfigSchema = z.strictObject({
  kind: z.literal('workflow'),
  id: z.string(),
  name: z.string(),
  definition: z.string(),
});

export const devConfigSchema = z.strictObject({
  port: z.number().optional(),
  host: z.string().optional(),
});

export const caidoConfigSchema = z.strictObject({
  plugins: z.array(
    z.discriminatedUnion('kind', [
      frontendPluginConfigSchema,
      backendPluginConfigSchema,
      workflowPluginConfigSchema,
    ])
  ),
  dev: devConfigSchema.optional(),
});

// Type inference
export type BackendReferenceConfig = z.infer<typeof backendReferenceConfigSchema>;
export type FrontendPluginConfig = z.infer<typeof frontendPluginConfigSchema>;
export type BackendPluginConfig = z.infer<typeof backendPluginConfigSchema>;
export type WorkflowPluginConfig = z.infer<typeof workflowPluginConfigSchema>;
export type DevConfig = z.infer<typeof devConfigSchema>;
export type CaidoConfig = z.infer<typeof caidoConfigSchema>; 

export async function loadConfig(configPath?: string): Promise<CaidoConfig> {
  const configFile = configPath || path.resolve(process.cwd(), DEFAULT_CONFIG_FILE);
  
  try {
    // Use jiti for dynamic imports
    const jiti = createJiti(process.cwd(), { interopDefault: true });
    const config = await jiti.import(configFile, { default: true });
    return caidoConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
    throw new Error('Unknown error occurred');
  }
}
