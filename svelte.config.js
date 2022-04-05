import esbuild from 'esbuild'
import { dtsPlugin } from 'esbuild-plugin-d.ts'

import preprocess from 'svelte-preprocess'
import { readFileSync } from 'fs'
import path from 'path'

import AdapterStatic from '@sveltejs/adapter-static'
const STATIC = AdapterStatic({
  pages: '.static_build_output',
  assets: '.static_build_output',
  fallback: null,
  precompress: false
})

import AdapterNode from '@sveltejs/adapter-node'
const NODE = AdapterNode({
  out: '.node_build_output',
  precompress: true
})

import AdapterFirebase from 'svelte-adapter-firebase'
const FIREBASE = AdapterFirebase()

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
const { version } = package_json
const dependencies = Object.keys({
  ...package_json.dependencies,
  ...package_json.devDependencies
}).filter((str) => !/^svelte-/.test(str))

esbuild.build({
  entryPoints: ['./src/lib/pubsub/server.ts'],
  outdir: './.node_bin/',
  bundle: true,
  external: dependencies,
  format: 'esm',
  platform: 'node',
  target: 'node15',
  plugins: [dtsPlugin()]
})

esbuild.build({
  entryPoints: ['./src/scss/bin/index.ts', './src/scss/bin/functions.ts'],
  outdir: './.node_bin/scss/',
  bundle: false,
  format: 'esm',
  platform: 'node',
  target: 'node15',
  plugins: [dtsPlugin()]
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
    adapter: STATIC,
    version: {
      name: version
    },
    trailingSlash: 'never',
    prerender: {
      default: true
    },
    vite: {
      optimizeDeps: {
        include: ['ua-parser-js']
      },
      server: {
        fs: {
          allow: ['package']
        }
      }
    },
    package: {
      exports(path) {
        const is_hit = !/(README.md|pnpm-lock.yaml)$/g.test(path)
        return is_hit
      },
      files(path) {
        if (/\/node_modules\//.test(path)) return false
        if (/\.log$/.test(path)) return false
        const is_hit = /^(browser|browser-device|common|fire|map-reduce|pointer|scroll|storage|timer|unicode|uri)\//g.test(
          path
        )
        return is_hit
      }
    }
  }
}

export default config
