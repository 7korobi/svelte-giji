import { writable } from 'svelte/store';
export const style = writable({
    icon: {
        width: 90,
        height: 130
    },
    gap_size: 50,
    line_slide: 25,
    border_width: 5,
    rx: 10,
    ry: 10
});
export const url = writable({
    portrate: '/images/portrate/'
});
