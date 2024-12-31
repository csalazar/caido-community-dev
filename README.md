# caido-dev

A development toolkit for building Caido plugins. This CLI tool simplifies the process of developing, building, and packaging Caido plugins.

## Installation

```bash
npm install -g caido-dev
```

## Usage

### Initialize a New Plugin

```bash
caido-dev init [--template <template-name>]
```

Available templates:
- `frontend-vue` (default) - Vue.js frontend with TypeScript
- `frontend-vanilla` - Vanilla JavaScript/TypeScript frontend
- `no-frontend` - Backend-only plugin

### Development Mode

```bash
caido-dev dev [--config <path-to-config>]
```

This command starts a development server for your plugin. It will:
- Watch for changes in your source files
- Automatically rebuild when changes are detected
- Provide hot module replacement for frontend development

### Build Plugin

```bash
caido-dev build [--config <path-to-config>]
```

This command:
1. Builds your frontend (if configured)
2. Builds your backend (if configured)
3. Creates a plugin package ready for distribution

## Configuration

Create a `caido.config.ts` file in your project root:

```typescript
import { defineConfig } from 'vite';

export default {
  name: 'my-plugin',
  version: '1.0.0',
  description: 'My awesome Caido plugin',
  author: 'Your Name',

  frontend: {
    entry: 'src/frontend/main.ts',
    vite: defineConfig({
      // Custom Vite configuration for frontend
    })
  },

  backend: {
    entry: 'src/backend/main.ts',
    vite: defineConfig({
      // Custom Vite configuration for backend
    })
  },

  dev: {
    port: 3000,
    https: false,
    host: 'localhost'
  },

  outDir: 'dist'
};
```

## Project Structure

A typical Caido plugin project structure:

```
my-plugin/
├── caido.config.ts
├── package.json
├── src/
│   ├── frontend/
│   │   ├── main.ts
│   │   └── components/
│   └── backend/
│       └── main.ts
└── dist/
    ├── frontend/
    ├── backend/
    └── plugin_package.zip
```

## License

MIT 