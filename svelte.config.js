import esbuild from 'esbuild'
import preprocess from 'svelte-preprocess'
import { readFileSync } from 'fs'
import path from 'path'
import svelte from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'

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

const package_file = path.join(path.dirname(new URL(import.meta.url).pathname), '/package.json')
const package_json = JSON.parse(readFileSync(package_file, 'utf8'))
const dependencies = Object.keys({ ...package_json.dependencies, ...package_json.devDependencies })
const packages = [
  'block',
  'browser',
  'chat',
  'common',
  'db',
  'fire',
  'icon',
  'map-reduce',
  'pointer',
  'pubsub',
  'scroll',
  'site',
  'storage',
  'timer',
  'topic',
  'uri'
].map((name) => `${name}/$lib`)
// const packages = ['browser','db','fire','icon','map-reduce', 'pointer', 'pubsub', 'scroll', 'site', 'storage', 'timer', 'topic', 'uri']

esbuild.build({
  entryPoints: ['./src/lib/pubsub/server.ts'],
  outdir: './.node_bin/',
  bundle: true,
  external: dependencies,
  format: 'esm',
  platform: 'node',
  target: 'node15'
})

esbuild.build({
  entryPoints: ['./src/scss/bin/index.ts', './src/scss/bin/functions.ts'],
  outdir: './.node_bin/scss/',
  bundle: false,
  format: 'esm',
  platform: 'node',
  target: 'node15'
})

import functions from './.node_bin/scss/functions.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    scss: { functions }
  }),

  kit: {
    target: 'body',
    adapter: STATIC
  }
}

pkg(`browser`)
// pkg('chat')
pkg(`db`)
pkg(`fire`)
pkg(`icon`)
pkg(`map-reduce`)
// pkg(`pointer`)
pkg(`pubsub`, ['client.ts'])
// pkg(`scroll`)
// pkg(`site`)
pkg(`storage`)
pkg(`timer`)
pkg(`topic`)
pkg(`uri`)

export default config

function pkg(name, targets = ['index.ts']) {
  esbuild.build({
    entryPoints: targets.map((file) => `./src/lib/${name}/${file}`),
    outdir: `./package/${name}/`,
    bundle: true,
    format: 'esm',
    target: 'node15',
    external: [...dependencies, ...packages],
    plugins: [
      svelte({
        typescript: true,
        preprocess: sveltePreprocess(),
        compilerOptions: {}
      })
    ]
  })
}
