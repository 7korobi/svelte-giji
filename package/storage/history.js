import { writable } from 'svelte/store';
export function writeHistory(init, property) {
  const { update, subscribe } = writable(init);
  return {
    add(value) {
      update((list) => {
        const valueProp = property(value);
        let isReplace = 0;
        let idx = list.findIndex((item) => {
          let itemProp = property(item);
          if (itemProp < valueProp) return false;
          isReplace = itemProp === valueProp ? 1 : 0;
          return true;
        });
        if (-1 === idx) idx = list.length;
        list.splice(idx, isReplace, value);
        return list;
      });
    },
    subscribe
  };
}
