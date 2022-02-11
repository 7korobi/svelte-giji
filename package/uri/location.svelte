<script>
import { __BROWSER__ } from 'svelte-petit-utils';
let init = { ...$$props, searchParams: { ...$$props.searchParams } };
export let refresh = null;
export let { searchParams, hash, protocol, host, port, hostname, pathname, href, origin, username, password } = {};
doRefresh();
$: if (refresh) doRefresh();
$: replace_url({ searchParams, hash, protocol, host, port, hostname, pathname });
function location_url() {
  const href = __BROWSER__ ? window.location.href : 'http://localhost/';
  const url = new URL(href);
  console.log('=', url.href);
  const data = {
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
  };
  return data;
}
function replace_url({ searchParams, ...req }) {
  if (!__BROWSER__) return;
  const ret = new URL(window.location.href);
  Object.assign(ret, req);
  setSearchParams(searchParams, ret.searchParams);
  if (window.location.href === ret.href) return;
  console.log('+', ret.href);
  if (window.location.origin === ret.origin) {
    history.replaceState({}, '', ret);
  } else {
    location.replace(ret);
  }
}
function setSearchParams(toUrl, ret = new URLSearchParams()) {
  for (const key in toUrl) {
    ret.delete(key);
    const val = toUrl[key];
    if (val instanceof Array) {
      for (const item of val) {
        ret.append(key, item);
      }
    } else {
      if (val) ret.append(key, val);
    }
  }
  return ret;
}
function toSearchParams(byUrl, init) {
  const ret = {};
  for (const key in init) {
    const defaultValue = init[key];
    const list = byUrl.getAll(key);
    if (defaultValue instanceof Array) {
      ret[key] = list.length ? list : defaultValue;
    } else {
      ret[key] = list[0] || defaultValue;
    }
  }
  return ret;
}
function doRefresh() {
  ({
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
  } = location_url());
}
</script>

<svelte:window on:hashchange={doRefresh} on:popstate={doRefresh} />
