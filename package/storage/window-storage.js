import { writable } from 'svelte/store';
import { listen } from 'svelte/internal';
import { __BROWSER__ } from 'svelte-petit-utils';
const NUMBER = {
    parse: (s) => parseInt(s),
    stringify: (n) => n.toString()
};
const STRING = {
    parse: (s) => s,
    stringify: (s) => s
};
function initConverter(init) {
    if ('number' === typeof init)
        return NUMBER;
    if ('string' === typeof init)
        return STRING;
    return JSON;
}
if (__BROWSER__) {
    listen(window, 'storage', ({ storageArea, key, newValue, oldValue, url }) => {
        let cache = undefined;
        if (window.localStorage === storageArea)
            cache = local_cache;
        if (window.sessionStorage === storageArea)
            cache = session_cache;
        if (!cache[key])
            return;
        const [store, convert] = cache[key];
        store.set(convert.parse(newValue));
    });
}
const local_cache = {};
const session_cache = {};
function writeCache(convert, cache, storage, key, initValue) {
    if (cache[key])
        throw new Error(`${key} duplicated.`);
    initValue = convert.parse(storage.getItem(key)) || initValue;
    const store = writable(initValue);
    store.subscribe((newValue) => {
        storage.setItem(key, convert.stringify(newValue));
    });
    cache[key] = [store, convert];
    return store;
}
export function writeLocal(key, initValue, convert = initConverter(initValue)) {
    if (!__BROWSER__)
        return writable(initValue);
    return writeCache(convert, local_cache, window.localStorage, key, initValue);
}
export function writeSession(key, initValue, convert = initConverter(initValue)) {
    if (!__BROWSER__)
        return writable(initValue);
    return writeCache(convert, session_cache, window.sessionStorage, key, initValue);
}
