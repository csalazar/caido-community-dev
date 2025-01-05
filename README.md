# caido-dev

A development toolkit for building Caido plugins. This CLI tool simplifies the process of developing, building, and packaging Caido plugins.

## Installation

```bash
pnpm install -D @caido-community/dev
```

## CLI Commands

### Build

```bash
caido-dev build [path] [--config <path-to-config>]
```

- **Description**: Build the Caido plugin.
- **Options**:
  - `-c, --config <path>`: Path to the `caido.config.ts` file.

### Watch

```bash
caido-dev watch [path] [--config <path-to-config>]
```

- **Description**: Start the development server and watch for changes.
- **Options**:
  - `-c, --config <path>`: Path to the `caido.config.ts` file.
