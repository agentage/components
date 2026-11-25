import { existsSync, readdirSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import pkg from './package.json' with { type: 'json' };

// Runtime deps stay external so preserved modules keep their own client boundaries.
const external = [
  /^react($|\/)/,
  /^react-dom($|\/)/,
  ...Object.keys(pkg.dependencies).map((dep) => new RegExp(`^${dep}($|/)`)),
];

const srcDir = resolve(__dirname, 'src');

// Every source module is an entry: with preserveModules a non-entry module keeps only the exports
// something else imports, so a subpath module would lose the exports the barrel does not re-export.
const entry = Object.fromEntries(
  (readdirSync(srcDir, { recursive: true, encoding: 'utf8' }) as string[])
    .filter((file) => /\.tsx?$/.test(file) && !/\.(test|d)\.tsx?$/.test(file))
    .map((file) => [file.replace(/\.tsx?$/, ''), resolve(srcDir, file)])
);

// Declarations must import siblings with `.js` so NodeNext consumers resolve them (src uses bundler style).
const withJsExtensions = (filePath: string, content: string): string =>
  content.replace(/(from\s+|import\()(['"])(\.{1,2}\/[^'"]+)\2/g, (match, lead, quote, spec) => {
    if (/\.(js|css|json)$/.test(spec)) return match;
    const target = resolve(dirname(filePath), spec);
    const rel = relative(resolve(__dirname, 'dist'), target);
    const isFile = ['.ts', '.tsx'].some((ext) => existsSync(resolve(srcDir, `${rel}${ext}`)));
    return `${lead}${quote}${spec}${isFile ? '' : '/index'}.js${quote}`;
  });

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      outDir: 'dist',
      beforeWriteFile: (filePath, content) => ({
        filePath,
        content: filePath.endsWith('.d.ts') ? withJsExtensions(filePath, content) : content,
      }),
    }),
  ],
  build: {
    lib: {
      entry,
      formats: ['es'],
    },
    rollupOptions: {
      external,
      output: {
        preserveModules: true,
        preserveModulesRoot: resolve(__dirname, 'src'),
        entryFileNames: '[name].js',
      },
    },
    cssCodeSplit: false,
    emptyOutDir: true,
  },
});
