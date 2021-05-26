import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-static'
import functions from './src/lib/scss/bin/functions.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    scss: { functions }
  }),

  kit: {
    target: 'body',
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null
    })
  }
}

export default config
