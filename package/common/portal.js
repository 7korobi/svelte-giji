import { tick } from 'svelte';
export const portals = {};
export function portal(selector = undefined) {
    let targetEl;
    if (selector) {
        catchSlot(3);
        return { mount };
    }
    else {
        return { slot, mount };
    }
    async function catchSlot(remain) {
        targetEl = document.querySelector(selector);
        if (remain && !targetEl) {
            await tick();
            catchSlot(remain - 1);
        }
    }
    function slot(el) {
        targetEl = el;
        return { destroy };
        function destroy() { }
    }
    function mount(el) {
        ;
        (async () => {
            await tick();
            targetEl.appendChild(el);
        })();
        return { destroy };
        function destroy() {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }
    }
}
