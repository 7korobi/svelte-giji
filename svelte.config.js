import preprocess from 'svelte-preprocess'
import functions from './node/lib/scss/bin/functions.js'

import AdapterStatic from '@sveltejs/adapter-static'
const STATIC = AdapterStatic({
  pages: '.static_build_output',
  assets: '.static_build_output',
  fallback: null
})

import AdapterNode from '@sveltejs/adapter-node'
const NODE = AdapterNode({
  out: '.node_build_output',
  precompress: true
})

import AdapterNetlify from '@sveltejs/adapter-netlify'
const NETLIFY = AdapterNetlify()

import AdapterVercel from '@sveltejs/adapter-vercel'
const VERCEL = AdapterVercel()

// TODO: use "platform: 'node'" when building for node
import AdapterCloudflare from '@sveltejs/adapter-cloudflare-workers'
const CLOUDFLARE = AdapterCloudflare()

import AdapterBegin from './src/@sveltejs-adapter-begin-11.js'
const BEGIN = AdapterBegin()

// TODO: has a little debugger bug.
import AdapterServerless from '@nikso/adapter-serverless'
const SERVERLESS = AdapterServerless({
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
    adapter: NODE
  }
}

export default config
