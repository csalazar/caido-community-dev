import { type UserConfig as ViteConfig } from "vite";
import { z } from "zod";

export type FrontendBuildOutput = {
  kind: "frontend";
  id: string;
  name: string;
  fileName: string;
  cssFileName: string | undefined;
  backendId: string | undefined;
  assets: string[];
};

export type BackendBuildOutput = {
  kind: "backend";
  id: string;
  name: string;
  fileName: string;
  assets: string[];
};

export type BuildOutput = FrontendBuildOutput | BackendBuildOutput;

export const backendReferenceConfigSchema = z.strictObject({ id: z.string() });

const viteSchema: z.ZodType<ViteConfig> = z.record(z.string(), z.unknown());

export const assetsConfigSchema = z.array(z.string()).optional();

export const tsupConfigSchema = z.strictObject({
  external: z.array(z.string()).optional(),
});

export const frontendPluginConfigSchema = z.strictObject({
  kind: z.literal("frontend"),
  id: z.string(),
  name: z.string().optional(),
  root: z.string(),
  assets: assetsConfigSchema,
  backend: backendReferenceConfigSchema.nullable().optional(),
  vite: viteSchema.optional(),
});

export const backendPluginConfigSchema = z.strictObject({
  kind: z.literal("backend"),
  id: z.string(),
  name: z.string().optional(),
  root: z.string(),
  assets: assetsConfigSchema,
  tsup: tsupConfigSchema.optional(),
});

export const workflowPluginConfigSchema = z.strictObject({
  kind: z.literal("workflow"),
  id: z.string(),
  name: z.string(),
  root: z.string(),
  definition: z.string(),
});

export const linksConfigSchema = z.strictObject({
  sponsor: z.string().url().optional(),
});

export const watchConfigSchema = z.strictObject({
  port: z.number().optional(),
});

export const caidoConfigSchema = z.strictObject({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  author: z.object({
    name: z.string(),
    email: z.string().email().optional(),
    url: z.string().url().optional(),
  }),
  links: linksConfigSchema.optional(),
  plugins: z.array(
    z.discriminatedUnion("kind", [
      frontendPluginConfigSchema,
      backendPluginConfigSchema,
      workflowPluginConfigSchema,
    ]),
  ),
  watch: watchConfigSchema.optional(),
});

// Type inference
export type BackendReferenceConfig = z.infer<
  typeof backendReferenceConfigSchema
>;
export type FrontendPluginConfig = z.infer<typeof frontendPluginConfigSchema>;
export type BackendPluginConfig = z.infer<typeof backendPluginConfigSchema>;
export type WorkflowPluginConfig = z.infer<typeof workflowPluginConfigSchema>;
export type WatchConfig = z.infer<typeof watchConfigSchema>;
export type CaidoConfig = z.infer<typeof caidoConfigSchema>;

export type ConnectedMessage = {
  kind: "connected";
  packageId: string;
  downloadUrl: string;
};

export type RebuildMessage = {
  kind: "rebuild";
  downloadUrl: string;
};

export type ErrorMessage = {
  kind: "error";
  error: string;
};
