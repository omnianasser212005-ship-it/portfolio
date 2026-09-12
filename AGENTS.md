# portfolio

React 19 + Vite 8 + Tailwind CSS v4 project configured for GitHub Pages deployment.

## Project Structure

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into `#root`
- `src/App.tsx` - Primary application component
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `index.html` - Vite HTML shell containing `#root` element and loading `src/main.tsx`
- `package.json` - Project dependencies and build scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, and `@` alias for `src`

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, `@vitejs/plugin-react`
