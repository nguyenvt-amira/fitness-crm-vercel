import { defaultPlugins, defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: process.env.NEXT_PUBLIC_OPENAPI_GENERATOR_URL ?? './src/lib/api/openapi.json',
  output: {
    lint: 'eslint',
    format: 'prettier',
    path: './src/lib/api',
  },
  plugins: [
    ...defaultPlugins,
    {
      enums: 'javascript',
      name: '@hey-api/typescript',
    },
    {
      asClass: true,
      name: '@hey-api/sdk',
    },
    {
      name: '@hey-api/client-fetch',
      runtimeConfigPath: './src/lib/client.config.ts',
    },
    '@tanstack/react-query',
  ],
});
