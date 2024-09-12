import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import * as sass from 'sass';

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          implementation: sass,
        },
      },
    },
  },
  integrations: [svelte(), tailwind(), expressiveCode({
    themes: ['rose-pine'],
    styleOverrides: {
      borderWidth: '0px',
      codeFontFamily: "Fira Code",
      frames: {
        editorTabBorderRadius: '4px 0px 0px 0px',
        tooltipSuccessBackground: '#272537',
        tooltipSuccessForeground: '#B195C7',
      }
    }
  })],
});
