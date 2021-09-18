import preprocess from 'svelte-preprocess'
import functions from './src/lib/scss/bin/functions.js'

import STATIC from '@sveltejs/adapter-static'
const staticAdapter = STATIC({
  pages: '.static_build_output',
  assets: '.static_build_output',
  fallback: null
})

import NODE from '@sveltejs/adapter-node'
const nodeAdapter = NODE({
  out: '.node_build_output',
  precompress: true,
  env: {
    port: 3000
  }
})

import NETLIFY from '@sveltejs/adapter-netlify'
const netlifyAdapter = NETLIFY()

import VERCEL from '@sveltejs/adapter-vercel'
const vercelAdapter = VERCEL()

// TODO: use "platform: 'node'" when building for node
import CLOUDFLARE from '@sveltejs/adapter-cloudflare-workers'
const cloudflareAdapter = CLOUDFLARE()

import BEGIN from './src/@sveltejs-adapter-begin-11.js'
const beginAdapter = BEGIN()

// TODO: has a little debugger bug.
import SERVERLESS from '@nikso/adapter-serverless'
const serverlessAdapter = SERVERLESS({
  out: '.serverless_build_output'
})

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    scss: { functions }
  }),

  kit: {
    target: 'body',
    adapter: nodeAdapter
  }
}

export default config
