export type FrontendBuildOutput = {
  kind: 'frontend';
  id: string;
  name: string;
  fileName: string;
  cssFileName: string | undefined;
  backendId: string | undefined;
}

export type BuildOutput = FrontendBuildOutput;