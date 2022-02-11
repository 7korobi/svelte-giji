## Svelte Map Reduce Store

```typescript
import { MapReduce } from 'svelte-map-reduce-store';

export type Folder = {
  _id: 'hello' | 'test' | 'beta';
  server?: string;
  config?: {
    maxsize: {
      MAXSIZE_ACTION: number;
      MAXSIZE_MEMOCNT: number;
      MAXSIZE_MEMOLINE: number;
    };
    path: {
      DIR_LIB: './lib';
      DIR_HTML: './html';
      DIR_RS: './rs';
      DIR_VIL: './data/vil';
      DIR_USER: '../data/user';
    };
  };
};

export const Folders = MapReduce({
  format: () => ({
    list: [] as Folder[],
    sameSites: new Set([location.origin])
  }),
  reduce: (data, doc) => {
    if (doc.server) data.sameSites.add(`http://${doc.server}`);
  },
  order: (data, { sort, group_sort }, mode: 'asc' | 'desc') => {
    data.list = sort(data.list)[mode]((o) => o.server);
  }
});
```

```html
<script lang="ts">
  import { Folders } from './model';

  Folders.add([
    {
      _id: 'hello',
      server: 'https://localhost/hello-world'
    },
    {
      _id: 'test',
      server: 'https://localhost/testpage'
    }
  ]);

  Folders.deploy({
    hello: {
      server: 'https://localhost/hello-world'
    },
    test: {
      server: 'https://localhost/testpage'
    }
  });

  Folders.find('hello');
  Folders.reduce(['hello', 'test'], (o: { count: number }) => {
    o.count ||= 0;
    o.count++;
  }).asc((o) => o.count);

  Folders.sort('desc');
  Folders.sort('asc');

  $: console.log($Folders.list);
</script>
```
