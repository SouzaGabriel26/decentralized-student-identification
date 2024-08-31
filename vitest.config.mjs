import { configDotenv } from 'dotenv';
import { expand } from 'dotenv-expand';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

expand(configDotenv({ path: '.env' }));

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    typecheck: {
      enabled: true,
    },
    fileParallelism: false,
  },
});
