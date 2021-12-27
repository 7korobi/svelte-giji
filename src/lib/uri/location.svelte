<script lang="ts">
import { __BROWSER__ } from '$lib/common'

type URLValue = {
  searchParams: { [key: string]: string | string[] }
  hash: string

  protocol: string
  host: string
  port: number
  hostname: string
  pathname: string

  href?: string
  origin?: string
  username?: string
  password?: string
}

let init = { ...$$props, searchParams: { ...$$props.searchParams } } as URLValue
export let refresh: any = null
export let {
  searchParams,
  hash,
  protocol,
  host,
  port,
  hostname,
  pathname,
  href,
  origin,
  username,
  password
} = {} as URLValue
doRefresh()

$: if (refresh) doRefresh()
$: replace_url({ searchParams, hash, protocol, host, port, hostname, pathname })

function location_url() {
  const href = __BROWSER__ ? window.location.href : 'http://localhost/'
  const url = new URL(href)
  console.log('=', url.href)

  const data: URLValue = {
    searchParams: toSearchParams(url.searchParams, init.searchParams),
    hash: url.hash.slice(1) || init.hash || '',
    protocol: url.protocol.slice(0, -1),
    host: url.host,
    port: Number(url.port) || init.port,
    hostname: url.hostname,
    pathname: url.pathname,
    href: url.href,
    origin: url.origin
    //    username: $$props.username,
    //    password: $$props.password
  }
  return data
}

function replace_url({ searchParams, ...req }: URLValue) {
  if (!__BROWSER__) return
  const ret = new URL(window.location.href)
  Object.assign(ret, req)
  setSearchParams(searchParams, ret.searchParams)
  if (window.location.href === ret.href) return
  console.log('+', ret.href)
  if (window.location.origin === ret.origin) {
    history.replaceState({}, '', ret)
  } else {
    location.replace(ret)
  }
}

function setSearchParams(
  toUrl: URLValue['searchParams'],
  ret = new URLSearchParams()
): URLSearchParams {
  for (const key in toUrl) {
    ret.delete(key)
    const val = toUrl[key]
    if (val instanceof Array) {
      for (const item of val) {
        ret.append(key, item)
      }
    } else {
      if (val) ret.append(key, val)
    }
  }
  return ret
}

function toSearchParams(
  byUrl: URLSearchParams,
  init: URLValue['searchParams']
): URLValue['searchParams'] {
  const ret = {}
  for (const key in init) {
    const defaultValue = init[key]
    const list = byUrl.getAll(key)
    if (defaultValue instanceof Array) {
      ret[key] = list.length ? list : defaultValue
    } else {
      ret[key] = list[0] || defaultValue
    }
  }
  return ret
}

function doRefresh() {
  ;({
    hash,
    searchParams,
    protocol,
    host,
    port,
    hostname,
    origin,
    pathname
    //    username,
    //    password,
  } = location_url())
}
</script>

<svelte:window on:hashchange={doRefresh} on:popstate={doRefresh} />
