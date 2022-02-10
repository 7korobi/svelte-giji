import { listen } from 'svelte/internal';
export function readyDownload(el, url, timeout = 20000) {
    return new Promise((ok, ng) => {
        const timer = setTimeout(fail, timeout);
        const byes = [
            listen(el, '--abort', fail),
            listen(el, 'error', fail),
            listen(el, 'load', success)
        ];
        el.src = url;
        function bye() {
            clearTimeout(timer);
            byes.forEach((fn) => fn());
        }
        function fail(e = new Event(`timeout ${timeout / 1000}sec`)) {
            el.src = '';
            bye();
            ng(e);
        }
        function success(e) {
            bye();
            ok(e);
        }
    });
}
