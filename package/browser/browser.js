import { listen } from 'svelte/internal';
import { __BROWSER__ } from 'svelte-petit-utils';
import { state, isOnline, isWatching, isActive } from './store';
export default function browserInit() {
    if (!__BROWSER__)
        return () => { };
    const byes = [
        listen(window, 'offline', setOnLine),
        listen(window, 'online', setOnLine),
        listen(window, 'visibilitychange', setVisibilityState)
    ];
    setOnLine();
    setVisibilityState();
    return () => {
        byes.forEach((fn) => fn());
    };
}
function setActive() {
    isActive.set(state.isOnline && state.isWatching);
}
function setOnLine() {
    state.isOnline = window.navigator.onLine;
    isOnline.set(state.isOnline);
    setActive();
}
function setVisibilityState() {
    state.isWatching = 'visible' === document.visibilityState;
    isWatching.set(state.isWatching);
    setActive();
}
