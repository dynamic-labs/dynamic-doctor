import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'bin/index.ts',
  output: {
    sourcemap: true,
    file: 'dist/index.js',
    format: 'cjs',
  },
  external: [
    'archy',
    'commander',
    'enquirer',
    'node-fetch',
    'path',
    'pug',
    'fs',
    'child_process',
    'chalk',
    'fs/promises',
  ],
  plugins: [
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    preserveShebangs(),
    copy({
      targets: [{ src: 'src/templates/*', dest: 'dist/src/templates' }],
    }),
  ],
};
