var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all3) => {
  __markAsModule(target);
  for (var name in all3)
    __defProp(target, name, { get: all3[name], enumerable: true });
};

// src/lib/pubsub/server.ts
import { readFileSync } from "fs";
import {
  createServer
} from "https";
import { Server } from "socket.io";
import parser2 from "socket.io-msgpack-parser";
import { argv } from "process";

// src/lib/db/mongodb.ts
import { MongoClient } from "mongodb";
var client;
function db() {
  return client.db();
}
async function dbBoot(url) {
  if (client)
    exit();
  client = new MongoClient(url, {});
  await client.connect();
  console.warn("MongoDB connected.");
  process.on("beforeExit", exit);
}
function watch(set2, del2, model3, pipeline) {
  return model3.watch(pipeline, { fullDocument: "updateLookup" }).on("change", ({ operationType, documentKey, fullDocument }) => {
    switch (operationType) {
      case "insert":
      case "update":
        set2(fullDocument);
        break;
      case "delete":
        del2(documentKey);
        break;
      case "invalidate":
        console.log(fullDocument);
        break;
    }
  });
}
function exit() {
  client.close();
  console.warn("MongoDB safely close.");
}

// src/lib/db/socket.io-server.ts
var MODEL = {};
var STORE = {};
var QUERY = {};
var io;
async function leave(socket, name, ...args) {
  var _a2;
  const api = getApi(name, ...args);
  socket.leave(api);
  const sockets = await socket.to(api).allSockets();
  if (QUERY[api] && !sockets.size) {
    console.log(socket.id, api, "closed.");
    (_a2 = QUERY[api].active) == null ? void 0 : _a2.close();
    delete QUERY[api].cache;
    delete QUERY[api].active;
  }
}
async function query(socket, name, ...args) {
  const api = getApi(name, ...args);
  socket.join(api);
  if (!QUERY[api])
    QUERY[api] = {};
  if (QUERY[api].cache) {
    const size = QUERY[api].cache.length;
    console.log(socket.id, api, `{ size: ${size} ... } (cached)`);
  } else {
    const $match = MODEL[name].$match(...args);
    QUERY[api].cache = await MODEL[name].query($match);
    const size = QUERY[api].cache.length;
    console.log(socket.id, api, { size, $match });
  }
  socket.emit(`SET:${api}`, QUERY[api].cache);
  if (MODEL[name].isLive) {
    const isLive = await MODEL[name].isLive(...args);
    if (isLive)
      init(socket, name, api, ...args);
  }
}
function init(socket, name, api, ...args) {
  if (!QUERY[api])
    QUERY[api] = {};
  if (QUERY[api].active)
    return;
  const $match = MODEL[name].$match(...args);
  const delay = 1e3;
  QUERY[api].active = MODEL[name].live($match, throttle(`SET:${api}`), throttle(`DEL:${api}`));
  function throttle(key) {
    const items = [];
    let timeout;
    return function(item) {
      if (QUERY[api].cache)
        delete QUERY[api].cache;
      items.push(item);
      if (!timeout)
        timeout = setTimeout(run, delay);
      function run() {
        io.in(api).emit(key, items);
        items.length = 0;
        timeout = null;
      }
    };
  }
}
async function set(name, docs) {
  const res = await Promise.all(docs.map(MODEL[name].set));
  const errors = docs.filter((doc, idx) => !res[idx].ok);
  if (errors.length)
    io.in(name).emit(`SET:ERROR:${name}`, errors);
}
async function del(name, ids) {
  const res = await MODEL[name].del(ids);
  const errors = res.deletedCount ? ids : [];
  if (errors.length)
    io.in(name).emit(`DEL:ERROR:${name}`, errors);
}
function getApi(name, ...args) {
  const { qid } = STORE[name];
  return `${name}(${qid(...args)})`;
}
function model(o) {
  return o;
}
function modelAsMongoDB(collection, $project) {
  const table = () => db().collection(collection);
  return {
    $match: (ids) => ({ _id: { $in: ids } }),
    set: ($set) => table().findOneAndUpdate({ _id: $set._id }, { $set }, { upsert: true }),
    del: (ids) => table().deleteMany({ _id: { $in: ids } }),
    isLive: async () => true,
    live: ($match, set2, del2) => watch(set2, del2, table(), pipeline($match)),
    query: async ($match) => table().aggregate(pipeline($match)).toArray()
  };
  function pipeline($match) {
    if ($project) {
      return [{ $match }, { $project }];
    } else {
      return [{ $match }];
    }
  }
}
function listen(socketio, models, stores) {
  MODEL = models;
  STORE = stores;
  for (const name in stores) {
    stores[name].name ??= name;
  }
  io = socketio;
  io.on("set", set);
  io.on("del", del);
  io.on("connection", (socket) => {
    socket.on("query", query.bind(null, socket));
    socket.on("leave", leave.bind(null, socket));
  });
  console.log(io.eventNames(), io.path());
}

// src/lib/site/json/live-server.json
var dev = {
  mongodb: "mongodb://giji-api.duckdns.org:27017/giji?directConnection=true&replicaSet=giji",
  http: {
    port: 3001
  },
  io: {
    origin: ["http://localhost:3000", "https://gijilog.web.app", "https://giji-db923.web.app"]
  }
};
var prod = {
  mongodb: "mongodb://192.168.0.200:27017/giji?directConnection=true&replicaSet=giji",
  https: {
    port: 4002,
    cert: "/etc/letsencrypt/live/giji-api.duckdns.org/cert.pem",
    privkey: "/etc/letsencrypt/live/giji-api.duckdns.org/privkey.pem"
  },
  io: {
    origin: [
      "http://localhost:3000",
      "https://admin.socket.io",
      "https://giji.f5.si",
      "https://gijilog.web.app",
      "https://giji-eve.web.app",
      "https://giji-db923.web.app"
    ]
  }
};
var live_server_default = {
  dev,
  prod
};

// src/lib/pubsub/model-client.ts
var model_client_exports = {};
__export(model_client_exports, {
  cards: () => cards,
  default_stories_query: () => default_stories_query,
  default_story_query: () => default_story_query,
  events: () => events,
  message_for_face: () => message_for_face,
  message_for_face_by_face: () => message_for_face_by_face,
  message_for_face_mestype: () => message_for_face_mestype,
  message_for_face_sow_auth: () => message_for_face_sow_auth,
  messages: () => messages,
  new_plans: () => new_plans,
  potof_for_face: () => potof_for_face,
  potof_for_face_live: () => potof_for_face_live,
  potof_for_face_role: () => potof_for_face_role,
  potof_for_face_sow_auth_max: () => potof_for_face_sow_auth_max,
  potofs: () => potofs,
  randoms: () => randoms,
  stats: () => stats,
  stories: () => stories,
  story_summary: () => story_summary
});

// src/lib/map-reduce/base.ts
import { writable } from "svelte/store";

// src/lib/common/define.ts
var __SPEC__ = typeof window === "undefined";
var __BROWSER__ = !__SPEC__;

// src/lib/map-reduce/fast-sort.ts
var castComparer = (comparer) => (a, b, order) => comparer(a, b, order) * order;
var throwInvalidConfigErrorIfTrue = function(condition, context) {
  if (condition)
    throw Error(`Invalid sort config: ${context}`);
};
var unpackObjectSorter = function(sortByObj) {
  const { asc, desc } = sortByObj || {};
  const order = asc ? 1 : -1;
  const sortBy = asc || desc;
  throwInvalidConfigErrorIfTrue(!sortBy, "Expected `asc` or `desc` property");
  throwInvalidConfigErrorIfTrue(asc && desc, "Ambiguous object with `asc` and `desc` config properties");
  const comparer = sortByObj.comparer && castComparer(sortByObj.comparer);
  return { order, sortBy, comparer };
};
var multiPropertySorterProvider = function(defaultComparer2) {
  return function multiPropertySorter(sortBy, sortByArr, depth, order, comparer, a, b) {
    let valA;
    let valB;
    if (typeof sortBy === "string") {
      valA = a[sortBy];
      valB = b[sortBy];
    } else if (typeof sortBy === "function") {
      valA = sortBy(a);
      valB = sortBy(b);
    } else {
      const objectSorterConfig = unpackObjectSorter(sortBy);
      return multiPropertySorter(objectSorterConfig.sortBy, sortByArr, depth, objectSorterConfig.order, objectSorterConfig.comparer || defaultComparer2, a, b);
    }
    const equality = comparer(valA, valB, order);
    if ((equality === 0 || valA == null && valB == null) && sortByArr.length > depth) {
      return multiPropertySorter(sortByArr[depth], sortByArr, depth + 1, order, comparer, a, b);
    }
    return equality;
  };
};
function getSortStrategy(sortBy, comparer, order) {
  if (sortBy === void 0 || sortBy === true) {
    return (a, b) => comparer(a, b, order);
  }
  if (typeof sortBy === "string") {
    throwInvalidConfigErrorIfTrue(sortBy.includes("."), "String syntax not allowed for nested properties.");
    return (a, b) => comparer(a[sortBy], b[sortBy], order);
  }
  if (typeof sortBy === "function") {
    return (a, b) => comparer(sortBy(a), sortBy(b), order);
  }
  if (Array.isArray(sortBy)) {
    const multiPropSorter = multiPropertySorterProvider(comparer);
    return (a, b) => multiPropSorter(sortBy[0], sortBy, 1, order, comparer, a, b);
  }
  const objectSorterConfig = unpackObjectSorter(sortBy);
  return getSortStrategy(objectSorterConfig.sortBy, objectSorterConfig.comparer || comparer, objectSorterConfig.order);
}
var sortArray = function(order, ctx, sortBy, comparer) {
  if (!Array.isArray(ctx)) {
    return ctx;
  }
  if (Array.isArray(sortBy) && sortBy.length < 2) {
    ;
    [sortBy] = sortBy;
  }
  return ctx.sort(getSortStrategy(sortBy, comparer, order));
};
var createNewSortInstance = function(opts) {
  const comparer = castComparer(opts.comparer);
  return function(_ctx) {
    const ctx = Array.isArray(_ctx) && !opts.inPlaceSorting ? _ctx.slice() : _ctx;
    return {
      asc(sortBy) {
        return sortArray(1, ctx, sortBy, comparer);
      },
      desc(sortBy) {
        return sortArray(-1, ctx, sortBy, comparer);
      },
      by(sortBy) {
        return sortArray(1, ctx, sortBy, comparer);
      }
    };
  };
};
var defaultComparer = (a, b, order) => {
  if (a == null)
    return order;
  if (b == null)
    return -order;
  if (a < b)
    return -1;
  if (a === b)
    return 0;
  return 1;
};
var sort = createNewSortInstance({
  comparer: defaultComparer
});
var inPlaceSort = createNewSortInstance({
  comparer: defaultComparer,
  inPlaceSorting: true
});

// src/lib/map-reduce/dic.ts
function sort2(value) {
  if (!(value instanceof Array)) {
    const list = [];
    for (const id in value) {
      const item = value[id];
      item._id = id;
      list.push(item);
    }
    value = list;
  }
  return inPlaceSort(value);
}
function group_sort(data, cb, ...cbs) {
  if (!cbs.length)
    return cb(data);
  if (data instanceof Array) {
    for (const o of data) {
      ;
      group_sort(o, ...cbs);
    }
  } else {
    const list = [];
    for (const idx in data) {
      const item = group_sort(data[idx], ...cbs);
      item._id = idx;
      list.push(item);
    }
    data = list;
  }
  return cb(data);
}
function dic(o, ...levels) {
  for (let i = 0; i < levels.length; i += 2) {
    const id = levels[i];
    const format2 = levels[i + 1];
    if (!o[id])
      o[id] = format2;
    o = o[id];
  }
  return o;
}

// src/lib/map-reduce/base.ts
function nop(...args) {
}
function MapReduce({
  format: format2,
  initialize = nop,
  reduce,
  order,
  start: start2
}) {
  const children = new Map();
  const map = new Map();
  const data = format2();
  const find = (id) => map.get(id);
  const { subscribe, set: set2 } = writable(format2(), __BROWSER__ ? start2 : void 0);
  let sArgs = [];
  return { deploy, clear, add, del: del2, find, reduce: doReduce, filter, sort: sort3, format: format2, data, subscribe };
  function sort3(...sa) {
    if (order)
      order(data, { sort: sort2, group_sort }, ...sArgs = sa);
    set2(data);
  }
  function full_calculate() {
    const { list } = data;
    clear();
    for (const doc of list) {
      data.list.push(doc);
      reduce(data, doc);
    }
  }
  function deploy(json, init2 = initialize) {
    const list = [];
    for (const _id in json) {
      const o = json[_id];
      o._id = _id;
      list.push(o);
    }
    add(list, init2);
  }
  function filter(validator, key = validator.toString()) {
    return query2;
    function query2(...filter_args) {
      const child = MapReduce({ format: format2, reduce, order });
      children.set(key, { validator, filter_args, add: child.add, del: child.del });
      child.add(data.list.filter((o) => validator(o, ...filter_args)));
      return {
        reduce: child.reduce,
        filter: child.filter,
        sort: child.sort,
        data: child.data,
        subscribe: child.subscribe,
        validator
      };
    }
  }
  function doReduce(ids, emit2) {
    const map2 = new Map();
    for (const id of ids) {
      const item = find(id);
      if (!item)
        continue;
      map2.set(id, __spreadValues({}, item));
    }
    const list = [...map2.values()];
    for (const item of list) {
      emit2(item);
    }
    return sort2(list);
  }
  function clear() {
    Object.assign(data, format2());
    set2(data);
  }
  function add(docs, init2 = initialize) {
    let is_update = false;
    for (const doc of docs) {
      const id = doc._id;
      if (find(id)) {
        is_update = true;
      } else {
        data.list.push(doc);
        init2 && init2(doc);
        reduce(data, doc);
      }
      map.set(id, doc);
    }
    if (is_update)
      full_calculate();
    sort3(...sArgs);
    set2(data);
    for (const { validator, filter_args, add: add2 } of children.values()) {
      add2(docs.filter((o) => validator(o, ...filter_args)));
    }
  }
  function del2(ids) {
    let is_update = false;
    for (const id of ids) {
      if (map.delete(id))
        is_update = true;
    }
    if (is_update)
      full_calculate();
    set2(data);
    for (const { del: del3 } of children.values()) {
      del3(ids);
    }
  }
}

// src/lib/db/socket.io-client.ts
import { io as io2 } from "socket.io-client";
import parser from "socket.io-msgpack-parser";
function model2(props) {
  return props;
}

// src/lib/pubsub/book_story/client.ts
import format from "date-fns/format/index.js";
import locale from "date-fns/locale/ja/index.js";

// src/lib/pubsub/aggregate/map-reduce.ts
var potof_for_faces = model2({
  format: () => ({
    list: []
  }),
  reduce: (data, doc) => {
  },
  order: (data, { sort: sort3 }) => {
  }
});

// src/lib/game/json/sow_folder.json
var PERL_DEFAULT = {
  config: {
    csid: [
      "ririnra",
      "ririnra_c01",
      "ririnra_c05",
      "ririnra_c08",
      "ririnra_c19",
      "ririnra_c67",
      "ririnra_c68",
      "ririnra_c72",
      "ririnra_c51",
      "ririnra_c20",
      "ririnra_c32",
      "ririnra_c128",
      "all",
      "mad",
      "mad_mad05",
      "time",
      "time_t21",
      "time_t44",
      "time_t48",
      "time_t48_wash",
      "time_t49",
      "time_t49_wash",
      "time_t80",
      "ger",
      "fable",
      "fable_f1",
      "fable_f8",
      "fable_f14",
      "fable_f4",
      "animal",
      "school",
      "changed",
      "changed_m05",
      "SF",
      "SF_sf10",
      "SF_sf032",
      "SF_sf041",
      "wa",
      "wa_w23",
      "wa_w51"
    ],
    path: {
      DIR_LIB: "../cabala/lib",
      DIR_HTML: "../cabala/html",
      DIR_RS: "../cabala/rs",
      DIR_VIL: "./data/vil",
      DIR_USER: "../sow/data/user"
    },
    enable: {
      DEFAULT_VOTETYPE: ["anonymity", "\u6A19\u6E96\u306E\u6295\u7968\u65B9\u6CD5(sign: \u8A18\u540D\u3001anonymity:\u7121\u8A18\u540D)"],
      ENABLED_DELETED: [1, "\u524A\u9664\u767A\u8A00\u3092\u8868\u793A\u3059\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_WINNER_LABEL: [1, "1:\u52DD\u5229\u8005\u8868\u793A\u3092\u3059\u308B\u3002"],
      ENABLED_MAX_ESAY: [0, "\u30A8\u30D4\u30ED\u30FC\u30B0\u3092\u767A\u8A00\u5236\u9650\u5BFE\u8C61\u306B 0:\u3057\u306A\u3044\u30011:\u3059\u308B"],
      ENABLED_RANDOMTARGET: [1, "1:\u6295\u7968\u30FB\u80FD\u529B\u5148\u306B\u300C\u30E9\u30F3\u30C0\u30E0\u300D\u3092\u542B\u3081\u308B"],
      ENABLED_SUDDENDEATH: [1, "1:\u7A81\u7136\u6B7B\u3042\u308A"],
      ENABLED_BITTY: [1, "\u5C11\u5973\u3084\u4EA4\u970A\u8005\u306E\u306E\u305E\u304D\u307F\u304C\u3072\u3089\u304C\u306A\u306E\u307F\u3002"],
      ENABLED_PERMIT_DEAD: [0, "\u5893\u4E0B\u306E\u4EBA\u72FC/\u5171\u9CF4\u8005/\u30B3\u30A6\u30E2\u30EA\u4EBA\u9593\u304C\u56C1\u304D\u3092\u898B\u3089\u308C\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_UNDEAD: [0, "1:\u5E7D\u754C\u30C8\u30FC\u30AF\u6751\u3092\u8A2D\u5B9A\u53EF\u80FD"],
      ENABLED_AIMING: [1, "1:\u5BFE\u8C61\u3092\u6307\u5B9A\u3057\u305F\u767A\u8A00\uFF08\u5185\u7DD2\u8A71\uFF09\u3092\u542B\u3081\u308B"],
      ENABLED_MOB_AIMING: [1, "1:\u898B\u7269\u4EBA\u304C\u5185\u7DD2\u8A71\u3092\u4F7F\u3048\u308B\u3002"],
      ENABLED_AMBIDEXTER: [
        1,
        "1:\u72C2\u4EBA\u306E\u88CF\u5207\u308A\u3092\u8A8D\u3081\u308B\uFF08\u72C2\u4EBA\u306F\u3001\u4EBA\u72FC\u9663\u55B6\u3067\u306F\u306A\u304F\u88CF\u5207\u308A\u306E\u9663\u55B6\uFF1D\u6751\u304C\u8CA0\u3051\u308C\u3070\u3088\u3044\uFF09"
      ],
      ENABLED_SUICIDE_VOTE: [1, "1:\u81EA\u6BBA\u6295\u7968"]
    }
  }
};
var PERL_NEW = {
  config: {
    trsid: ["all", "star", "regend", "heavy", "complexx", "secret"],
    game: [
      "TABULA",
      "LIVE_TABULA",
      "MILLERHOLLOW",
      "LIVE_MILLERHOLLOW",
      "TROUBLE",
      "MISTERY",
      "SECRET"
    ]
  }
};
var PERL_GAME = {
  config: {
    csid: [
      "ririnra",
      "ririnra_c01",
      "ririnra_c05",
      "ririnra_c08",
      "ririnra_c19",
      "ririnra_c67",
      "ririnra_c68",
      "ririnra_c72",
      "ririnra_c51",
      "ririnra_c20",
      "ririnra_c32",
      "ririnra_c128",
      "all",
      "mad",
      "mad_mad05",
      "time",
      "time_t21",
      "time_t44",
      "time_t48",
      "time_t48_wash",
      "time_t49",
      "time_t49_wash",
      "time_t80",
      "ger",
      "fable",
      "fable_f1",
      "fable_f8",
      "fable_f14",
      "fable_f4",
      "animal",
      "school",
      "changed",
      "changed_m05",
      "SF",
      "SF_sf10",
      "SF_sf032",
      "SF_sf041",
      "wa",
      "wa_w23",
      "wa_w51"
    ],
    erb: "./asset/sow/giji.pl.erb",
    cd_default: "\u6226",
    maxsize: {
      MAXSIZE_ACTION: 60,
      MAXSIZE_MEMOCNT: 1e3,
      MAXSIZE_MEMOLINE: 25
    },
    saycnt: ["tiny", "weak", "juna", "say1", "say5x200", "say5x300", "saving", "euro"],
    game: ["TABULA", "LIVE_TABULA", "MILLERHOLLOW", "LIVE_MILLERHOLLOW", "TROUBLE", "MISTERY"],
    trsid: ["all", "star", "regend", "heavy", "complexx"],
    path: {
      DIR_LIB: "./lib",
      DIR_HTML: "./html",
      DIR_RS: "./rs",
      DIR_VIL: "./data/vil",
      DIR_USER: "../sow/data/user"
    }
  }
};
var UNION = {
  config: {
    csid: [
      "ririnra",
      "ririnra_c01",
      "ririnra_c05",
      "ririnra_c08",
      "ririnra_c19",
      "ririnra_c67",
      "ririnra_c68",
      "ririnra_c72",
      "ririnra_c51",
      "ririnra_c20",
      "ririnra_c32",
      "ririnra_c128",
      "all",
      "mad",
      "mad_mad05",
      "time",
      "time_t21",
      "time_t44",
      "time_t48",
      "time_t48_wash",
      "time_t49",
      "time_t49_wash",
      "time_t80",
      "ger",
      "fable",
      "fable_f1",
      "fable_f8",
      "fable_f14",
      "fable_f4",
      "animal",
      "school",
      "changed",
      "changed_m05",
      "SF",
      "SF_sf10",
      "SF_sf032",
      "SF_sf041",
      "wa",
      "wa_w23",
      "wa_w51"
    ],
    erb: "./asset/sow/giji.pl.erb",
    cd_default: "\u6226",
    maxsize: {
      MAXSIZE_ACTION: 60,
      MAXSIZE_MEMOCNT: 1e3,
      MAXSIZE_MEMOLINE: 25
    },
    saycnt: ["tiny", "weak", "juna", "say5x200", "say5x300", "wbbs", "saving", "euro"],
    game: [
      "TABULA",
      "LIVE_TABULA",
      "MILLERHOLLOW",
      "LIVE_MILLERHOLLOW",
      "TROUBLE",
      "MISTERY",
      "SECRET"
    ],
    trsid: [
      "sow",
      "all",
      "star",
      "regend",
      "heavy",
      "complexx",
      "tabula",
      "millerhollow",
      "ultimate"
    ],
    path: {
      DIR_LIB: "./lib",
      DIR_HTML: "./html",
      DIR_RS: "./rs",
      DIR_VIL: "./data/vil",
      DIR_USER: "../sow/data/user"
    },
    cfg: {
      TYPE: "CABALA",
      RULE: "UNION",
      USERID_NPC: "master",
      USERID_ADMIN: "admin",
      ENABLED_VMAKE: 1,
      TIMEOUT_ENTRY: 3,
      TIMEOUT_SCRAP: 10,
      TOPPAGE_INFO: "../sow/_info.pl",
      BASEDIR_CGI: ".",
      BASEDIR_DAT: "./data",
      BASEDIR_DOC: "http://s3-ap-northeast-1.amazonaws.com/giji-assets"
    }
  }
};
var BRAID = {
  story: {
    evil: "WOLF",
    role_play: true
  },
  config: {
    csid: [
      "ririnra",
      "ririnra_c01",
      "ririnra_c05",
      "ririnra_c08",
      "ririnra_c19",
      "ririnra_c67",
      "ririnra_c68",
      "ririnra_c72",
      "ririnra_c51",
      "ririnra_c20",
      "ririnra_c32",
      "ririnra_c128",
      "all",
      "mad",
      "mad_mad05",
      "time",
      "time_t21",
      "time_t44",
      "time_t48",
      "time_t48_wash",
      "time_t49",
      "time_t49_wash",
      "time_t80",
      "ger",
      "fable",
      "fable_f1",
      "fable_f8",
      "fable_f14",
      "fable_f4",
      "animal",
      "school",
      "changed",
      "changed_m05",
      "SF",
      "SF_sf10",
      "SF_sf032",
      "SF_sf041",
      "wa",
      "wa_w23",
      "wa_w51"
    ],
    erb: "./asset/sow/giji.pl.erb",
    cd_default: "\u6F14",
    maxsize: {
      MAXSIZE_ACTION: 120,
      MAXSIZE_MEMOCNT: 2e3,
      MAXSIZE_MEMOLINE: 25
    },
    saycnt: ["weak", "juna", "vulcan", "infinity"],
    game: ["TABULA", "MILLERHOLLOW", "TROUBLE", "MISTERY"],
    trsid: ["all", "star", "regend", "heavy", "complexx"],
    enable: {
      DEFAULT_VOTETYPE: ["anonymity", "\u6A19\u6E96\u306E\u6295\u7968\u65B9\u6CD5(sign: \u8A18\u540D\u3001anonymity:\u7121\u8A18\u540D)"],
      ENABLED_DELETED: [0, "\u524A\u9664\u767A\u8A00\u3092\u8868\u793A\u3059\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_WINNER_LABEL: [0, "1:\u52DD\u5229\u8005\u8868\u793A\u3092\u3059\u308B\u3002"],
      ENABLED_MAX_ESAY: [0, "\u30A8\u30D4\u30ED\u30FC\u30B0\u3092\u767A\u8A00\u5236\u9650\u5BFE\u8C61\u306B 0:\u3057\u306A\u3044\u30011:\u3059\u308B"],
      ENABLED_RANDOMTARGET: [1, "1:\u6295\u7968\u30FB\u80FD\u529B\u5148\u306B\u300C\u30E9\u30F3\u30C0\u30E0\u300D\u3092\u542B\u3081\u308B"],
      ENABLED_SUDDENDEATH: [1, "1:\u7A81\u7136\u6B7B\u3042\u308A"],
      ENABLED_BITTY: [0, "\u5C11\u5973\u3084\u4EA4\u970A\u8005\u306E\u306E\u305E\u304D\u307F\u304C\u3072\u3089\u304C\u306A\u306E\u307F\u3002"],
      ENABLED_PERMIT_DEAD: [1, "\u5893\u4E0B\u306E\u4EBA\u72FC/\u5171\u9CF4\u8005/\u30B3\u30A6\u30E2\u30EA\u4EBA\u9593\u304C\u56C1\u304D\u3092\u898B\u3089\u308C\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_UNDEAD: [1, "1:\u5E7D\u754C\u30C8\u30FC\u30AF\u6751\u3092\u8A2D\u5B9A\u53EF\u80FD"],
      ENABLED_AIMING: [0, "1:\u5BFE\u8C61\u3092\u6307\u5B9A\u3057\u305F\u767A\u8A00\uFF08\u5185\u7DD2\u8A71\uFF09\u3092\u542B\u3081\u308B"],
      ENABLED_MOB_AIMING: [1, "1:\u898B\u7269\u4EBA\u304C\u5185\u7DD2\u8A71\u3092\u4F7F\u3048\u308B\u3002"],
      ENABLED_AMBIDEXTER: [
        0,
        "1:\u72C2\u4EBA\u306E\u88CF\u5207\u308A\u3092\u8A8D\u3081\u308B\uFF08\u72C2\u4EBA\u306F\u3001\u4EBA\u72FC\u9663\u55B6\u3067\u306F\u306A\u304F\u88CF\u5207\u308A\u306E\u9663\u55B6\uFF1D\u6751\u304C\u8CA0\u3051\u308C\u3070\u3088\u3044\uFF09"
      ],
      ENABLED_SUICIDE_VOTE: [0, "1:\u81EA\u6BBA\u6295\u7968"]
    },
    cfg: {
      TYPE: "BRAID",
      RULE: "BRAID",
      USERID_NPC: "master",
      USERID_ADMIN: "admin",
      ENABLED_VMAKE: 1,
      TIMEOUT_ENTRY: 2,
      TIMEOUT_SCRAP: 5,
      TOPPAGE_INFO: "./_info.pl",
      BASEDIR_CGI: ".",
      BASEDIR_DAT: "./data",
      BASEDIR_DOC: "http://s3-ap-northeast-1.amazonaws.com/giji-assets"
    }
  }
};
var all = {
  nation: "- \u3059\u3079\u3066 -"
};
var TEST = {
  nation: "\u4EBA\u72FC\u8B70\u4E8B\u30C6\u30B9\u30C8",
  story: {
    evil: "EVIL",
    role_play: false
  },
  config: {
    csid: [
      "ririnra",
      "ririnra_c01",
      "ririnra_c05",
      "ririnra_c08",
      "ririnra_c19",
      "ririnra_c67",
      "ririnra_c68",
      "ririnra_c72",
      "ririnra_c51",
      "ririnra_c20",
      "ririnra_c32",
      "ririnra_c128",
      "all",
      "mad",
      "mad_mad05",
      "time",
      "time_t21",
      "time_t44",
      "time_t48",
      "time_t48_wash",
      "time_t49",
      "time_t49_wash",
      "time_t80",
      "ger",
      "fable",
      "fable_f1",
      "fable_f8",
      "fable_f14",
      "fable_f4",
      "animal",
      "school",
      "changed",
      "changed_m05",
      "SF",
      "SF_sf10",
      "SF_sf032",
      "SF_sf041",
      "wa",
      "wa_w23",
      "wa_w51"
    ],
    erb: "./asset/sow/giji.pl.erb",
    cd_default: "\u6226",
    maxsize: {
      MAXSIZE_ACTION: 60,
      MAXSIZE_MEMOCNT: 1e3,
      MAXSIZE_MEMOLINE: 25
    },
    saycnt: [
      "weak",
      "juna",
      "say5x200",
      "say5x300",
      "wbbs",
      "saving",
      "euro",
      "vulcan",
      "infinity"
    ],
    game: [
      "TABULA",
      "LIVE_TABULA",
      "MILLERHOLLOW",
      "LIVE_MILLERHOLLOW",
      "TROUBLE",
      "MISTERY",
      "SECRET"
    ],
    trsid: [
      "sow",
      "all",
      "star",
      "regend",
      "heavy",
      "complexx",
      "tabula",
      "millerhollow",
      "ultimate"
    ],
    path: {
      DIR_LIB: "../testbed/lib",
      DIR_HTML: "../testbed/html",
      DIR_RS: "../testbed/rs",
      DIR_VIL: "./data/vil",
      DIR_USER: "../sow/data/user"
    },
    cfg: {
      TYPE: "CABALA",
      RULE: "ALLSTAR",
      USERID_NPC: "master",
      USERID_ADMIN: "admin",
      ENABLED_VMAKE: 1,
      TIMEOUT_ENTRY: 1,
      TIMEOUT_SCRAP: 1,
      TOPPAGE_INFO: "../sow/_info.pl",
      BASEDIR_CGI: ".",
      BASEDIR_DAT: "./data",
      BASEDIR_DOC: "http://s3-ap-northeast-1.amazonaws.com/giji-assets",
      URL_SW: "http://utage.family.jp/testbed",
      BASEDIR_CGIERR: "http://utage.family.jp//testbed",
      NAME_HOME: "\u4EBA\u72FC\u8B70\u4E8B \u624B\u5143\u30C6\u30B9\u30C8",
      MAX_VILLAGES: 9
    },
    enable: {
      DEFAULT_VOTETYPE: ["anonymity", "\u6A19\u6E96\u306E\u6295\u7968\u65B9\u6CD5(sign: \u8A18\u540D\u3001anonymity:\u7121\u8A18\u540D)"],
      ENABLED_DELETED: [1, "\u524A\u9664\u767A\u8A00\u3092\u8868\u793A\u3059\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_WINNER_LABEL: [1, "1:\u52DD\u5229\u8005\u8868\u793A\u3092\u3059\u308B\u3002"],
      ENABLED_MAX_ESAY: [0, "\u30A8\u30D4\u30ED\u30FC\u30B0\u3092\u767A\u8A00\u5236\u9650\u5BFE\u8C61\u306B 0:\u3057\u306A\u3044\u30011:\u3059\u308B"],
      ENABLED_RANDOMTARGET: [1, "1:\u6295\u7968\u30FB\u80FD\u529B\u5148\u306B\u300C\u30E9\u30F3\u30C0\u30E0\u300D\u3092\u542B\u3081\u308B"],
      ENABLED_SUDDENDEATH: [0, "1:\u7A81\u7136\u6B7B\u3042\u308A"],
      ENABLED_BITTY: [1, "\u5C11\u5973\u3084\u4EA4\u970A\u8005\u306E\u306E\u305E\u304D\u307F\u304C\u3072\u3089\u304C\u306A\u306E\u307F\u3002"],
      ENABLED_PERMIT_DEAD: [0, "\u5893\u4E0B\u306E\u4EBA\u72FC/\u5171\u9CF4\u8005/\u30B3\u30A6\u30E2\u30EA\u4EBA\u9593\u304C\u56C1\u304D\u3092\u898B\u3089\u308C\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_UNDEAD: [1, "1:\u5E7D\u754C\u30C8\u30FC\u30AF\u6751\u3092\u8A2D\u5B9A\u53EF\u80FD"],
      ENABLED_AIMING: [1, "1:\u5BFE\u8C61\u3092\u6307\u5B9A\u3057\u305F\u767A\u8A00\uFF08\u5185\u7DD2\u8A71\uFF09\u3092\u542B\u3081\u308B"],
      ENABLED_MOB_AIMING: [1, "1:\u898B\u7269\u4EBA\u304C\u5185\u7DD2\u8A71\u3092\u4F7F\u3048\u308B\u3002"],
      ENABLED_AMBIDEXTER: [
        1,
        "1:\u72C2\u4EBA\u306E\u88CF\u5207\u308A\u3092\u8A8D\u3081\u308B\uFF08\u72C2\u4EBA\u306F\u3001\u4EBA\u72FC\u9663\u55B6\u3067\u306F\u306A\u304F\u88CF\u5207\u308A\u306E\u9663\u55B6\uFF1D\u6751\u304C\u8CA0\u3051\u308C\u3070\u3088\u3044\uFF09"
      ],
      ENABLED_SUICIDE_VOTE: [1, "1:\u81EA\u6BBA\u6295\u7968"]
    },
    pl: "/www/giji_log/testbed/config.pl"
  }
};
var PERJURY_OLD = {
  folder: "PERJURY_OLD",
  nation: "\u4EBA\u72FC\u8B70\u4E8BRP:Bp",
  vid_code: "Bp",
  server: "utage.family.jp",
  oldlog: "/perjury/sow.cgi?cmd=oldlog&rowall=on",
  livelog: "/perjury/sow.cgi?cmd=rss",
  info_url: "/perjury/sow.cgi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/perjury/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  config: {
    csid: [
      "ririnra",
      "ririnra_c01",
      "ririnra_c05",
      "ririnra_c08",
      "ririnra_c19",
      "ririnra_c67",
      "ririnra_c68",
      "ririnra_c72",
      "ririnra_c51",
      "ririnra_c20",
      "ririnra_c32",
      "ririnra_c128",
      "all",
      "mad",
      "mad_mad05",
      "time",
      "time_t21",
      "time_t44",
      "time_t48",
      "time_t48_wash",
      "time_t49",
      "time_t49_wash",
      "time_t80",
      "ger",
      "fable",
      "fable_f1",
      "fable_f8",
      "fable_f14",
      "fable_f4",
      "animal",
      "school",
      "changed",
      "changed_m05",
      "SF",
      "SF_sf10",
      "SF_sf032",
      "SF_sf041",
      "wa",
      "wa_w23",
      "wa_w51"
    ],
    erb: "./asset/sow/giji.pl.erb",
    cd_default: "\u6F14",
    maxsize: {
      MAXSIZE_ACTION: 120,
      MAXSIZE_MEMOCNT: 2e3,
      MAXSIZE_MEMOLINE: 25
    },
    saycnt: ["weak", "juna", "vulcan", "infinity"],
    game: ["TABULA", "MILLERHOLLOW", "TROUBLE", "MISTERY"],
    trsid: ["all", "star", "regend", "heavy", "complexx"],
    enable: {
      DEFAULT_VOTETYPE: ["anonymity", "\u6A19\u6E96\u306E\u6295\u7968\u65B9\u6CD5(sign: \u8A18\u540D\u3001anonymity:\u7121\u8A18\u540D)"],
      ENABLED_DELETED: [0, "\u524A\u9664\u767A\u8A00\u3092\u8868\u793A\u3059\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_WINNER_LABEL: [0, "1:\u52DD\u5229\u8005\u8868\u793A\u3092\u3059\u308B\u3002"],
      ENABLED_MAX_ESAY: [0, "\u30A8\u30D4\u30ED\u30FC\u30B0\u3092\u767A\u8A00\u5236\u9650\u5BFE\u8C61\u306B 0:\u3057\u306A\u3044\u30011:\u3059\u308B"],
      ENABLED_RANDOMTARGET: [1, "1:\u6295\u7968\u30FB\u80FD\u529B\u5148\u306B\u300C\u30E9\u30F3\u30C0\u30E0\u300D\u3092\u542B\u3081\u308B"],
      ENABLED_SUDDENDEATH: [1, "1:\u7A81\u7136\u6B7B\u3042\u308A"],
      ENABLED_BITTY: [0, "\u5C11\u5973\u3084\u4EA4\u970A\u8005\u306E\u306E\u305E\u304D\u307F\u304C\u3072\u3089\u304C\u306A\u306E\u307F\u3002"],
      ENABLED_PERMIT_DEAD: [1, "\u5893\u4E0B\u306E\u4EBA\u72FC/\u5171\u9CF4\u8005/\u30B3\u30A6\u30E2\u30EA\u4EBA\u9593\u304C\u56C1\u304D\u3092\u898B\u3089\u308C\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_UNDEAD: [1, "1:\u5E7D\u754C\u30C8\u30FC\u30AF\u6751\u3092\u8A2D\u5B9A\u53EF\u80FD"],
      ENABLED_AIMING: [0, "1:\u5BFE\u8C61\u3092\u6307\u5B9A\u3057\u305F\u767A\u8A00\uFF08\u5185\u7DD2\u8A71\uFF09\u3092\u542B\u3081\u308B"],
      ENABLED_MOB_AIMING: [1, "1:\u898B\u7269\u4EBA\u304C\u5185\u7DD2\u8A71\u3092\u4F7F\u3048\u308B\u3002"],
      ENABLED_AMBIDEXTER: [
        0,
        "1:\u72C2\u4EBA\u306E\u88CF\u5207\u308A\u3092\u8A8D\u3081\u308B\uFF08\u72C2\u4EBA\u306F\u3001\u4EBA\u72FC\u9663\u55B6\u3067\u306F\u306A\u304F\u88CF\u5207\u308A\u306E\u9663\u55B6\uFF1D\u6751\u304C\u8CA0\u3051\u308C\u3070\u3088\u3044\uFF09"
      ],
      ENABLED_SUICIDE_VOTE: [0, "1:\u81EA\u6BBA\u6295\u7968"]
    },
    cfg: {
      TYPE: "CABALA",
      RULE: "BRAID",
      USERID_NPC: "master",
      USERID_ADMIN: "admin",
      ENABLED_VMAKE: 0,
      TIMEOUT_ENTRY: 2,
      TIMEOUT_SCRAP: 5,
      TOPPAGE_INFO: "../sow/_info.pl",
      BASEDIR_CGI: ".",
      BASEDIR_DAT: "./data",
      BASEDIR_DOC: "http://s3-ap-northeast-1.amazonaws.com/giji-assets",
      URL_SW: "http://utage.family.jp/perjury",
      BASEDIR_CGIERR: "http://utage.family.jp//perjury",
      NAME_HOME: "\u4EBA\u72FC\u8B70\u4E8B Role Play braid perjury",
      MAX_VILLAGES: 0
    },
    path: {
      DIR_LIB: "../cabala/lib",
      DIR_HTML: "../cabala/html",
      DIR_RS: "../cabala/rs",
      DIR_VIL: "./data/vil",
      DIR_USER: "../sow/data/user"
    },
    pl: "/www/giji_log/perjury/config.pl"
  }
};
var PRETENSE = {
  folder: "PRETENSE",
  nation: "\u4EBA\u72FC\u8B70\u4E8BRP:Advance",
  vid_code: "A",
  server: "utage.family.jp",
  oldlog: "/pretense/sow.cgi?cmd=oldlog&rowall=on",
  info_url: "/pretense/sow.cgi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/pretense/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  story: {
    evil: "WOLF",
    role_play: true
  }
};
var RP = {
  folder: "RP",
  nation: "\u4EBA\u72FC\u8B70\u4E8BRP:",
  vid_code: "",
  server: "utage.family.jp",
  oldlog: "/rp/sow.cgi?cmd=oldlog&rowall=on",
  info_url: "/rp/sow.cgi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/rp/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  story: {
    evil: "WOLF",
    role_play: true
  }
};
var CABALA_OLD = {
  folder: "CABALA",
  nation: "\u4EBA\u72FC\u8B70\u4E8B\u9670\u8B00:",
  vid_code: "C",
  server: "utage.family.jp",
  oldlog: "/cabala/sow.cgi?cmd=oldlog&rowall=on",
  livelog: "/cabala/sow.cgi?cmd=rss",
  info_url: "/cabala/sow.cgi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/cabala/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  config: {
    csid: [
      "ririnra",
      "ririnra_c01",
      "ririnra_c05",
      "ririnra_c08",
      "ririnra_c19",
      "ririnra_c67",
      "ririnra_c68",
      "ririnra_c72",
      "ririnra_c51",
      "ririnra_c20",
      "ririnra_c32",
      "ririnra_c128",
      "all",
      "mad",
      "mad_mad05",
      "time",
      "time_t21",
      "time_t44",
      "time_t48",
      "time_t48_wash",
      "time_t49",
      "time_t49_wash",
      "time_t80",
      "ger",
      "fable",
      "fable_f1",
      "fable_f8",
      "fable_f14",
      "fable_f4",
      "animal",
      "school",
      "changed",
      "changed_m05",
      "SF",
      "SF_sf10",
      "SF_sf032",
      "SF_sf041",
      "wa",
      "wa_w23",
      "wa_w51"
    ],
    erb: "./asset/sow/giji.pl.erb",
    cd_default: "\u6226",
    maxsize: {
      MAXSIZE_ACTION: 60,
      MAXSIZE_MEMOCNT: 1e3,
      MAXSIZE_MEMOLINE: 25
    },
    saycnt: ["tiny", "weak", "juna", "say1", "say5x200", "say5x300", "saving", "euro"],
    game: ["TABULA", "LIVE_TABULA", "MILLERHOLLOW", "LIVE_MILLERHOLLOW", "TROUBLE", "MISTERY"],
    trsid: ["all", "star", "regend", "heavy", "complexx"],
    path: {
      DIR_LIB: "../cabala/lib",
      DIR_HTML: "../cabala/html",
      DIR_RS: "../cabala/rs",
      DIR_VIL: "../cafe/data/vil",
      DIR_USER: "../sow/data/user"
    },
    enable: {
      DEFAULT_VOTETYPE: ["anonymity", "\u6A19\u6E96\u306E\u6295\u7968\u65B9\u6CD5(sign: \u8A18\u540D\u3001anonymity:\u7121\u8A18\u540D)"],
      ENABLED_DELETED: [1, "\u524A\u9664\u767A\u8A00\u3092\u8868\u793A\u3059\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_WINNER_LABEL: [1, "1:\u52DD\u5229\u8005\u8868\u793A\u3092\u3059\u308B\u3002"],
      ENABLED_MAX_ESAY: [0, "\u30A8\u30D4\u30ED\u30FC\u30B0\u3092\u767A\u8A00\u5236\u9650\u5BFE\u8C61\u306B 0:\u3057\u306A\u3044\u30011:\u3059\u308B"],
      ENABLED_RANDOMTARGET: [1, "1:\u6295\u7968\u30FB\u80FD\u529B\u5148\u306B\u300C\u30E9\u30F3\u30C0\u30E0\u300D\u3092\u542B\u3081\u308B"],
      ENABLED_SUDDENDEATH: [1, "1:\u7A81\u7136\u6B7B\u3042\u308A"],
      ENABLED_BITTY: [1, "\u5C11\u5973\u3084\u4EA4\u970A\u8005\u306E\u306E\u305E\u304D\u307F\u304C\u3072\u3089\u304C\u306A\u306E\u307F\u3002"],
      ENABLED_PERMIT_DEAD: [0, "\u5893\u4E0B\u306E\u4EBA\u72FC/\u5171\u9CF4\u8005/\u30B3\u30A6\u30E2\u30EA\u4EBA\u9593\u304C\u56C1\u304D\u3092\u898B\u3089\u308C\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_UNDEAD: [1, "1:\u5E7D\u754C\u30C8\u30FC\u30AF\u6751\u3092\u8A2D\u5B9A\u53EF\u80FD"],
      ENABLED_AIMING: [1, "1:\u5BFE\u8C61\u3092\u6307\u5B9A\u3057\u305F\u767A\u8A00\uFF08\u5185\u7DD2\u8A71\uFF09\u3092\u542B\u3081\u308B"],
      ENABLED_MOB_AIMING: [1, "1:\u898B\u7269\u4EBA\u304C\u5185\u7DD2\u8A71\u3092\u4F7F\u3048\u308B\u3002"],
      ENABLED_AMBIDEXTER: [
        1,
        "1:\u72C2\u4EBA\u306E\u88CF\u5207\u308A\u3092\u8A8D\u3081\u308B\uFF08\u72C2\u4EBA\u306F\u3001\u4EBA\u72FC\u9663\u55B6\u3067\u306F\u306A\u304F\u88CF\u5207\u308A\u306E\u9663\u55B6\uFF1D\u6751\u304C\u8CA0\u3051\u308C\u3070\u3088\u3044\uFF09"
      ],
      ENABLED_SUICIDE_VOTE: [1, "1:\u81EA\u6BBA\u6295\u7968"]
    },
    cfg: {
      TYPE: "CABALA",
      RULE: "CABALA",
      USERID_NPC: "master",
      USERID_ADMIN: "admin",
      ENABLED_VMAKE: 1,
      TIMEOUT_ENTRY: 3,
      TIMEOUT_SCRAP: 10,
      TOPPAGE_INFO: "../sow/_info.pl",
      BASEDIR_CGI: ".",
      BASEDIR_DAT: "./data",
      BASEDIR_DOC: "http://s3-ap-northeast-1.amazonaws.com/giji-assets",
      URL_SW: "http://utage.family.jp/cabala",
      BASEDIR_CGIERR: "http://utage.family.jp//cabala",
      NAME_HOME: "\u4EBA\u72FC\u8B70\u4E8B \u9670\u8B00\u306E\u82D1",
      MAX_VILLAGES: 0
    },
    pl: "/www/giji_log/cabala/config.pl"
  }
};
var ALLSTAR_OLD = {
  folder: "ALLSTAR",
  nation: "\u4EBA\u72FC\u8B70\u4E8B\u5927\u4E71\u95D8:A",
  vid_code: "A",
  server: "utage.family.jp",
  oldlog: "/allstar/sow.cgi?cmd=oldlog&rowall=on",
  livelog: "/allstar/sow.cgi?cmd=rss",
  info_url: "/allstar/sow.cgi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/allstar/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  config: {
    csid: [
      "ririnra",
      "ririnra_c01",
      "ririnra_c05",
      "ririnra_c08",
      "ririnra_c19",
      "ririnra_c67",
      "ririnra_c68",
      "ririnra_c72",
      "ririnra_c51",
      "ririnra_c20",
      "ririnra_c32",
      "ririnra_c128",
      "all",
      "mad",
      "mad_mad05",
      "time",
      "time_t21",
      "time_t44",
      "time_t48",
      "time_t48_wash",
      "time_t49",
      "time_t49_wash",
      "time_t80",
      "ger",
      "fable",
      "fable_f1",
      "fable_f8",
      "fable_f14",
      "fable_f4",
      "animal",
      "school",
      "changed",
      "changed_m05",
      "SF",
      "SF_sf10",
      "SF_sf032",
      "SF_sf041",
      "wa",
      "wa_w23",
      "wa_w51"
    ],
    erb: "./asset/sow/giji.pl.erb",
    cd_default: "\u6226",
    maxsize: {
      MAXSIZE_ACTION: 60,
      MAXSIZE_MEMOCNT: 1e3,
      MAXSIZE_MEMOLINE: 25
    },
    saycnt: ["tiny", "weak", "juna", "say5x200", "say5x300", "wbbs", "saving", "euro"],
    game: [
      "TABULA",
      "LIVE_TABULA",
      "MILLERHOLLOW",
      "LIVE_MILLERHOLLOW",
      "TROUBLE",
      "MISTERY",
      "SECRET"
    ],
    trsid: [
      "sow",
      "all",
      "star",
      "regend",
      "heavy",
      "complexx",
      "tabula",
      "millerhollow",
      "ultimate"
    ],
    path: {
      DIR_LIB: "../cabala/lib",
      DIR_HTML: "../cabala/html",
      DIR_RS: "../cabala/rs",
      DIR_VIL: "../jksy/data/vil",
      DIR_USER: "../sow/data/user"
    },
    cfg: {
      TYPE: "CABALA",
      RULE: "ALLSTAR",
      USERID_NPC: "master",
      USERID_ADMIN: "admin",
      ENABLED_VMAKE: 1,
      TIMEOUT_ENTRY: 3,
      TIMEOUT_SCRAP: 10,
      TOPPAGE_INFO: "../sow/_info.pl",
      BASEDIR_CGI: ".",
      BASEDIR_DAT: "./data",
      BASEDIR_DOC: "http://s3-ap-northeast-1.amazonaws.com/giji-assets",
      URL_SW: "http://utage.family.jp/allstar",
      BASEDIR_CGIERR: "http://utage.family.jp//allstar",
      NAME_HOME: "\u4EBA\u72FC\u8B70\u4E8B \u5927\u4E71\u95D8\u30AA\u30FC\u30EB\u30B9\u30BF\u30FC",
      MAX_VILLAGES: 0
    },
    enable: {
      DEFAULT_VOTETYPE: ["anonymity", "\u6A19\u6E96\u306E\u6295\u7968\u65B9\u6CD5(sign: \u8A18\u540D\u3001anonymity:\u7121\u8A18\u540D)"],
      ENABLED_DELETED: [1, "\u524A\u9664\u767A\u8A00\u3092\u8868\u793A\u3059\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_WINNER_LABEL: [1, "1:\u52DD\u5229\u8005\u8868\u793A\u3092\u3059\u308B\u3002"],
      ENABLED_MAX_ESAY: [0, "\u30A8\u30D4\u30ED\u30FC\u30B0\u3092\u767A\u8A00\u5236\u9650\u5BFE\u8C61\u306B 0:\u3057\u306A\u3044\u30011:\u3059\u308B"],
      ENABLED_RANDOMTARGET: [1, "1:\u6295\u7968\u30FB\u80FD\u529B\u5148\u306B\u300C\u30E9\u30F3\u30C0\u30E0\u300D\u3092\u542B\u3081\u308B"],
      ENABLED_SUDDENDEATH: [1, "1:\u7A81\u7136\u6B7B\u3042\u308A"],
      ENABLED_BITTY: [1, "\u5C11\u5973\u3084\u4EA4\u970A\u8005\u306E\u306E\u305E\u304D\u307F\u304C\u3072\u3089\u304C\u306A\u306E\u307F\u3002"],
      ENABLED_PERMIT_DEAD: [0, "\u5893\u4E0B\u306E\u4EBA\u72FC/\u5171\u9CF4\u8005/\u30B3\u30A6\u30E2\u30EA\u4EBA\u9593\u304C\u56C1\u304D\u3092\u898B\u3089\u308C\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_UNDEAD: [1, "1:\u5E7D\u754C\u30C8\u30FC\u30AF\u6751\u3092\u8A2D\u5B9A\u53EF\u80FD"],
      ENABLED_AIMING: [0, "1:\u5BFE\u8C61\u3092\u6307\u5B9A\u3057\u305F\u767A\u8A00\uFF08\u5185\u7DD2\u8A71\uFF09\u3092\u542B\u3081\u308B"],
      ENABLED_MOB_AIMING: [1, "1:\u898B\u7269\u4EBA\u304C\u5185\u7DD2\u8A71\u3092\u4F7F\u3048\u308B\u3002"],
      ENABLED_AMBIDEXTER: [
        1,
        "1:\u72C2\u4EBA\u306E\u88CF\u5207\u308A\u3092\u8A8D\u3081\u308B\uFF08\u72C2\u4EBA\u306F\u3001\u4EBA\u72FC\u9663\u55B6\u3067\u306F\u306A\u304F\u88CF\u5207\u308A\u306E\u9663\u55B6\uFF1D\u6751\u304C\u8CA0\u3051\u308C\u3070\u3088\u3044\uFF09"
      ],
      ENABLED_SUICIDE_VOTE: [1, "1:\u81EA\u6BBA\u6295\u7968"]
    },
    pl: "/www/giji_log/allstar/config.pl"
  }
};
var ULTIMATE = {
  folder: "ULTIMATE",
  nation: "\u4EBA\u72FC\u8B70\u4E8B\u5927\u4E71\u95D8:",
  vid_code: "",
  server: "utage.family.jp",
  oldlog: "/ultimate/sow.cgi?cmd=oldlog&rowall=on",
  info_url: "/ultimate/sow.cgi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/ultimate/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  story: {
    evil: "EVIL",
    role_play: false
  }
};
var WOLF = {
  folder: "WOLF",
  nation: "\u4EBA\u72FC\u8B70\u4E8B\u6A19\u6E96",
  vid_code: "",
  server: "utage.family.jp",
  oldlog: "/wolf/sow.cgi?cmd=oldlog&rowall=on",
  livelog: "/wolf/sow.cgi?cmd=rss",
  info_url: "/wolf/sow.cgi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/wolf/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  story: {
    evil: "WOLF",
    role_play: false
  }
};
var PAN = {
  folder: "PAN",
  nation: "\u4F3C\u9854\u7D75\u4EBA\u72FC",
  server: "soy-bean.sakura.ne.jp",
  oldlog: "/pan/sow.cgi?cmd=oldlog&rowall=on",
  livelog: "/pan/sow.cgi?cmd=rss",
  info_url: "/pan/sow.cgi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/pan/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  story: {
    evil: "WOLF",
    role_play: false
  },
  config: {
    csid: ["sow", "juna", "name", "bloody", "orange", "15girls", "tmmi", "cat", "bunmei"],
    erb: "./asset/sow/pan.pl.erb",
    cd_default: "\u6226",
    maxsize: {
      MAXSIZE_ACTION: 60,
      MAXSIZE_MEMOCNT: 1e3,
      MAXSIZE_MEMOLINE: 25
    },
    saycnt: ["tiny", "weak", "juna", "say5x200", "say5x300", "wbbs", "saving", "euro"],
    game: [
      "TABULA",
      "LIVE_TABULA",
      "MILLERHOLLOW",
      "LIVE_MILLERHOLLOW",
      "TROUBLE",
      "MISTERY",
      "SECRET"
    ],
    trsid: [
      "sow",
      "all",
      "star",
      "regend",
      "heavy",
      "complexx",
      "tabula",
      "millerhollow",
      "ultimate"
    ],
    path: {
      DIR_LIB: "./lib",
      DIR_HTML: "./html",
      DIR_RS: "./rs",
      DIR_VIL: "./data/vil",
      DIR_USER: "./data/user"
    },
    cfg: {
      TYPE: "CABALA",
      RULE: "PAN",
      USERID_NPC: "master",
      USERID_ADMIN: "admin",
      ENABLED_VMAKE: 1,
      TIMEOUT_ENTRY: 3,
      TIMEOUT_SCRAP: 10,
      TOPPAGE_INFO: "../sow/_info.pl",
      BASEDIR_CGI: ".",
      BASEDIR_DAT: "./data",
      BASEDIR_DOC: "http://s3-ap-northeast-1.amazonaws.com/giji-assets",
      URL_SW: "http://soy-bean.sakura.ne.jp/pan",
      BASEDIR_CGIERR: "http://soy-bean.sakura.ne.jp/pan//",
      NAME_HOME: "\u4F3C\u9854\u7D75\u4EBA\u72FC",
      MAX_VILLAGES: 1
    },
    enable: {
      DEFAULT_VOTETYPE: ["anonymity", "\u6A19\u6E96\u306E\u6295\u7968\u65B9\u6CD5(sign: \u8A18\u540D\u3001anonymity:\u7121\u8A18\u540D)"],
      ENABLED_DELETED: [1, "\u524A\u9664\u767A\u8A00\u3092\u8868\u793A\u3059\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_WINNER_LABEL: [1, "1:\u52DD\u5229\u8005\u8868\u793A\u3092\u3059\u308B\u3002"],
      ENABLED_MAX_ESAY: [0, "\u30A8\u30D4\u30ED\u30FC\u30B0\u3092\u767A\u8A00\u5236\u9650\u5BFE\u8C61\u306B 0:\u3057\u306A\u3044\u30011:\u3059\u308B"],
      ENABLED_RANDOMTARGET: [1, "1:\u6295\u7968\u30FB\u80FD\u529B\u5148\u306B\u300C\u30E9\u30F3\u30C0\u30E0\u300D\u3092\u542B\u3081\u308B"],
      ENABLED_SUDDENDEATH: [1, "1:\u7A81\u7136\u6B7B\u3042\u308A"],
      ENABLED_BITTY: [1, "\u5C11\u5973\u3084\u4EA4\u970A\u8005\u306E\u306E\u305E\u304D\u307F\u304C\u3072\u3089\u304C\u306A\u306E\u307F\u3002"],
      ENABLED_PERMIT_DEAD: [1, "\u5893\u4E0B\u306E\u4EBA\u72FC/\u5171\u9CF4\u8005/\u30B3\u30A6\u30E2\u30EA\u4EBA\u9593\u304C\u56C1\u304D\u3092\u898B\u3089\u308C\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_UNDEAD: [1, "1:\u5E7D\u754C\u30C8\u30FC\u30AF\u6751\u3092\u8A2D\u5B9A\u53EF\u80FD"],
      ENABLED_AIMING: [0, "1:\u5BFE\u8C61\u3092\u6307\u5B9A\u3057\u305F\u767A\u8A00\uFF08\u5185\u7DD2\u8A71\uFF09\u3092\u542B\u3081\u308B"],
      ENABLED_MOB_AIMING: [0, "1:\u898B\u7269\u4EBA\u304C\u5185\u7DD2\u8A71\u3092\u4F7F\u3048\u308B\u3002"],
      ENABLED_AMBIDEXTER: [
        0,
        "1:\u72C2\u4EBA\u306E\u88CF\u5207\u308A\u3092\u8A8D\u3081\u308B\uFF08\u72C2\u4EBA\u306F\u3001\u4EBA\u72FC\u9663\u55B6\u3067\u306F\u306A\u304F\u88CF\u5207\u308A\u306E\u9663\u55B6\uFF1D\u6751\u304C\u8CA0\u3051\u308C\u3070\u3088\u3044\uFF09"
      ],
      ENABLED_SUICIDE_VOTE: [1, "1:\u81EA\u6BBA\u6295\u7968"],
      ENABLED_SEQ_EVENT: [0, "0:\u30E9\u30F3\u30C0\u30E0\u30A4\u30D9\u30F3\u30C8 1:\u9806\u5E8F\u901A\u308A\u306E\u30A4\u30D9\u30F3\u30C8"]
    },
    pl: "/www/giji_log/pan/config.pl",
    is_angular: "show-fix"
  }
};
var MORPHE = {
  folder: "MORPHE",
  nation: "\u4EBA\u72FC\u8B70\u4E8B \u30E2\u30EB\u30DA\u30A6\u30B9",
  vid_code: "M",
  server: "morphe.sakura.ne.jp",
  oldlog: "/sow.cgi?cmd=oldlog&rowall=on",
  livelog: "/sow.cgi?cmd=rss",
  info_url: "/sow.cgi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  story: {
    evil: "EVIL",
    role_play: false
  },
  config: {
    csid: [
      "ririnra",
      "ririnra_c01",
      "ririnra_c05",
      "ririnra_c08",
      "ririnra_c19",
      "ririnra_c67",
      "ririnra_c68",
      "ririnra_c72",
      "ririnra_c51",
      "ririnra_c20",
      "ririnra_c32",
      "ririnra_c128",
      "all",
      "mad",
      "mad_mad05",
      "time",
      "time_t21",
      "time_t44",
      "time_t48",
      "time_t48_wash",
      "time_t49",
      "time_t49_wash",
      "time_t80",
      "ger",
      "fable",
      "fable_f1",
      "fable_f8",
      "fable_f14",
      "fable_f4",
      "animal",
      "school",
      "changed",
      "changed_m05",
      "SF",
      "SF_sf10",
      "SF_sf032",
      "SF_sf041",
      "wa",
      "wa_w23",
      "wa_w51"
    ],
    erb: "./asset/sow/giji.pl.erb",
    cd_default: "\u6226",
    maxsize: {
      MAXSIZE_ACTION: 60,
      MAXSIZE_MEMOCNT: 1e3,
      MAXSIZE_MEMOLINE: 25
    },
    saycnt: ["tiny", "weak", "juna", "say1", "say5x200", "say5x300", "saving", "euro"],
    game: ["TABULA", "LIVE_TABULA", "MILLERHOLLOW", "LIVE_MILLERHOLLOW", "TROUBLE", "MISTERY"],
    trsid: ["all", "star", "regend", "heavy", "complexx"],
    path: {
      DIR_LIB: "./lib",
      DIR_HTML: "./html",
      DIR_RS: "./rs",
      DIR_VIL: "./data/vil",
      DIR_USER: "./data/user"
    },
    enable: {
      DEFAULT_VOTETYPE: ["anonymity", "\u6A19\u6E96\u306E\u6295\u7968\u65B9\u6CD5(sign: \u8A18\u540D\u3001anonymity:\u7121\u8A18\u540D)"],
      ENABLED_DELETED: [1, "\u524A\u9664\u767A\u8A00\u3092\u8868\u793A\u3059\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_WINNER_LABEL: [1, "1:\u52DD\u5229\u8005\u8868\u793A\u3092\u3059\u308B\u3002"],
      ENABLED_MAX_ESAY: [0, "\u30A8\u30D4\u30ED\u30FC\u30B0\u3092\u767A\u8A00\u5236\u9650\u5BFE\u8C61\u306B 0:\u3057\u306A\u3044\u30011:\u3059\u308B"],
      ENABLED_RANDOMTARGET: [1, "1:\u6295\u7968\u30FB\u80FD\u529B\u5148\u306B\u300C\u30E9\u30F3\u30C0\u30E0\u300D\u3092\u542B\u3081\u308B"],
      ENABLED_SUDDENDEATH: [1, "1:\u7A81\u7136\u6B7B\u3042\u308A"],
      ENABLED_BITTY: [1, "\u5C11\u5973\u3084\u4EA4\u970A\u8005\u306E\u306E\u305E\u304D\u307F\u304C\u3072\u3089\u304C\u306A\u306E\u307F\u3002"],
      ENABLED_PERMIT_DEAD: [0, "\u5893\u4E0B\u306E\u4EBA\u72FC/\u5171\u9CF4\u8005/\u30B3\u30A6\u30E2\u30EA\u4EBA\u9593\u304C\u56C1\u304D\u3092\u898B\u3089\u308C\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_UNDEAD: [1, "1:\u5E7D\u754C\u30C8\u30FC\u30AF\u6751\u3092\u8A2D\u5B9A\u53EF\u80FD"],
      ENABLED_AIMING: [0, "1:\u5BFE\u8C61\u3092\u6307\u5B9A\u3057\u305F\u767A\u8A00\uFF08\u5185\u7DD2\u8A71\uFF09\u3092\u542B\u3081\u308B"],
      ENABLED_MOB_AIMING: [1, "1:\u898B\u7269\u4EBA\u304C\u5185\u7DD2\u8A71\u3092\u4F7F\u3048\u308B\u3002"],
      ENABLED_AMBIDEXTER: [
        1,
        "1:\u72C2\u4EBA\u306E\u88CF\u5207\u308A\u3092\u8A8D\u3081\u308B\uFF08\u72C2\u4EBA\u306F\u3001\u4EBA\u72FC\u9663\u55B6\u3067\u306F\u306A\u304F\u88CF\u5207\u308A\u306E\u9663\u55B6\uFF1D\u6751\u304C\u8CA0\u3051\u308C\u3070\u3088\u3044\uFF09"
      ],
      ENABLED_SUICIDE_VOTE: [1, "1:\u81EA\u6BBA\u6295\u7968"]
    },
    cfg: {
      TYPE: "BRAID",
      RULE: "MORPHE",
      USERID_NPC: "master",
      USERID_ADMIN: "admin",
      ENABLED_VMAKE: 1,
      TIMEOUT_ENTRY: 2,
      TIMEOUT_SCRAP: 5,
      TOPPAGE_INFO: "./_info.pl",
      BASEDIR_CGI: ".",
      BASEDIR_DAT: "./data",
      BASEDIR_DOC: "http://s3-ap-northeast-1.amazonaws.com/giji-assets",
      URL_SW: "http://dais.kokage.cc/giji-log/morphe",
      BASEDIR_CGIERR: "http://dais.kokage.cc/giji-log//morphe",
      NAME_HOME: "\u4EBA\u72FC\u8B70\u4E8B \u5922\u306E\u5F62",
      MAX_VILLAGES: 0
    },
    pl: "/www/giji_log/morphe/config.pl"
  }
};
var SOYBEAN = {
  folder: "SOYBEAN",
  nation: "\u4EBA\u72FC\u8B70\u4E8B\u9BD6\u306E\u5473\u564C\u716E",
  vid_code: "Bs",
  server: "soy-bean.sakura.ne.jp",
  oldlog: "/sow.cgi?cmd=oldlog&rowall=on",
  livelog: "/sow.cgi?cmd=rss",
  info_url: "/sow.cgi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  story: {
    evil: "WOLF",
    role_play: true
  },
  config: {
    csid: [
      "ririnra",
      "ririnra_c01",
      "ririnra_c05",
      "ririnra_c08",
      "ririnra_c19",
      "ririnra_c67",
      "ririnra_c68",
      "ririnra_c72",
      "ririnra_c51",
      "ririnra_c20",
      "ririnra_c32",
      "ririnra_c128",
      "all",
      "mad",
      "mad_mad05",
      "time",
      "time_t21",
      "time_t44",
      "time_t48",
      "time_t48_wash",
      "time_t49",
      "time_t49_wash",
      "time_t80",
      "ger",
      "fable",
      "fable_f1",
      "fable_f8",
      "fable_f14",
      "fable_f4",
      "animal",
      "school",
      "changed",
      "changed_m05",
      "SF",
      "SF_sf10",
      "SF_sf032",
      "SF_sf041",
      "wa",
      "wa_w23",
      "wa_w51"
    ],
    erb: "./asset/sow/giji.pl.erb",
    cd_default: "\u6F14",
    maxsize: {
      MAXSIZE_ACTION: 120,
      MAXSIZE_MEMOCNT: 2e3,
      MAXSIZE_MEMOLINE: 25
    },
    saycnt: ["weak", "juna", "vulcan", "infinity"],
    game: ["TABULA", "MILLERHOLLOW", "TROUBLE", "MISTERY"],
    trsid: ["all", "star", "regend", "heavy", "complexx"],
    enable: {
      DEFAULT_VOTETYPE: ["anonymity", "\u6A19\u6E96\u306E\u6295\u7968\u65B9\u6CD5(sign: \u8A18\u540D\u3001anonymity:\u7121\u8A18\u540D)"],
      ENABLED_DELETED: [0, "\u524A\u9664\u767A\u8A00\u3092\u8868\u793A\u3059\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_WINNER_LABEL: [0, "1:\u52DD\u5229\u8005\u8868\u793A\u3092\u3059\u308B\u3002"],
      ENABLED_MAX_ESAY: [0, "\u30A8\u30D4\u30ED\u30FC\u30B0\u3092\u767A\u8A00\u5236\u9650\u5BFE\u8C61\u306B 0:\u3057\u306A\u3044\u30011:\u3059\u308B"],
      ENABLED_RANDOMTARGET: [1, "1:\u6295\u7968\u30FB\u80FD\u529B\u5148\u306B\u300C\u30E9\u30F3\u30C0\u30E0\u300D\u3092\u542B\u3081\u308B"],
      ENABLED_SUDDENDEATH: [1, "1:\u7A81\u7136\u6B7B\u3042\u308A"],
      ENABLED_BITTY: [0, "\u5C11\u5973\u3084\u4EA4\u970A\u8005\u306E\u306E\u305E\u304D\u307F\u304C\u3072\u3089\u304C\u306A\u306E\u307F\u3002"],
      ENABLED_PERMIT_DEAD: [1, "\u5893\u4E0B\u306E\u4EBA\u72FC/\u5171\u9CF4\u8005/\u30B3\u30A6\u30E2\u30EA\u4EBA\u9593\u304C\u56C1\u304D\u3092\u898B\u3089\u308C\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_UNDEAD: [1, "1:\u5E7D\u754C\u30C8\u30FC\u30AF\u6751\u3092\u8A2D\u5B9A\u53EF\u80FD"],
      ENABLED_AIMING: [1, "1:\u5BFE\u8C61\u3092\u6307\u5B9A\u3057\u305F\u767A\u8A00\uFF08\u5185\u7DD2\u8A71\uFF09\u3092\u542B\u3081\u308B"],
      ENABLED_MOB_AIMING: [1, "1:\u898B\u7269\u4EBA\u304C\u5185\u7DD2\u8A71\u3092\u4F7F\u3048\u308B\u3002"],
      ENABLED_AMBIDEXTER: [
        0,
        "1:\u72C2\u4EBA\u306E\u88CF\u5207\u308A\u3092\u8A8D\u3081\u308B\uFF08\u72C2\u4EBA\u306F\u3001\u4EBA\u72FC\u9663\u55B6\u3067\u306F\u306A\u304F\u88CF\u5207\u308A\u306E\u9663\u55B6\uFF1D\u6751\u304C\u8CA0\u3051\u308C\u3070\u3088\u3044\uFF09"
      ],
      ENABLED_SUICIDE_VOTE: [1, "1:\u81EA\u6BBA\u6295\u7968"],
      ENABLED_SEQ_EVENT: [1, "1:\u4E8B\u4EF6\u6B63\u9806\u306E\u9078\u629E\u3092\u6709\u52B9\u306B\u3059\u308B\u3002"],
      ENABLED_TEST_ROLE: [1, "1:\u30C6\u30B9\u30C8\u4E2D\u5F79\u8077\u3092\u6709\u52B9\u306B\u3059\u308B\u3002"]
    },
    cfg: {
      TYPE: "BRAID",
      RULE: "BRAID",
      USERID_NPC: "master",
      USERID_ADMIN: "admin",
      ENABLED_VMAKE: 1,
      TIMEOUT_ENTRY: 2,
      TIMEOUT_SCRAP: 5,
      TOPPAGE_INFO: "./_info.pl",
      BASEDIR_CGI: ".",
      BASEDIR_DAT: "./data",
      BASEDIR_DOC: "http://s3-ap-northeast-1.amazonaws.com/giji-assets",
      URL_SW: "http://soy-bean.sakura.ne.jp/soy-bean",
      BASEDIR_CGIERR: "http://soy-bean.sakura.ne.jp/soy-bean//",
      NAME_HOME: "\u4EBA\u72FC\u8B70\u4E8B \u9BD6\u306E\u5473\u564C\u716E",
      MAX_VILLAGES: 2
    },
    path: {
      DIR_LIB: "./lib",
      DIR_HTML: "./html",
      DIR_RS: "./rs",
      DIR_VIL: "./data/vil",
      DIR_USER: "./data/user"
    },
    pl: "/www/giji_log/soy-bean/config.pl",
    is_angular: "show-fix"
  }
};
var CIEL = {
  folder: "CIEL",
  nation: "\u4EBA\u72FC\u8B70\u4E8BRP:Cheat Ciel",
  vid_code: "Cc",
  server: "ciel.moo.jp",
  oldlog: "/cheat/sow.cgi?cmd=oldlog&rowall=on",
  livelog: "/cheat/sow.cgi?cmd=rss",
  info_url: "/cheat/sow.cgi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/cheat/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  story: {
    evil: "WOLF",
    role_play: true
  },
  config: {
    csid: [
      "ririnra",
      "ririnra_c01",
      "ririnra_c05",
      "ririnra_c08",
      "ririnra_c19",
      "ririnra_c67",
      "ririnra_c68",
      "ririnra_c72",
      "ririnra_c51",
      "ririnra_c20",
      "ririnra_c32",
      "ririnra_c128",
      "all",
      "mad",
      "mad_mad05",
      "time",
      "time_t21",
      "time_t44",
      "time_t48",
      "time_t48_wash",
      "time_t49",
      "time_t49_wash",
      "time_t80",
      "ger",
      "fable",
      "fable_f1",
      "fable_f8",
      "fable_f14",
      "fable_f4",
      "animal",
      "school",
      "changed",
      "changed_m05",
      "SF",
      "SF_sf10",
      "SF_sf032",
      "SF_sf041",
      "wa",
      "wa_w23",
      "wa_w51"
    ],
    erb: "./asset/sow/giji.pl.erb",
    cd_default: "\u6F14",
    maxsize: {
      MAXSIZE_ACTION: 120,
      MAXSIZE_MEMOCNT: 2e3,
      MAXSIZE_MEMOLINE: 25
    },
    saycnt: ["weak", "juna", "vulcan", "infinity"],
    game: ["TABULA", "MILLERHOLLOW", "TROUBLE", "MISTERY"],
    trsid: ["all", "star", "regend", "heavy", "complexx"],
    enable: {
      DEFAULT_VOTETYPE: ["anonymity", "\u6A19\u6E96\u306E\u6295\u7968\u65B9\u6CD5(sign: \u8A18\u540D\u3001anonymity:\u7121\u8A18\u540D)"],
      ENABLED_DELETED: [0, "\u524A\u9664\u767A\u8A00\u3092\u8868\u793A\u3059\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_WINNER_LABEL: [0, "1:\u52DD\u5229\u8005\u8868\u793A\u3092\u3059\u308B\u3002"],
      ENABLED_MAX_ESAY: [0, "\u30A8\u30D4\u30ED\u30FC\u30B0\u3092\u767A\u8A00\u5236\u9650\u5BFE\u8C61\u306B 0:\u3057\u306A\u3044\u30011:\u3059\u308B"],
      ENABLED_RANDOMTARGET: [1, "1:\u6295\u7968\u30FB\u80FD\u529B\u5148\u306B\u300C\u30E9\u30F3\u30C0\u30E0\u300D\u3092\u542B\u3081\u308B"],
      ENABLED_SUDDENDEATH: [1, "1:\u7A81\u7136\u6B7B\u3042\u308A"],
      ENABLED_BITTY: [0, "\u5C11\u5973\u3084\u4EA4\u970A\u8005\u306E\u306E\u305E\u304D\u307F\u304C\u3072\u3089\u304C\u306A\u306E\u307F\u3002"],
      ENABLED_PERMIT_DEAD: [1, "\u5893\u4E0B\u306E\u4EBA\u72FC/\u5171\u9CF4\u8005/\u30B3\u30A6\u30E2\u30EA\u4EBA\u9593\u304C\u56C1\u304D\u3092\u898B\u3089\u308C\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_UNDEAD: [1, "1:\u5E7D\u754C\u30C8\u30FC\u30AF\u6751\u3092\u8A2D\u5B9A\u53EF\u80FD"],
      ENABLED_AIMING: [1, "1:\u5BFE\u8C61\u3092\u6307\u5B9A\u3057\u305F\u767A\u8A00\uFF08\u5185\u7DD2\u8A71\uFF09\u3092\u542B\u3081\u308B"],
      ENABLED_MOB_AIMING: [1, "1:\u898B\u7269\u4EBA\u304C\u5185\u7DD2\u8A71\u3092\u4F7F\u3048\u308B\u3002"],
      ENABLED_AMBIDEXTER: [
        0,
        "1:\u72C2\u4EBA\u306E\u88CF\u5207\u308A\u3092\u8A8D\u3081\u308B\uFF08\u72C2\u4EBA\u306F\u3001\u4EBA\u72FC\u9663\u55B6\u3067\u306F\u306A\u304F\u88CF\u5207\u308A\u306E\u9663\u55B6\uFF1D\u6751\u304C\u8CA0\u3051\u308C\u3070\u3088\u3044\uFF09"
      ],
      ENABLED_SUICIDE_VOTE: [0, "1:\u81EA\u6BBA\u6295\u7968"]
    },
    cfg: {
      TYPE: "CHEAT",
      RULE: "CIEL",
      USERID_NPC: "master",
      USERID_ADMIN: "admin",
      ENABLED_VMAKE: 1,
      TIMEOUT_ENTRY: 2,
      TIMEOUT_SCRAP: 5,
      TOPPAGE_INFO: "./_info.pl",
      BASEDIR_CGI: ".",
      BASEDIR_DAT: "./data",
      BASEDIR_DOC: "http://s3-ap-northeast-1.amazonaws.com/giji-assets",
      BASEDIR_CGIERR: "http://ciel.moo.jp//cheat",
      URL_SW: "http://ciel.moo.jp/cheat",
      MAX_VILLAGES: 2,
      NAME_HOME: "\u4EBA\u72FC\u8B70\u4E8B ciel<br>- Role Play Cheat -"
    },
    path: {
      DIR_LIB: "./lib",
      DIR_HTML: "./html",
      DIR_RS: "./rs",
      DIR_VIL: "./data/vil",
      DIR_USER: "./data/user"
    },
    pl: "/www/giji_log/ciel/config.pl",
    is_angular: "show-fix"
  }
};
var PERJURY = {
  folder: "PERJURY",
  nation: "\u4EBA\u72FC\u8B70\u4E8BRP:Braid Perjury",
  vid_code: "Bp",
  server: "perjury.rulez.jp",
  oldlog: "/sow.cgi?cmd=oldlog&rowall=on",
  livelog: "/sow.cgi?cmd=rss",
  info_url: "/sow.cgi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  story: {
    evil: "WOLF",
    role_play: true
  },
  config: {
    csid: [
      "ririnra",
      "ririnra_c01",
      "ririnra_c05",
      "ririnra_c08",
      "ririnra_c19",
      "ririnra_c67",
      "ririnra_c68",
      "ririnra_c72",
      "ririnra_c51",
      "ririnra_c20",
      "ririnra_c32",
      "ririnra_c128",
      "all",
      "mad",
      "mad_mad05",
      "time",
      "time_t21",
      "time_t44",
      "time_t48",
      "time_t48_wash",
      "time_t49",
      "time_t49_wash",
      "time_t80",
      "ger",
      "fable",
      "fable_f1",
      "fable_f8",
      "fable_f14",
      "fable_f4",
      "animal",
      "school",
      "changed",
      "changed_m05",
      "SF",
      "SF_sf10",
      "SF_sf032",
      "SF_sf041",
      "wa",
      "wa_w23",
      "wa_w51"
    ],
    erb: "./asset/sow/giji.pl.erb",
    cd_default: "\u6F14",
    maxsize: {
      MAXSIZE_ACTION: 120,
      MAXSIZE_MEMOCNT: 2e3,
      MAXSIZE_MEMOLINE: 25
    },
    saycnt: ["weak", "juna", "vulcan", "infinity"],
    game: ["TABULA", "MILLERHOLLOW", "TROUBLE", "MISTERY"],
    trsid: ["all", "star", "regend", "heavy", "complexx"],
    enable: {
      DEFAULT_VOTETYPE: ["anonymity", "\u6A19\u6E96\u306E\u6295\u7968\u65B9\u6CD5(sign: \u8A18\u540D\u3001anonymity:\u7121\u8A18\u540D)"],
      ENABLED_DELETED: [0, "\u524A\u9664\u767A\u8A00\u3092\u8868\u793A\u3059\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_WINNER_LABEL: [0, "1:\u52DD\u5229\u8005\u8868\u793A\u3092\u3059\u308B\u3002"],
      ENABLED_MAX_ESAY: [0, "\u30A8\u30D4\u30ED\u30FC\u30B0\u3092\u767A\u8A00\u5236\u9650\u5BFE\u8C61\u306B 0:\u3057\u306A\u3044\u30011:\u3059\u308B"],
      ENABLED_RANDOMTARGET: [1, "1:\u6295\u7968\u30FB\u80FD\u529B\u5148\u306B\u300C\u30E9\u30F3\u30C0\u30E0\u300D\u3092\u542B\u3081\u308B"],
      ENABLED_SUDDENDEATH: [1, "1:\u7A81\u7136\u6B7B\u3042\u308A"],
      ENABLED_BITTY: [0, "\u5C11\u5973\u3084\u4EA4\u970A\u8005\u306E\u306E\u305E\u304D\u307F\u304C\u3072\u3089\u304C\u306A\u306E\u307F\u3002"],
      ENABLED_PERMIT_DEAD: [1, "\u5893\u4E0B\u306E\u4EBA\u72FC/\u5171\u9CF4\u8005/\u30B3\u30A6\u30E2\u30EA\u4EBA\u9593\u304C\u56C1\u304D\u3092\u898B\u3089\u308C\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_UNDEAD: [1, "1:\u5E7D\u754C\u30C8\u30FC\u30AF\u6751\u3092\u8A2D\u5B9A\u53EF\u80FD"],
      ENABLED_AIMING: [0, "1:\u5BFE\u8C61\u3092\u6307\u5B9A\u3057\u305F\u767A\u8A00\uFF08\u5185\u7DD2\u8A71\uFF09\u3092\u542B\u3081\u308B"],
      ENABLED_MOB_AIMING: [1, "1:\u898B\u7269\u4EBA\u304C\u5185\u7DD2\u8A71\u3092\u4F7F\u3048\u308B\u3002"],
      ENABLED_AMBIDEXTER: [
        0,
        "1:\u72C2\u4EBA\u306E\u88CF\u5207\u308A\u3092\u8A8D\u3081\u308B\uFF08\u72C2\u4EBA\u306F\u3001\u4EBA\u72FC\u9663\u55B6\u3067\u306F\u306A\u304F\u88CF\u5207\u308A\u306E\u9663\u55B6\uFF1D\u6751\u304C\u8CA0\u3051\u308C\u3070\u3088\u3044\uFF09"
      ],
      ENABLED_SUICIDE_VOTE: [0, "1:\u81EA\u6BBA\u6295\u7968"]
    },
    cfg: {
      TYPE: "BRAID",
      RULE: "PERJURY",
      USERID_NPC: "master",
      USERID_ADMIN: "admin",
      ENABLED_VMAKE: 1,
      TIMEOUT_ENTRY: 2,
      TIMEOUT_SCRAP: 5,
      TOPPAGE_INFO: "./_info.pl",
      BASEDIR_CGI: ".",
      BASEDIR_DAT: "./data",
      BASEDIR_DOC: "http://s3-ap-northeast-1.amazonaws.com/giji-assets",
      URL_SW: "http://perjury.rulez.jp",
      BASEDIR_CGIERR: "http://perjury.rulez.jp//",
      MAX_VILLAGES: 2,
      NAME_HOME: "\u4EBA\u72FC\u8B70\u4E8B perjury rulez<br>- Role Play braid -"
    },
    path: {
      DIR_LIB: "./lib",
      DIR_HTML: "./html",
      DIR_RS: "./rs",
      DIR_VIL: "./data/vil",
      DIR_USER: "../sow/data/user"
    },
    pl: "/www/giji_log/vage/config.pl"
  }
};
var XEBEC = {
  folder: "XEBEC",
  nation: "\u4EBA\u72FC\u8B70\u4E8BRP:Braid XEBEC",
  vid_code: "Bx",
  server: "xebec.x0.to",
  oldlog: "/xebec/sow.cgi?cmd=oldlog&rowall=on",
  livelog: "/xebec/sow.cgi?cmd=rss",
  info_url: "/xebec/sow.cgi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/xebec/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  story: {
    evil: "WOLF",
    role_play: true
  },
  config: {
    csid: [
      "ririnra",
      "ririnra_c01",
      "ririnra_c05",
      "ririnra_c08",
      "ririnra_c19",
      "ririnra_c67",
      "ririnra_c68",
      "ririnra_c72",
      "ririnra_c51",
      "ririnra_c20",
      "ririnra_c32",
      "ririnra_c128",
      "all",
      "mad",
      "mad_mad05",
      "time",
      "time_t21",
      "time_t44",
      "time_t48",
      "time_t48_wash",
      "time_t49",
      "time_t49_wash",
      "time_t80",
      "ger",
      "fable",
      "fable_f1",
      "fable_f8",
      "fable_f14",
      "fable_f4",
      "animal",
      "school",
      "changed",
      "changed_m05",
      "SF",
      "SF_sf10",
      "SF_sf032",
      "SF_sf041",
      "wa",
      "wa_w23",
      "wa_w51"
    ],
    erb: "./asset/sow/giji.pl.erb",
    cd_default: "\u6F14",
    maxsize: {
      MAXSIZE_ACTION: 120,
      MAXSIZE_MEMOCNT: 2e3,
      MAXSIZE_MEMOLINE: 25
    },
    saycnt: ["weak", "juna", "vulcan"],
    game: ["TABULA", "MILLERHOLLOW", "TROUBLE", "MISTERY"],
    trsid: ["all", "star", "regend", "heavy", "complexx"],
    enable: {
      DEFAULT_VOTETYPE: ["anonymity", "\u6A19\u6E96\u306E\u6295\u7968\u65B9\u6CD5(sign: \u8A18\u540D\u3001anonymity:\u7121\u8A18\u540D)"],
      ENABLED_DELETED: [0, "\u524A\u9664\u767A\u8A00\u3092\u8868\u793A\u3059\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_WINNER_LABEL: [0, "1:\u52DD\u5229\u8005\u8868\u793A\u3092\u3059\u308B\u3002"],
      ENABLED_MAX_ESAY: [0, "\u30A8\u30D4\u30ED\u30FC\u30B0\u3092\u767A\u8A00\u5236\u9650\u5BFE\u8C61\u306B 0:\u3057\u306A\u3044\u30011:\u3059\u308B"],
      ENABLED_RANDOMTARGET: [1, "1:\u6295\u7968\u30FB\u80FD\u529B\u5148\u306B\u300C\u30E9\u30F3\u30C0\u30E0\u300D\u3092\u542B\u3081\u308B"],
      ENABLED_SUDDENDEATH: [1, "1:\u7A81\u7136\u6B7B\u3042\u308A"],
      ENABLED_BITTY: [0, "\u5C11\u5973\u3084\u4EA4\u970A\u8005\u306E\u306E\u305E\u304D\u307F\u304C\u3072\u3089\u304C\u306A\u306E\u307F\u3002"],
      ENABLED_PERMIT_DEAD: [1, "\u5893\u4E0B\u306E\u4EBA\u72FC/\u5171\u9CF4\u8005/\u30B3\u30A6\u30E2\u30EA\u4EBA\u9593\u304C\u56C1\u304D\u3092\u898B\u3089\u308C\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_UNDEAD: [1, "1:\u5E7D\u754C\u30C8\u30FC\u30AF\u6751\u3092\u8A2D\u5B9A\u53EF\u80FD"],
      ENABLED_AIMING: [0, "1:\u5BFE\u8C61\u3092\u6307\u5B9A\u3057\u305F\u767A\u8A00\uFF08\u5185\u7DD2\u8A71\uFF09\u3092\u542B\u3081\u308B"],
      ENABLED_MOB_AIMING: [1, "1:\u898B\u7269\u4EBA\u304C\u5185\u7DD2\u8A71\u3092\u4F7F\u3048\u308B\u3002"],
      ENABLED_AMBIDEXTER: [
        0,
        "1:\u72C2\u4EBA\u306E\u88CF\u5207\u308A\u3092\u8A8D\u3081\u308B\uFF08\u72C2\u4EBA\u306F\u3001\u4EBA\u72FC\u9663\u55B6\u3067\u306F\u306A\u304F\u88CF\u5207\u308A\u306E\u9663\u55B6\uFF1D\u6751\u304C\u8CA0\u3051\u308C\u3070\u3088\u3044\uFF09"
      ],
      ENABLED_SUICIDE_VOTE: [0, "1:\u81EA\u6BBA\u6295\u7968"]
    },
    cfg: {
      TYPE: "BRAID",
      RULE: "BRAID",
      USERID_NPC: "master",
      USERID_ADMIN: "admin",
      ENABLED_VMAKE: 1,
      TIMEOUT_ENTRY: 2,
      TIMEOUT_SCRAP: 5,
      TOPPAGE_INFO: "./_info.pl",
      BASEDIR_CGI: ".",
      BASEDIR_DAT: "./data",
      BASEDIR_DOC: "http://s3-ap-northeast-1.amazonaws.com/giji-assets",
      URL_SW: "http://xebec.x0.to/xebec",
      BASEDIR_CGIERR: "http://xebec.x0.to//xebec",
      NAME_HOME: "\u4EBA\u72FC\u8B70\u4E8B xebec<br>- Role Play braid -",
      MAX_VILLAGES: 3
    },
    path: {
      DIR_LIB: "./lib",
      DIR_HTML: "./html",
      DIR_RS: "./rs",
      DIR_VIL: "./data/vil",
      DIR_USER: "../sow/data/user"
    },
    pl: "/www/giji_log/xebec/config.pl"
  }
};
var DAIS = {
  folder: "DAIS",
  nation: "\u4EBA\u72FC\u8B70\u4E8BRP:Dais",
  vid_code: "D",
  server: "dais.kokage.cc",
  oldlog: "/dais/sow.cgi?cmd=oldlog&rowall=on",
  livelog: "/dais/sow.cgi?cmd=rss",
  info_url: "/dais/sow.cgi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/dais/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  story: {
    evil: "WOLF",
    role_play: true
  },
  config: {
    csid: [
      "ririnra",
      "ririnra_c01",
      "ririnra_c05",
      "ririnra_c08",
      "ririnra_c19",
      "ririnra_c67",
      "ririnra_c68",
      "ririnra_c72",
      "ririnra_c51",
      "ririnra_c20",
      "ririnra_c32",
      "ririnra_c128",
      "all",
      "mad",
      "mad_mad05",
      "time",
      "time_t21",
      "time_t44",
      "time_t48",
      "time_t48_wash",
      "time_t49",
      "time_t49_wash",
      "time_t80",
      "ger",
      "fable",
      "fable_f1",
      "fable_f8",
      "fable_f14",
      "fable_f4",
      "animal",
      "school",
      "changed",
      "changed_m05",
      "SF",
      "SF_sf10",
      "SF_sf032",
      "SF_sf041",
      "wa",
      "wa_w23",
      "wa_w51"
    ],
    erb: "./asset/sow/giji.pl.erb",
    cd_default: "\u6F14",
    maxsize: {
      MAXSIZE_ACTION: 120,
      MAXSIZE_MEMOCNT: 2e3,
      MAXSIZE_MEMOLINE: 25
    },
    saycnt: ["infinity"],
    game: ["TABULA", "MILLERHOLLOW", "TROUBLE", "MISTERY"],
    trsid: ["all", "star", "regend", "heavy", "complexx"],
    enable: {
      DEFAULT_VOTETYPE: ["anonymity", "\u6A19\u6E96\u306E\u6295\u7968\u65B9\u6CD5(sign: \u8A18\u540D\u3001anonymity:\u7121\u8A18\u540D)"],
      ENABLED_DELETED: [0, "\u524A\u9664\u767A\u8A00\u3092\u8868\u793A\u3059\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_WINNER_LABEL: [0, "1:\u52DD\u5229\u8005\u8868\u793A\u3092\u3059\u308B\u3002"],
      ENABLED_MAX_ESAY: [0, "\u30A8\u30D4\u30ED\u30FC\u30B0\u3092\u767A\u8A00\u5236\u9650\u5BFE\u8C61\u306B 0:\u3057\u306A\u3044\u30011:\u3059\u308B"],
      ENABLED_RANDOMTARGET: [1, "1:\u6295\u7968\u30FB\u80FD\u529B\u5148\u306B\u300C\u30E9\u30F3\u30C0\u30E0\u300D\u3092\u542B\u3081\u308B"],
      ENABLED_SUDDENDEATH: [1, "1:\u7A81\u7136\u6B7B\u3042\u308A"],
      ENABLED_BITTY: [0, "\u5C11\u5973\u3084\u4EA4\u970A\u8005\u306E\u306E\u305E\u304D\u307F\u304C\u3072\u3089\u304C\u306A\u306E\u307F\u3002"],
      ENABLED_PERMIT_DEAD: [1, "\u5893\u4E0B\u306E\u4EBA\u72FC/\u5171\u9CF4\u8005/\u30B3\u30A6\u30E2\u30EA\u4EBA\u9593\u304C\u56C1\u304D\u3092\u898B\u3089\u308C\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_UNDEAD: [1, "1:\u5E7D\u754C\u30C8\u30FC\u30AF\u6751\u3092\u8A2D\u5B9A\u53EF\u80FD"],
      ENABLED_AIMING: [1, "1:\u5BFE\u8C61\u3092\u6307\u5B9A\u3057\u305F\u767A\u8A00\uFF08\u5185\u7DD2\u8A71\uFF09\u3092\u542B\u3081\u308B"],
      ENABLED_MOB_AIMING: [1, "1:\u898B\u7269\u4EBA\u304C\u5185\u7DD2\u8A71\u3092\u4F7F\u3048\u308B\u3002"],
      ENABLED_AMBIDEXTER: [
        0,
        "1:\u72C2\u4EBA\u306E\u88CF\u5207\u308A\u3092\u8A8D\u3081\u308B\uFF08\u72C2\u4EBA\u306F\u3001\u4EBA\u72FC\u9663\u55B6\u3067\u306F\u306A\u304F\u88CF\u5207\u308A\u306E\u9663\u55B6\uFF1D\u6751\u304C\u8CA0\u3051\u308C\u3070\u3088\u3044\uFF09"
      ],
      ENABLED_SUICIDE_VOTE: [0, "1:\u81EA\u6BBA\u6295\u7968"]
    },
    cfg: {
      TYPE: "BRAID",
      RULE: "BRAID",
      USERID_NPC: "master",
      USERID_ADMIN: "admin",
      ENABLED_VMAKE: 1,
      TIMEOUT_ENTRY: 2,
      TIMEOUT_SCRAP: 5,
      TOPPAGE_INFO: "./_info.pl",
      BASEDIR_CGI: ".",
      BASEDIR_DAT: "./data",
      BASEDIR_DOC: "http://s3-ap-northeast-1.amazonaws.com/giji-assets",
      URL_SW: "http://dais.kokage.cc/dais",
      BASEDIR_CGIERR: "http://dais.kokage.cc//dais",
      NAME_HOME: "\u4EBA\u72FC\u8B70\u4E8B dais",
      MAX_VILLAGES: 3
    },
    path: {
      DIR_LIB: "./lib",
      DIR_HTML: "./html",
      DIR_RS: "./rs",
      DIR_VIL: "./data/vil",
      DIR_USER: "./data/user"
    },
    pl: "/www/giji_log/dais/config.pl"
  }
};
var CRAZY = {
  folder: "CRAZY",
  nation: "\u4EBA\u72FC\u8B70\u4E8BRP:Braid Crazy",
  vid_code: "Bc",
  server: "crazy-crazy.sakura.ne.jp",
  oldlog: "/crazy/sow.cgi?cmd=oldlog&rowall=on",
  livelog: "/crazy/sow.cgi?cmd=rss",
  info_url: "/crazy/sow.cgi?\\ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/crazy/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  story: {
    evil: "WOLF",
    role_play: true
  },
  config: {
    csid: [
      "ririnra",
      "ririnra_c01",
      "ririnra_c05",
      "ririnra_c08",
      "ririnra_c19",
      "ririnra_c67",
      "ririnra_c68",
      "ririnra_c72",
      "ririnra_c51",
      "ririnra_c20",
      "ririnra_c32",
      "ririnra_c128",
      "all",
      "mad",
      "mad_mad05",
      "time",
      "time_t21",
      "time_t44",
      "time_t48",
      "time_t48_wash",
      "time_t49",
      "time_t49_wash",
      "time_t80",
      "ger",
      "fable",
      "fable_f1",
      "fable_f8",
      "fable_f14",
      "fable_f4",
      "animal",
      "school",
      "changed",
      "changed_m05",
      "SF",
      "SF_sf10",
      "SF_sf032",
      "SF_sf041",
      "wa",
      "wa_w23",
      "wa_w51"
    ],
    erb: "./asset/sow/giji.pl.erb",
    cd_default: "\u6F14",
    maxsize: {
      MAXSIZE_ACTION: 120,
      MAXSIZE_MEMOCNT: 2e3,
      MAXSIZE_MEMOLINE: 25
    },
    saycnt: ["infinity"],
    game: ["TABULA", "MILLERHOLLOW", "TROUBLE", "MISTERY"],
    trsid: ["all", "star", "regend", "heavy", "complexx"],
    enable: {
      DEFAULT_VOTETYPE: ["anonymity", "\u6A19\u6E96\u306E\u6295\u7968\u65B9\u6CD5(sign: \u8A18\u540D\u3001anonymity:\u7121\u8A18\u540D)"],
      ENABLED_DELETED: [0, "\u524A\u9664\u767A\u8A00\u3092\u8868\u793A\u3059\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_WINNER_LABEL: [0, "1:\u52DD\u5229\u8005\u8868\u793A\u3092\u3059\u308B\u3002"],
      ENABLED_MAX_ESAY: [0, "\u30A8\u30D4\u30ED\u30FC\u30B0\u3092\u767A\u8A00\u5236\u9650\u5BFE\u8C61\u306B 0:\u3057\u306A\u3044\u30011:\u3059\u308B"],
      ENABLED_RANDOMTARGET: [1, "1:\u6295\u7968\u30FB\u80FD\u529B\u5148\u306B\u300C\u30E9\u30F3\u30C0\u30E0\u300D\u3092\u542B\u3081\u308B"],
      ENABLED_SUDDENDEATH: [1, "1:\u7A81\u7136\u6B7B\u3042\u308A"],
      ENABLED_BITTY: [0, "\u5C11\u5973\u3084\u4EA4\u970A\u8005\u306E\u306E\u305E\u304D\u307F\u304C\u3072\u3089\u304C\u306A\u306E\u307F\u3002"],
      ENABLED_PERMIT_DEAD: [1, "\u5893\u4E0B\u306E\u4EBA\u72FC/\u5171\u9CF4\u8005/\u30B3\u30A6\u30E2\u30EA\u4EBA\u9593\u304C\u56C1\u304D\u3092\u898B\u3089\u308C\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_UNDEAD: [1, "1:\u5E7D\u754C\u30C8\u30FC\u30AF\u6751\u3092\u8A2D\u5B9A\u53EF\u80FD"],
      ENABLED_AIMING: [1, "1:\u5BFE\u8C61\u3092\u6307\u5B9A\u3057\u305F\u767A\u8A00\uFF08\u5185\u7DD2\u8A71\uFF09\u3092\u542B\u3081\u308B"],
      ENABLED_MOB_AIMING: [1, "1:\u898B\u7269\u4EBA\u304C\u5185\u7DD2\u8A71\u3092\u4F7F\u3048\u308B\u3002"],
      ENABLED_AMBIDEXTER: [
        0,
        "1:\u72C2\u4EBA\u306E\u88CF\u5207\u308A\u3092\u8A8D\u3081\u308B\uFF08\u72C2\u4EBA\u306F\u3001\u4EBA\u72FC\u9663\u55B6\u3067\u306F\u306A\u304F\u88CF\u5207\u308A\u306E\u9663\u55B6\uFF1D\u6751\u304C\u8CA0\u3051\u308C\u3070\u3088\u3044\uFF09"
      ],
      ENABLED_SUICIDE_VOTE: [0, "1:\u81EA\u6BBA\u6295\u7968"]
    },
    cfg: {
      TYPE: "BRAID",
      RULE: "BRAID",
      USERID_NPC: "master",
      USERID_ADMIN: "admin",
      ENABLED_VMAKE: 0,
      TIMEOUT_ENTRY: 2,
      TIMEOUT_SCRAP: 5,
      TOPPAGE_INFO: "./_info.pl",
      BASEDIR_CGI: ".",
      BASEDIR_DAT: "./data",
      BASEDIR_DOC: "http://s3-ap-northeast-1.amazonaws.com/giji-assets",
      URL_SW: "http://dais.kokage.cc/giji-log/crazy",
      BASEDIR_CGIERR: "http://dais.kokage.cc/giji-log//crazy",
      NAME_HOME: "\u4EBA\u72FC\u8B70\u4E8B crazy<br>- Role Play braid -",
      MAX_VILLAGES: 0
    },
    path: {
      DIR_LIB: "./lib",
      DIR_HTML: "./html",
      DIR_RS: "./rs",
      DIR_VIL: "./data/vil",
      DIR_USER: "./data/user"
    },
    pl: "/www/giji_log/crazy/config.pl"
  }
};
var CABALA = {
  folder: "CABALA",
  nation: "\u4EBA\u72FC\u8B70\u4E8BCabalaCafe",
  vid_code: "C",
  server: "cabala.halfmoon.jp",
  oldlog: "/cafe/sow.cgi?cmd=oldlog&rowall=on",
  livelog: "/cafe/sow.cgi?cmd=rss",
  info_url: "/cafe/sow.cgi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/cafe/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  story: {
    evil: "EVIL",
    role_play: false
  },
  config: {
    csid: [
      "ririnra",
      "ririnra_c01",
      "ririnra_c05",
      "ririnra_c08",
      "ririnra_c19",
      "ririnra_c67",
      "ririnra_c68",
      "ririnra_c72",
      "ririnra_c51",
      "ririnra_c20",
      "ririnra_c32",
      "ririnra_c128",
      "all",
      "mad",
      "mad_mad05",
      "time",
      "time_t21",
      "time_t44",
      "time_t48",
      "time_t48_wash",
      "time_t49",
      "time_t49_wash",
      "time_t80",
      "ger",
      "fable",
      "fable_f1",
      "fable_f8",
      "fable_f14",
      "fable_f4",
      "animal",
      "school",
      "changed",
      "changed_m05",
      "SF",
      "SF_sf10",
      "SF_sf032",
      "SF_sf041",
      "wa",
      "wa_w23",
      "wa_w51"
    ],
    erb: "./asset/sow/giji.pl.erb",
    cd_default: "\u6226",
    maxsize: {
      MAXSIZE_ACTION: 60,
      MAXSIZE_MEMOCNT: 1e3,
      MAXSIZE_MEMOLINE: 25
    },
    saycnt: ["tiny", "weak", "juna", "say1", "say5x200", "say5x300", "saving", "euro"],
    game: ["TABULA", "LIVE_TABULA", "MILLERHOLLOW", "LIVE_MILLERHOLLOW", "TROUBLE", "MISTERY"],
    trsid: ["all", "star", "regend", "heavy", "complexx"],
    path: {
      DIR_LIB: "./lib",
      DIR_HTML: "./html",
      DIR_RS: "./rs",
      DIR_VIL: "./data/vil",
      DIR_USER: "../sow/data/user"
    },
    enable: {
      DEFAULT_VOTETYPE: ["anonymity", "\u6A19\u6E96\u306E\u6295\u7968\u65B9\u6CD5(sign: \u8A18\u540D\u3001anonymity:\u7121\u8A18\u540D)"],
      ENABLED_DELETED: [1, "\u524A\u9664\u767A\u8A00\u3092\u8868\u793A\u3059\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_WINNER_LABEL: [1, "1:\u52DD\u5229\u8005\u8868\u793A\u3092\u3059\u308B\u3002"],
      ENABLED_MAX_ESAY: [0, "\u30A8\u30D4\u30ED\u30FC\u30B0\u3092\u767A\u8A00\u5236\u9650\u5BFE\u8C61\u306B 0:\u3057\u306A\u3044\u30011:\u3059\u308B"],
      ENABLED_RANDOMTARGET: [1, "1:\u6295\u7968\u30FB\u80FD\u529B\u5148\u306B\u300C\u30E9\u30F3\u30C0\u30E0\u300D\u3092\u542B\u3081\u308B"],
      ENABLED_SUDDENDEATH: [1, "1:\u7A81\u7136\u6B7B\u3042\u308A"],
      ENABLED_BITTY: [1, "\u5C11\u5973\u3084\u4EA4\u970A\u8005\u306E\u306E\u305E\u304D\u307F\u304C\u3072\u3089\u304C\u306A\u306E\u307F\u3002"],
      ENABLED_PERMIT_DEAD: [0, "\u5893\u4E0B\u306E\u4EBA\u72FC/\u5171\u9CF4\u8005/\u30B3\u30A6\u30E2\u30EA\u4EBA\u9593\u304C\u56C1\u304D\u3092\u898B\u3089\u308C\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_UNDEAD: [1, "1:\u5E7D\u754C\u30C8\u30FC\u30AF\u6751\u3092\u8A2D\u5B9A\u53EF\u80FD"],
      ENABLED_AIMING: [1, "1:\u5BFE\u8C61\u3092\u6307\u5B9A\u3057\u305F\u767A\u8A00\uFF08\u5185\u7DD2\u8A71\uFF09\u3092\u542B\u3081\u308B"],
      ENABLED_MOB_AIMING: [1, "1:\u898B\u7269\u4EBA\u304C\u5185\u7DD2\u8A71\u3092\u4F7F\u3048\u308B\u3002"],
      ENABLED_AMBIDEXTER: [
        1,
        "1:\u72C2\u4EBA\u306E\u88CF\u5207\u308A\u3092\u8A8D\u3081\u308B\uFF08\u72C2\u4EBA\u306F\u3001\u4EBA\u72FC\u9663\u55B6\u3067\u306F\u306A\u304F\u88CF\u5207\u308A\u306E\u9663\u55B6\uFF1D\u6751\u304C\u8CA0\u3051\u308C\u3070\u3088\u3044\uFF09"
      ],
      ENABLED_SUICIDE_VOTE: [1, "1:\u81EA\u6BBA\u6295\u7968"]
    },
    cfg: {
      TYPE: "BRAID",
      RULE: "CABALA",
      USERID_NPC: "master",
      USERID_ADMIN: "admin",
      ENABLED_VMAKE: 1,
      TIMEOUT_ENTRY: 2,
      TIMEOUT_SCRAP: 5,
      TOPPAGE_INFO: "./_info.pl",
      BASEDIR_CGI: ".",
      BASEDIR_DAT: "./data",
      BASEDIR_DOC: "http://s3-ap-northeast-1.amazonaws.com/giji-assets",
      URL_SW: "http://dais.kokage.cc/giji-log/cafe",
      BASEDIR_CGIERR: "http://dais.kokage.cc/giji-log//cafe",
      NAME_HOME: "\u4EBA\u72FC\u8B70\u4E8B Cabala Cafe",
      MAX_VILLAGES: 0
    },
    pl: "/www/giji_log/cafe/config.pl"
  }
};
var ALLSTAR = {
  folder: "ALLSTAR",
  nation: "\u4EBA\u72FC\u8B70\u4E8B\u5927\u4E71\u95D8:AllStar",
  vid_code: "A",
  server: "jinro.jksy.org",
  oldlog: "/~nanakorobi?cmd=oldlog&rowall=on",
  livelog: "/~nanakorobi?cmd=rss",
  info_url: "/~nanakorobi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/~nanakorobi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  story: {
    evil: "EVIL",
    role_play: false
  },
  config: {
    csid: [
      "ririnra",
      "ririnra_c01",
      "ririnra_c05",
      "ririnra_c08",
      "ririnra_c19",
      "ririnra_c67",
      "ririnra_c68",
      "ririnra_c72",
      "ririnra_c51",
      "ririnra_c20",
      "ririnra_c32",
      "ririnra_c128",
      "all",
      "mad",
      "mad_mad05",
      "time",
      "time_t21",
      "time_t44",
      "time_t48",
      "time_t48_wash",
      "time_t49",
      "time_t49_wash",
      "time_t80",
      "ger",
      "fable",
      "fable_f1",
      "fable_f8",
      "fable_f14",
      "fable_f4",
      "animal",
      "school",
      "changed",
      "changed_m05",
      "SF",
      "SF_sf10",
      "SF_sf032",
      "SF_sf041",
      "wa",
      "wa_w23",
      "wa_w51"
    ],
    erb: "./asset/sow/giji.pl.erb",
    cd_default: "\u6226",
    maxsize: {
      MAXSIZE_ACTION: 60,
      MAXSIZE_MEMOCNT: 1e3,
      MAXSIZE_MEMOLINE: 25
    },
    saycnt: ["tiny", "weak", "juna", "say5x200", "say5x300", "wbbs", "saving", "euro"],
    game: [
      "TABULA",
      "LIVE_TABULA",
      "MILLERHOLLOW",
      "LIVE_MILLERHOLLOW",
      "TROUBLE",
      "MISTERY",
      "SECRET"
    ],
    trsid: [
      "sow",
      "all",
      "star",
      "regend",
      "heavy",
      "complexx",
      "tabula",
      "millerhollow",
      "ultimate"
    ],
    path: {
      DIR_LIB: "./lib",
      DIR_HTML: "./html",
      DIR_RS: "./rs",
      DIR_VIL: "./data/vil",
      DIR_USER: "../sow/data/user"
    },
    cfg: {
      TYPE: "BRAID",
      RULE: "ALLSTAR",
      USERID_NPC: "master",
      USERID_ADMIN: "admin",
      ENABLED_VMAKE: 0,
      TIMEOUT_ENTRY: 3,
      TIMEOUT_SCRAP: 10,
      TOPPAGE_INFO: "./_info.pl",
      BASEDIR_CGI: ".",
      BASEDIR_DAT: "./data",
      BASEDIR_DOC: "http://s3-ap-northeast-1.amazonaws.com/giji-assets",
      URL_SW: "http://jinro.jksy.org/~nanakorobi",
      BASEDIR_CGIERR: "http://jinro.jksy.org//~nanakorobi",
      NAME_HOME: "\u4EBA\u72FC\u8B70\u4E8B \u5927\u4E71\u95D8All\u2606Star",
      MAX_VILLAGES: 0
    },
    enable: {
      DEFAULT_VOTETYPE: ["anonymity", "\u6A19\u6E96\u306E\u6295\u7968\u65B9\u6CD5(sign: \u8A18\u540D\u3001anonymity:\u7121\u8A18\u540D)"],
      ENABLED_DELETED: [1, "\u524A\u9664\u767A\u8A00\u3092\u8868\u793A\u3059\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_WINNER_LABEL: [1, "1:\u52DD\u5229\u8005\u8868\u793A\u3092\u3059\u308B\u3002"],
      ENABLED_MAX_ESAY: [0, "\u30A8\u30D4\u30ED\u30FC\u30B0\u3092\u767A\u8A00\u5236\u9650\u5BFE\u8C61\u306B 0:\u3057\u306A\u3044\u30011:\u3059\u308B"],
      ENABLED_RANDOMTARGET: [1, "1:\u6295\u7968\u30FB\u80FD\u529B\u5148\u306B\u300C\u30E9\u30F3\u30C0\u30E0\u300D\u3092\u542B\u3081\u308B"],
      ENABLED_SUDDENDEATH: [1, "1:\u7A81\u7136\u6B7B\u3042\u308A"],
      ENABLED_BITTY: [1, "\u5C11\u5973\u3084\u4EA4\u970A\u8005\u306E\u306E\u305E\u304D\u307F\u304C\u3072\u3089\u304C\u306A\u306E\u307F\u3002"],
      ENABLED_PERMIT_DEAD: [0, "\u5893\u4E0B\u306E\u4EBA\u72FC/\u5171\u9CF4\u8005/\u30B3\u30A6\u30E2\u30EA\u4EBA\u9593\u304C\u56C1\u304D\u3092\u898B\u3089\u308C\u308B\u304B\u3069\u3046\u304B"],
      ENABLED_UNDEAD: [1, "1:\u5E7D\u754C\u30C8\u30FC\u30AF\u6751\u3092\u8A2D\u5B9A\u53EF\u80FD"],
      ENABLED_AIMING: [0, "1:\u5BFE\u8C61\u3092\u6307\u5B9A\u3057\u305F\u767A\u8A00\uFF08\u5185\u7DD2\u8A71\uFF09\u3092\u542B\u3081\u308B"],
      ENABLED_MOB_AIMING: [1, "1:\u898B\u7269\u4EBA\u304C\u5185\u7DD2\u8A71\u3092\u4F7F\u3048\u308B\u3002"],
      ENABLED_AMBIDEXTER: [
        1,
        "1:\u72C2\u4EBA\u306E\u88CF\u5207\u308A\u3092\u8A8D\u3081\u308B\uFF08\u72C2\u4EBA\u306F\u3001\u4EBA\u72FC\u9663\u55B6\u3067\u306F\u306A\u304F\u88CF\u5207\u308A\u306E\u9663\u55B6\uFF1D\u6751\u304C\u8CA0\u3051\u308C\u3070\u3088\u3044\uFF09"
      ],
      ENABLED_SUICIDE_VOTE: [1, "1:\u81EA\u6BBA\u6295\u7968"]
    },
    pl: "/www/giji_log/jksy/config.pl"
  }
};
var LOBBY_OLD = {
  folder: "LOBBY_OLD",
  nation: "\u4EBA\u72FC\u8B70\u4E8B\u65E7\u30ED\u30D3\u30FC",
  vid_code: "O"
};
var LOBBY = {
  folder: "LOBBY",
  nation: "\u4EBA\u72FC\u8B70\u4E8B\u30ED\u30D3\u30FC",
  vid_code: "L",
  server: "crazy-crazy.sakura.ne.jp",
  oldlog: "/giji_lobby/lobby/sow.cgi?cmd=oldlog&rowall=on",
  livelog: "/giji_lobby/lobby/sow.cgi?cmd=rss",
  info_url: "/giji_lobby/lobby/sow.cgi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/giji_lobby/lobby/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  story: {
    evil: "EVIL",
    role_play: false
  }
};
var OFFPARTY = {
  folder: "OFFPARTY",
  nation: "\u4EBA\u72FC\u8B70\u4E8B\u30AA\u30D5\u76F8\u8AC7\u6240",
  vid_code: "P",
  server: "party.ps.land.to",
  oldlog: "/kitchen/sow.cgi?cmd=oldlog&rowall=on",
  livelog: "/kitchen/sow.cgi?cmd=rss",
  info_url: "/kitchen/sow.cgi?ua=mb&vid=%s&cmd=vinfo",
  epi_url: "/kitchen/sow.cgi?ua=mb&vid=%s&turn=%s&move=page&pageno=1&row=50",
  story: {
    evil: "EVIL",
    role_play: false
  }
};
var sow_folder_default = {
  PERL_DEFAULT,
  PERL_NEW,
  PERL_GAME,
  UNION,
  BRAID,
  all,
  TEST,
  PERJURY_OLD,
  PRETENSE,
  RP,
  CABALA_OLD,
  ALLSTAR_OLD,
  ULTIMATE,
  WOLF,
  PAN,
  MORPHE,
  SOYBEAN,
  CIEL,
  PERJURY,
  XEBEC,
  DAIS,
  CRAZY,
  CABALA,
  ALLSTAR,
  LOBBY_OLD,
  LOBBY,
  OFFPARTY
};

// src/lib/pubsub/book_folder/map-reduce.ts
var Folders = MapReduce({
  format: () => ({
    list: [],
    sameSites: __BROWSER__ ? new Set([location.origin]) : new Set()
  }),
  reduce: (data, doc) => {
    if (doc.server)
      data.sameSites.add(`http://${doc.server}`);
  },
  order: (data, { sort: sort3, group_sort: group_sort2 }) => {
  }
});
var _a, _b;
for (const _id in sow_folder_default) {
  const o = sow_folder_default[_id];
  if (!o.nation)
    continue;
  if (!o.folder)
    continue;
  o._id = _id.toLowerCase();
  o.top_url = ((_b = (_a = o.config) == null ? void 0 : _a.cfg) == null ? void 0 : _b.URL_SW) + "/sow.cgi";
  Folders.add([o]);
}

// src/lib/game/json/chr_face.json
var chr_face_default = [
  {
    _id: "c49",
    name: "\u30DC\u30EA\u30B9",
    comment: "test",
    order: 1,
    tag_ids: ["giji"]
  },
  {
    _id: "c38",
    name: "\u30B3\u30EA\u30FC\u30F3",
    order: 2,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c77",
    name: "\u30AD\u30E3\u30ED\u30E9\u30A4\u30CA",
    order: 3,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c35",
    name: "\u30C0\u30F3",
    order: 4,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c53",
    name: "\u30BC\u30EB\u30C0",
    order: 5,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c74",
    name: "\u30D5\u30E9\u30F3\u30B7\u30B9\u30AB",
    order: 6,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c50",
    name: "\u30C7\u30A3\u30FC\u30F3",
    order: 8,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c36",
    name: "\u30DF\u30C3\u30B7\u30A7\u30EB",
    order: 8.1,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c26",
    name: "\u30E2\u30CB\u30AB",
    order: 8.2,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c09",
    name: "\u30D2\u30ED\u30B7",
    order: 9,
    tag_ids: ["giji", "travel", "G_n_h", "T_h_w"]
  },
  {
    _id: "c55",
    name: "\u30D1\u30D4\u30E8\u30F3",
    order: 10,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c29",
    name: "\u30A4\u30A2\u30F3",
    order: 11,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c12",
    name: "\u30D0\u30FC\u30CA\u30D0\u30B9",
    order: 12,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c16",
    name: "\u30DE\u30EA\u30A2\u30F3\u30CC",
    order: 900.127,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c34",
    name: "\u30C8\u30CB\u30FC",
    order: 14,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c44",
    name: "\u30C9\u30CA\u30EB\u30C9",
    order: 15,
    tag_ids: ["giji"]
  },
  {
    _id: "c11",
    name: "\u30AB\u30EB\u30F4\u30A3\u30F3",
    order: 16,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c10",
    name: "\u30BE\u30FC\u30A4",
    order: 17,
    tag_ids: ["giji", "travel", "G_s_t", "T_s_n"]
  },
  {
    _id: "c70",
    name: "\u30D1\u30C6\u30A3",
    order: 18,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c56",
    name: "\u30B4\u30C9\u30A6\u30A3\u30F3",
    order: 19,
    tag_ids: ["giji"]
  },
  {
    _id: "c07",
    name: "\u30C6\u30A3\u30E2\u30B7\u30FC",
    order: 20,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c41",
    name: "\u30E4\u30CB\u30AF",
    order: 21,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c58",
    name: "\u30D6\u30EB\u30FC\u30CE",
    order: 22,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c17",
    name: "\u30E6\u30EA\u30B7\u30FC\u30BA",
    order: 23,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c39",
    name: "\u30B7\u30D3\u30EB",
    order: 24,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c40",
    name: "\u30CF\u30EF\u30FC\u30C9",
    order: 25,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c65",
    name: "\u30BA\u30EA\u30A8\u30EB",
    order: 26,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c59",
    name: "\u30E0\u30D1\u30E0\u30D4\u30B9",
    order: 27,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c57",
    name: "\u30C4\u30A7\u30C4\u30A3\u30FC\u30EA\u30E4",
    order: 28,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c04",
    name: "\u30CE\u30FC\u30EA\u30FC\u30F3",
    order: 29,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c46",
    name: "\u30B2\u30A4\u30EB",
    order: 30,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c14",
    name: "\u30EC\u30C6\u30A3\u30FC\u30B7\u30E3",
    order: 31,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c42",
    name: "\u30E9\u30EB\u30D5",
    order: 33,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c37",
    name: "\u30BB\u30B7\u30EB",
    order: 34,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c75",
    name: "\u30D3\u30EA\u30FC",
    order: 35,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c32",
    name: "\u30AA\u30B9\u30AB\u30FC",
    order: 36,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c33",
    name: "\u30DB\u30EA\u30FC",
    order: 37,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c02",
    name: "\u30A2\u30EB\u30D5\u30EC\u30C3\u30C9",
    order: 38,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c66",
    name: "\u30AF\u30EA\u30B9\u30C8\u30D5\u30A1\u30FC",
    order: 39,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c24",
    name: "\u30CA\u30BF\u30EA\u30A2",
    order: 41,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c79",
    name: "\u30DE\u30FC\u30B4",
    order: 42,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c61",
    name: "\u30CC\u30DE\u30BF\u30ED\u30A6",
    order: 43,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c23",
    name: "\u30C1\u30E3\u30FC\u30EB\u30BA",
    order: 44,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c28",
    name: "\u30B1\u30A4\u30C8",
    comment: "",
    order: 47,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c68",
    name: "\u30E8\u30A2\u30D2\u30E0",
    order: 48,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c30",
    name: "\u30D5\u30A3\u30EA\u30C3\u30D7",
    order: 49,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c21",
    name: "\u30CB\u30FC\u30EB",
    order: 50,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c52",
    name: "\u30AE\u30EA\u30A2\u30F3",
    order: 52,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c51",
    name: "\u30E8\u30FC\u30E9\u30F3\u30C0",
    order: 53,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c01",
    name: "\u30E1\u30A2\u30EA\u30FC",
    comment: "",
    order: 55,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c69",
    name: "\u30AE\u30CD\u30B9",
    order: 56,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c63",
    name: "\u30D4\u30C3\u30D1",
    order: 57,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c05",
    name: "\u30AD\u30E3\u30B5\u30EA\u30F3",
    order: 59,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c22",
    name: "\u30EF\u30C3\u30C8",
    order: 60,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c62",
    name: "\u30F4\u30A7\u30E9",
    order: 61,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c13",
    name: "\u30ED\u30DF\u30AA",
    order: 62,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c18",
    name: "\u30A8\u30DE",
    order: 63,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c27",
    name: "\u30EA\u30F3\u30C0",
    order: 65,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c08",
    name: "\u30D9\u30CD\u30C3\u30C8",
    order: 66,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c19",
    name: "\u30BF\u30D0\u30B5",
    order: 67,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c71",
    name: "\u30CE\u30C3\u30AF\u30B9",
    order: 70,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c03",
    name: "\u30B9\u30C6\u30A3\u30FC\u30D6\u30F3",
    order: 71,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c43",
    name: "\u30AC\u30B9\u30C8\u30F3",
    order: 72,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c15",
    name: "\u30A6\u30A7\u30FC\u30BA\u30EA\u30FC",
    order: 73,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c54",
    name: "\u30B6\u30C3\u30AF",
    order: 75,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c25",
    name: "\u30EB\u30FC\u30AB\u30B9",
    order: 77,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c20",
    name: "\u30B0\u30ED\u30EA\u30A2",
    order: 79,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c72",
    name: "\u30F4\u30A7\u30B9\u30D1\u30BF\u30A4\u30F3",
    order: 81,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c73",
    name: "\u30ED\u30FC\u30BA\u30DE\u30EA\u30FC",
    order: 900.195,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c47",
    name: "\u30DA\u30E9\u30B8\u30FC",
    order: 21.1,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c80",
    name: "\u30C6\u30C3\u30C9",
    order: 87,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c96",
    name: "\u30EC\u30AA\u30CA\u30EB\u30C9",
    comment: "2011/12/11",
    order: 89,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c95",
    name: "\u30E2\u30EA\u30B9",
    comment: "2011/12/11",
    order: 91,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c97",
    name: "\u30B8\u30A7\u30D5",
    comment: "2011/12/14 \u8D85\u5E38\u73FE\u8C61\u306F\u3042\u308B\u3093\u3060\u2026",
    order: 93,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c98",
    name: "\u30AA\u30BA\u30EF\u30EB\u30C9",
    comment: "2011/12/29 \u3053\u306E\u9AED\u306F\u305C\u3063\u305F\u3044\u30EF\u30C3\u30AF\u30B9\u4F7F\u3063\u3066\u308B\u3002",
    order: 95,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c100",
    name: "\u30B0\u30EC\u30C3\u30B0",
    comment: "2012/12/30 \u30B9\u30DD\u30FC\u30C4\u7CFB\u4E2D\u5B66\u751F\u304F\u3089\u3044\u306B\u898B\u3048\u308B",
    order: 97,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c101",
    name: "\u30AF\u30E9\u30EA\u30C3\u30B5",
    comment: "2011/12/30 \u7F8E\u4EBA\u3055\u3093\u266A",
    order: 99,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c90",
    name: "\u30B1\u30F4\u30A3\u30F3",
    comment: "2011/12/06",
    order: 125.2,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c88",
    name: "\u30D4\u30A8\u30FC\u30EB",
    comment: "2011/12/05",
    order: 125.8,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c89",
    name: "\u30AB\u30C8\u30EA\u30FC\u30CA",
    comment: "2011/12/06",
    order: 900.128,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c84",
    name: "\u30D6\u30EC\u30F3\u30C0",
    comment: "2011/12/05",
    order: 900.129,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c85",
    name: "\u30CF\u30CA",
    comment: "2011/12/05",
    order: 900.13,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c91",
    name: "\u30C9\u30ED\u30B7\u30FC",
    comment: "2011/12/06 \u59E6\u3057\u3044\u5965\u69D8\u266A",
    order: 900.143,
    tag_ids: ["giji"]
  },
  {
    _id: "c92",
    name: "\u30BB\u30EC\u30B9\u30C8",
    comment: "2011/12/06 \u59E6\u3057\u5A18\u30FC\u305A\u266A",
    order: 900.144,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c93",
    name: "\u30D9\u30C3\u30AD\u30FC",
    comment: "2011/12/06 \u3048\u30FC\u25CB\u25CB\u304C\u8A31\u3055\u308C\u308B\u306E\u306F\u5C0F\u5B66\u751F\u307E\u3067\u3060\u3088\u306D\u30FC\u266A",
    order: 900.145,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c78",
    name: "\u30CD\u30A4\u30B5\u30F3",
    order: 900.15,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c82",
    name: "\u30ED\u30D3\u30F3",
    order: 900.148,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c94",
    name: "\u30C0\u30FC\u30E9",
    comment: "2011/12/11",
    order: 900.17,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c64",
    name: "\u30D8\u30AF\u30BF\u30FC",
    order: 900.185,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c81",
    name: "\u30B5\u30A4\u30E9\u30B9",
    order: 900.19,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c67",
    name: "\u30BD\u30D5\u30A3\u30A2",
    order: 900.2,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c76",
    name: "\u30B8\u30E7\u30FC\u30B8",
    order: 900.202,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c60",
    name: "\u30DD\u30FC\u30C1\u30E5\u30E9\u30AB",
    order: 900.197,
    tag_ids: ["giji"]
  },
  {
    _id: "c87",
    name: "\u30A8\u30EA\u30A2\u30B9",
    comment: "2011/12/05",
    order: 900.217,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c45",
    name: "\u30D7\u30EA\u30B7\u30E9",
    order: 900.222,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c48",
    name: "\u30D3\u30A2\u30F3\u30AB",
    order: 900.228,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c86",
    name: "\u30DB\u30EC\u30FC\u30B7\u30E7\u30FC",
    comment: "2011/12/05",
    order: 900.233,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c83",
    name: "\u30A2\u30A4\u30EA\u30B9",
    order: 900.24,
    tag_ids: ["marchen", "giji", "G_a_k"]
  },
  {
    _id: "c31",
    name: "\u30CD\u30EB",
    order: 900.25,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c99",
    name: "\u30B5\u30A4\u30E2\u30F3",
    order: 900.26,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "g01",
    name: "\u9732\u8776",
    comment: "\u4E2D\u56FD\u5973\u6027\u540D",
    order: 10001,
    tag_ids: ["asia"]
  },
  {
    _id: "g02",
    name: "\u5FD7\u5049",
    comment: "\u53F0\u6E7E\u7537\u6027\u540D \u8D8A\u5357\u306E\u540D\u524D\u3082\u63A2\u3057\u305F\u304B\u3063\u305F\u304C\u3001\u898B\u3064\u304B\u3089\u306C\u2026",
    order: 900.215,
    tag_ids: ["asia"]
  },
  {
    _id: "g03",
    name: "\u8299\u84C9",
    comment: "\u91CC\u5E30\u308A",
    order: 10003,
    tag_ids: ["asia"]
  },
  {
    _id: "gc61",
    name: "\u6CBC\u592A\u90CE",
    comment: "\u91CC\u5E30\u308A",
    order: 10004,
    tag_ids: ["asia"]
  },
  {
    _id: "mad01",
    name: "\u30C7\u30E1\u30C6\u30EB",
    comment: "\u963F\u7247\u7A9F\u304B\u3089\u304D\u307E\u3057\u305F",
    order: 900.213,
    tag_ids: ["marchen"]
  },
  {
    _id: "mad02",
    name: "\u30A8\u30EB\u30B4\u30C3\u30C8",
    comment: "\u963F\u7247\u7A9F\u304B\u3089\u304D\u307E\u3057\u305F",
    order: 900.27,
    tag_ids: ["marchen"]
  },
  {
    _id: "mad03",
    name: "\u30B7\u30FC\u30B7\u30E3",
    comment: "\u963F\u7247\u7A9F\u304B\u3089\u304D\u307E\u3057\u305F",
    order: 900.22,
    tag_ids: ["marchen"]
  },
  {
    _id: "mad04",
    name: "\u30C9\u30EA\u30D9\u30EB",
    comment: "\u963F\u7247\u7A9F\u304B\u3089\u304D\u307E\u3057\u305F",
    order: 20004,
    tag_ids: ["marchen"]
  },
  {
    _id: "mad05",
    name: "\u30E4\u30D8\u30A4",
    comment: "\u963F\u7247\u7A9F\u304B\u3089\u304D\u307E\u3057\u305F",
    order: 900.28,
    tag_ids: ["marchen"]
  },
  {
    _id: "mad06",
    name: "\u30A2\u30E4\u30EF\u30B9\u30AB",
    comment: "\u963F\u7247\u7A9F\u304B\u3089\u304D\u307E\u3057\u305F",
    order: 900.236,
    tag_ids: ["marchen"]
  },
  {
    _id: "t01",
    name: "\u30C1\u30A2\u30AD",
    comment: "\u6642\u3092\u304B\u3051\u308B\u5C11\u5973",
    order: 30001,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t02",
    name: "\u30EA\u30C3\u30AD\u30A3",
    comment: "\u590F\u3078\u306E\u6249",
    order: 30002,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t03",
    name: "\u30DF\u30CA\u30AB\u30BF",
    comment: "\u30FC\u4EC1\u30FC",
    order: 900.156,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t04",
    name: "\u30AB\u30A4\u30EB",
    comment: "\u30B5\u30E9\u30FB\u30B3\u30CA\u30FC\u30FB\u30AF\u30ED\u30CB\u30AF\u30EB\u30BA",
    order: 30004,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t05",
    name: "\u30B8\u30A7\u30CB\u30D5\u30A1\u30FC",
    comment: "\u30D0\u30C3\u30AF\u30FB\u30C8\u30A5\u30FB\u30B6\u30FB\u30D5\u30E5\u30FC\u30C1\u30E3\u30FC",
    order: 30005,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "m99",
    name: "\u30D1\u30EB\u30C3\u30AF",
    order: 70000.01,
    tag_ids: ["myth"]
  },
  {
    _id: "m06",
    name: "\u30EA\u30EA\u30F3\u30E9",
    order: 70000.21,
    tag_ids: ["myth"]
  },
  {
    _id: "m03",
    name: "\u30C8\u30CE\u30B5\u30DE",
    order: 70000.22,
    tag_ids: ["myth"]
  },
  {
    _id: "m05",
    name: "\u30CA\u30CA\u30B3\u30ED",
    order: 70000.23,
    tag_ids: ["myth"]
  },
  {
    _id: "m15",
    name: "\u30DF\u30BD\u30C1\u30E3",
    order: 70000.24,
    tag_ids: ["myth"]
  },
  {
    _id: "m07",
    name: "\u30A2\u30EA\u30B9",
    order: 70000.11,
    tag_ids: ["myth"]
  },
  {
    _id: "r30",
    name: "\u30C8\u30EA",
    order: 70000.31,
    tag_ids: ["myth"]
  },
  {
    _id: "m01",
    name: "\u30B1\u30E0\u30B7",
    order: 70001,
    tag_ids: ["myth"]
  },
  {
    _id: "m02",
    name: "\u30DD\u30D7\u30E9",
    order: 70002,
    tag_ids: ["myth"]
  },
  {
    _id: "m04",
    name: "\u30A2\u30AA\u30A4",
    order: 70004,
    tag_ids: ["myth"]
  },
  {
    _id: "b44",
    name: "\u30C9\u30CA\u30EB\u30C9",
    comment: "",
    order: 70007.9,
    tag_ids: ["myth"]
  },
  {
    _id: "m08",
    name: "\u304A\u3063\u3071\u3044",
    order: 70008,
    tag_ids: ["myth"]
  },
  {
    _id: "m09",
    name: "\u30AB\u30DF\u30B8\u30E3\u30FC",
    order: 70009,
    tag_ids: ["myth"]
  },
  {
    _id: "r12",
    name: "\u30D0\u30FC\u30CA\u30D0\u30B9",
    order: 12,
    tag_ids: []
  },
  {
    _id: "b49",
    name: "\u30DC\u30EA\u30B9",
    comment: "",
    order: 70008.1,
    tag_ids: ["myth"]
  },
  {
    _id: "m10",
    name: "\u30A2\u30C1\u30E3\u30DD",
    order: 70010,
    tag_ids: ["myth"]
  },
  {
    _id: "m12",
    name: "\u30C8\u30EB\u30CB\u30C8\u30B9",
    comment: "",
    order: 70012,
    tag_ids: ["myth"]
  },
  {
    _id: "m11",
    name: "\u30E9\u30A4\u30C8\u30CB\u30F3\u30B0",
    order: 70011,
    tag_ids: ["myth"]
  },
  {
    _id: "m13",
    name: "\u30DF\u30B1",
    order: 70000.12,
    tag_ids: ["myth"]
  },
  {
    _id: "m14",
    name: "\u30AB\u30EA\u30E5\u30AF\u30B9",
    order: 70014,
    tag_ids: ["myth"]
  },
  {
    _id: "sf01",
    name: "\u30E9\u30C3\u30B7\u30FC\u30C9",
    comment: "\u308A\u3057\u3042\u3055\u3093\uFF06\u304B\u308C\u3084\u306A\u304E\u3055\u3093",
    order: 8e4,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf02",
    name: "\u30A8\u30B9\u30DA\u30E9\u30F3\u30C8",
    comment: "\u3075\u3089\u3045\u3055\u3093\uFF06\u304B\u308C\u3084\u306A\u304E\u3055\u3093",
    order: 80001,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf03",
    name: "\u30D4\u30FC\u30C8",
    comment: "\u305F\u308B\u3063\u3068\u3055\u3093\uFF06\u308A\u3061\u3083\u3055\u3093",
    order: 80002,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf04",
    name: "\u30A2\u30B7\u30E2\u30D5",
    comment: "\u3042\u3059\u305F\u3093\uFF06\u308A\u308A\u3093\u3089",
    order: 80003,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf05",
    name: "\u30E2\u30CA\u30EA\u30B6",
    comment: "\u306A\u306A\u3053\u308D\u3073\uFF06\u308A\u308A\u3093\u3089",
    order: 80004,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf06",
    name: "\u30EF\u30EC\u30F3\u30C1\u30CA",
    comment: "\u307E\u308A\u3082\u3055\u3093\uFF06\u3042\u305A\u307E\u3055\u3093",
    order: 80005,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf07",
    name: "\u30E4\u30F3\u30D5\u30A1",
    comment: "\u308A\u3057\u3042\u3055\u3093\uFF06\u306F\u3080\u304A\u304F\u3093",
    order: 80007,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf08",
    name: "\uFF30\uFF2A",
    comment: "\u308A\u3057\u3042\u3055\u3093\uFF06\u3075\u3089\u3045\u3055\u3093",
    order: 80008,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf09",
    name: "\u30AD\u30EA\u30B7\u30DE",
    comment: "\u306A\u306A\u3053\u308D\u3073\uFF06\u3075\u3089\u3045\u3055\u3093",
    order: 80009,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf10",
    name: "\u30CA\u30E6\u30BF",
    comment: "\u304B\u308C\u3084\u306A\u304E\u3055\u3093\uFF06\u304B\u3044\u3055\u3093",
    order: 80010,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf11",
    name: "\u30A4\u30EF\u30CE\u30D5",
    comment: "\u304B\u308C\u3084\u306A\u304E\u3055\u3093\uFF06\u308A\u3061\u3083\u3055\u3093",
    order: 80011,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf12",
    name: "\u2020\u30EB\u30B7\u30D5\u30A7\u30EB\u2020",
    comment: null,
    order: 80012,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf13",
    name: "\u30C8\u30EB\u30C9\u30F4\u30A3\u30F3",
    comment: null,
    order: 80013,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf18",
    name: "\u7396\u4F11",
    comment: null,
    order: 80014,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf19",
    name: "\u53C2\u4F11",
    comment: null,
    order: 80015,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf14",
    name: "\u30AF\u30EA\u30B9\u30DE\u30B9",
    comment: null,
    order: 80016,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf15",
    name: "\u30B8\u30A7\u30FC\u30E0\u30B9",
    comment: null,
    order: 80017,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf16",
    name: "\u30E9\u30A4\u30B8",
    comment: null,
    order: 80018,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf17",
    name: "\u30B8\u30E3\u30C3\u30AF",
    comment: null,
    order: 80019,
    tag_ids: ["stratos"]
  },
  {
    _id: "w05",
    name: "\u5B9A\u5409",
    comment: "\u3077\u3048\u308B\u3068\u308A\u3053\u306E\u65C5\u4EBA\u3000\u30A8\u30FC\u30B8\u2015\u30A8\u30FC",
    order: 90001,
    tag_ids: ["shoji"]
  },
  {
    _id: "w21",
    name: "\u9244\u5E73",
    comment: "\u65E5\u672C\u306E\u4F1D\u7D71\u3000\u718A\u6728\u5F6B",
    order: 90002,
    tag_ids: ["shoji"]
  },
  {
    _id: "w22",
    name: "\u7AF9\u4E09",
    comment: "\u96EA\u56FD\u306E\u98A8\u96C5\u3000\u718A\u6728\u5F6B",
    order: 90003,
    tag_ids: ["shoji"]
  },
  {
    _id: "w36",
    name: "\u30A6\u30C8",
    order: 90004,
    tag_ids: ["shoji"]
  },
  {
    _id: "w16",
    name: "\u52E2",
    comment: "\u3076\u305F\u3055\u3093\u5370\u306E\u3000\u3042\u304A\u3044\u30B8\u30F3\u30AE\u30B9\u30AB\u30F3",
    order: 90005,
    tag_ids: ["shoji"]
  },
  {
    _id: "w18",
    name: "\u83CA",
    order: 90006,
    tag_ids: ["shoji"]
  },
  {
    _id: "w26",
    name: "\u52DD\u4E38",
    order: 90007,
    tag_ids: ["shoji"]
  },
  {
    _id: "w35",
    name: "\u5948\u9808\u9EBF",
    comment: "",
    order: 90008,
    tag_ids: ["shoji"]
  },
  {
    _id: "w24",
    name: "\u8FB0\u6B21",
    comment: "\u6843\u6E90\u90F7\u3050\u305F\u56FD\u306E\u3081\u3050\u307F\u3000\u3075\u3089\u3046\u4E73\u696D",
    order: 90009,
    tag_ids: ["shoji"]
  },
  {
    _id: "w37",
    name: "\u8299\u84C9",
    order: 90010,
    tag_ids: ["shoji"]
  },
  {
    _id: "w29",
    name: "\u5FD7\u4E43",
    order: 90011,
    tag_ids: ["shoji"]
  },
  {
    _id: "w20",
    name: "\u85E4\u4E4B\u52A9",
    order: 90012,
    tag_ids: ["shoji"]
  },
  {
    _id: "w31",
    name: "\u65E5\u5411",
    order: 90013,
    tag_ids: ["shoji"]
  },
  {
    _id: "w12",
    name: "\u304A\u307F\u3064",
    comment: "\u9053\u3092\u5916\u3057\u306660\u5E74\u3000GEDOU\u5354\u4F1A",
    order: 90014,
    tag_ids: ["shoji"]
  },
  {
    _id: "w10",
    name: "\u535A\u53F2",
    order: 90015,
    tag_ids: ["shoji"]
  },
  {
    _id: "w25",
    name: "\u6CD5\u6CC9",
    order: 90016,
    tag_ids: ["shoji"]
  },
  {
    _id: "w09",
    name: "\u30C1\u30E3\u30FC\u30EB\u30BA",
    comment: "\u30C1\u30E3\u30FC\u30EB\u30BA\u6D3E\u9063\u306A\u3089\u304A\u307E\u304B\u305B\u3000O-ririn",
    order: 90017,
    tag_ids: ["shoji"]
  },
  {
    _id: "w30",
    name: "\u96EA\u4EE3",
    order: 90018,
    tag_ids: ["shoji"]
  },
  {
    _id: "w14",
    name: "\u83EF\u6708\u658E",
    comment: "\u3081\u3052\u306A\u3044\u30BC\u30E9\u30C1\u30F3\u4F5C\u308A\u3000MEGE\u30BC\u30E9\u30C1\u30F3",
    order: 90019,
    tag_ids: ["shoji"]
  },
  {
    _id: "w13",
    name: "\u305F\u307E\u3053",
    comment: "\u4E16\u754C\u306E\u9053\u3092\u3064\u306A\u3050\u3000\u8B70\u4E8B\u56FD\u5730\u56F3",
    order: 90020,
    tag_ids: ["shoji"]
  },
  {
    _id: "w11",
    name: "\u6CBC\u592A\u90CE",
    order: 90021,
    tag_ids: ["shoji"]
  },
  {
    _id: "w03",
    name: "\u6714",
    comment: "\u65B0\u3057\u3044\u8B70\u4E8B\u3092\u3064\u304F\u308B\u3000\u305F\u304D\u5B66\u4F1A",
    order: 90022,
    tag_ids: ["shoji"]
  },
  {
    _id: "w34",
    name: "\u4F59\u56DB\u6717",
    order: 90023,
    tag_ids: ["shoji"]
  },
  {
    _id: "w27",
    name: "\u6E90\u8535",
    order: 90024,
    tag_ids: ["shoji"]
  },
  {
    _id: "w28",
    name: "\u751A\u516D",
    order: 90025,
    tag_ids: ["shoji"]
  },
  {
    _id: "w17",
    name: "\u96F7\u9580",
    comment: "\u8F1D\u304F\u6708\u306B\u672A\u6765\u3092\u8A17\u3059\u3000\u6681\u6708\u5546\u4E8B",
    order: 90026,
    tag_ids: ["shoji"]
  },
  {
    _id: "w39",
    name: "\u6C99\u8036",
    comment: "",
    order: 90027,
    tag_ids: ["shoji"]
  },
  {
    _id: "w08",
    name: "\u671D\u9854",
    order: 90028,
    tag_ids: ["shoji"]
  },
  {
    _id: "w43",
    name: "\u6625\u677E",
    order: 90029,
    tag_ids: ["shoji"]
  },
  {
    _id: "w07",
    name: "\u5915\u9854",
    order: 90030,
    tag_ids: ["shoji"]
  },
  {
    _id: "w40",
    name: "\u6727",
    order: 90031,
    tag_ids: ["shoji"]
  },
  {
    _id: "w33",
    name: "\u56E3\u5341\u90CE",
    comment: "",
    order: 90032,
    tag_ids: ["shoji"]
  },
  {
    _id: "w23",
    name: "\u4EC1\u53F3\u885B\u9580",
    order: 90033,
    tag_ids: ["shoji"]
  },
  {
    _id: "w04",
    name: "\u5C0F\u9234",
    comment: "\u304A\u53E3\u306E\u611B\u4EBA\u3000\u30BF\u30EB\u30C3\u30C6\u30A3\u30FB\u30BF\u30EB\u30C3\u30C8",
    order: 90034,
    tag_ids: ["shoji"]
  },
  {
    _id: "w06",
    name: "\u3086\u308A",
    comment: "\u9053\u3092\u5916\u3057\u306660\u5E74\u3000GEDOU\u5354\u4F1A",
    order: 90035,
    tag_ids: ["shoji"]
  },
  {
    _id: "w38",
    name: "\u4E00\u5E73\u592A",
    comment: "",
    order: 90037,
    tag_ids: ["shoji"]
  },
  {
    _id: "w01",
    name: "\u93E1\u82B1",
    comment: "\u8F1D\u304F\u6708\u306B\u672A\u6765\u3092\u8A17\u3059\u3000\u6681\u6708\u5546\u4E8B",
    order: 90038,
    tag_ids: ["shoji"]
  },
  {
    _id: "w15",
    name: "\u516B\u91CD",
    comment: "\u6843\u6E90\u90F7\u3050\u305F\u56FD\u306E\u3081\u3050\u307F\u3000\u3075\u3089\u3046\u4E73\u696D",
    order: 90039,
    tag_ids: ["shoji"]
  },
  {
    _id: "w32",
    name: "\u660E\u4E4B\u9032",
    order: 90040,
    tag_ids: ["shoji"]
  },
  {
    _id: "w02",
    name: "\u6176\u4E09\u90CE",
    comment: "\u30AB\u30E1\u30E9\u306E\u3053\u3068\u306A\u3089\u3000MISEKI",
    order: 90041,
    tag_ids: ["shoji"]
  },
  {
    _id: "w44",
    name: "\u96EA\u5BA2",
    comment: "\u308A\u308A\u3093\u30E9\u30CF\u30A6\u30B9\u5451\u3093\u3060\u304F\u308C\u5927\u4F1A",
    order: 90042,
    tag_ids: ["shoji"]
  },
  {
    _id: "w45",
    name: "\u4E80\u5409",
    comment: "\u308A\u308A\u3093\u30E9\u30CF\u30A6\u30B9\u5451\u3093\u3060\u304F\u308C\u5927\u4F1A",
    order: 90043,
    tag_ids: ["shoji"]
  },
  {
    _id: "w46",
    name: "\u6885\u5B50",
    comment: "\u304A\u8A95\u751F\u65E5\u8A18\u5FF5\u2606",
    order: 90044,
    tag_ids: ["shoji"]
  },
  {
    _id: "w47",
    name: "\u7F6E\u58F1",
    comment: "\u65E5\u672C\u306E\u7F8E\u5FB3\u5F37\u5316\u6708\u9593",
    order: 90045,
    tag_ids: ["shoji"]
  },
  {
    _id: "all",
    name: "\u30D1\u30EB\u30C3\u30AF",
    order: 99999,
    tag_ids: ["god"]
  },
  {
    _id: "g04",
    name: "\u653B\u82B8",
    comment: "\u53F0\u6E7E\u7537\u6027\u540D",
    order: 10005,
    tag_ids: ["asia"]
  },
  {
    _id: "g05",
    name: "\u9EBB\u96C0",
    comment: "\u4E2D\u56FD\u5973\u6027\u540D",
    order: 900.175,
    tag_ids: ["asia"]
  },
  {
    _id: "g06",
    name: "\u9ECD\u7089",
    comment: "\u30C0\u30EA\u30C0\u30A4\u30FB\u30AA\u30C3\u30C1\u30AE\u30F3",
    order: 10007,
    tag_ids: ["asia"]
  },
  {
    _id: "mad07",
    name: "\u30C0\u30A4\u30DF",
    comment: "\u963F\u7247\u7A9F\u304B\u3089\u304D\u307E\u3057\u305F",
    order: 20007,
    tag_ids: ["marchen"]
  },
  {
    _id: "mad08",
    name: "\u30A8\u30D5\u30A7\u30C9\u30E9",
    comment: "\u963F\u7247\u7A9F\u304B\u3089\u304D\u307E\u3057\u305F",
    order: 20008,
    tag_ids: ["marchen"]
  },
  {
    _id: "t06",
    name: "\u30B5\u30DF\u30E5\u30A8\u30EB",
    comment: "\u30C8\u30E9\u30F3\u30B9\u30D5\u30A9\u30FC\u30DE\u30FC",
    order: 30006,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t07",
    name: "\u30A2\u30AB\u30EA",
    comment: "\u6642\u3092\u304B\u3051\u308B\u5C11\u5973",
    order: 30019,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t08",
    name: "\u30DF\u30EB\u30D5\u30A3",
    comment: "\u6D77\u8CCA\u6226\u968A\u30B4\u30FC\u30AB\u30A4\u30B8\u30E3\u30FC",
    order: 900.224,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t09",
    name: "\u30B4\u30ED\u30A6",
    comment: "\u6642\u3092\u304B\u3051\u308B\u5C11\u5973",
    order: 30009,
    tag_ids: ["travel"]
  },
  {
    _id: "t10",
    name: "\u30C8\u30EC\u30A4\u30EB",
    comment: "\u30BC\u30EB\u30C0\u306E\u4F1D\u8AAC \u30E0\u30B8\u30E5\u30E9\u306E\u4EEE\u9762",
    order: 30010,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t11",
    name: "\u30DE\u30C9\u30AB",
    comment: "\u5B87\u5B99\u6226\u8266\u30E4\u30DE\u30E2\u30C8\u30FB\u30E8\u30FC\u30B3",
    order: 30019,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t12",
    name: "\u30D5\u30E9\u30F3\u30AF",
    comment: "\u30AA\u30FC\u30ED\u30E9\u306E\u5F7C\u65B9\u3078",
    order: 30012,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t13",
    name: "\u30B8\u30E3\u30CB\u30B9",
    comment: "\u30D5\u30E9\u30C3\u30B7\u30E5\u30D5\u30A9\u30EF\u30FC\u30C9",
    order: 30013,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "c105",
    name: "\u30B7\u30E1\u30AA\u30F3",
    comment: "\u5E74\u672B\u30AB\u30A6\u30F3\u30C8\u30C0\u30A6\u30F3\u266A",
    order: 82,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c104",
    name: "\u30D2\u30E5\u30FC",
    comment: "\u5E74\u672B\u30AB\u30A6\u30F3\u30C8\u30C0\u30A6\u30F3\u266A",
    order: 89,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c106",
    name: "\u30EF\u30F3\u30C0",
    comment: "\u5E74\u672B\u30AB\u30A6\u30F3\u30C8\u30C0\u30A6\u30F3\u266A",
    order: 90,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c108",
    name: "\u30D6\u30ED\u30FC\u30EA\u30F3",
    comment: "\u5E74\u672B\u30AB\u30A6\u30F3\u30C8\u30C0\u30A6\u30F3\u266A",
    order: 91,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c109",
    name: "\u30E9\u30C7\u30A3\u30B9\u30E9\u30F4\u30A1",
    comment: "\u5E74\u672B\u30AB\u30A6\u30F3\u30C8\u30C0\u30A6\u30F3\u266A",
    order: 900.18,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c102",
    name: "\u30A6\u30A9\u30FC\u30EC\u30F3",
    comment: "\u5E74\u672B\u30AB\u30A6\u30F3\u30C8\u30C0\u30A6\u30F3\u266A",
    order: 900.155,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c107",
    name: "\u30A4\u30F4\u30A9\u30F3",
    comment: "\u5E74\u672B\u30AB\u30A6\u30F3\u30C8\u30C0\u30A6\u30F3\u266A",
    order: 900.205,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c103",
    name: "\u30CA\u30F3\u30B7\u30FC",
    comment: "\u5E74\u672B\u30AB\u30A6\u30F3\u30C8\u30C0\u30A6\u30F3\u266A",
    order: 900.234,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "t14",
    name: "\u30AF\u30B7\u30E3\u30DF",
    comment: "\u543E\u8F29\u306F\u732B\u3067\u3042\u308B\u3002",
    order: 30014,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t15",
    name: "\u30AC\u30FC\u30C7\u30A3",
    comment: "\u30D9\u30A4\u30AB\u30FC\u8857\u5C11\u5E74\u63A2\u5075\u56E3",
    order: 30015,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "sf20",
    name: "\u30C6\u30A3\u30BD",
    comment: null,
    order: 80020,
    tag_ids: ["stratos"]
  },
  {
    _id: "g07",
    name: "\u30B8\u30EA\u30E4",
    comment: "\u30ED\u30B7\u30A2\u5973\u6027\u540D",
    order: 10008,
    tag_ids: ["asia"]
  },
  {
    _id: "t16",
    name: "\u30A2\u30E9\u30F3",
    comment: "\u6620\u753B\u76E3\u7763\u305F\u3061\u306E\u5171\u7528\u507D\u540D",
    order: 30016,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "w48",
    name: "\u76F4\u5186",
    comment: "\u548C\u7B97\u5FA9\u6D3B\u6708\u9593",
    order: 90048,
    tag_ids: ["shoji"]
  },
  {
    _id: "w49",
    name: "\u9320",
    comment: "\u30DD\u30EB\u30C8\u30AC\u30EB\u4EBA\u306B\u30B8\u30AA\u30B4\u3063\u3066\u3044\u308B\u3093\u3060\u305C\u3002\u3078\u30FC\u3002\u304B\u3063\u3053\u3044\u30FC\u3002",
    order: 90049,
    tag_ids: ["shoji"]
  },
  {
    _id: "w50",
    name: "\u4E01\u52A9",
    comment: "\u8CA0\u3051\u308B\u305F\u3073\u306B\u8FFD\u3044\u535A\u6253",
    order: 90050,
    tag_ids: ["shoji"]
  },
  {
    _id: "t17",
    name: "\u30B9\u30B9\u30E0",
    comment: "\u304A\u3082\u3044\u3063\u304D\u308A\u63A2\u5075\u56E3 \u8987\u60AA\u6012\u7D44",
    order: 30018,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t18",
    name: "\u30DE\u30E6\u30DF",
    comment: "\u307E\u3093\u304C\u306F\u3058\u3081\u3066\u7269\u8A9E\uFF08\u4E8C\u4EE3\u76EE\uFF09",
    order: 30018,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "c110",
    name: "\u30EA\u30FC",
    comment: "",
    order: 92,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "t19",
    name: "\u30CF\u30EB\u30AB",
    comment: "\u306F\u308B\u304B\u30EA\u30D5\u30EC\u30A4\u30F3",
    order: 30017,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "w51",
    name: "\u9B3C\u4E1E",
    comment: "\u30EA\u30CB\u30E5\u30FC\u30A2\u30EB\u8A18\u5FF5\uFF01",
    order: 90051,
    tag_ids: ["shoji"]
  },
  {
    _id: "w52",
    name: "\u6AFB\u5B50",
    comment: "\u30EA\u30CB\u30E5\u30FC\u30A2\u30EB\u8A18\u5FF5\uFF01",
    order: 90052,
    tag_ids: ["shoji"]
  },
  {
    _id: "c111",
    name: "\u30B9\u30FC\u30B8\u30FC",
    comment: "\u30EA\u30CB\u30E5\u30FC\u30A2\u30EB\u8A18\u5FF5\uFF01 \u5F1F\u304C\u3044\u308B\u3068\u3044\u3046\u5642\u304C\u2026",
    order: 900.165,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c113",
    name: "\u30B8\u30A7\u30EC\u30DF\u30FC",
    comment: "\u30EA\u30CB\u30E5\u30FC\u30A2\u30EB\u8A18\u5FF5\uFF01",
    order: 900.2308,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c112",
    name: "\u30CB\u30B3\u30E9\u30B9",
    comment: "\uFF01\uFF1F",
    order: 112,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "m16",
    name: "\u30A2\u30FC\u30B5\u30FC",
    comment: "\u5186\u5353\u306E\u9A0E\u58EB",
    order: 70016,
    tag_ids: ["myth"]
  },
  {
    _id: "t20",
    name: "\u30A8\u30EA",
    comment: "\u82F1\u56FD\u60C5\u5831\u5C40\u79D8\u5BC6\u7D44\u7E54\u30C1\u30A7\u30E9\u30D6 (CHERUB)",
    order: 30022,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "g08",
    name: "\u30A4\u30EF\u30F3",
    comment: "\u0418\u0432\u0430\u043D-\u0434\u0443\u0440\u0430\u043A",
    order: 10009,
    tag_ids: ["asia"]
  },
  {
    _id: "c114",
    name: "\u30E2\u30F3\u30C9",
    comment: "\uFF18\uFF18\u4EF6\u306E\u3054\u5FDC\u52DF\u3001\u3042\u308A\u304C\u3068\u3046\u3002\u305D\u3057\u3066\u3001\u3042\u308A\u304C\u3068\u3046\u3002",
    order: 114,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "m18",
    name: "\u30DF\u30FC\u30E0",
    comment: "\u30A4\u30F3\u30BF\u30FC\u30CD\u30C3\u30C8\u30FB\u30DF\u30FC\u30E0\u304B\u3089\u3002 \u3048\u3093\u3044\u30FC",
    order: 70018,
    tag_ids: ["myth"]
  },
  {
    _id: "m19",
    name: "\u30BF\u30EB\u30C8",
    comment: "https://twitter.com/7korobi/status/510069062974447617",
    order: 70019,
    tag_ids: ["myth"]
  },
  {
    _id: "m20",
    name: "\u30B7\u30E7\u30B3\u30E9",
    comment: "https://twitter.com/noa_marimo/status/510100541536358400",
    order: 70020,
    tag_ids: ["myth"]
  },
  {
    _id: "c115",
    name: "\u30DE\u30EA\u30AA",
    comment: "\u3058\u3064\u306F\u3001\u7267\u5834\u80B2\u3061\u3089\u3057\u3044\u3088\u3002",
    order: 115,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "t21",
    name: "\u30C8\u30B7\u30DF",
    comment: "\u4EE3\u7D0BTAKE2",
    order: 30019,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t22",
    name: "\u30B1\u30A4\u30A4\u30C1",
    comment: "\u3072\u3050\u3089\u3057\u306E\u306A\u304F\u9803\u306B",
    order: 30021,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "w53",
    name: "\u304A\u3082\u3093",
    comment: "\u4E09\u62FE\u7CCE\u7A0B\u306E\u300C\u3082\u3075\u3082\u3075\u306D\u3053\u3072\u3088\u3053\u300D\u3000\u305B\u3093\u3044\u3061",
    order: 90053,
    tag_ids: ["shoji"]
  },
  {
    _id: "sf021",
    name: "\u30A2\u30F3\u30BF\u30EC\u30B9",
    comment: "",
    order: 80022,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf023",
    name: "\u30A8\u30D5",
    comment: "",
    order: 80023,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf024",
    name: "\u30A2\u30A4\u30E9\u30A4\u30C8",
    comment: "",
    order: 80024,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf025",
    name: "\u30A2\u30DE\u30EB\u30C6\u30A2",
    comment: "",
    order: 80006,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf026",
    name: "\u30DD\u30FC\u30E9",
    comment: "",
    order: 80026,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf022",
    name: "\u30C1\u30A7\u30D3\u30A4",
    comment: "",
    order: 80027,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf027",
    name: "\u30E2\u30B9\u30AD\u30FC\u30C8",
    comment: "",
    order: 80028,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf032",
    name: "\u30EF\u30AF\u30E9\u30D0",
    comment: "",
    order: 80029,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf028",
    name: "\u30B3\u30FC\u30BF",
    comment: "",
    order: 80030,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf029",
    name: "\u30DF\u30C4\u30DC\u30B7",
    comment: "",
    order: 80031,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf030",
    name: "\u30AF\u30EC\u30D1\u30B9\u30AD\u30E5\u30FC\u30EB",
    comment: "",
    order: 80032,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf031",
    name: "\u30B7\u30EB\u30AF",
    comment: "",
    order: 80033,
    tag_ids: ["stratos"]
  },
  {
    _id: "t23",
    name: "\u30CA\u30CA\u30AA",
    comment: "",
    order: 30023,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t24",
    name: "\u30AD\u30EB\u30ED\u30A4",
    comment: "\u300C\u30AD\u30EB\u30ED\u30A4\u3053\u3053\u306B\u73FE\u308B\u300D",
    order: 30024,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t25",
    name: "\u30DF\u30B5\u30AD",
    comment: "",
    order: 30025,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t26",
    name: "\u30A2\u30C4\u30BF\u30CD",
    comment: "\u5E73\u7530\u7BE4\u80E4",
    order: 30026,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t27",
    name: "\u307F\u3087\u3093\u3053",
    comment: "",
    order: 30027,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t28",
    name: "\u30EA\u30C4",
    comment: "",
    order: 30028,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t29",
    name: "\u30D2\u30CA\u30B3",
    comment: "",
    order: 30020,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t30",
    name: "\u30EF\u30BF\u30CC\u30AD",
    comment: "\u56DB\u6708\u6714\u65E5",
    order: 30030,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t31",
    name: "\u30DB\u30A6\u30A4\u30C1",
    comment: "",
    order: 900.158,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t32",
    name: "\u30C8\u30E8\u30BF",
    comment: "\u6D0B\u753B\u306E\u65E5\u672C\u4EBA\u540D",
    order: 30032,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t33",
    name: "\u30A8\u30C4\u30B3",
    comment: "",
    order: 30033,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t34",
    name: "\u30C9\u30F3",
    comment: "",
    order: 17.1,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "c116",
    name: "\u30E1\u30EB\u30E4",
    comment: "",
    order: 116,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c117",
    name: "\u30EB\u30D1\u30FC\u30C8",
    comment: "",
    order: 117,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c118",
    name: "\u30E6\u30FC\u30B8\u30F3",
    comment: "",
    order: 900.2306,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c119",
    name: "\u30AA\u30FC\u30EC\u30EA\u30A2",
    comment: "",
    order: 900.21,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c120",
    name: "\u30CE\u30A2",
    comment: "",
    order: 120,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "t35",
    name: "\u30A4\u30B9\u30EB\u30AE",
    comment: "",
    order: 900.208,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "c121",
    name: "\u30D6\u30C3\u30AB",
    comment: "\u30D6\u30C3\u30AB\u30FB\u30DB\u30EF\u30A4\u30C8\u6C0F\u304B\u3089\u3002",
    order: 900.159,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "mad09",
    name: "\u30AB\u30CA\u30D3\u30B9",
    comment: "\u30A6\u30D1\u30CB\u30B7\u30E3\u30C3\u30C9\u306E\u7CBE\u795E\u3067",
    order: 20009,
    tag_ids: ["marchen"]
  },
  {
    _id: "mad10",
    name: "\u30EB\u30B0\u30EC",
    comment: "\u5F8C\u6094\u3042\u3068\u3092\u305F\u305F\u305A",
    order: 900.2302,
    tag_ids: ["marchen"]
  },
  {
    _id: "mad11",
    name: "\u30AA\u30EB\u30AE\u30A2",
    comment: "\u3048\u3048\u3058\u3083\u306A\u3044\u304B\u3048\u3048\u3058\u3083\u306A\u3044\u304B\u30FC\uFF01",
    order: 900.2304,
    tag_ids: ["marchen"]
  },
  {
    _id: "sf033",
    name: "\u30A4\u30FC\u30B9\u30BF\u30FC",
    comment: null,
    order: 80033,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf034",
    name: "\u30A2\u30CB\u30E5",
    order: 80034,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf035",
    name: "\u30AD\u30E3\u30F3\u30C7\u30A3",
    comment: null,
    order: 80035,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf036",
    name: "\u30AD\u30AB",
    order: 80036,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf037",
    name: "\u30D0\u30F3\u30A2\u30EC\u30F3",
    order: 80037,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf038",
    name: "\u30D1\u30E9\u30C1\u30FC\u30CE",
    order: 80038,
    tag_ids: ["stratos"]
  },
  {
    _id: "t36",
    name: "\u30A4\u30EB\u30DE",
    comment: "",
    order: 30036,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t37",
    name: "\u30B7\u30E5\u30F3\u30BF\u30ED",
    comment: "",
    order: 30009,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t38",
    name: "\u30B9\u30BA\u30AD",
    comment: "",
    order: 30038,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t39",
    name: "\u30AC\u30E2\u30A6",
    comment: "",
    order: 30018.1,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "c122",
    name: "\u30D5\u30ED\u30FC\u30E9",
    comment: "",
    order: 900.226,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c123",
    name: "\u30D5\u30A7\u30EB\u30BC",
    comment: "\u304B\u304B\u3068\u3063\u3066\u610F\u5473\u3089\u3057\u3044\u3000\u30D5\u30A7\u30C1\u3063\u307D\u3044\u306D\uFF01",
    order: 123,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c124",
    name: "\u30BB\u30A4\u30EB\u30BA",
    comment: "",
    order: 124,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c125",
    name: "\u30D4\u30B9\u30C6\u30A3\u30AA",
    comment: "",
    order: 125,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "t40",
    name: "\u30DE\u30B9\u30BF",
    comment: "",
    order: 30039,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "w54",
    name: "\u8237\u4E4B\u4E08",
    comment: "",
    order: 90054,
    tag_ids: ["shoji"]
  },
  {
    _id: "t41",
    name: "\u30A2\u30AA",
    comment: "",
    order: 30041,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t42",
    name: "\u30EC\u30F3",
    comment: "",
    order: 30042,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t43",
    name: "\u3053\u3053\u308D",
    comment: "",
    order: 30043,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t44",
    name: "\u30CA\u30C4\u30DF",
    comment: "",
    order: 30044,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t45",
    name: "\u30AF\u30ED\u30A8",
    comment: "",
    order: 30018.1,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t46",
    name: "\u30B5\u30C0\u30DF\u30C4",
    comment: "",
    order: 30046,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t47",
    name: "\u30CE\u30C3\u30AB",
    comment: "",
    order: 30047,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t48",
    name: "\uFF21",
    comment: "",
    order: 30048,
    tag_ids: ["travel"]
  },
  {
    _id: "t49",
    name: "\uFF21",
    comment: "",
    order: 30049,
    tag_ids: ["travel"]
  },
  {
    _id: "t50",
    name: "\u30E8\u30B9\u30AC",
    comment: "",
    order: 30050,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t51",
    name: "\u30A8\u30CB\u30B7",
    comment: "",
    order: 30051,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t52",
    name: "\u30CB\u30C8\u30AB",
    comment: "",
    order: 30052,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t53",
    name: "\u30C4\u30C5\u30E9",
    comment: "",
    order: 900.16,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t54",
    name: "\u30A6\u30C4\u30AE",
    comment: "",
    order: 30054,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t55",
    name: "\u30BB\u30A4\u30AB",
    comment: "",
    order: 30055,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t56",
    name: "\u30E4\u30B9\u30EA",
    comment: "",
    order: 30056,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t57",
    name: "\u306F\u306E\u3093",
    comment: "",
    order: 30057,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t58",
    name: "\u30B7\u30F3\u30A4\u30C1",
    comment: "",
    order: 30058,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "c126",
    name: "\u30ED\u30A4\u30A8",
    comment: "",
    order: 126,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "w55",
    name: "\u7DB2\u658E",
    comment: "",
    order: 90055,
    tag_ids: ["shoji"]
  },
  {
    _id: "mad12",
    name: "\u30D1\u30AB\u30ED\u30ED",
    comment: "",
    order: 900.235,
    tag_ids: ["marchen"]
  },
  {
    _id: "t59",
    name: "\u30E1\u30A4",
    comment: "",
    order: 30059,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t60",
    name: "\u30BF\u30C4\u30DF",
    comment: "",
    order: 30060,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "f000",
    name: "\u30ED\u30B4\u30B9",
    comment: "",
    order: 6e4,
    tag_ids: ["fable"]
  },
  {
    _id: "f1",
    name: "\u30E8\u30B0\u30E9\u30FC\u30B8",
    comment: "\u51E1\u3066\u306E\u54FA\u4E73\u985E\u304B\u3089\u306E\u656C\u610F\u3092\u3053\u3081\u3066\u3002",
    order: 60001,
    tag_ids: ["fable"]
  },
  {
    _id: "f2",
    name: "\u30A2\u30FC\u30B5\u30FC",
    comment: "\u30B7\u30EA\u30A2\u30B9\u306A\u308A\u3085\u3046\u304D\u3078\u3044\u3002\u30B3\u30FC\u30E9\u306B\u4E57\u308B\u3068\u3044\u3044\u3002",
    order: 60002,
    tag_ids: ["fable"]
  },
  {
    _id: "f3",
    name: "\u30ED\u30D0\u30FC\u30C8",
    comment: "\u4F7F\u5F79\u3055\u308C\u305F\u308A\u3059\u308B\u3001\u697D\u5712\u3067\u306F\u306A\u3044\u611F\u3092\u51FA\u3057\u305F\u3044\u306A\u3002\u3068\u3044\u3046\u80A9\u66F8\u3002",
    order: 60003,
    tag_ids: ["fable"]
  },
  {
    _id: "f4",
    name: "\u30CF\u30E9\u30D5",
    comment: "\u30A8\u30B8\u30D7\u30C8\u4EBA\u540D \u72AC\u306A\u306E\u3067\u3001\u4E0D\u52D5\u7523\u696D\u3092\u3084\u3089\u305B\u305F\u304B\u3063\u305F\u3002",
    order: 60004,
    tag_ids: ["fable"]
  },
  {
    _id: "f5",
    name: "\u30B3\u30FC\u30E9",
    comment: "\u690D\u7269\u306E\u5B9F\u3068\u305D\u3053\u304B\u3089\u4F5C\u308B\u70AD\u9178\u98F2\u6599 \u30AA\u30FC\u30AF\u30B7\u30E7\u30F3\u306B\u304B\u3051\u308B\u3068\u9AD8\u5024\u304C\u4ED8\u304D\u305D\u3046\u306A\u547D\u306B\u898B\u3048\u308B\u306E\u3067\u3002",
    order: 60005,
    tag_ids: ["fable"]
  },
  {
    _id: "f6",
    name: "\u30BF\u30A4\u30E0",
    comment: "\u4E00\u5FDC\u9E1A\u9D61\u306E\u7523\u5730\u30D1\u30D7\u30EF\u30CB\u30E5\u30FC\u30AE\u30CB\u30A2\u4EBA\u540D \u4F1D\u4EE4\u7684\u306A\u3068\u3053\u308D\u3092\u8003\u3048\u3066\u3044\u3066\u3001\u3053\u3084\u3064\u306F\u6587\u5B57\u901A\u308A\u306E\u98DB\u3076\u811A\u306A\u306E\u3067\u306F\u3001\u3068\u3002\u30BF\u30A4\u30E0\u30EA\u30DF\u30C3\u30C8\u6307\u5B9A\u3092\u3059\u308B\uFF08\u901F\u9054\uFF09\u3068\u9AD8\u3044\u904B\u3073\u8CC3\u304C\u3068\u308C\u308B\u8077\u696D\u306A\u306E\u3067\u3002",
    order: 60006,
    tag_ids: ["fable"]
  },
  {
    _id: "f7",
    name: "\u30BF\u30D7\u30EB",
    comment: "\u5E7E\u4F55\u5B66\u3001\u97F3\u697D\u7528\u8A9E\u3067\u307E\u3068\u3081\u305F\u304B\u3063\u305F\u3002 \u3053\u3044\u3064\u306B\u306F\u3001\uFF1F\uFF1F\uFF1F\u306A\u3093\u3060\u3053\u308C\uFF1F\uFF1F\uFF1F\u3068\u601D\u3063\u3066\u307B\u3057\u3044\u3002",
    order: 60007,
    tag_ids: ["fable"]
  },
  {
    _id: "f8",
    name: "\u30BD\u30E9\u30F3\u30B8\u30E5",
    comment: "\uFF08\u80A9\u66F8\uFF09\u601D\u6625\u671F\u306E\u5C11\u5973\u306E\u8EAB\u632F\u308A\u3001\u614B\u5EA6\u53C8\u306F\u30E6\u30FC\u30E2\u30A2",
    order: 60008,
    tag_ids: ["fable"]
  },
  {
    _id: "f9",
    name: "\u30D8\u30EA\u30F3\u30D8\u30A4\u30E2",
    comment: "\u30D5\u30A3\u30F3\u30E9\u30F3\u30C9\u4EBA\u540D\u3000\u54C1\u7269\u3092\u7D4C\u308B\u9B54\u6CD5\u3001\u3068\u3044\u3046\u306E\u3092\u3084\u3089\u305B\u305F\u304B\u3063\u305F\u3002",
    order: 60009,
    tag_ids: ["fable"]
  },
  {
    _id: "f10",
    name: "\u30F3\u30B4\u30C6\u30A3\u30A8\u30AF",
    comment: "\u30A2\u30D5\u30EA\u30AB\u4EBA\u540D  \u8679\u3092\u80A9\u66F8\u306B\u3044\u308C\u305F\u304B\u3063\u305F\u3068\u3053\u308D\u3068\u795E\u8A71\u306E\u8679\u86C7\u304B\u3089\u3002",
    order: 60010,
    tag_ids: ["fable"]
  },
  {
    _id: "f11",
    name: "D.\u30D0\u30EB\u30D9\u30EB\u30C7",
    comment: "\u30B9\u30DA\u30A4\u30F3\u4EBA\u540D  \u9818\u5730\u3092\u3082\u3063\u305F\u8CB4\u65CF\u3067\u3042\u3063\u3066\u307B\u3057\u3044\u306E\u3067\u3001\u9F8D\u4F1D\u627F\u306E\u3042\u308B\u571F\u5730\u306B\u5C01\u3058\u305F\u3002",
    order: 60011,
    tag_ids: ["fable"]
  },
  {
    _id: "f12",
    name: "\u30BD\u30EB\u30D5\u30EA\u30C3\u30C4\u30A3",
    comment: "\u30A4\u30BF\u30EA\u30A2\u4EBA\u540D",
    order: 60013,
    tag_ids: ["fable"]
  },
  {
    _id: "fw01",
    name: "\u30C4\u30A7\u30F3",
    comment: "\u4E2D\u56FD\u4EBA\u540D\u304B\u3089\u3002",
    order: 61001,
    tag_ids: ["fable"]
  },
  {
    _id: "fw02",
    name: "\u30C7\u30A3\u266A\u30B8\u30A2\u30F3",
    comment: "\u5E1D\u6C5F\uFF08\u3066\u3044\u3053\u3046 di4jiang1 \u30C7\u30A3\u30B8\u30A2\u30F3\uFF09\u304B\u3089\u3002",
    order: 61002,
    tag_ids: ["fable"]
  },
  {
    _id: "fw03",
    name: "\u30E4\u30C4\u30C7",
    comment: null,
    order: 61003,
    tag_ids: ["fable"]
  },
  {
    _id: "c127",
    name: "\u30B6\u30FC\u30B4",
    comment: null,
    order: 127,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "t61",
    name: "\u30E0\u30AE\u30BF",
    comment: null,
    order: 30061,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t62",
    name: "\u30D8\u30A4\u30BF\u30ED\u30A6",
    comment: null,
    order: 30062,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t63",
    name: "\u30BD\u30A6\u30B9\u30B1",
    comment: null,
    order: 30063,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t64",
    name: "\u30E6\u30A8",
    comment: null,
    order: 30064,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t65",
    name: "\u30AB\u30B3",
    comment: null,
    order: 30065,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t66",
    name: "\u30B3\u30B3\u30A2",
    comment: null,
    order: 30066,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t67",
    name: "\u30DE\u30B3\u30C8",
    comment: null,
    order: 30067,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t68",
    name: "\u30EF\u30AB\u30CA",
    comment: null,
    order: 30068,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t69",
    name: "\u30E4\u30DE\u30C8",
    comment: null,
    order: 30069,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "c128",
    name: "\u30DA\u30C8\u30E9",
    comment: null,
    order: 128,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c129",
    name: "\u30CC\u30F4\u30A3\u30EB",
    comment: null,
    order: 129,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "t70",
    name: "\u30CB\u30B8\u30CE",
    comment: null,
    order: 30070,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t71",
    name: "\u30EF\u30AB\u30D0\u30E4\u30B7",
    comment: "\u30BA\u30C3\u30B3\u30B1\u6642\u9593\u65C5\u884C\u8A18\u304B\u3089\u3002",
    order: 30071,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t72",
    name: "\u30AB\u30AC",
    comment: "\u63A8\u7406\u5C0F\u8AAC\u306E\u4E3B\u4EBA\u516C\u304B\u3089",
    order: 30072,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t73",
    name: "\u30EF\u30BF\u30EB",
    comment: null,
    order: 30073,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t74",
    name: "\u30D5\u30A6\u30BF",
    comment: "\u30AB\u30DF\u30CA\u30EA\u306B\u5BFE\u3057\u3066\u98A8\u3063\u307D\u304F",
    order: 30074,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t75",
    name: "\u30EB\u30EA",
    comment: "\u65E5\u672C\u9152\u300C\u7460\u7483\u8272\u306E\u6D77\u300D",
    order: 30075,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "f13",
    name: "\u30C6\u30A3\u30E0",
    comment: "\u5192\u967A\u4F5C\u5BB6\u30C6\u30A3\u30E0\u30FB\u30BB\u30F4\u30A7\u30EA\u30F3",
    order: 60013,
    tag_ids: ["fable"]
  },
  {
    _id: "f14",
    name: "\u30A4\u30F3\u30C6\u30A3Jr",
    comment: "\u5357\u7C73\u306E\u592A\u967D\u795E\u300C\u30A4\u30F3\u30C6\u30A3\u300D\u306E\u606F\u5B50\u3001\u3068\u3044\u3046\u610F\u5473\u306E\u30EA\u30F3\u30B0\u30CD\u30FC\u30E0",
    order: 60014,
    tag_ids: ["fable"]
  },
  {
    _id: "fw04",
    name: "\u30AE\u30E7\u30A6\u30D6",
    comment: "\u96A0\u795E\u5211\u90E8\uFF08\u304E\u3087\u3046\u3076\u305F\u306C\u304D\uFF09",
    order: 61004,
    tag_ids: ["fable"]
  },
  {
    _id: "fw05",
    name: "\u30A4\u30CA\u30EA",
    comment: "\u7A32\u8377\u795E\u793E",
    order: 61005,
    tag_ids: ["fable"]
  },
  {
    _id: "w56",
    name: "\u5927\u516B\u90CE",
    comment: "\u6C5F\u6238\u6642\u4EE3\u306E\u5B9F\u696D\u5BB6\u304B\u3089\u3082\u3058\u3063\u3066\u3002",
    order: 90056,
    tag_ids: ["shoji"]
  },
  {
    _id: "w57",
    name: "\u7A32\u8377",
    comment: "\u7A32\u8377\u795E\u793E",
    order: 90057,
    tag_ids: ["shoji"]
  },
  {
    _id: "sf039",
    name: "\u30CF\u30ED\u30A6\u30A3\u30F3",
    comment: "\u304A\u307E\u3064\u308A",
    order: 80039,
    tag_ids: ["stratos"]
  },
  {
    _id: "c130",
    name: "\u30B8\u30E3\u30FC\u30C7\u30A3\u30F3",
    comment: null,
    order: 130,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c131",
    name: "\u30B0\u30B9\u30BF\u30D5",
    comment: null,
    order: 131,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c132",
    name: "\u30EB\u30A4\u30F3",
    comment: null,
    order: 132,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c133",
    name: "\u30AF\u30EC\u30B9\u30C6\u30D5",
    comment: null,
    order: 133,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c134",
    name: "\u30BA\u30C3\u30C6\u30EB",
    comment: null,
    order: 134,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "f15",
    name: "\u30B1\u30C8\u30A5\u30FC\u30C8\u30A5",
    comment: "\u30A4\u30F3\u30C9\u30CD\u30B7\u30A2\u4EBA\u540D\u3002\uFF08\u3044\u308D\u3093\u306A\u3082\u306E\u3068\u306E\uFF09\u304A\u53CB\u9054\u611F\u3092\u72D9\u3046\u3002",
    order: 60015,
    tag_ids: ["fable"]
  },
  {
    _id: "f16",
    name: "\u30A4\u30A7\u30F3\u30AD\u30F3\u30B9",
    comment: "\u30B9\u30A4\u30B9\u4EBA\u540D\u3002\u304A\u306B\u3063\u3053\u306F\u5F93\u8005\u5BC4\u308A\u306B\u3057\u3066\u3044\u3053\u3046\u3002",
    order: 60016,
    tag_ids: ["fable"]
  },
  {
    _id: "fw06",
    name: "\u30B9\u30C8\u30E9\u30D4\u30BF\u30AB",
    comment: "\u5B88\u654F's \u30B3\u30EC\u30AF\u30B7\u30E7\u30F3\u3068\u3044\u3046\u89E3\u8AAC\u304B\u3089\u3002\u4E09\u8535\u306E\u3072\u3068\u3064\u3001\u7D4C\u8535\uFF08\u30B9\u30FC\u30C8\u30E9\u30FB\u30D4\u30BF\u30AB\uFF09",
    order: 61006,
    tag_ids: ["fable"]
  },
  {
    _id: "f17",
    name: "\u30E2\u30A4",
    comment: "\u30A2\u30A4\u30B9\u30E9\u30F3\u30C9\u4EBA\u540D\u3002\u96EA\u666F\u8272\u306E\u4E2D\u3001\u706B\u306E\u307E\u307B\u3046\u304C\u706F\u3063\u3066\u3044\u308B\u559C\u3073\u3002",
    order: 60017,
    tag_ids: ["fable"]
  },
  {
    _id: "f18",
    name: "\u30DF\u30BF\u30B7\u30E5",
    comment: "\u30C1\u30A7\u30B3\u4EBA\u540D\u3002\u88AB\u9020\u7269\uFF08\u795E\u306B\u3088\u308B\u3082\u306E\u3067\u306F\u306A\u304F\uFF09\u3089\u3057\u3055\u3092\u3002",
    order: 60018,
    tag_ids: ["fable"]
  },
  {
    _id: "g09",
    name: "\u30C1\u30C8\u30D5",
    comment: "\u30ED\u30B7\u30A2\u4EBA\u540D\u3002\u672B\u3063\u5B50\u306E\u53EF\u611B\u3089\u3057\u3055\u3092\u3002",
    order: 10009,
    tag_ids: ["asia"]
  },
  {
    _id: "t76",
    name: "\u30BF\u30AB\u30E2\u30C8",
    comment: "\u585A\u539F\u65B0\u53F3\u885B\u9580\u9AD8\u5E79\uFF08\u585A\u539F\u535C\u4F1D\uFF09\u3002",
    order: 30076,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t77",
    name: "\u30E8\u30FC\u30B3",
    comment: "\u30AA\u30CE\u30E8\u30FC\u30B3\u3055\u3093\u3092\u53C2\u7167\u3002",
    order: 30077,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t78",
    name: "\u30E4\u30F3",
    comment: "\u4E2D\u56FD\u4EBA\u540D\u3002",
    order: 30078,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t79",
    name: "\u30D2\u30A4\u30E9\u30AE",
    comment: null,
    order: 30079,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t80",
    name: "\u30CA\u30AA\u30B7\u30B2",
    comment: null,
    order: 30080,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t81",
    name: "\u30B1\u30F3\u30C8",
    comment: "\u30A2\u30E1\u30EA\u30AB\u4EBA\u540D\u3002WASP\u3063\u307D\u304F\u3057\u305F\u304B\u3063\u305F\u306E\u3067\u3059\u3002",
    order: 30081,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t82",
    name: "\u30B5\u30AC\u30BF",
    comment: "\u500B\u4EBA\u304C\u5584\u610F\u3067\u884C\u306A\u3046\u559C\u6368\u3002\u3092\u3042\u3089\u308F\u3059\u30A2\u30E9\u30D3\u30A2\u8A9E",
    order: 30082,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t83",
    name: "\u30AD\u30E7\u30A6\u30B9\u30B1",
    comment: "\u9B54\u6BDB\u72C2\u4ECB\u304B\u3089\u3002",
    order: 30083,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t84",
    name: "\u30A2\u30EA\u30D0\u30D0",
    comment: "\u30A2\u30EA\u30D0\u30D0\u3068\uFF14\uFF10\u4EBA\u306E\u76D7\u8CCA\u3002",
    order: 30084,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "c135",
    name: "\u30D8\u30B6\u30FC",
    comment: null,
    order: 135,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "c136",
    name: "\u30EC\u30CA\u30FC\u30BF",
    comment: null,
    order: 136,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "t85",
    name: "\u30DF\u30B5",
    comment: "\u7531\u6765\uFF1A\u5F25 \u6D77\u7802",
    order: 30085,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t86",
    name: "Dr.\u30B3\u30C8\u30EA\u30F3",
    comment: "\u7531\u6765\uFF1A\u30D7\u30ED\u30B0\u30E9\u30E0\u8A00\u8A9E kotlin",
    order: 30086,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t87",
    name: "\u30EC\u30A4",
    comment: "\u7531\u6765\uFF1A\u7DBE\u6CE2\u30EC\u30A4",
    order: 30087,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "c137",
    name: "\u30C7\u30EA\u30AF\u30BD\u30F3",
    order: 137,
    tag_ids: ["giji", "G_s_t"]
  },
  {
    _id: "c138",
    name: "\u30EC\u30C3\u30AF\u30B9",
    order: 138,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c139",
    name: "\u30E8\u30EA\u30C3\u30AF",
    order: 139,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "t88",
    name: "\u30A2\u30C8\u30EC\u30A4\u30E6",
    order: 30088,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t89",
    name: "\u30E4\u30AB\u30E2\u30C8",
    comment: "\u6B27\u7C73\u30C9\u30E9\u30DE\u3067\u898B\u304B\u3051\u308B\u3061\u3087\u3063\u3068\u52D8\u9055\u3044\u3057\u3066\u308B\u65E5\u672C\u4EBA\u540D\u3002",
    order: 30089,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "f20",
    name: "\u30B8\u30A7\u30EB\u30DE\u30F3",
    comment: "\u30D5\u30E9\u30F3\u30B9\u4EBA\u540D\u3067\u3059\u304C\u3001\u307E\u3042\u3001\u3064\u307E\u308A\u3001\u3042\u306E\u4EBA\u3002",
    order: 60020,
    tag_ids: ["fable"]
  },
  {
    _id: "f21",
    name: "\u30F4\u30A7\u30EB\u30CC\u30A4\u30E6",
    comment: "\u30D5\u30E9\u30F3\u30B9\u4EBA\u540D\u304B\u3089\u3002",
    order: 60021,
    tag_ids: ["fable"]
  },
  {
    _id: "f22",
    name: "\u30AA\u30B0\u30F3",
    comment: "\u30A2\u30D5\u30EA\u30AB\u306E\u795E\u69D8\u3002\u30F4\u2015\u30C9\u30A5\u30FC\u6559\u3067\u306F\u30B0\u30FC\u3068\u3044\u3046\u3002",
    order: 60022,
    tag_ids: ["fable"]
  },
  {
    _id: "f23",
    name: "\u30CF\u30ED",
    comment: "Halo effect\u304B\u3089\u3002\u89AA\u3057\u307F\u306E\u3082\u3066\u308B\u540D\u524D\u306B\u3082\u306A\u308B\u3057\u3002",
    order: 60023,
    tag_ids: ["fable"]
  },
  {
    _id: "f24",
    name: "\u30AE\u30ED\u30C1\u30F3",
    comment: "\u5F31\u3044\u9EBB\u75FA\u6BD2\u304C\u3042\u308B\u304C\u3001\u8C5A\u8089\u306E\u3088\u3046\u306A\u98DF\u611F\u306E\u8338\u3002\u6D1E\u7A9F\u306E\u5929\u4E95\u306A\u3069\u306B\u5B50\u5B9F\u4F53\u3092\u5F62\u6210\u3057\u3001\u5185\u90E8\u306B\u304B\u3064\u3066\u306E\u72A0\u7272\u8005\u304B\u3089\u53CE\u96C6\u3057\u305F\u722A\u7259\u3092\u53CE\u7D0D\u3057\u3066\u3044\u308B\u3002\u8D85\u97F3\u6CE2\u3092\u767A\u3059\u308B\u6027\u8CEA\u304C\u3042\u308A\u3001\u8868\u9762\u306E\u67D4\u6BDB\u3067\u53CD\u97FF\u5B9A\u4F4D\u3092\u884C\u3046\u3068\u3055\u308C\u308B\u3002",
    order: 60024,
    tag_ids: ["fable"]
  },
  {
    _id: "f25",
    name: "\u30EF\u30E4\u30F3",
    comment: "\u30EF\u30E4\u30F3\u30FB\u30AF\u30EA\u30C3\uFF08\u30C8\uFF09\u304B\u3089\u3002",
    order: 60025,
    tag_ids: ["fable"]
  },
  {
    _id: "t90",
    name: "\u30AD\u30EA\u30CE",
    comment: "\u30A6\u30EB\u30C8\u30E9\u30DE\u30F3\u30C6\u30A3\u30AC\u306B\u767B\u5834\u3059\u308B\u30AD\u30EA\u30CE\u30FB\u30DE\u30AD\u30AA\u304B\u3089\u3002",
    order: 30091,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t91",
    name: "\u30A6\u30A8\u30C0",
    comment: "\u6210\u5357\u9AD8\u6821\u306E\u4E0A\u7530\u5065\u4E8C\u304B\u3089\u3002",
    order: 30091,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t92",
    name: "\u30DE\u30CA",
    comment: "\u5947\u8DE1\u3001\u970A\u7684\u306A\u529B\uFF08\u30CF\u30EF\u30A4\u8A9E\uFF09\u304B\u3089\u3002",
    order: 30092,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "t93",
    name: "\u30CD\u30B3\u5143\u5E25",
    comment: "\u30D0\u30F3\u30C9\u30E1\u30F3\u7D44\u3093\u3067\u307F\u305F\u3002Holy Ghost!\u304B\u3089\u3002",
    order: 30093,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t94",
    name: "\u30CB\u30B7",
    comment: "\u30D0\u30F3\u30C9\u30E1\u30F3\u7D44\u3093\u3067\u307F\u305F\u3002Holy Ghost!\u304B\u3089\u3002",
    order: 30094,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "t95",
    name: "\u30D4\u30C3\u30AF\u30DE\u30F3",
    comment: "\u30D0\u30F3\u30C9\u30E1\u30F3\u7D44\u3093\u3067\u307F\u305F\u3002Holy Ghost!\u304B\u3089\u3002",
    order: 30095,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "c140",
    name: "\u30A2\u30EB\u30B5\u30E9\u30FC\u30F3",
    order: 140,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c141",
    name: "\u30E6\u30F3\u30AB\u30FC",
    order: 141,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "sf040",
    name: "\u30DA\u30B5\u30CF",
    comment: "\u304A\u307E\u3064\u308A",
    order: 80040,
    tag_ids: ["stratos"]
  },
  {
    _id: "w58",
    name: "\u5343\u65E9",
    comment: "\u6E90\u6C0F\u540D\u304B\u3089\u3002",
    order: 90058,
    tag_ids: ["shoji"]
  },
  {
    _id: "c142",
    name: "\u30A6\u30A3\u30EC\u30E0",
    order: 142,
    tag_ids: ["giji", "G_a_k"]
  },
  {
    _id: "c143",
    name: "\u30DC\u30A4\u30C9",
    order: 143,
    tag_ids: ["giji"]
  },
  {
    _id: "f26",
    name: "\u30D3\u30B8\u30EA\u30A2",
    order: 60026,
    tag_ids: ["fable"]
  },
  {
    _id: "t96",
    name: "\u30D0\u30E9\u30C0\u30AE",
    order: 30096,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "c144",
    name: "\u30D4\u30EA",
    order: 144,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "w59",
    name: "\u6C99\u7F85",
    comment: "\u6C99\u7F85\u53CC\u6A39\u306E\u82B1\u306E\u8272",
    order: 90059,
    tag_ids: ["shoji"]
  },
  {
    _id: "t97",
    name: "\u30B5\u30E9",
    order: 30097,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "f30",
    name: "\u30C1\u30E3\u30EB\u30B1",
    order: 60030,
    tag_ids: ["fable"]
  },
  {
    _id: "f29",
    name: "\u30DD\u30D4\u30F3",
    order: 60029,
    tag_ids: ["fable"]
  },
  {
    _id: "f28",
    name: "\u30AC\u30EB\u30E0",
    order: 60028,
    tag_ids: ["fable"]
  },
  {
    _id: "f27",
    name: "\u30AD\u30E9\u30F3\u30C7\u30A3",
    order: 60027,
    tag_ids: ["fable"]
  },
  {
    _id: "t98",
    name: "\u30CF\u30EB\u30DF\u30C1",
    order: 30098,
    tag_ids: ["travel", "T_h_w"]
  },
  {
    _id: "f31",
    name: "\u30D0\u30AD\u30E5\u30E9\u30E0",
    order: 60031,
    tag_ids: ["fable"]
  },
  {
    _id: "f32",
    name: "\u30E0\u30B9\u30BF\u30D5\u30A1",
    order: 60032,
    tag_ids: ["fable"]
  },
  {
    _id: "fw07",
    name: "\u30B3\u30A2\u30C8\u30EA\u30AF\u30A8",
    order: 61007,
    tag_ids: ["fable"]
  },
  {
    _id: "c145",
    name: "\u30E1\u30EA\u30C3\u30B5",
    order: 145,
    tag_ids: ["giji", "G_m_w"]
  },
  {
    _id: "c146",
    name: "\u30D8\u30A4",
    order: 146,
    tag_ids: ["giji", "G_n_h"]
  },
  {
    _id: "f33",
    name: "\u30DC\u30EB\u30C9\u30FC\u30F3",
    order: 60033,
    tag_ids: ["fable"]
  },
  {
    _id: "f34",
    name: "\u30B9\u30D7\u30B9\u30D7\u30A4",
    order: 60034,
    tag_ids: ["fable"]
  },
  {
    _id: "f35",
    name: "\u30D1\u30B8\u30E3\u30AF",
    order: 60035,
    tag_ids: ["fable"]
  },
  {
    _id: "f36",
    name: "\u30B8\u30EB",
    order: 60036,
    tag_ids: ["fable"]
  },
  {
    _id: "fw08",
    name: "\u30AA\u30E2\u30D2\u30AB\u30CC",
    order: 61008,
    tag_ids: ["fable"]
  },
  {
    _id: "t99",
    name: "\u30AA\u30C8\u30B5\u30AB",
    order: 30099,
    tag_ids: ["travel", "T_a_k"]
  },
  {
    _id: "t100",
    name: "\u30CC\u30BF\u30CF\u30E9",
    order: 30100,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "sf041",
    name: "\u5730\u7403",
    comment: null,
    order: 80041,
    tag_ids: ["stratos"]
  },
  {
    _id: "t101",
    name: "\u30AF\u30C4\u30EF\u30C0",
    order: 30101,
    tag_ids: ["travel", "T_s_n"]
  },
  {
    _id: "sf042",
    name: "\u30A2\u30EB\u30AF\u30D3\u30A8\u30EC",
    comment: "\u8D85\u5149\u901F\u822A\u6CD5\u30A2\u30EB\u30AF\u30D3\u30A8\u30EC\u30FB\u30C9\u30E9\u30A4\u30D6",
    order: 80042,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf043",
    name: "\u30D1\u30EB\u30CA",
    comment: "\u30D2\u30C3\u30BF\u30A4\u30C8\u8A9E\u3067\u300C\u5BB6\u300D",
    order: 80043,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf044",
    name: "\u30C6\u30EA\u30A2",
    comment: "\u51FA\u5178\u300C\u9999\u6E2F\u8B66\u5BDF\u7279\u6B8A\u4EFB\u52D9\u90E8\u968A\u300D",
    order: 80044,
    tag_ids: ["stratos"]
  },
  {
    _id: "sf045",
    name: "\u30DE\u30C8\u30EA\u30AF\u30B9",
    comment: "\u5F3E\u5E55\u7CFB\u30B7\u30E5\u30FC\u30C6\u30A3\u30F3\u30B0\u30B2\u30FC\u30E0\u306E\u81EA\u6A5F\u3092\u3084\u308B\u30B9\u30DD\u30FC\u30C4\u304C\u3001\u660E\u5F8C\u65E5\u306E\u3069\u3053\u304B\u3067\u6D41\u884C\u3057\u3066\u3044\u308B\u3068\u9762\u767D\u3044\u306A\u3002",
    order: 80045,
    tag_ids: ["stratos"]
  }
];

// src/lib/pubsub/chr_face/map-reduce.ts
var katakanas = (() => {
  const result = [];
  let start2 = "\u30A2".charCodeAt(0);
  let end = "\u30F3".charCodeAt(0);
  let idx = start2;
  for (; idx <= end; idx++) {
    result.push(String.fromCharCode(idx));
  }
  return result;
})();
var Faces = MapReduce({
  format: () => ({
    list: [],
    remain: [],
    cover: [],
    tag: {}
  }),
  reduce: (data, doc) => {
    let name = doc.name.slice(0);
    if (doc.name.startsWith("\u2020"))
      name = doc.name.slice(1);
    if (doc.name.startsWith("D."))
      name = doc.name.slice(2);
    if (doc.name.startsWith("Dr."))
      name = doc.name.slice(3);
    name = name.replace(/[\u3041-\u3096]/g, (hira) => String.fromCharCode(hira.charCodeAt(0) + 96));
    const head = name[0];
    doc.tag_ids.unshift("all");
    for (const tag_id of doc.tag_ids) {
      emit2(dic(data.tag, tag_id, {}));
    }
    function emit2(o) {
      if (!o.list) {
        o.list = [];
        o.name_head_dic = {};
      }
      o.list.push(doc);
      dic(o.name_head_dic, head, []).push(doc.name);
    }
  },
  order: (data, { sort: sort3 }) => {
    for (const kana of katakanas) {
      if (data.tag.all.name_head_dic[kana]) {
        data.cover.push(kana);
      } else {
        data.remain.push(kana);
      }
    }
    for (const tag_id in data.tag) {
      sort3(data.tag[tag_id].list).asc((o) => o.order);
      data.tag[tag_id].name_head = sort3(data.tag[tag_id].name_head_dic).desc((o) => o.length);
    }
  }
});
chr_face_default.forEach((o, idx) => {
  o.yml_idx = idx;
});
Faces.add(chr_face_default);

// src/lib/game/json/cs_ririnra.json
var chr_set = {
  _id: "ririnra",
  admin: "\u95C7\u306E\u545F\u304D",
  maker: "\u5929\u306E\u304A\u544A\u3052",
  label: "\u4EBA\u72FC\u8B70\u4E8B"
};
var chr_npc = [
  {
    label: "\u4EBA\u72FC\u8B70\u4E8B\uFF08\u30AD\u30E3\u30B5\u30EA\u30F3\uFF09",
    csid: "ririnra_c05",
    face_id: "c05",
    say_0: "\u305F\u3044\u3078\u3093\u3001\u305F\u3044\u3078\u3093\u3001\u305F\u3044\u3078\u3093\uFF01",
    say_1: "\u5927\u5909\u3001\u4EBA\u72FC\u304C\u51FA\u305F\u3088\uFF01\u3000\u3044\u3064\u3082\u306F\u5618\u3060\u3051\u3069\u3001\u4ECA\u5EA6\u306F\u672C\u5F53\u306E\u672C\u5F53\u306B\u672C\u5F53\uFF01"
  },
  {
    label: "\u4EBA\u72FC\u8B70\u4E8B\uFF08\u30D9\u30CD\u30C3\u30C8\uFF09",
    csid: "ririnra_c08",
    face_id: "c08",
    say_0: "\u58C1\u306E\u5411\u3053\u3046\u3060\u3001\u3084\u3064\u306E\u8DB3\u97F3\u304C\u805E\u3053\u3048\u308B\u3002\u3044\u3088\u3044\u3088\u96A3\u5BA4\u306B\u8FEB\u308B\u3002\n\u660E\u65E5\u306F\u3001\u3082\u3046\u2026\u2026",
    say_1: "\u8DB3\u97F3\u304C\u90E8\u5C4B\u306E\u524D\u3067\u6B62\u307E\u3063\u305F\u3002\u305D\u3057\u3066\u3001\u30C9\u30A2\u30CE\u30D6\u304C\u3086\u3063\u304F\u308A\u3068\u56DE\u308B\u97F3\u304C\u805E\u3053\u3048\u308B\u3002\u632F\u308A\u5411\u3044\u3066\u306F\u3044\u3051\u306A\u3044\u3001\u632F\u308A\u5411\u3051\u3070\n\n<strong>\u65E5\u8A18\u306F\u305D\u3053\u3067\u9014\u5207\u308C\u3001\u767A\u898B\u3055\u308C\u308B\u307E\u3067\u6253\u3061\u6368\u3066\u3089\u308C\u3066\u3044\u305F\u3002</strong>"
  },
  {
    label: "\u4EBA\u72FC\u8B70\u4E8B\uFF08\u30BF\u30D0\u30B5\uFF09",
    csid: "ririnra_c19",
    face_id: "c19",
    say_0: "\u306D\u3047\u3001\u904A\u3093\u3067\u304B\u306A\u3044\uFF1F\u3000\u4ECA\u591C\u306F\u3042\u306A\u305F\u304C\u72FC\u3088\u2026\u2026",
    say_1: "\u4EBA\u72FC\u306A\u3093\u3066\u3044\u308B\u308F\u3051\u306A\u3044\u3058\u3083\u3093\uFF1F\u3000\u307F\u3093\u306A\u5927\u3052\u3055\u306A\u306E\u3055\u3002"
  },
  {
    label: "\u4EBA\u72FC\u8B70\u4E8B\uFF08\u30BD\u30D5\u30A3\u30A2\uFF09",
    csid: "ririnra_c67",
    face_id: "c67",
    say_0: "\u3053\u3093\u3070\u3093\u308F\u3001\u3053\u3093\u306A\u9045\u304F\u306B\u305F\u3044\u3078\u3093\u3067\u3059\u306D\u3002\n\n\u2026\u2026\u2026\n\u884C\u3063\u3061\u3083\u3063\u305F\u3002\u3078\u3093\u306A\u306E\u3002",
    say_1: "\u307E\u3055\u304B\u3042\u306E\u6642\u3001\u3042\u306E\u3072\u3068\u304C\u2026\u2026\uFF1F\n\u4EBA\u6BBA\u3057\u3068\u4E00\u7DD2\u306B\u3044\u308B\u306A\u3093\u3066\u2026\u2026\uFF01\u3000\u3078\u3084\u2026\u3001\u90E8\u5C4B\u306B\u623B\u3089\u305B\u3066\u3082\u3089\u3044\u307E\u3059\uFF01"
  },
  {
    label: "\u4EBA\u72FC\u8B70\u4E8B\uFF08\u30E8\u30A2\u30D2\u30E0\uFF09",
    csid: "ririnra_c68",
    face_id: "c68",
    say_0: "\u3075\u3072\u3001\u3075\u3072\u3072\uFF01\u3000\u4EBA\u72FC\u306B\u306A\u3069\u2026\u2026\u304F\u308C\u3066\u3084\u308B\u3082\u306E\u304B\u30E8\uFF01",
    say_1: "\u4EBA\u6BBA\u3057\u3068\u4E00\u7DD2\u306B\u3044\u308B\u306A\u3093\u3066\u3054\u3081\u3093\u3060\u30E8\uFF01\u3000\u3078\u2026\u3078\u3063\u3001\u90E8\u5C4B\u306B\u623B\u3089\u305B\u3066\u3082\u3089\u3046\u30E8\uFF01"
  },
  {
    label: "\u4EBA\u72FC\u8B70\u4E8B\uFF08\u30F4\u30A7\u30B9\u30D1\u30BF\u30A4\u30F3\uFF09",
    csid: "ririnra_c72",
    face_id: "c72",
    say_0: "\u55DA\u547C\u3001\u805E\u3053\u3048\u308B\u3002\u3084\u3064\u306E\u8DB3\u97F3\u304C\u805E\u3053\u3048\u308B\u2026\u2026\u3002",
    say_1: "\u9003\u3052\u308D\u3002\u9003\u3052\u308D\uFF01\u3000\u304A\u307E\u3048\u3089\u3060\u3051\u3067\u3082\u9003\u3052\u308D\u3002"
  },
  {
    label: "\u4EBA\u72FC\u8B70\u4E8B\uFF08\u30E8\u30FC\u30E9\u30F3\u30C0\uFF09",
    csid: "ririnra_c51",
    face_id: "c51",
    say_0: "\u591C\u98A8\u306B\u4E57\u3063\u3066\u3001\u9060\u304F\u304B\u3089\u58F0\u304C\u3068\u3069\u304D\u307E\u3059\u3002\u6628\u591C\u306F\u5E7D\u304B\u306B\u3002\u4ECA\u591C\u306F\u97FF\u304D\u3002\u304D\u3063\u3068\u660E\u65E5\u306F\u2026\u2026",
    say_1: "\u2026\u2026\u3042\u306E\u3001\u308F\u305F\u3057\u3002\u3053\u306E\u9A12\u304E\u304C\u843D\u3061\u7740\u3044\u305F\u3089\u6B64\u51E6\u3092\u51FA\u305F\u3044\u3093\u3067\u3059\u3002\n\u5E7C\u99B4\u67D3\u304B\u3089\u624B\u7D19\u304C\u6765\u305F\u306E\u3002\u304A\u91D1\u3092\u8CAF\u3081\u305F\u304B\u3089\u3001\u9060\u304F\u3067\u4E00\u7DD2\u306B\u66AE\u3089\u305D\u3046\u3063\u3066\u3002"
  },
  {
    label: "\u4EBA\u72FC\u8B70\u4E8B\uFF08\u30B0\u30ED\u30EA\u30A2\uFF09",
    csid: "ririnra_c20",
    face_id: "c20",
    say_0: "\u7D33\u58EB\u306A\u3089\u3073\u306B\u6DD1\u5973\u306E\u7686\u69D8\u3001\u308F\u305F\u304F\u3057\u306E\u9928\u3078\u3088\u3046\u3053\u305D\u3002\n\u4E16\u9593\u306E\u5642\u306A\u3069\u552F\u306E\u5642\u8A71\u3001\u6B64\u51E6\u3067\u3072\u3068\u3068\u304D\u5FA1\u5BDB\u304E\u306A\u3055\u3044\u306A\u3002",
    say_1: "\u3061\u3087\u3063\u3068\uFF01\u3000\u305D\u3053\u306E\u8CB4\u65B9\u3001\u4F55\u3092\u3057\u3066\u3044\u308B\u306E\uFF01\n\u805E\u3044\u305F\u3067\u3057\u3087\u3046\u4EBA\u72FC\u304C\u3044\u308B\u306E\u3088\u3001\u306F\u3084\u304F\u898B\u3064\u3051\u3066\u51E6\u5211\u306A\u3055\u3044\uFF01"
  },
  {
    label: "\u4EBA\u72FC\u8B70\u4E8B\uFF08\u30AA\u30B9\u30AB\u30FC\uFF09",
    csid: "ririnra_c32",
    face_id: "c32",
    say_0: "\u2026\u305D\u3063\u3061\u3058\u3083\u306A\u3044\u3088\u3001\u3053\u3063\u3061\u3060\u3088\u3002\n\u3053\u3053\u3001\u79D8\u5BC6\u57FA\u5730\u306A\u3093\u3060\u3002\u96E8\u3082\u3078\u3044\u304D\u3060\u3057\u6696\u304B\u3044\u3088\u3002",
    say_1: "\u306D\u3048\u3002\u898B\u3066\u898B\u3066\u3002\u30D1\u30F3\u6301\u3063\u3066\u304D\u305F\u3093\u3060\u3002\n\u307F\u3093\u306A\u306B\u306F\u30CA\u30A4\u30B7\u30E7\u3060\u3088\uFF1F"
  },
  {
    label: "\u4EBA\u72FC\u8B70\u4E8B\uFF08\u30E1\u30A2\u30EA\u30FC\uFF09",
    csid: "ririnra_c01",
    face_id: "c01",
    say_0: "\u3042\u306E\u65E5\u306B\u7D75\u672C\u3092\u3082\u3089\u3063\u3066\u304B\u3089\u3001\u738B\u5B50\u69D8\u3068\u306E\u9022\u702C\u3092\u5922\u898B\u3066\u306F\u66F8\u304D\u6E9C\u3081\u3066\u3044\u305F\u3002\n\u30EC\u30CA\u30FC\u30BF\u304C\u6355\u307E\u3048\u305F\u4F73\u3044\u4EBA\u3082\u307E\u3042\u307E\u3042\u3060\u3051\u308C\u3069\u3001\u79C1\u3060\u3051\u306E\u738B\u5B50\u69D8\u306F\u304D\u3063\u3068\u6843\u5712\u306E\u306B\u3042\u3046\u3072\u3068\u3002\n\n\u30BC\u30E9\u30CB\u30A6\u30E0\u3092\u30E4\u30C9\u30EA\u30AE\u3067\u7E4B\u3052\u3066\u3002\u660E\u65E5\u306F\u82B1\u98FE\u308A\u6301\u3063\u3066\u3044\u3053\u3046\uFF01",
    say_1: "\u3054\u3081\u3093\u306D\u3001\u672C\u7269\u306E\u604B\u304C\u3057\u305F\u304F\u306A\u3063\u3061\u3083\u3063\u305F\u3002\n\n\u3075\u305F\u308A\u3060\u3051\u306E\u8A18\u5FF5\u65E5\u306B\u5F85\u3061\u5408\u308F\u305B\n\u8056\u795D\u65E5\u306E\u5915\u713C\u3051\u306B\u982C\u3092\u67D3\u3081\u3066\u898B\u3064\u3081\u5408\u3044\n\u6B4C\u5287\u9152\u5834\u306E\u540D\u512A\u304C\u3001\u541B\u3068\u751F\u304D\u3066\u3044\u304F\u660E\u65E5\u3092\u6B4C\u3044\u4E0A\u3052\u308B\u3088\u308A\u3082\u306A\u304A\u96C4\u5F01\u306B\n\n\u82B1\u98FE\u308A\u306B\u30C4\u30C4\u30B8\u3092\u6DFB\u3048\u3066\u3001\u4ECA\u65E5\u306F\u5BC4\u308A\u9053\u3057\u3066\u3044\u304F\u306E\u3002"
  },
  {
    label: "\u4EBA\u72FC\u8B70\u4E8B\uFF08\u30DA\u30C8\u30E9\uFF09",
    csid: "ririnra_c128",
    face_id: "c128",
    say_0: "\u9003\u3052\u308B\u306E\u306F\u5F97\u610F\u3060\u3051\u3069\u3001\u82B1\u3001\u85AC\u3001\u9B5A\u306F\u672C\u7269\u306E\u76EE\u304C\u5149\u3063\u3066\u3063\u3057\u3001\u3082\u3046\u58F2\u308A\u7269\u306A\u3044\u3057\u2026\u3002\u3042\u30FC\u3042\u3002\u3069\u3046\u3057\u3066\u3053\u3046\u306A\u3063\u305F\u3002\n\n\u30BF\u30C3\u30D7\u30EA\u5DDD\u306E\u6C34\u3092\u98F2\u3093\u3067\u300C\u4E38\u3005\u3068\u80A5\u3063\u305F\u9C0A\u300D\u3092\u58F2\u308A\u3055\u3070\u3044\u305F\u3068\u304D\u306F\u3088\u304B\u3063\u305F\u306A\u3001\u5824\u3067\u58F2\u3063\u3066\u308A\u3083\u65B0\u9BAE\u306B\u898B\u3048\u308B\u3066\u3093\u3067\u53F3\u304B\u3089\u5DE6\u3002\n\u65AF\u304F\u3057\u3066\u9B5A\u5C4B\u306E\u30B4\u30DF\u7BB1\u306F\u5B8C\u58F2\u5FA1\u793C\u3001\u6075\u307E\u308C\u306A\u3044\u5B50\u4F9B\u306E\u304A\u8179\u3082\u6E80\u305F\u3055\u308C\u3066\u3001\u9C0A\u3092\u53CE\u3081\u305F\u3054\u7ACB\u8179\u304C\u5824\u306B\u6765\u305F\u3053\u308D\u306B\u306F\u3001\u672C\u7269\u306E\u9B5A\u5C4B\u3057\u304B\u3044\u307E\u305B\u3093\u3067\u3057\u305F\u3068\u3055\u3063\u3066\u306D\u3002\u5091\u4F5C\u3060\u308D\uFF1F\n\n\u3042\u3042\u3001\u4ECA\u65E5\u306F\u9053\u7AEF\u306B\u5EA7\u308D\u3063\u304B\u3002\u7ACB\u3064\u307B\u3046\u3067\u306A\u304D\u3083\u611B\u60F3\u3082\u3044\u3089\u306D\u3063\u3057\u3002",
    say_1: "\u3084\u3070\u3044\u3084\u3070\u3044\u3084\u3063\u3070\u3044\u3057\uFF01\u76EE\u304C\u5408\u3063\u305F\u3057\uFF01\n\n\u3088\u3057\u3001\u9003\u3052\u3063\u304B\u3002\n\u5DDD\u3080\u3053\u3046\u2026\u3046\u3046\u3093\u3044\u3063\u305D\u9003\u308C\u306E\u753A\u307E\u3067\u3002\n\n\u305C\u3063\u3066\u30FC\u3042\u3044\u3064\u3089\u5FB4\u7A0E\u56E3\u306A\u3093\u304B\u3058\u3083\u306A\u3044\u3057\u3002\u305D\u308C\u306A\u3089\u6697\u304F\u3066\u5538\u3063\u3066\u7D05\u3044\u76EE\u3067\u3001\u3064\u3044\u3067\u306B\u30B4\u30EF\u30B4\u30EF\u3057\u3066\u306D\u30FC\u3057\u3002\n\u3042\u30FC\u3042\u3002\u304D\u306E\u3046\u306E\u3042\u304C\u308A\u30DC\u30C1\u30DC\u30C1\u3042\u3063\u305F\u3057\u3001\u3082\u3063\u305F\u3044\u306A\u3044\u3051\u3069\u2026\u3002"
  },
  {
    label: "\u4EBA\u72FC\u8B70\u4E8B",
    csid: "ririnra",
    face_id: "c99",
    say_0: "\u55DA\u547C\u3001\u805E\u3053\u3048\u308B\u3002\u3084\u3064\u306E\u8DB3\u97F3\u304C\u805E\u3053\u3048\u308B\u2026\u2026\u3002",
    say_1: "\u9003\u3052\u308D\u3002\u9003\u3052\u308D\uFF01\u3000\u304A\u307E\u3048\u3089\u3060\u3051\u3067\u3082\u9003\u3052\u308D\u3002"
  }
];
var chr_job = [
  {
    face_id: "c01",
    job: "\u82B1\u58F2\u308A"
  },
  {
    face_id: "c02",
    job: "\u6751\u9577"
  },
  {
    face_id: "c03",
    job: "\u898B\u7FD2\u3044\u533B\u5E2B"
  },
  {
    face_id: "c04",
    job: "\u5973\u4E2D"
  },
  {
    face_id: "c05",
    job: "\u75C5\u4EBA"
  },
  {
    face_id: "c06",
    job: "\u7D10"
  },
  {
    face_id: "c07",
    job: "\u96D1\u8CA8\u5C4B"
  },
  {
    face_id: "c08",
    job: "\u672C\u5C4B"
  },
  {
    face_id: "c09",
    job: "\u523A\u5BA2"
  },
  {
    face_id: "c10",
    job: "\u5C0F\u5A18"
  },
  {
    face_id: "c11",
    job: "\u5C0F\u50E7"
  },
  {
    face_id: "c12",
    job: "\u5FA1\u8005"
  },
  {
    face_id: "c13",
    job: "\u30D9\u30C6\u30E9\u30F3\u533B\u5E2B"
  },
  {
    face_id: "c14",
    job: "\u8056\u6B4C\u968A\u54E1"
  },
  {
    face_id: "c15",
    job: "\u90F5\u4FBF\u5C4B"
  },
  {
    face_id: "c16",
    job: "\u98DF\u3044\u3057\u3093\u574A"
  },
  {
    face_id: "c17",
    job: "\u8A69\u4EBA"
  },
  {
    face_id: "c18",
    job: "\u30D9\u30C6\u30E9\u30F3\u770B\u8B77\u5A66"
  },
  {
    face_id: "c19",
    job: "\u6C34\u5546\u58F2"
  },
  {
    face_id: "c20",
    job: "\u826F\u5BB6\u306E\u5A18"
  },
  {
    face_id: "c21",
    job: "\u8089\u5C4B"
  },
  {
    face_id: "c22",
    job: "\u767E\u59D3"
  },
  {
    face_id: "c23",
    job: "\u4F1D\u9053\u5E2B"
  },
  {
    face_id: "c24",
    job: "\u9577\u8001"
  },
  {
    face_id: "c25",
    job: "\u826F\u5BB6\u306E\u606F\u5B50"
  },
  {
    face_id: "c26",
    job: "\u697D\u5668\u8077\u4EBA"
  },
  {
    face_id: "c27",
    job: "\u7267\u4EBA"
  },
  {
    face_id: "c28",
    job: "\u8AAD\u66F8\u5BB6"
  },
  {
    face_id: "c29",
    job: "\u8A18\u8005"
  },
  {
    face_id: "c30",
    job: "\u9CE5\u4F7F\u3044"
  },
  {
    face_id: "c31",
    job: "\u7AE5\u8A71\u4F5C\u5BB6"
  },
  {
    face_id: "c32",
    job: "\u53CC\u751F\u5150"
  },
  {
    face_id: "c33",
    job: "\u53CC\u751F\u5150"
  },
  {
    face_id: "c34",
    job: "\u9774\u78E8\u304D"
  },
  {
    face_id: "c35",
    job: "\u89AA\u65B9"
  },
  {
    face_id: "c36",
    job: "\u98FE\u308A\u8077"
  },
  {
    face_id: "c37",
    job: "\u594F\u8005"
  },
  {
    face_id: "c38",
    job: "\u6B4C\u3044\u624B"
  },
  {
    face_id: "c39",
    job: "\u4ED5\u7ACB\u3066\u5C4B"
  },
  {
    face_id: "c40",
    job: "\u57F7\u4E8B"
  },
  {
    face_id: "c41",
    job: "\u3055\u3059\u3089\u3044\u4EBA"
  },
  {
    face_id: "c42",
    job: "\u6383\u9664\u592B"
  },
  {
    face_id: "c43",
    job: "\u68EE\u756A"
  },
  {
    face_id: "c44",
    job: "\u5C0F\u60AA\u515A"
  },
  {
    face_id: "c45",
    job: "\u535A\u5F92"
  },
  {
    face_id: "c46",
    job: "\u52A9\u624B"
  },
  {
    face_id: "c47",
    job: "\u6D41\u6D6A\u8005"
  },
  {
    face_id: "c48",
    job: "\u5B9D\u77F3\u53CE\u96C6\u5BB6"
  },
  {
    face_id: "c49",
    job: "\u77F3\u5DE5"
  },
  {
    face_id: "c50",
    job: "\u4F1A\u8A08\u58EB"
  },
  {
    face_id: "c51",
    job: "\u5893\u5B88"
  },
  {
    face_id: "c52",
    job: "\u5893\u5800"
  },
  {
    face_id: "c53",
    job: "\u5927\u5730\u4E3B"
  },
  {
    face_id: "c54",
    job: "\u7406\u9AEA\u5E2B"
  },
  {
    face_id: "c55",
    job: "\u5BE1\u5A66"
  },
  {
    face_id: "c56",
    job: "\u9152\u5C4B"
  },
  {
    face_id: "c57",
    job: "\u4FEE\u9053\u5973"
  },
  {
    face_id: "c58",
    job: "\u53F8\u796D"
  },
  {
    face_id: "c59",
    job: "\u4FEE\u9053\u58EB"
  },
  {
    face_id: "c60",
    job: "\u826F\u5BB6\u306E\u672B\u5A18"
  },
  {
    face_id: "c61",
    job: "\u91E3\u308A\u5E2B"
  },
  {
    face_id: "c62",
    job: "\u98A8\u6765\u574A"
  },
  {
    face_id: "c63",
    job: "\u6F02\u767D\u5DE5"
  },
  {
    face_id: "c64",
    job: "\u5893\u8352\u3089\u3057"
  },
  {
    face_id: "c65",
    job: "\u59CB\u672B\u5C4B"
  },
  {
    face_id: "c66",
    job: "\u7D05\u8336\u5C4B"
  },
  {
    face_id: "c67",
    job: "\u5E97\u756A"
  },
  {
    face_id: "c68",
    job: "\u8CED\u5834\u306E\u4E3B"
  },
  {
    face_id: "c69",
    job: "\u7F8E\u8853\u5BB6"
  },
  {
    face_id: "c70",
    job: "\u5B50\u5B88\u308A"
  },
  {
    face_id: "c71",
    job: "\u9053\u6848\u5185"
  },
  {
    face_id: "c72",
    job: "\u30E9\u30F3\u30BF\u30F3\u8077\u4EBA"
  },
  {
    face_id: "c73",
    job: "\u6C34\u5546\u58F2"
  },
  {
    face_id: "c74",
    job: "\u8E0A\u308A\u624B"
  },
  {
    face_id: "c75",
    job: "\u594F\u8005"
  },
  {
    face_id: "c76",
    job: "\u7559\u5B88\u756A"
  },
  {
    face_id: "c77",
    job: "\u99AC\u98FC\u3044"
  },
  {
    face_id: "c78",
    job: "\u9053\u5316\u5E2B"
  },
  {
    face_id: "c79",
    job: "\u9577\u8001\u306E\u5B6B"
  },
  {
    face_id: "c80",
    job: "\u82E5\u8005"
  },
  {
    face_id: "c81",
    job: "\u85AC\u5C4B"
  },
  {
    face_id: "c82",
    job: "\u57F7\u4E8B\u898B\u7FD2\u3044"
  },
  {
    face_id: "c83",
    job: "\u53D7\u4ED8"
  },
  {
    face_id: "c84",
    job: "\u59BB"
  },
  {
    face_id: "c85",
    job: "\u304A\u4F7F\u3044"
  },
  {
    face_id: "c86",
    job: "\u653E\u8569\u8005"
  },
  {
    face_id: "c87",
    job: "\u75C5\u4EBA"
  },
  {
    face_id: "c88",
    job: "\u6599\u7406\u4EBA"
  },
  {
    face_id: "c99",
    job: "\u53AD\u4E16\u5BB6"
  },
  {
    job: "\u65B0\u59BB",
    face_id: "c89"
  },
  {
    job: "\u7C89\u3072\u304D",
    face_id: "c90"
  },
  {
    job: "\u6D17\u6FEF\u5A66",
    face_id: "c91"
  },
  {
    job: "\u6D17\u6FEF\u5A66",
    face_id: "c92"
  },
  {
    job: "\u6D17\u6FEF\u5A66",
    face_id: "c93"
  },
  {
    face_id: "c94",
    job: "\u5973\u4E3B\u4EBA"
  },
  {
    face_id: "c95",
    job: "\u65B0\u805E\u914D\u9054"
  },
  {
    face_id: "c96",
    job: "\u5B66\u8005"
  },
  {
    job: "\u635C\u67FB\u5B98",
    face_id: "c97"
  },
  {
    job: "\u63A2\u5075",
    face_id: "c98"
  },
  {
    job: "\u5F92\u5F1F",
    face_id: "c100"
  },
  {
    job: "\u624B\u4F1D\u3044",
    face_id: "c101"
  },
  {
    face_id: "c102",
    job: "\u6307\u63EE\u8005"
  },
  {
    face_id: "c103",
    job: "\u53AD\u4E16\u5BB6"
  },
  {
    face_id: "c104",
    job: "\u8CA0\u50B7\u5175"
  },
  {
    face_id: "c105",
    job: "\u6559\u3048\u5B50"
  },
  {
    face_id: "c106",
    job: "\u9B5A\u5C4B"
  },
  {
    face_id: "c107",
    job: "\u6210\u91D1"
  },
  {
    face_id: "c108",
    job: "\u63A1\u96C6\u4EBA"
  },
  {
    face_id: "c109",
    job: "\u6751\u5A18"
  },
  {
    face_id: "c110",
    job: "\u308D\u304F\u3067\u306A\u3057"
  },
  {
    face_id: "c111",
    job: "\u611B\u4EBA"
  },
  {
    face_id: "c112",
    job: "\u8A31\u5A5A"
  },
  {
    face_id: "c113",
    job: "\u7D10"
  },
  {
    face_id: "c114",
    job: "\u9769\u547D\u5BB6"
  },
  {
    face_id: "c115",
    job: "\u5EC3\u54C1\u56DE\u53CE"
  },
  {
    face_id: "c116",
    job: "\u9003\u4EA1\u8005"
  },
  {
    face_id: "c117",
    job: "\u5BBF\u5C4B"
  },
  {
    face_id: "c118",
    job: "\u6E21\u3057\u8239"
  },
  {
    face_id: "c119",
    job: "\u4FE1\u5F92"
  },
  {
    face_id: "c120",
    job: "\u5EAD\u5E2B"
  },
  {
    face_id: "c121",
    job: "\u8FB2\u85AC\u58F2"
  },
  {
    face_id: "c122",
    job: "\u30D3\u30FC\u30EB\u914D\u308A"
  },
  {
    face_id: "c123",
    job: "\u874B\u71ED\u8077\u4EBA"
  },
  {
    face_id: "c124",
    job: "\u516C\u8A3C\u4EBA"
  },
  {
    face_id: "c125",
    job: "\u4E0B\u50CD\u304D"
  },
  {
    face_id: "c126",
    job: "\u59C9\u59B9"
  },
  {
    face_id: "c127",
    job: "\u9280\u884C\u5C4B"
  },
  {
    face_id: "c128",
    job: "\u4E00\u65E5\u4E5E\u98DF"
  },
  {
    face_id: "c129",
    job: "\u5974\u96B7\u904B\u3073"
  },
  {
    face_id: "c130",
    job: "\u5F01\u52D9\u5B98"
  },
  {
    face_id: "c131",
    job: "\u5C71\u5E2B"
  },
  {
    face_id: "c132",
    job: "\u76AE\u97A3\u5DE5"
  },
  {
    face_id: "c133",
    job: "\u5FB4\u7A0E\u56E3"
  },
  {
    face_id: "c134",
    job: "\u5E72\u62D3\u6C11"
  },
  {
    face_id: "c135",
    job: "\u8FF7\u3044\u4EBA"
  },
  {
    face_id: "c136",
    job: "\u526A\u6BDB\u5DE5"
  },
  {
    face_id: "c137",
    job: "\u7532\u677F\u54E1"
  },
  {
    face_id: "c138",
    job: "\u4EE3\u57F7\u7B46"
  },
  {
    face_id: "c139",
    job: "\u512A\u7B49\u751F"
  },
  {
    face_id: "c140",
    job: "\u968A\u5546\u5378"
  },
  {
    face_id: "c141",
    job: "\u6CE5\u70AD\u63A1\u308A"
  },
  {
    face_id: "c142",
    job: "\u6CB3\u5DDD\u5B66\u5F92"
  },
  {
    face_id: "c143",
    job: "\u5BB6\u5EAD\u6559\u5E2B"
  },
  {
    face_id: "c144",
    job: "\u6AA3\u697C\u89B3\u6E2C"
  },
  {
    face_id: "c145",
    job: "\u52A9\u7523\u5A66"
  },
  {
    face_id: "c146",
    job: "\u7570\u672C\u5546"
  }
];
var cs_ririnra_default = {
  chr_set,
  chr_npc,
  chr_job
};

// src/lib/game/json/cs_wa.json
var chr_set2 = {
  _id: "wa",
  admin: "\u95C7\u306E\u545F\u304D",
  maker: "\u7A32\u8377\u306E\u304A\u544A\u3052",
  label: "\u548C\u306E\u56FD\u3066\u3084\u3093\u3067\u3048"
};
var chr_npc2 = [
  {
    label: "\u548C\u306E\u56FD\u3066\u3084\u3093\u3067\u3048",
    csid: "wa",
    face_id: "w17",
    say_0: "\u55DA\u547C\u3001\u805E\u3053\u3048\u308B\u3002\u3084\u3064\u306E\u8DB3\u97F3\u304C\u805E\u3053\u3048\u308B\u2026\u2026\u3002",
    say_1: "\u9003\u3052\u308D\u3002\u9003\u3052\u308D\uFF01\u3000\u304A\u307E\u3048\u3089\u3060\u3051\u3067\u3082\u9003\u3052\u308D\u3002"
  },
  {
    label: "\u548C\u306E\u56FD\u3066\u3084\u3093\u3067\u3048\uFF08\u4EC1\u53F3\u885B\u9580\uFF09",
    csid: "wa_w23",
    face_id: "w23",
    say_0: "\u306A\u3093\u3068\u3001\u3053\u308C\u306F\u5947\u3063\u602A\u2026\u2026\u5206\u304B\u3063\u305F\u30BE\uFF01",
    say_1: "\u3084\u3063\u3071\u308A\u4EBA\u72FC\u306F\u5B9F\u5728\u3059\u308B\u3093\u3060\u30E8\uFF01\u3000\u3046\u3063\u3072\u3087\u3072\u3087\u30FC\u3044\uFF01"
  },
  {
    label: "\u548C\u306E\u56FD\u3066\u3084\u3093\u3067\u3048\uFF08\u9B3C\u4E1E\uFF09",
    csid: "wa_w51",
    face_id: "w51",
    say_0: "\u30AB\u30AB\u30AB\u2026\u2026\u3001\u5982\u4F55\u69D8\u3063\u3066\u304A\u524D\u3088\u3002\n\u308F\u304B\u3063\u3066\u3093\u306E\u304B\uFF1F\u3000\u9685\u3005\u307E\u3067\u8ABF\u3079\u3066\u3088\u3001\u306A\u3042\u3093\u306B\u3082\u51FA\u306A\u3051\u308A\u3083\u3088\uFF1F\n\n\u304A\u3046\uFF01\u3000\u5834\u306E\u5341\u500D\u3001\u8033\u63C3\u3048\u3066\u51FA\u3059\u3093\u3060\u308D\u3046\u306A\uFF01",
    say_1: "\u3088\u3046\u3002\u90AA\u9B54\u3059\u308B\u3088\u3002\n\u3042\u3093\u305F\u300A\u85AC\u55B0\u3044\u300B\u3060\u308D\uFF1F\u3000\u3053\u306E\u3057\u307F\u3063\u305F\u308C\u91CE\u90CE\u3092\u8CB7\u3063\u3066\u304F\u308C\u3088\u3002\n\n\u307E\u3063\u305F\u307E\u3063\u305F\u307E\u3063\u305F\uFF01\n\u4FFA\u306F\u307B\u3089\u3001\u3055\u3055\u3084\u304B\u306A\u91D1\u5B50\u304C\u3044\u305F\u3060\u3051\u308A\u3083\u3042\u3063\u3066\u3001\u305D\u308C\u3060\u3051\u306E\u7528\u4E8B\u306A\u308F\u3051\u3088\u3002\u308F\u304B\u308B\u3060\u308D\u3002\u306A\uFF1F\n\n\u4F8D\u306B\u306F\u9ED9\u3063\u3066\u308B\u304B\u3089\u3001\u3088\u3002\n\u3082\u3061\u3064\u3082\u305F\u308C\u3064\u3001\u4EF2\u826F\u304F\u3057\u3088\u3046\u305C\u2026\u2026"
  }
];
var chr_job2 = [
  {
    face_id: "w01",
    job: "\u5F79\u8005"
  },
  {
    face_id: "w02",
    job: "\u6D6A\u4EBA"
  },
  {
    face_id: "w03",
    job: "\u5FCD\u8005"
  },
  {
    face_id: "w04",
    job: "\u753A\u5A18"
  },
  {
    face_id: "w05",
    job: "\u98F4\u5E2B"
  },
  {
    face_id: "w06",
    job: "\u5DEB\u5973"
  },
  {
    face_id: "w07",
    job: "\u53CC\u5B50"
  },
  {
    face_id: "w08",
    job: "\u53CC\u5B50"
  },
  {
    face_id: "w09",
    job: "\u5BA3\u6559\u5E2B"
  },
  {
    face_id: "w10",
    job: "\u523A\u5BA2"
  },
  {
    face_id: "w11",
    job: "\u91E3\u308A\u5E2B"
  },
  {
    face_id: "w12",
    job: "\u5973\u4E2D"
  },
  {
    face_id: "w13",
    job: "\u56E3\u5B50\u5C4B"
  },
  {
    face_id: "w14",
    job: "\u624B\u59BB\u5E2B"
  },
  {
    face_id: "w15",
    job: "\u5C71\u59E5"
  },
  {
    face_id: "w16",
    job: "\u9AEA\u7D50\u3044"
  },
  {
    face_id: "w17",
    job: "\u75C5\u4EBA"
  },
  {
    face_id: "w18",
    job: "\u5F8C\u59BB"
  },
  {
    face_id: "w20",
    job: "\u5449\u670D\u554F\u5C4B"
  },
  {
    face_id: "w21",
    job: "\u3046\u3069\u3093\u8077\u4EBA"
  },
  {
    face_id: "w22",
    job: "\u305D\u3070\u8077\u4EBA"
  },
  {
    face_id: "w23",
    job: "\u5F01\u58EB"
  },
  {
    face_id: "w24",
    job: "\u55A7\u5629\u5C4B"
  },
  {
    face_id: "w25",
    job: "\u8AAC\u6CD5\u5E2B"
  },
  {
    face_id: "w26",
    job: "\u9913\u9B3C\u5927\u5C06"
  },
  {
    face_id: "w27",
    job: "\u767A\u660E\u5BB6"
  },
  {
    face_id: "w28",
    job: "\u98DB\u811A"
  },
  {
    face_id: "w29",
    job: "\u7434\u5F3E\u304D"
  },
  {
    face_id: "w30",
    job: "\u5B97\u4E3B"
  },
  {
    face_id: "w31",
    job: "\u5B50\u5B88\u308A"
  },
  {
    face_id: "w32",
    job: "\u843D\u80E4"
  },
  {
    face_id: "w33",
    job: "\u8239\u5927\u5DE5"
  },
  {
    face_id: "w34",
    job: "\u91CE\u4F0F\u308A"
  },
  {
    face_id: "w35",
    job: "\u795E\u4E3B"
  },
  {
    face_id: "w36",
    job: "\u697D\u58EB"
  },
  {
    face_id: "w37",
    job: "\u85AC\u58F2\u308A"
  },
  {
    face_id: "w38",
    job: "\u9580\u4E0B\u751F"
  },
  {
    face_id: "w39",
    job: "\u6B66\u5BB6\u306E\u5A18"
  },
  {
    face_id: "w40",
    job: "\u61D0\u5200"
  },
  {
    face_id: "w41",
    job: "\u7269\u4E5E\u3044"
  },
  {
    face_id: "w43",
    job: "\u4E01\u7A1A"
  },
  {
    face_id: "w44",
    job: "\u6A5F\u7E54\u308A"
  },
  {
    face_id: "w45",
    job: "\u5EA7\u6577\u5B88"
  },
  {
    face_id: "w46",
    job: "\u5C4D\u6F01\u308A"
  },
  {
    face_id: "w47",
    job: "\u80A5\u4EE3\u53D6\u308A"
  },
  {
    face_id: "w48",
    job: "\u548C\u7B97\u5BB6"
  },
  {
    face_id: "w49",
    job: "\u629C\u8377"
  },
  {
    face_id: "w50",
    job: "\u534A\u306E\u76EE"
  },
  {
    face_id: "w51",
    job: "\u771F\u5263\u5E2B"
  },
  {
    face_id: "w52",
    job: "\u770B\u677F\u5A18"
  },
  {
    face_id: "w53",
    job: "\u65C5\u7C60"
  },
  {
    face_id: "w54",
    job: "\u5927\u65E6\u90A3"
  },
  {
    face_id: "w55",
    job: "\u4E11\u306E\u523B\u53C2\u308A"
  },
  {
    face_id: "w56",
    job: "\u5FA1\u514D\u682A"
  },
  {
    face_id: "w57",
    job: "\u9670\u967D\u5E2B"
  },
  {
    face_id: "w58",
    job: "\u5E2B\u7BC4\u68CB\u58EB"
  },
  {
    face_id: "w59",
    job: "\u513A\u9063"
  }
];
var cs_wa_default = {
  chr_set: chr_set2,
  chr_npc: chr_npc2,
  chr_job: chr_job2
};

// src/lib/game/json/cs_time.json
var chr_set3 = {
  _id: "time",
  admin: "\u7B2C\u56DB\u306E\u58C1\u306E\u6DF1\u5965",
  maker: "\u6B21\u5143X\u5F0F\u30B3\u30F3\u30D4\u30E5\u30FC\u30BF\u30FC",
  label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u5E30\u9084\u8005\u8B70\u4E8B\u300D"
};
var chr_npc3 = [
  {
    label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u5E30\u9084\u8005\u8B70\u4E8B\u300D",
    csid: "time",
    face_id: "c10",
    say_0: "M4\u30E9\u30A4\u30D5\u30EB\u3092\u6301\u3063\u3066\u3055\u3048\u3044\u308C\u3070\u2026\u3001\u306A\u30FC\u3093\u3066\u3001\u601D\u3063\u3066\u3066\u3082\u3057\u3087\u3046\u304C\u306A\u3044\u306D\u3002\u9375\u304B\u3051\u3068\u3053\u3046\u3002",
    say_1: "\u3084\u3063\u3071\u3055\u3001\u9283\u3092\u6301\u3063\u305F\u5584\u4EBA\u304C\u3044\u306A\u3044\u3068\u3055\u3002\n\n\u3061\u3087\u3063\u3068\u51FA\u304B\u3051\u3066\u304F\u308B\uFF01\u3000\u30D7\u30EA\u30F3\u98DF\u3079\u3061\u3083\u30C0\u30E1\u3060\u3088\uFF01"
  },
  {
    label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u5E30\u9084\u8005\u8B70\u4E8B\u300D\uFF08\u30CA\u30C4\u30DF\uFF09",
    csid: "time_t44",
    face_id: "t44",
    say_0: "<strong>\u65E5\u5DEE\u3057\u304C\u30D7\u30EA\u30FC\u30C4\u304B\u3089\u3053\u307C\u308C\u308B\u3068\u3001\u30D1\u30F3\u3092\u304F\u308F\u3048\u305F\u9ED2\u9AEA\u306F\u3082\u3046\u3001\u5E87\u304B\u3089\u306E\u6821\u820E\u5165\u308A\u3092\u9054\u6210\u3057\u3066\u3044\u305F\u3002</strong>\n\n\u3054\u3081\u3093\u306D\uFF01\n\u6025\u3044\u3067\u308B\u304B\u3089\u3001\u62F3\u904A\u3073\u306F\u653E\u8AB2\u5F8C\uFF01\n\n\u304A\u306F\u3088\u30FC\u3002\u5BBF\u984C\u3084\u3063\u305F\uFF1F\u3000\u3061\u3087\u3063\u3068\u6559\u3048\u3066\u30FC\n\u3042\u3042\u3046\u3093\u3001\u98DF\u3079\u3061\u3083\u3046\u3057\u3001\u4E0A\u5C65\u304D\u306F\u306D\u3001\u6301\u3063\u3066\u308B\u3002\u3060\u3044\u3058\u3087\u3076\u3002",
    say_1: "\u307E\u3063\u305F\u304F\u3001\u3044\u304F\u3089\u653E\u8AB2\u5F8C\u3063\u3066\u3044\u3063\u3066\u3082\u3055\u2026\u3002\n\n\u3082\u3046\u3055\u30FC\u3001\u304A\u98A8\u5442\u3057\u3066\u3001\u982D\u6D17\u3063\u3066\u3001\u6B6F\u78E8\u304D\u3057\u3061\u3083\u304A\u3046\u3088\u3002\n\u30C0\u30E1\u3001\u304B\u2026\n\n\u3058\u3083\u3042\u3001\u306F\u3058\u3081\u307E\u3059\u306D\u3002\n\n\u5440\uFF01"
  },
  {
    label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u5E30\u9084\u8005\u8B70\u4E8B\u300D\uFF08\u5C11\u5E74\uFF21\uFF09",
    csid: "time_t48_wash",
    face_id: "t48",
    _id: "time_t48_wash",
    say_0: "\u3053\u3053\u3001\u79D8\u5BC6\u57FA\u5730\u3063\u3066\u3084\u3064\u306A\u306E\u304B\u306A\u3002\n\u304A\u3058\u3083\u307E\u3057\u307E\u3059\u2026\u2026\n\n\u3051\u3063\u3053\u3046\u2026\u2026\u5E83\u3044\u305E\u2026\u2026\u3002\u306F\u306F\u3063\u3001\u3059\u3052\u3048\uFF01\u3000\u30DE\u30F3\u30AC\u96A0\u305D\u3046\u304B\u306A\uFF01\n\n<strong>\uFF08\u7740\u4FE1\u97F3\uFF09</strong>\n\n\u3084\u3079\u3063\u3001\u6BCD\u3055\u3093\u3060\u3002",
    say_1: "\u3054\u3081\u3093\uFF01\u3000\u5FD8\u308C\u7269\u3057\u3066\u305F\u3002\u5148\u884C\u3063\u3066\u3066\uFF01\n\n\u2026\u2026\n\n\u3046\u3072\u3072\u3001\u3053\u306E\u3001\u9784\u3044\u3063\u3071\u3044\u306E\u79D8\u8535\u306E\u540D\u4F5C\u3092\u3001\u305D\u3046\u3060\u306A\u3002\u3042\u3063\u3061\u3068\u3001\u3053\u3063\u3061\u3068\u3001\n\u3044\u3066\u3063\u3002\n\n\u3048\u3063\u8AB0"
  },
  {
    label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u5E30\u9084\u8005\u8B70\u4E8B\u300D\uFF08\u5C11\u5973\uFF21\uFF09",
    csid: "time_t49_wash",
    face_id: "t49",
    _id: "time_t49_wash",
    say_0: "\u9045\u304F\u306A\u3063\u3061\u3083\u3063\u305F\u304B\u3089\u3001\u76F4\u63A5\u587E\u884C\u304D\u307E\u3059\u3002\u5915\u5FA1\u98EF\u6B8B\u3057\u3068\u3044\u3066\u306D\u3002\u3000\u30D4\u30C3\n<strong>\u3059\u3063\u304B\u308A\u65E5\u304C\u66AE\u308C\u305F\u3001\u3044\u3064\u3082\u306E\u5E30\u308A\u9053\u3002\u3051\u308C\u3069\u30DD\u30B1\u30C3\u30C8\u306B\u643A\u5E2F\u3092\u53CE\u3081\u308B\u3068\u3001\u3057\u3070\u3057\u8003\u3048\u3001\u6A2A\u9053\u306B\u5165\u308A\u3053\u3080\u3002</strong>\n\n\u3088\u3057\u3088\u3057\u3002\u304A\u307E\u3048\u3001\u3053\u3093\u306A\u3068\u3053\u308D\u3067\u72EC\u308A\u307C\u3063\u3061\u306A\u306E\uFF1F\u3000\u2026\u2026\u3058\u3083\u3042\u3053\u308C\u3001\u3042\u3052\u308B\u3002\n\u307B\u3089\u2026\u2026\u3001\u304A\u3044\u3067\uFF1F\n\u306D\u3063\u3001\u6696\u304B\u3044\u3067\u3057\u3087\u3002",
    say_1: "\u9045\u304F\u306A\u3063\u3061\u3083\u3063\u305F\u304B\u3089\u3001\u76F4\u63A5\u587E\u884C\u304D\u307E\u3059\u3002\u5915\u5FA1\u98EF\u6B8B\u3057\u3068\u3044\u3066\u306D\u3002\u3000\u30D4\u30C3\n<strong>\u3059\u3063\u304B\u308A\u65E5\u304C\u66AE\u308C\u305F\u3001\u3044\u3064\u3082\u306E\u5E30\u308A\u9053\u3002\u3051\u308C\u3069\u30DD\u30B1\u30C3\u30C8\u304B\u3089\u7F36\u8A70\u3092\u53D6\u308A\u51FA\u3059\u3068\u3001\u3057\u3070\u3057\u8003\u3048\u3001\u6A2A\u9053\u306B\u5165\u308A\u3053\u3080\u3002</strong>\n\n\u4ECA\u65E5\u3082\u3044\u308B\u3088\u306D\u2026\u2026\uFF1F\n\u304A\u30FC\u3044\u3001\u3069\u3053\u3060\u3044\u3002\u3053\u3063\u3061\u304B\u306A\u3002\u3042\u3063\u3061\u304B\u306A\uFF1F\n\u3042\u3001\u2026\u2026\u307F\u3044\u3064\u3051\u305F\uFF1F\n\n\u3048\u3063\u8AB0"
  },
  {
    label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u5E30\u9084\u8005\u8B70\u4E8B\u300D\uFF08\u5C11\u5E74\uFF21/\u30DB\u30E9\u30FC\uFF09",
    csid: "time_t48",
    face_id: "t48",
    say_0: "<strong>\uFF08\u7740\u4FE1\u97F3\uFF09</strong>\n\n\u3046\u3047\u3001\u7D61\u307E\u308C\u3066\u308B\uFF1F\n\u8A00\u8449\u901A\u3058\u3066\u306A\u3044\u306A\u30FC\u3002\u524A\u9664\u524A\u9664\u3002\u30CF\u30CF\u30CF\n\n<strong> \u307D\u3061\u3002\u307D\u3061\u3002\u7C21\u5358\u306A\u64CD\u4F5C\u3092\u3057\u3066\u30B1\u30FC\u30BF\u30A4\u3092\u3057\u307E\u3046\u3002</strong>",
    say_1: "<strong>\uFF08\u7740\u4FE1\u97F3\uFF09</strong>\n\n\u8AB0\u306A\u3093\u3060\u3088\u3002\u4F55\u56DE\u76EE\u3060\u3088\u3002\u30A6\u30B1\u306A\u3044\u3063\u3064\u30FC\u306E\n\n<strong>\uFF08\u7740\u4FE1\u97F3\uFF09</strong>\n\n\u307B\u3093\u3068\u75DB\u3005\u3057\u3044\u304B\u3089\u2026\u3053\u308C\u3001\u3084\u3081\u3066\u2026\n\n<strong>\uFF08\u7740\u4FE1\u97F3\uFF09</strong>\n\n\u3084\u3081\u3066\u3088\u2026\n\n<strong>\uFF08\u7740\u4FE1\u97F3\uFF09</strong>"
  },
  {
    label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u5E30\u9084\u8005\u8B70\u4E8B\u300D\uFF08\u5C11\u5973\uFF21/\u30DB\u30E9\u30FC\uFF09",
    csid: "time_t49",
    face_id: "t49",
    say_0: "\u6B21\u306F\u79C1\u306E\u9806\u756A\u306D\u3002\u3053\u306E\u6559\u5BA4\u3067\u3001\u307B\u3093\u3068\u3046\u306B\u3042\u3063\u305F\u306F\u306A\u3057\u3002\n\n\u3042\u308B\u5973\u306E\u5B50\u3092\u7121\u8996\u3059\u308B\u3068\u6C7A\u3081\u305F\u3053\u3068\u304C\u3042\u308B\u306E\u3002\u7D66\u98DF\u306E\u3068\u304D\u3001\u30C8\u30A4\u30EC\u3001\u79FB\u52D5\u6559\u5BA4\u3001\u653E\u8AB2\u5F8C\u3082\u3002\n\u3084\u304C\u3066\u3001\u305D\u306E\u5B50\u306F\u6559\u5BA4\u306E\u771F\u3093\u4E2D\u3067\u3001\u6B7B\u3093\u3067\u3057\u307E\u3044\u307E\u3059\u3002\u9ED2\u677F\u306B\u306F\u8840\u7CCA\u3067\u3073\u3063\u3057\u308A\u3001\u6068\u307F\u8A00\u304C\u66F8\u304B\u308C\u3066\u3044\u308B\u306E\u3002\n\n\u305D\u308C\u304B\u3089\u306F\u540C\u3058\u6559\u5BA4\u3067\u3001\u4ECA\u5EA6\u306F\u9996\u3092\u540A\u3063\u305F\u308A\u3001\u8840\u5857\u308C\u306B\u306A\u3063\u305F\u308A\u3001\u98DB\u3073\u964D\u308A\u305F\u308A\u3059\u308B\u4EBA\u304C\u76F8\u6B21\u3050\u305D\u3046\u3088\u2026",
    say_1: "\u305D\u306E\u8ABF\u5B50\u3088\u2026\u300A\u4EBA\u72FC\u300B\u3002\u983C\u3093\u3060\u901A\u308A\u3001\u304A\u9858\u3044\u2026\n\u305D\u3057\u3066\u2026\u6700\u5F8C\u306B\u2026\u546A\u3044\u3092\u2026\u304B\u3051\u308B\u2026\n\n<strong>\u75D9\u6523\u3057\u306A\u304C\u3089\u3082\u9ED2\u677F\u307E\u3067\u9019\u3044\u305A\u308B\u3068\u3001\u50B7\u304B\u3089\u3042\u3075\u308C\u308B\u8840\u3092\u5857\u308A\u4ED8\u3051\u3001\u6587\u5B57\u3092\u7DB4\u308B\u3002</strong>\n\n\u3053\u308C\u3067\u3001\u79C1\u306E\u756A\u306F\u3001\u304A\u308F\u308A\u3002\n\u6B21\u306F\u3001\u2026\u30AA\u30DE\u30A8\u30C0\u2026\uFF01"
  },
  {
    label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u5E30\u9084\u8005\u8B70\u4E8B\u300D\uFF08\u30C8\u30B7\u30DF\uFF09",
    csid: "time_t21",
    face_id: "t21",
    say_0: "\u305D\u308C\u306F\u826F\u3044\u306E\u3067\u3059\u3088\u3002\u30C7\u30EA\u30FC\u30FB\u30D4\u30E9\u30A2\u304C\u6652\u3055\u308C\u3001\u6B20\u3051\u7D9A\u3051\u3066\u306F\u3044\u307E\u3059\u304C\u3001\u307E\u3060\u516B\u3064\u306E\u672A\u77E5\u8CE2\u304C\u5065\u5728\u306A\u306E\u3067\u3059\u3002\u3084\u304C\u3066\u60AA\u3057\u304D\u5927\u81E3\u3092\u8A85\u6EC5\u3059\u308B\u3053\u3068\u3082\u53F6\u3046\u3002\u3051\u308C\u3069\u3001\u5FA1\u5E30\u9084\u306B\u6210\u3089\u308C\u308B\u305D\u306E\u65E5\u307E\u3067\u3001\u7121\u6182\u82B1\u3092\u8B77\u6301\u3059\u308B\u3053\u3068\u306F\u3001\u306A\u306B\u3054\u3068\u306B\u3082\u66FF\u3048\u3089\u308C\u307E\u305B\u3093\u3002\n\u4E07\u4E00\u306B\u3082\u30C0\u30EB\u30DE\u304C\u6B20\u3051\u3066\u3057\u307E\u3048\u3070\u3001\u4ECA\u65E5\u307E\u3067\u965B\u4E0B\u306B\u304A\u4ED5\u3048\u3057\u3066\u304D\u305F\u610F\u5473\u3082\u308D\u3068\u3082\u3001\u6B20\u843D\u3057\u3066\u5931\u308F\u308C\u308B\u306E\u3067\u3059\u3002\n\n\u3067\u306F\u2026\u2026\u679C\u65AD\u306A\u51E6\u7F6E\u3092\u3002",
    say_1: "\u2026\u2026\u672C\u6765\u306A\u3089\u6211\u7B49\u306F\u79D8\u4E2D\u306E\u79D8\u3002\u65AF\u69D8\u306A\u4E9B\u4E8B\u3067\u5F92\u3089\u306B\u516D\u9053\u3092\u8CBB\u3084\u3055\u305A\u3001\u308F\u305F\u3057\u4E00\u4EBA\u3067\u6E08\u307E\u305B\u3089\u308C\u305D\u3046\u3067\u3059\u306D\u3002\n\n\u3082\u3057\u3082\u3057\u3001\u30C8\u30B7\u30DF\u3067\u3059\u3002\u3084\u3063\u3071\u308A\u65E9\u304F\u5E30\u308C\u305D\u3046\u3060\u3057\u6669\u5FA1\u98EF\u3001\u308F\u305F\u3057\u4F5C\u308B\u306D\u3002\u4E5D\u5473\u7CA5\u306E\u6B8B\u308A\u3064\u304B\u3063\u3061\u3083\u3044\u307E\u3059\u3002\u3000\u30D4\u30C3\n\n\u3055\u3066\u3001\u5915\u9909\u307E\u3067\u306B\u6E08\u307E\u305B\u306A\u3044\u3068\u2015\u2015"
  },
  {
    label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u5E30\u9084\u8005\u8B70\u4E8B\u300D\uFF08\u30CA\u30AA\u30B7\u30B2\uFF09",
    csid: "time_t80",
    face_id: "t80",
    say_0: "\u304A\u306F\u3088\u3046\u3001\u305D\u3057\u3066\u304A\u3081\u3067\u3068\u3046\u3002\u7740\u9678\u3060\u3002\n\u8AF8\u541B\u306F\u3053\u3053\u3067\u81EA\u5206\u3089\u8B77\u885B\u3068\u5225\u308C\u3001\u7528\u610F\u3057\u305F\u6751\u306B\u79FB\u4F4F\u3059\u308B\u3002\u4E57\u7269\u3082\u3042\u308B\u304C\u3001\u6B69\u3044\u3066\u3082\u884C\u3051\u308B\u3060\u308D\u3046\u3002\n\n\u305D\u308C\u304B\u3089\u5F53\u6A5F\u306F\u6700\u5BC4\u308A\u306E\u6226\u5834\u3067\u56FD\u7C4D\u4E0D\u660E\u6A5F\u306B\u6483\u589C\u3055\u308C\u3001\u3059\u3079\u3066\u306E\u8A3C\u62E0\u3068\u3068\u3082\u306B\u6226\u5834\u306E\u7159\u3068\u306A\u308B\u3002\n\u4EE5\u4E0A\u3060\u3002\u8CEA\u554F\u306F\uFF1F\n\n\u8AF8\u541B\u306E\u4EA1\u547D\u304C\u4E0A\u624B\u304F\u884C\u304F\u3088\u3046\u7948\u3063\u3066\u3044\u308B\u3088\u3002",
    say_1: "\u3084\u3042\uFF01\u307E\u3060\u3053\u3093\u306A\u3068\u3053\u308D\u306B\u3044\u305F\u306E\u304B\uFF01\uFF1F\u3082\u3046\u3059\u3050\u96E2\u9678\u3060\u305E\uFF01\n\n\u2026\u3059\u307E\u306A\u3044\u3001\u30A8\u30F3\u30B8\u30F3\u97F3\u3067\u805E\u304D\u53D6\u308C\u306A\u304B\u3063\u305F\u3093\u3060\u3002\u3082\u3046\u4E00\u5EA6\u8A00\u3063\u3066\u3082\u3089\u3048\u308B\uFF1F"
  }
];
var chr_job3 = [
  {
    face_id: "c10",
    job: "\u5C0F\u9283\u5354\u4F1A"
  },
  {
    face_id: "t01",
    job: "\u53CB\u611B\u7D44\u5408"
  },
  {
    face_id: "t02",
    job: "\u5E78\u904B\u306E\u79D1\u5B66"
  },
  {
    face_id: "t03",
    job: "FSM\u56E3"
  },
  {
    face_id: "t04",
    job: "\u622A\u62F3\u9053"
  },
  {
    face_id: "t05",
    job: "\u958B\u653E\u7684\u5E02\u6C11"
  },
  {
    face_id: "c09",
    job: "\u6697\u6BBA\u6559\u56E3"
  },
  {
    face_id: "t06",
    job: "\u6B7B\u306D\u6B7B\u306D\u56E3"
  },
  {
    face_id: "t07",
    job: "\u52E7\u5584\u61F2\u60AA\u59D4"
  },
  {
    face_id: "t08",
    job: "\u8986\u9762\u5AC9\u59AC\u56E3"
  },
  {
    face_id: "t09",
    job: "\u533F\u540D\u8ECD\u56E3"
  },
  {
    face_id: "t10",
    job: "\u55B6\u5229\u653F\u5E9C"
  },
  {
    face_id: "t11",
    job: "\u9DF9\u306E\u722A\u56E3"
  },
  {
    face_id: "t12",
    job: "\u5730\u4E0B\u9244\u9053"
  },
  {
    face_id: "t13",
    job: "MNU\u6A5F\u95A2"
  },
  {
    face_id: "t14",
    job: "\u732B\u306E\u96C6\u4F1A"
  },
  {
    face_id: "t15",
    job: "\u5C11\u5E74\u63A2\u5075\u56E3"
  },
  {
    face_id: "t16",
    job: "\u5B89\u5168\u4FDD\u969C\u5C40"
  },
  {
    face_id: "t17",
    job: "\u8594\u8587\u2234\u5341\u5B57"
  },
  {
    face_id: "t18",
    job: "\u767D\u9280\u2234\u79D8\u661F"
  },
  {
    face_id: "t19",
    job: "\u8056\u6226\u58EB\u52DF\u96C6"
  },
  {
    face_id: "t20",
    job: "MI:18"
  },
  {
    face_id: "t21",
    job: "\u4E5D\u672A\u77E5\u4F1A"
  },
  {
    face_id: "t22",
    job: "\u5B66\u5712\u7279\u8B66"
  },
  {
    face_id: "t23",
    job: "\u5B64\u9AD8\u5929\u4F7F\u9023\u5408",
    comment: "\u7531\u6765\uFF1A\u30BD\u30ED\u30FB\u30A8\u30F3\u30B8\u30A7\u30EB\u30BA\u30FB\u30E2\u30FC\u30BF\u30FC\u30B5\u30A4\u30AF\u30EB\u30AF\u30E9\u30D6"
  },
  {
    face_id: "t24",
    job: "\u30C8\u30EC\u30FC\u30B5\u30FC"
  },
  {
    face_id: "t25",
    job: "2.14\u9769\u547D\u6A5F\u69CB"
  },
  {
    face_id: "t26",
    job: "\u6CD5\u9686\u5BFA"
  },
  {
    face_id: "t27",
    job: "\u786F\u53CB\u793E"
  },
  {
    face_id: "t28",
    job: "\u6A2B\u306E\u6A39\u306E\u5B50\u3089",
    comment: "\u7531\u6765\uFF1A\u30E9\u30A4\u30D6\u30AA\u30FC\u30AF\u30DC\u30FC\u30A4\u30BA"
  },
  {
    face_id: "t29",
    job: "\u900F\u660E\u5973\u5B50\u4F1A"
  },
  {
    face_id: "t30",
    job: "\u65C5\u56E3\u2721\u8098\u7B20\u96E8",
    comment: "\u7531\u6765\uFF1A\u30B7\u30E3\u30EF\u30FC\u30D1\u30B7"
  },
  {
    face_id: "t31",
    job: "\u5475\u5475\u8001\u4F1A"
  },
  {
    face_id: "t32",
    job: "\u5B89\u5168\u8ABF\u67FB\u5C40"
  },
  {
    face_id: "t33",
    job: "\u4EA1\u547D\u540C\u76DF"
  },
  {
    face_id: "t34",
    job: "\u5927\u9283\u5354\u4F1A"
  },
  {
    face_id: "t35",
    job: "\u7D05\u5BA2\u9023\u76DF"
  },
  {
    face_id: "t36",
    job: "PPP",
    comment: "\u7531\u6765\uFF1AKKK\u3066\u304D\u306A\u4F55\u304B\u3002"
  },
  {
    face_id: "t37",
    job: "\u7D20\u9854\u9023\u76DF",
    comment: "\u7531\u6765\uFF1A\u56FD\u8A9E\u306E\u6559\u79D1\u66F8\u300C\u7D20\u9854\u540C\u76DF\u300D\u304B\u3089\u3002"
  },
  {
    face_id: "t38",
    job: "\u5317\u5F8C\u5BB6\u8718\u86DB\u4F1A",
    comment: "\u7531\u6765\uFF1A\u4EBA\u306E\u6B7B\u306A\u306A\u3044\u63A8\u7406\u5C0F\u8AAC\u300E\u9ED2\u5F8C\u5BB6\u8718\u86DB\u306E\u4F1A\u300F\u306E\u305D\u3070\u306B"
  },
  {
    face_id: "t39",
    job: "\u9EC4\u91D1\u2234\u9ECE\u660E",
    comment: "\u305D\u308D\u305D\u308D\u8056\u6226\u58EB\u304C\u6B32\u3057\u304B\u3063\u305F\uFF01"
  },
  {
    face_id: "t40",
    job: "\u4E00\u676F\u3068\u81EA\u7531",
    comment: "\u7531\u6765\uFF1A\u30ED\u30B7\u30A2\u7D50\u793E\u300C\u571F\u5730\u3068\u81EA\u7531\u300D"
  },
  {
    face_id: "t41",
    job: "\u5E38\u4E16\u5036\u697D\u90E8",
    comment: "\u7531\u6765\uFF1A\u30DC\u30D8\u30DF\u30A2\u30F3\u30AF\u30E9\u30D6"
  },
  {
    face_id: "t42",
    job: "\u67B6\u7A7A\u60D1\u661F",
    comment: "\u7531\u6765\uFF1A\u30BE\u30EB\u30BF\u30AF\u30B9\u30BC\u30A4\u30A2\u30F3"
  },
  {
    face_id: "t43",
    job: "\u5B63\u7BC0\u5DE1\u56DE",
    comment: "\u7531\u6765\uFF1A\u5B63\u7BC0\u5354\u4F1A\u3068\u304B\u5B63\u7BC0\u793E"
  },
  {
    face_id: "t44",
    job: "\u4E03\u661F\u62F3",
    comment: "\u7531\u6765\uFF1A\u56DE\u6559\u5F92\u306E\u4E2D\u56FD\u6B66\u8853"
  },
  {
    face_id: "t45",
    job: "\u660E\u4EC4\u2234\u6681\u661F",
    comment: "\u7531\u6765\uFF1A\u66D9\u306E\u661F"
  },
  {
    face_id: "t46",
    job: "\u9769\u795E\u4F1A",
    comment: "\u7531\u6765\uFF1A\u683C\u795E\u4F1A"
  },
  {
    face_id: "t47",
    job: "\u8056\u611B\u8272\u540C\u80DE",
    comment: "\u7531\u6765\uFF1A\u8056\u767D\u8272\u540C\u80DE\u56E3"
  },
  {
    face_id: "t48",
    job: "\u5C11\u5E74"
  },
  {
    face_id: "t49",
    job: "\u5C11\u5973"
  },
  {
    face_id: "t50",
    job: "\u5929\u9053\u5C45\u58EB",
    comment: "\u7531\u6765\uFF1A\u795E\u9053\u5929\u884C\u5C45"
  },
  {
    face_id: "t51",
    job: "\u5730\u9053\u5C45\u58EB",
    comment: "\u7531\u6765\uFF1A\u795E\u9053\u5929\u884C\u5C45"
  },
  {
    face_id: "t52",
    job: "\u5FD8\u6211\u5171\u540C\u4F53",
    comment: "\u5B66\u6821\u3067\u5730\u5473\u306B\u7121\u500B\u6027\u306B\u632F\u821E\u3046\u7684\u306A\u2026"
  },
  {
    face_id: "t53",
    job: "\u72EC\u5C0A\u968A",
    comment: "\u7531\u6765\uFF1A\u30B3\u30FC\u30B5\u30FB\u30CE\u30B9\u30C8\u30E9\u300C\u308F\u308C\u3089\u306E\u3082\u306E\u300D"
  },
  {
    face_id: "t54",
    job: "\u5B87\u5B99\u539F\u7406\u8846",
    comment: "\u7531\u6765\uFF1A\u5B87\u5B99\u5143\u59CB\u795E\u6559"
  },
  {
    face_id: "t55",
    job: "\u9244\u8840\u306E\u798F\u97F3",
    comment: "\u7531\u6765\uFF1A\u6804\u5149\u306E\u798F\u97F3\u30AD\u30EA\u30B9\u30C8\u6559\u56E3"
  },
  {
    face_id: "t56",
    job: "\u4E00\u5207\u4E00\u9580",
    comment: "\u7531\u6765\uFF1A\u4E00\u5207\u5B97"
  },
  {
    face_id: "t57",
    job: "\u5171\u4FE1\u306E\u53CB",
    comment: "\u7531\u6765\uFF1A\u540C\u4FE1\u306E\u53CB\uFF08\u30D6\u30CA\u30A4\u30FB\u30D6\u30EA\u30B9\uFF09"
  },
  {
    face_id: "t58",
    job: "\u771F\u5411\u4E00\u6C17",
    comment: "\u7531\u6765\uFF1A\u4E00\u5411\u4E00\u63C6"
  },
  {
    face_id: "t59",
    job: "\u591C\u7B11\u56FD",
    comment: "\u7531\u6765\uFF1A\u53E4\u4EE3\u306E\u591C\u90CE\u56FD\u3002\u591C\u90CE\u81EA\u5927\u306E\u6545\u4E8B\u6210\u8A9E\u306E\u5143"
  },
  {
    face_id: "t60",
    job: "\u5927\u592A\u5200\u6E90\u6D41",
    comment: "\u7531\u6765\uFF1A\u793A\u73FE\u6D41"
  },
  {
    face_id: "t61",
    job: "\u611A\u9023\u968A",
    comment: "\u7531\u6765\uFF1A\u4E00\u822C\u540D\u8A5E\u306E\u611A\u9023\u968A"
  },
  {
    face_id: "t62",
    job: "\u982D\u84CB\u9AA8\u3068\u9AA8",
    comment: "\u7531\u6765\uFF1A\u30B9\u30AB\u30EB\uFF06\u30DC\u30FC\u30F3\u30BA"
  },
  {
    face_id: "t63",
    job: "\u671D\u8336\u4F1A",
    comment: "\u7531\u6765\uFF1A\u671D\u6D3B\u3002\u671D\u8336\u3092\u3059\u308B\u96C6\u307E\u308A\u3001\u307F\u305F\u3044\u306A\u30A4\u30E1\u30FC\u30B8\u3067\u3059\u3002"
  },
  {
    face_id: "t64",
    job: "\u98DF\u990A\u4F1A",
    comment: "\u7531\u6765\uFF1A\u98DF\u990A\u4F1A\uFF08\u307E\u307E\uFF09"
  },
  {
    face_id: "t65",
    job: "\u5553\u660E\u7D50\u793E",
    comment: "\u7531\u6765\uFF1A\u30A4\u30EB\u30DF\u30CA\u30C6\u30A3"
  },
  {
    face_id: "t66",
    job: "\u66F4\u306A\u308B\u524D\u9032",
    comment: "\u7531\u6765\uFF1APLUS ULTRA"
  },
  {
    face_id: "t67",
    job: "\u9818\u4E8B\u88C1\u5224\u6240",
    comment: "\u7531\u6765\uFF1A\u6A2A\u6D5C\u82F1\u56FD\u9818\u4E8B\u88C1\u5224\u6240"
  },
  {
    face_id: "t68",
    job: "\u5929\u6587\u5B66\u4F1A",
    comment: "\u7531\u6765\uFF1A\u516C\u76CA\u793E\u56E3\u6CD5\u4EBA \u65E5\u672C\u5929\u6587\u5B66\u4F1A"
  },
  {
    face_id: "t69",
    job: "\u6821\u5EAD\u756A\u9577",
    comment: "\u7531\u6765\uFF1A\u756A\u9577\u5B66\u5712\uFF01\uFF08TRPG\uFF09"
  },
  {
    face_id: "t70",
    job: "\u30E9\u30D7\u30BF\u30FC",
    comment: "\u7531\u6765\uFF1A\u4E2D\u4E16\u304B\u3089\u7D9A\u304F\u3001\u30ED\u30B7\u30A2\u306E\u7403\u6280"
  },
  {
    face_id: "t71",
    job: "\u6708\u5149\u5B66\u4F1A",
    comment: "\u7531\u6765\uFF1A\u30EB\u30CA\u30FB\u30BD\u30B5\u30A4\u30A8\u30C6\u30A3"
  },
  {
    face_id: "t72",
    job: "\u516C\u5B89\u90E8",
    comment: "\u7531\u6765\uFF1A\u516C\u5B89\u8B66\u5BDF"
  },
  {
    face_id: "t73",
    job: "\u4F1A\u5802\u9577\u8001\u4F1A",
    comment: "\u7531\u6765\uFF1A\u30B5\u30F3\u30D8\u30C9\u30EA\u30F3"
  },
  {
    face_id: "t74",
    job: "\u30AB\u30DF\u30CA\u30EA\u65CF",
    comment: "\u7531\u6765\uFF1A\u30DE\u30D5\u30E9\u30FC\u6539\u9020\u8ECA\u3067\u306E\u7206\u97F3\u8D70\u884C"
  },
  {
    face_id: "t75",
    job: "\u73CA\u745A\u5BAE\u9023\u90A6",
    comment: "\u7531\u6765\uFF1A\u6D77\u5E95\u90FD\u5E02\u3001\u51B7\u6CC9\u5C71\u9F8D\u5BAE\u5BFA\u3001\u516B\u5C3E\u6BD4\u4E18\u5C3C\u4F1D\u8AAC"
  },
  {
    face_id: "t76",
    job: "R\u56E3",
    comment: "\u306A\u3093\u3060\u304B\u3093\u3060\u3068\u805E\u304B\u308C\u305F\u3089\u3001\u7B54\u3048\u3066\u3042\u3052\u308B\u4EBA\u9054"
  },
  {
    face_id: "t77",
    job: "\u4FFA\u306B\u6C17\u304C\u3042\u308B",
    comment: "\u3044\u3084\u3001\u4FFA\u3060\u3088\u3002\u3044\u3084\u3044\u3084\u3001\u4FFA\u3060\u3063\u3066\u3002\u3044\u3084\u301C\u3001\u4FFA\u3060\u308D\u3046\uFF1F"
  },
  {
    face_id: "t78",
    job: "\u8AF8\u845B\u516B\u5366\u6751",
    comment: "\u5FA1\u5148\u7956\u69D8\u304C\u8D64\u58C1\u3092\u3084\u304D\u3064\u304F\u3057\u307E\u3057\u305F\u3002"
  },
  {
    face_id: "t79",
    job: "\u8D85\u5FC3\u7406\u5B66\u4F1A",
    comment: "parapsychology."
  },
  {
    face_id: "t80",
    job: "EO LLC",
    comment: "Executive Outcomes Limited Liability Company. EO(1989\u301C1998)\u89E3\u6563\u5F8C\u306A\u3093\u304B\u9811\u5F35\u308A\u304C\u3042\u3063\u305F\u8A2D\u5B9A\u3067\u3002"
  },
  {
    face_id: "t81",
    job: "\u592A\u967D\u795E\u6BBF",
    comment: "\u7531\u6765\uFF1A\u592A\u967D\u4F1D\u8AAC\u56FD\u969B\u9A0E\u58EB\u56E3"
  },
  {
    face_id: "t82",
    job: "\u5B50\u3069\u3082\u98DF\u5802",
    comment: "\u7531\u6765\uFF1A\u6C17\u307E\u3050\u308C\u516B\u767E\u5C4B\u3060\u3093\u3060\u3093 \u3053\u3069\u3082\u98DF\u5802 \u3000\u306A\u3069"
  },
  {
    face_id: "t83",
    job: "\u30CB\u30D3\u30EB\u661F",
    comment: "\u7531\u6765\uFF1A\u67B6\u7A7A\u306E\u60D1\u661F"
  },
  {
    face_id: "t84",
    job: "\u9ED2\u3044\u53D6\u5F15\u5148",
    comment: "\u7531\u6765\uFF1A\u9ED2\u5E47\u3002\u3059\u3053\u3057\u3075\u308F\u3063\u3068\u3057\u305F\u8A00\u8449\u3002"
  },
  {
    face_id: "t85",
    job: "\u767D\u83CA\u4F1A",
    comment: "\u7531\u6765\uFF1A\u767D\u83CA\u907A\u65CF\u4F1A\u3002\u7BE4\u5FD7\u732E\u4F53\u7D44\u7E54\u306E\u767D\u83CA\u4F1A\u3067\u3082\u307E\u3042\u3002\u3088\u3057\u3002"
  },
  {
    face_id: "t86",
    job: "\u4EBA\u5DE5\u77E5\u80FD\u7814",
    comment: "\u7531\u6765\uFF1A\u4EBA\u5DE5\u77E5\u80FD\u7814\u7A76\u6240\uFF08MIT, \u3064\u304F\u3070\u5927\u5B66, \u30C9\u30EF\u30F3\u30B4\u306A\u3069\uFF09"
  },
  {
    face_id: "t87",
    job: "CC",
    comment: "\u7531\u6765\uFF1A2001/12/22 \u4F53\u7D30\u80DE\u30AF\u30ED\u30FC\u30F3\u732B\u8A95\u751F"
  },
  {
    face_id: "t88",
    job: "\u502B\u7406\u59D4\u54E1\u4F1A",
    comment: "\u5B57\u9762\u306E\u30D1\u30EF\u30FC\u306B\u60DA\u308C\u3066\u3002\u3044\u3061\u304A\u3046\u7531\u6765\uFF1A\u81E8\u5E8A\u7814\u7A76\u306E\u5BE9\u67FB\u6A5F\u95A2"
  },
  {
    face_id: "t89",
    job: "\u6642\u9593\u8CAF\u84C4\u9280\u884C",
    comment: "\u7531\u6765\uFF1A\u30DF\u30D2\u30E3\u30A8\u30EB\u30FB\u30A8\u30F3\u30C7\u306E\u5150\u7AE5\u6587\u5B66"
  },
  {
    face_id: "t90",
    job: "ASIOS",
    comment: "\u7531\u6765\uFF1A\u8D85\u5E38\u73FE\u8C61\u306E\u61D0\u7591\u7684\u8ABF\u67FB\u306E\u305F\u3081\u306E\u4F1A"
  },
  {
    face_id: "t91",
    job: "\u9B3C\u9762\u515A",
    comment: "\u7531\u6765\uFF1A\u95A2\u6771\u9023\u5408\u5185\u90E8\u306E\u30B0\u30EB\u30FC\u30D7"
  },
  {
    face_id: "t92",
    job: "\u7DBF\u6D25\u898B\u6559\u4F1A",
    comment: "\u6D77\u795E\uFF08\u308F\u305F\u3064\u307F\uFF09\u304C\u300C\u5927\u304D\u306A\u5B97\u6559\u300D\u306B\u6539\u5B97\u3057\u305F\u611F\u3058\u3067\u3002\u5927\u516B\u6D32\u56FD\u3067\u3082\u5929\u7167\u72FC\u306E\u5B50\u3089\u304C\u4ECF\u9053\u306B\u5E30\u4F9D\u3057\u305F\u3063\u3066\u3044\u3046\u3057\u3002"
  },
  {
    face_id: "t93",
    job: "Holy Arkham!",
    comment: "M\u5927\u65E5\u672C\u6821\u3067\u306F\u3001\uFF13\u5E74\u6642\u306B\u30DE\u30B5\u30C1\u30E5\u30FC\u30BB\u30C3\u30C4\u5DDE\u306B\u3042\u308B\u672C\u6821\u306B\u7559\u5B66\u3059\u308B\u5236\u5EA6\u304C\u3042\u308A\u3001\u5F7C\u7B49\u306F\u5C06\u6765\u306E\u30D6\u30ED\u30FC\u30C9\u30A6\u30A7\u30A4\u3092\u5922\u898B\u308B\u306E\u3060\u3002"
  },
  {
    face_id: "t94",
    job: "Holy Arkham!",
    comment: "M\u5927\u65E5\u672C\u6821\u3067\u306F\u3001\uFF13\u5E74\u6642\u306B\u30DE\u30B5\u30C1\u30E5\u30FC\u30BB\u30C3\u30C4\u5DDE\u306B\u3042\u308B\u672C\u6821\u306B\u7559\u5B66\u3059\u308B\u5236\u5EA6\u304C\u3042\u308A\u3001\u5F7C\u7B49\u306F\u5C06\u6765\u306E\u30D6\u30ED\u30FC\u30C9\u30A6\u30A7\u30A4\u3092\u5922\u898B\u308B\u306E\u3060\u3002"
  },
  {
    face_id: "t95",
    job: "Holy Arkham!",
    comment: "M\u5927\u65E5\u672C\u6821\u3067\u306F\u3001\uFF13\u5E74\u6642\u306B\u30DE\u30B5\u30C1\u30E5\u30FC\u30BB\u30C3\u30C4\u5DDE\u306B\u3042\u308B\u672C\u6821\u306B\u7559\u5B66\u3059\u308B\u5236\u5EA6\u304C\u3042\u308A\u3001\u5F7C\u7B49\u306F\u5C06\u6765\u306E\u30D6\u30ED\u30FC\u30C9\u30A6\u30A7\u30A4\u3092\u5922\u898B\u308B\u306E\u3060\u3002"
  },
  {
    face_id: "t96",
    job: "\u8B77\u56FD\u8056\u7363",
    comment: "\u304B\u3064\u3066\u30B4\u30B8\u30E9\u3068\u6226\u3063\u305F\u8B77\u56FD\u4E09\u8056\u7363\u3001\u5A46\u7F85\u8B77\u543D\u3001\u6700\u73E0\u7F85\u3001\u9B4F\u6012\u7F85\u306B\u3042\u3084\u304B\u3063\u3066\u3002\u5A46\u7F85\u9640\u9B4F\u5C71\u795E\u306F\u4E09\u8056\u7363\u307B\u3069\u5F37\u529B\u3067\u306F\u306A\u3044\u6C17\u6301\u3061\u3067\u3002"
  },
  {
    face_id: "t97",
    job: "\u9640\u7F85\u5C3C",
    comment: "\u300C\u8A18\u61B6\u3057\u3066\u5FD8\u308C\u306A\u3044\u3002\u300D\u3068\u3044\u3046\u610F\u5473\u306E\u8A00\u8449\u3002"
  },
  {
    face_id: "t98",
    job: "\u5350\u9ED2\u5E1D\u6703\u5350",
    comment: "\u95A2\u6771\u9023\u5408 BLACK \u5350 EMPEROR \u304B\u3089\u3002"
  },
  {
    face_id: "t99",
    job: "\u6697\u9ED2\u821E\u8E0F",
    comment: "\u65E5\u672C\u306E\u524D\u885B\u821E\u8E0F\u5BB6\u304C\u8208\u3057\u305F\u72EC\u7279\u306A\u821E\u8E0F\u306E\u6D41\u308C\u306B\u3064\u3044\u305F\u540D\u524D"
  },
  {
    face_id: "t100",
    job: "\u3044\u3056\u306A\u304E\u6D41",
    comment: "\u9AD8\u77E5\u770C\u306B\u4ECA\u3082\u4F1D\u308F\u308B\u9670\u967D\u5E2B\uFF08\u306E\u6751\uFF09"
  },
  {
    face_id: "t101",
    job: "\u96A3\u4FDD\u73ED",
    comment: "\u4EE4\u548C\u306B\u306A\u304F\u306A\u308B\u3068\u3044\u3044\u3067\u3059\u306D\u3002\u3068\u306A\u308A\u3050\u307F\u3002"
  }
];
var cs_time_default = {
  chr_set: chr_set3,
  chr_npc: chr_npc3,
  chr_job: chr_job3
};

// src/lib/game/json/cs_sf.json
var chr_set4 = {
  _id: "sf",
  admin: "\u9ED2\u4F53\u653E\u5C04\u306E\u30A8\u30F4\u30A7\u30EC\u30C3\u30C8\u89E3\u91C8",
  maker: "\u91CD\u306D\u5408\u305B\u732B\u306E\u30E6\u30CB\u30BF\u30EA\u5909\u63DB",
  label: "\u660E\u5F8C\u65E5\u3078\u306E\u9053\u6A19"
};
var chr_npc4 = [
  {
    label: "\u660E\u5F8C\u65E5\u3078\u306E\u9053\u6A19",
    csid: "SF",
    face_id: "sf04",
    say_0: "\u3068\u305F\u305F\u305F\u305F\u3093\u3063\u3002\n\n<strong>\u3081\u3056\u307E\u3057\u3044\u901F\u3055\u3067\u6728\u306E\u6D1E\u306B\u99C6\u3051\u8FBC\u3080\u3068\u3001\u3058\u3063\u3068\u6F5C\u3093\u3060\u6697\u95C7\u306B\u77B3\u304C\u3075\u305F\u3064\u3002\n\u3044\u3061\u3069\u5927\u597D\u304D\u306A\u9589\u6240\u306B\u53CE\u307E\u308B\u3068\u3001\u305D\u3046\u304B\u3093\u305F\u3093\u306B\u51FA\u3066\u306F\u3053\u306A\u3044\u306E\u3060\u3002</strong>",
    say_1: "\u3061\u3085\u30FC\uFF01\n\n\u3000\u3061\u3085\u30FC\uFF01\n\n<strong>\u304C\u308A\u304C\u308A\u3001\u304C\u308A\u304C\u308A\u3002\u30B1\u30FC\u30B8\u306E\u7E01\u3092\u3072\u3063\u304B\u304F\u3068\u3001\u3046\u308D\u3046\u308D\u3001\u3046\u308D\u3046\u308D\u53F3\u3078\u5DE6\u3078\u99C6\u3051\u56DE\u308B\u3002\u6728\u306E\u6D1E\u306B\u76EE\u3082\u304F\u308C\u305A\u3001\u591C\u4E2D\u3058\u3085\u3046\u8D70\u308A\u7D9A\u3051\u308B\u306E\u3060\u3063\u305F\u2026\u2026</strong>"
  },
  {
    label: "\u660E\u5F8C\u65E5\u3078\u306E\u9053\u6A19\uFF08\u30CA\u30E6\u30BF\uFF09",
    csid: "SF_sf10",
    face_id: "sf10",
    say_0: "f*ck\uFF01\u3000\u307E\u305F\u30C1\u30AA\u30C1\u30E2\u30EA\u30F3\u3068\u4E8C\u9178\u5316\u70AD\u7D20\u5206\u5727\u3060\u3057\uFF01\n\u30A8\u30A2\u30B3\u30F3\u304C\u30B3\u30F3\u30BF\u30DF\u308B\u3057\u30B9\u30BF\u30B0\u308B\u3057f*ck'n\u30AA\u30FC\u30ED\u30E9\u306E\u5B63\u7BC0\u3060\u3057\u3001\u30AC\u30EB\u30BF\u30A4\u30C8\u3082\u30B5\u30AF\u30E9\u30C0\u30A4\u30C8\u3082f*ck'n\u9AD8\u3063\u3051\u30FC\u3057\u2026\n\n<strong>\u540C\u65E5\n\u6574\u5099\u65E5\u8A8C\n\u3000\u5B9A\u671F\u70B9\u691C\u3002\u305F\u3060\u3061\u306B\u5065\u5EB7\u306B\u5F71\u97FF\u306F\u306A\u3044\u304C\u3001\u64E6\u904E\u75D5\u2026</strong>",
    say_1: "\u3088\u30FCf*ck'n\u304A\u307E\u3048\u3089\u3002\n\u30DE\u30B8\u805E\u3051\u3002\u30A8\u30F4\u30A1\u3063\u3066\u3067\u304B\u3044\uFF11\uFF10\u5186\u30AD\u30BA\u898B\u3064\u3051\u305F\u3002\u8AB0\u3060\u3057\uFF1F\n\u30DE\u30B8\u6012\u3093\u306D\u30FC\u304B\u3089\u624B\u3047\u6319\u3052\n\n<strong>\u3077\u3064\u3093</strong>\n\n\u3063\u3068\u3002\u77AC\u505C\u3063\u305F\u2026\u3002f*ck\u3002\n\u3061\u3087\u3063\u3068\u5916\u306E\u69D8\u5B50\u898B\u3066\u304F\u308B\u3002\u4FFA\u306E\u30D7\u30EA\u30F3\u6B8B\u3057\u3068\u3044\u3066\u304F\u308C\u3088\u3002"
  },
  {
    label: "\u660E\u5F8C\u65E5\u3078\u306E\u9053\u6A19\uFF08\u30EF\u30AF\u30E9\u30D0\uFF09",
    csid: "SF_sf032",
    face_id: "sf032",
    say_0: "\u5F85\u3066\u3088\u3002\u3061\u3087\u3063\u3068\u5F85\u3066\u3063\u3066\u3002\n\u60AA\u304B\u3063\u305F\u3063\u3066\u8A00\u3063\u3066\u308B\u3058\u3083\u306A\u3044\u304B\u3002\n\n\u30AA\u30C3\u30B1\u30FC\u3001\u3053\u3046\u3057\u3088\u3046\u3002\n\u51B7\u8535\u5EAB\u3001\uFF12\u6BB5\u76EE\u3060\u3002\u53D6\u308A\u5206\u306F\u5B88\u308C\u3088\u3002\n\u60AA\u3044\u30CB\u30E5\u30FC\u30B9\u306F\u805E\u304D\u305F\u304F\u306A\u3044\u305C\u3001\u307E\u305F\u306A\u3002",
    say_1: "\u5F85\u3066\u5F85\u3066\u5F85\u3066\u3001\u8A71\u3092\u805E\u3044\u3066\u3044\u305F\u306E\u304B\uFF1F\u3000\u305D\u306E\u307E\u3055\u304B\u3060\u3002\n\n\u639F\u306E\uFF13\u756A\u3092\u601D\u3044\u51FA\u305B\uFF01\u3000\u304A\u524D\u306A\u3089\u3084\u308C\u308B\uFF01\u3000\u9811\u5F35\u308B\u3093\u3060\uFF01"
  },
  {
    label: "\u660E\u5F8C\u65E5\u3078\u306E\u9053\u6A19\uFF08\u30E9\u30C3\u30B7\u30FC\u30C9\uFF09",
    csid: "SF_sf01",
    face_id: "sf01",
    say_0: "\u5F85\u305F\u305B\u305F\u306A\uFF01\u307F\u3093\u306A\uFF01\n\u30AE\u30EA\u30AE\u30EA\u3060\u3063\u305F\u3051\u3069\u9593\u306B\u5408\u3063\u305F\u305C\uFF01\n\n\u3053\u308C\u304C\u5FB9\u591C\u3067\u6539\u9020\u3057\u305F\u76F8\u68D2\u306E\u771F\u306E\u59FF\u3001\u540D\u4ED8\u3051\u3066\u30DE\u30B9\u30C6\u30A3\u30DE\u30FB\u30D0\u30FC\u30B9\u30C8\u3060\u3041\u30FC\u3063\uFF01",
    say_1: "\u307E\u305A\u3044\u3001\u30D0\u30C8\u30EB\u30A2\u30EA\u30FC\u30CA\u304C\u72ED\u3059\u304E\u308B\u3093\u3060\u2026\n\u3053\u306E\u307E\u307E\u3058\u3083\u3001\n\n\u304F\u305D\u3063\u3001\u4FDD\u3063\u3066\u304F\u308C\u76F8\u68D2\u3001\u3042\u3068\uFF11\u5206\u3067\u30E1\u30F3\u30C6\u306B\u5165\u308C\u308B\u3093\u3060\u2026\n\n\u3042\u3063"
  },
  {
    label: "\u660E\u5F8C\u65E5\u3078\u306E\u9053\u6A19\uFF08\u9752\u3044\u661F\uFF09",
    csid: "SF_sf041",
    face_id: "sf041",
    say_0: "\u5916\u306E\u4E16\u754C\u3092\u77E5\u308A\u305F\u3044\u3002\u53E4\u6765\u3088\u308A\u3001\u4EBA\u9593\u306E\u3053\u306E\u610F\u6B32\u307B\u3069\u3001\u5927\u304D\u306A\u60C5\u71B1\u306F\u3042\u308A\u307E\u305B\u3093\u3002\n\n\u30E9\u30CB\u30A2\u30B1\u30A2\u306E\u8584\u6697\u3044\u7247\u9685\u306B\u706F\u308B\u77EE\u661F\u3092\u5DE1\u308B\u3053\u306E\u5C0F\u3055\u306A\u5929\u4F53\u306F\u3001\u304A\u304A\u3080\u306DDHMO\u3067\u8986\u308F\u308C\u3066\u3044\u307E\u3059\u3002\n\u3042\u305F\u3089\u3057\u3044\u5B87\u5B99\u4EBA\u304C\u767A\u898B\u3055\u308C\u3066\u4EE5\u6765\u3001\u3053\u306E\u7460\u7483\u8272\u306E\u5730\u7403\u306B\u4EBA\u9593\u306F\u5F15\u304D\u4ED8\u3051\u3089\u308C\u3066\u304D\u307E\u3057\u305F\u3002\n\n\u6570\u4E07\u306B\u306E\u307C\u308B\u81EA\u6CBB\u653F\u5E9C\u6570\u3001\u9577\u5927\u306A\u5909\u5149\u661F\u8DF3\u8E8D\u70B9\u5217\u3001etc\u2026\n\u7169\u96D1\u3055\u306B\u6E80\u3061\u3066\u3044\u308B\u306B\u3082\u304B\u304B\u308F\u3089\u305A\u3001\u3069\u3046\u3057\u3066\u3053\u308C\u307B\u3069\u306E\u6E21\u822A\u8005\u3092\u9B45\u4E86\u3057\u7D9A\u3051\u3066\u304D\u305F\u306E\u3067\u3057\u3087\u3046\u304B\u2015\u2015",
    say_1: "\u5927\u65B9\u306E\u4E88\u60F3\u306B\u53CD\u3057\u3066\u3001\u524D\u89E6\u308C\u306F\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u306F\u3058\u3081\u306B\u751F\u547D\u304C\u5931\u308F\u308C\u3001\u6697\u95C7\u3068\u69CB\u9020\u304C\u5931\u308F\u308C\u305F\u3068\u3055\u308C\u3066\u3044\u307E\u3059\u3002\n\u305D\u3057\u3066\u3001\u4FE1\u4EF0\u3068\u77E5\u8B58\u3068\u3001\u3064\u3044\u306B\u306F\u66B4\u529B\u3055\u3048\u3002\n\n\u3084\u304C\u3066\u3001\u304B\u3064\u3066\u306E\u8CC7\u6E90\u3092\u5F97\u308B\u898B\u8FBC\u307F\u304C\u5931\u308F\u308C\u3066\u3057\u307E\u3048\u3070\u3001\u3053\u306E\u5730\u7403\u3082\u3001\u6A19\u8B58\u306E\u306A\u3044\u5B87\u5B99\u306E\u714C\u304D\u3068\u306A\u308B\u306E\u3067\u3057\u3087\u3046\u3002"
  }
];
var chr_job4 = [
  {
    face_id: "sf01",
    job: "\u901A\u4FE1\u58EB"
  },
  {
    face_id: "sf02",
    job: "\u54F2\u5B66\u8005"
  },
  {
    face_id: "sf03",
    job: "\u9053\u6848\u5185"
  },
  {
    face_id: "sf04",
    job: "\u304A\u6563\u6B69\u968A\u9577"
  },
  {
    face_id: "sf05",
    job: "\u65B0\u88FD\u54C1"
  },
  {
    face_id: "sf06",
    job: "\u58EB\u5B98"
  },
  {
    face_id: "sf07",
    job: "\u904A\u6CF3\u54E1"
  },
  {
    face_id: "sf08",
    job: "\u670D\u98FE\u5546"
  },
  {
    face_id: "sf09",
    job: "\u7814\u4FEE\u751F"
  },
  {
    face_id: "sf10",
    job: "\u4FDD\u5B89\u6280\u5E2B"
  },
  {
    face_id: "sf11",
    job: "\u8247\u9577"
  },
  {
    face_id: "sf12",
    job: "\u5EC3\u795E"
  },
  {
    face_id: "sf13",
    job: "\u6D88\u9632\u968A\u9577"
  },
  {
    face_id: "sf14",
    job: "\u5BFE\u9762\u8CA9\u58F2"
  },
  {
    face_id: "sf15",
    job: "\u5FCD\u8005\u968A"
  },
  {
    face_id: "sf16",
    job: "\u4FDD\u967A\u8ABF\u67FB"
  },
  {
    face_id: "sf17",
    job: "\u5E7D\u9589\u5150"
  },
  {
    face_id: "sf18",
    job: "\u611F\u6027\u5B50"
  },
  {
    face_id: "sf19",
    job: "\u7406\u6027\u5B50"
  },
  {
    face_id: "sf20",
    job: "\u6E2C\u91CF\u58EB"
  },
  {
    face_id: "sf021",
    job: "\u661F\u9593\u5E06\u8D70"
  },
  {
    face_id: "sf022",
    job: "\u9271\u6ED3\u5730\u533A"
  },
  {
    face_id: "sf023",
    job: "\u5730\u4E0B\u8ECC\u9053"
  },
  {
    face_id: "sf024",
    job: "\u5149\u5F69\u697D\u56E3"
  },
  {
    face_id: "sf025",
    job: "\u6551\u661F\u968A"
  },
  {
    face_id: "sf026",
    job: "\u661F\u5148\u6848\u5185"
  },
  {
    face_id: "sf027",
    job: "\u9271\u6ED3\u7687\u5E1D"
  },
  {
    face_id: "sf028",
    job: "\u6EB6\u63A5\u6280\u5E2B"
  },
  {
    face_id: "sf029",
    job: "\u6A5F\u5DE7\u5FCD\u8ECD"
  },
  {
    face_id: "sf030",
    job: "\u9589\u9396\u7BA1\u7406"
  },
  {
    face_id: "sf031",
    job: "\u610F\u5320\u9020\u5F62"
  },
  {
    face_id: "sf032",
    job: "\u9271\u6ED3\u5730\u533A"
  },
  {
    face_id: "sf033",
    job: "\u91CD\u5C64\u57F9\u990A"
  },
  {
    face_id: "sf034",
    job: "\u83EF\u7F8E\u4EBA"
  },
  {
    face_id: "sf035",
    job: "\u9280\u6CB3\u30AE\u30E3\u30EB"
  },
  {
    face_id: "sf036",
    job: "\u597D\u5947\u8A3A"
  },
  {
    face_id: "sf037",
    job: "\u57F7\u884C\u968A"
  },
  {
    face_id: "sf038",
    job: "\u8907\u773C\u30EC\u30D5"
  },
  {
    face_id: "sf039",
    job: "\u79D8\u8853\u8CA9\u58F2"
  },
  {
    face_id: "sf040",
    job: "\u96FB\u934D\u6280\u5E2B"
  },
  {
    face_id: "sf041",
    job: "\u9752\u3044\u661F"
  },
  {
    face_id: "sf042",
    job: "\u9280\u6CB3\u66F3\u822A"
  },
  {
    face_id: "sf043",
    job: "\u5922\u898B\u79FB\u6C11"
  },
  {
    face_id: "sf044",
    job: "\u98DB\u864E\u968A"
  },
  {
    face_id: "sf045",
    job: "\u5F3E\u5E55\u98DB\u7FD4"
  }
];
var cs_sf_default = {
  chr_set: chr_set4,
  chr_npc: chr_npc4,
  chr_job: chr_job4
};

// src/lib/game/json/cs_fable.json
var chr_set5 = {
  _id: "fable",
  admin: "\u6DF7\u6C8C\u306E\u6D77\u306E\u5BDD\u8FD4\u308A",
  maker: "\u65E5\u8F2A\u306E\u714C\u3081\u304D",
  label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u5E7B\u65E5\u4E16\u754C\u300D"
};
var chr_npc5 = [
  {
    label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u5E7B\u65E5\u4E16\u754C\u300D",
    csid: "fable",
    face_id: "f000",
    say_0: "\u304A\u306F\u3088\u3046\u3002\u71BE\u706B\u306E\u5B50\u4F9B\u9054\u3002\n\u5E0C\u671B\u306E\u671D\u306F\u307E\u3060\u3060\u3051\u308C\u3069\u3001\u30DE\u30CA\u3068\u306A\u308A\u3001\u30D1\u30F3\u3068\u306A\u308B\u65E5\u8F2A\u306E\u671D\u304C\u304D\u305F\u3088\u3002\n\n\u3055\u3042\u3001\u6226\u3092\u3088\u305D\u3046\u3002\n\u543E\u3068\u6C5D\u3068\u308F\u304B\u3061\u3042\u3044\u3001\u80B2\u307F\u3001\u5275\u308A\u3001\u611B\u3057\u3066\u751F\u304D\u3088\u3046\u3002",
    say_1: "\u6C5D\u306F\u5927\u5D50\u3092\u8D77\u3053\u305D\u3046\u3068\u3057\u3066\u3044\u308B\u3002\n\u5E0C\u671B\u306F\u305D\u306E\u7BB1\u306B\u306F\u3082\u3046\u306A\u3044\u306E\u3060\u3002\n\n\u3088\u3057\u306A\u3055\u3044\u3002\u9EC4\u660F\u3088\u308A\u3082\u660F\u304D\u8005\u3088\u3002\n\n\u3060\u304C\u3001\u305D\u308C\u3067\u3082\u3002\n\u4FE1\u3058\u3066\u5F85\u3066\u3070\u3001\u304B\u306A\u3089\u305A\u2015\u2015"
  },
  {
    label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u5E7B\u65E5\u4E16\u754C\u300D\uFF08\u30E8\u30B0\u30E9\u30FC\u30B8\uFF09",
    csid: "fable_f1",
    face_id: "f1",
    say_0: "\u9031\u3067\uFF11\uFF10\uFF10\u3060\u3088\u3002\u3046\u3061\u3067\u50CD\u304F\u306A\u3089\u305D\u306E\u304F\u3089\u3044\u306F\u306D\u3002\n\u798F\u5229\u539A\u751F\u306F\u8A17\u5150\u6240\u3001\u98DF\u5802\u3001\u904B\u52D5\u5834\u3001\u793E\u54E1\u5BEE\u3068\u30E1\u30A4\u30C9\u3002\u7D66\u4E0E\u306F\u9031\u6255\u3044\u3002\n\n\u3042\u3089\u3042\u3089\u3001\u3088\u304F\u6CE3\u304F\u5143\u6C17\u306A\u304A\u4ED4\u3055\u3093\u3002\n\u3057\u3063\u304B\u308A\u7A3C\u3044\u3067\u3001\u304D\u3061\u3093\u3068\u98DF\u3079\u3055\u305B\u3066\u3042\u3052\u306A\u3044\u3068\u306D\u3002\n\n\u6700\u521D\u306F\u4E73\u6F3F\u5206\u96E2\u304B\u3089\u899A\u3048\u3066\u3082\u3089\u3044\u307E\u3059\u3088\u3002\u4ED5\u4E8B\u306B\u6163\u308C\u305F\u3089\u716E\u8FBC\u934B\u3001\u30C1\u30FC\u30BA\u4ED5\u8FBC\u307F\u2026",
    say_1: "\u9003\u3052\u308D\u3002\u9003\u3052\u308D\uFF01\u3000\u4ED4\u4F9B\u9054\u3060\u3051\u3067\u3082\u9003\u3052\u308D\uFF01\n\u81EA\u5206\u306E\u4ED4\u3058\u3083\u306A\u304F\u3066\u3082\u3044\u3044\u3001\u3068\u3082\u304B\u304F\u3001\u62B1\u3051\u308B\u3060\u3051\u9023\u308C\u3066\u8D70\u3093\u306A\u3055\u3044\uFF01"
  },
  {
    label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u5E7B\u65E5\u4E16\u754C\u300D\uFF08\u30BD\u30E9\u30F3\u30B8\u30E5\uFF09",
    csid: "fable_f8",
    face_id: "f8",
    say_0: "\u3075\u30FC\u3093\u307E\u30FC\u3064\u3001\u3075\u30FC\u3093\u307E\u30FC\u3064\u3001\u6C34\u8ECA\u5C4B\u3055\u3093\u266A\n\u304A\u7802\u7CD6\u3068\u3001\u30B9\u30D1\u30A4\u30B9\u3068\u3001\u7D20\u6575\u306A\u30E2\u30CE\u306E\u7C89\u3001\u78BE\u3051\u3066\u307E\u3059\uFF1F\n\n\u3084\u3063\u305F\u3042\u266A\n\n\u3072\u3068\u3064\u3060\u3051\u3001\u30AA\u30B0\u30F3\u69D8\u306B\u304A\u4F9B\u3048\u3057\u3066\u2026\u2026\u3002\n\u3053\u306E\u304A\u306B\u304E\u308A\u3001\u304A\u3072\u3068\u3064\u3069\u3046\u305E\u3002\u304A\u793C\u306E\u5370\u3002",
    say_1: "\u2026\u2026\u306F\u30FC\u3001\u9577\u96E8\u3002\u3061\u3063\u3068\u3082\u3084\u307E\u306A\u3044\u306A\u3002\n\u65E5\u304C\u66AE\u308C\u3061\u3083\u3046\u3057\u3001\u8377\u7269\u306F\u304A\u8179\u306B\u304B\u304F\u3057\u3061\u3083\u304A\u3046\u3002\n\n\u3044\u3063\u3071\u3044\u306F\u7528\u610F\u3067\u304D\u306A\u304B\u3063\u305F\u3051\u308C\u3069\u3001\u7D20\u6575\u306B\u81A8\u3089\u3080\u3068\u3044\u3044\u306A\u3042\u3002"
  },
  {
    label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u5E7B\u65E5\u4E16\u754C\u300D\uFF08\u30A4\u30F3\u30C6\u30A3Jr\uFF09",
    csid: "fable_f14",
    face_id: "f14",
    say_0: "\u5730\u30DE\u30C3\u30C8\u306F\u305D\u306E\u307E\u307E\u3067\u3044\u3044\uFF01\n\u5929\u30DE\u30C3\u30C8\u3001\u3082\u30461ft\u4E0B\u3052\u3066\u304F\u308C\uFF01\u3000\u3042\u307E\u308A\u9752\u5929\u4E95\u3058\u3083\u6B7B\u3093\u3058\u307E\u3046\u304B\u3089\u306A\uFF01\n\n\u5F85\u305F\u305B\u305F\u3002\u89B3\u5BA2\u5E2D\u3060\u304C\u3001\u98F2\u307F\u5C4B\u306E\u8ED2\u5148\u304B\u308A\u3066\u3053\u3046\u3001\u56DB\u6BB5\u304F\u3089\u3044\u3053\u3046\u3084\u3063\u3066\u3055\u2026\n\u3068\u3053\u308D\u3067\u3001\u305D\u306E\u4EBA\u72FC\uFF1F\u3000\u4E8B\u4EF6\u3063\u3066\u3044\u3046\u306E\u306F\u3001\u8FD1\u6240\u306A\u306E\u304B\u3002\n\n\u3075\u30FC\u3093\u3002\u305D\u308A\u3083\u4E0D\u5B89\u3060\u3088\u306A\u2026\u2026\n\u3082\u3057\u898B\u3064\u3051\u305F\u3089\u7E1B\u308A\u4E0A\u3052\u3068\u3044\u3066\u3084\u308B\u3088\u3002\u6D6E\u3044\u305F\u50AD\u5175\u4EE3\u3067\u5962\u3063\u3066\u304F\u308C\u3001\u30CF\u30C3\u30CF\u30C3\u30CF",
    say_1: "\u3088\u304A\u3002\u8AB0\u306E\u8178\u3060\u305D\u308C\u3001\u304A\u5F01\u5F53\u4ED8\u3044\u3066\u308B\u305E\uFF1F\n\u300C\u6B21\u306F\u543E\u8F29\u300D\u3063\u3066\u9854\u3060\u305C\u3002\u81EA\u6162\u306A\u306E\u306F\u722A\u304B\uFF1F\u3000\u7259\u304B\uFF1F\n\n\u4E0A\u304C\u3093\u306A\u3002\u571F\u9593\u3058\u3083\u6B7B\u3093\u3058\u307E\u3046\u3002\u98DB\u884C\u6A5F\u6295\u3052\u306E\u8105\u5A01\u3001\u3053\u3053\u3067\u898B\u305B\u3066\u3084\u308B\u3088\u3002"
  },
  {
    label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u5E7B\u65E5\u4E16\u754C\u300D\uFF08\u30CF\u30E9\u30D5\uFF09",
    csid: "fable_f4",
    face_id: "f4",
    say_0: "\u3044\u3089\u3063\u3057\u3083\u3044\u307E\u305B\u3002\n\u3053\u308C\u306F\u3053\u308C\u306F\u3001\u5824\u306E\u5996\u7CBE\u3055\u3093\u2026\u3067\u3059\u3088\u306D\u3002\u9084\u66A6\u306B\u4F59\u308B\u307B\u3069\u306E\u9577\u5BFF\u3092\u751F\u304D\u3001\u6CB3\u5DDD\u3092\u6CBB\u3081\u3001\u5EFA\u7BC9\u3092\u53F8\u308B\u3068\u3044\u3046\u3002\n\u3042\u3001\u3044\u3084\u5931\u793C\u3002\u7D75\u672C\u3067\u8AAD\u3093\u3060\u3053\u3068\u304C\u3002\n\n\u3048\u3048\u78BA\u304B\u306B\u3001\u68EE\u306E\u5165\u308A\u53E3\u306B\u3042\u308B\u5B9A\u790E\u306F\u9AD8\u7956\u6BCD\u306E\u4ED5\u4E8B\u3067\u3059\u3002\n\u3042\u308C\u3092\u6C34\u6E96\u306B\u4E09\u65B9120\u753A\u6B69\u3001\u68EE\u306F\u305D\u306E\u307E\u307E\u3067\u3002\u2026\u78BA\u304B\u306B\u627F\u308A\u307E\u3057\u305F\u3002\u6B21\u306E\u796D\u308A\u306B\u306F\u56F3\u9762\u3092\u304A\u6301\u3061\u3057\u307E\u3059\u3002\n\u305D\u308C\u3068\u3001\u305D\u306E\u3001\u50ED\u8D8A\u3067\u3059\u304C\u2026\u3001\u63E1\u624B\u3092\u3044\u305F\u3060\u3051\u307E\u3059\u304B\uFF1F",
    say_1: "\u81EA\u7E04\u5F35\u308A\u306F\u3053\u3093\u306A\u3068\u3053\u308D\u304B\u3002\u6E80\u6708\u306E\u304A\u304B\u3052\u3067\u6357\u3063\u305F\u3002\n\n\u3055\u3066\u3001\u3053\u308C\u306A\u3089\u4ECA\u65E5\u306E\u5357\u4E2D\u306B\u306F\u6075\u65B9\u3068\u9B3C\u9580\u306E\u5929\u6E2C\u307E\u3067\u3084\u308C\u305D\u3046\u3060\u3002\n\u591C\u660E\u3051\u306B\u306F\u9593\u304C\u3042\u308B\u306A\u3002\u606F\u5B50\u306B\u571F\u7523\u3067\u3082\u62FE\u3063\u3066\u3001\u3044\u3061\u3069\u5E30\u308B\u304B\u3002\n\u305F\u3057\u304B\u305D\u308D\u305D\u308D\u30C6\u30EC\u30D1\u690E\u306E\u6642\u671F\u3060\u3063\u305F\u306F\u305A\u2026\u2026\n\n<strong>\u5FEB\u6674\u306E\u65E5\u5DEE\u3057\u304C\u3001\u6301\u3061\u4E3B\u306E\u3044\u306A\u3044\u30ED\u30FC\u30D7\u3084\u6750\u6728\u3092\u3058\u308A\u3058\u308A\u3068\u7167\u308A\u3064\u3051\u3001\u3084\u304C\u3066\u65E5\u304C\u66AE\u308C\u308B\u3002</strong>"
  }
];
var chr_job5 = [
  {
    face_id: "f000",
    job: "\u65E5\u8F2A\u4EE3\u7406"
  },
  {
    face_id: "f1",
    job: "\u916A\u8FB2\u5BB6"
  },
  {
    face_id: "f2",
    job: "\u7ADC\u9A0E\u5175"
  },
  {
    face_id: "f3",
    job: "\u4E09\u7B49\u5175"
  },
  {
    face_id: "f4",
    job: "\u6E2C\u91CF\u5EA7"
  },
  {
    face_id: "f5",
    job: "\u5B9D\u73E0"
  },
  {
    face_id: "f6",
    job: "\u98DB\u811A\u5EA7"
  },
  {
    face_id: "f7",
    job: "\u516B\u5143\u0283\u222B\u5E72\u6E09"
  },
  {
    face_id: "f8",
    job: "\u30AD\u30F3\u30B8\u30F3"
  },
  {
    face_id: "f9",
    job: "\u985E\u611F\u546A\u8853\u5E2B"
  },
  {
    face_id: "f10",
    job: "\u98DF\u901A\u8679\u86C7"
  },
  {
    face_id: "f11",
    job: "\u30A2\u30E9\u30E9\u30FC\u4F2F"
  },
  {
    face_id: "f12",
    job: "\u9244\u9A0E\u5175"
  },
  {
    face_id: "f13",
    job: "\u7A7A\u633A\u5E06\u8D70"
  },
  {
    face_id: "f14",
    job: "\u708E\u5929\u306E\u96F7\u5149"
  },
  {
    face_id: "f15",
    job: "\u6191\u4F9D\u546A\u8853\u5E2B"
  },
  {
    face_id: "f16",
    job: "\u9244\u9A0E\u5F93\u5175",
    comment: "\u304A\u306B\u3063\u3053\u306F\u5F93\u3046\u7ACB\u5834\u5BC4\u308A\u3002\u307E\u308F\u308A\u306E\u5996\u7CBE\u307F\u305F\u3044\u306A\u3002"
  },
  {
    face_id: "f17",
    job: "\u9CF3\u51F0\u306E\u5B9F",
    comment: "\u5357\u56FD\u306B\u54B2\u304F\u9CF3\u51F0\u6A39\u3092\u30D2\u30F3\u30C8\u306B\u3002"
  },
  {
    face_id: "f18",
    job: "\u7CBE\u7559\u91B8\u9020",
    comment: "\u4EBA\u9593\u306E\u7CBE\u6DB2\u3092\uFF14\uFF10\u65E5\u5BC6\u9589 \uFF0B rectification\uFF08\u7CBE\u7559\uFF09 \uFF0B \u7D14\u7C73\u672C\u91B8\u9020"
  },
  {
    face_id: "f20",
    job: "\u4EF2\u8CB7\u546A\u8853\u5E2B",
    comment: "\u4EF2\u8CB7\u4EBA\u3001\u3060\u3051\u3060\u3068\u8B70\u4E8B\u6A19\u6E96\u306B\u306F\u5404\u5E97\u8217\u304C\u3042\u308B\u3057\u3001\u30E2\u30CE\u306B\u306A\u3089\u306A\u3044\u306E\u3067\u3001\u546A\u8853\u5E2B\u306B\u3057\u3066\u307F\u305F\u3002"
  },
  {
    face_id: "f21",
    job: "\u523B\u5B57\u5EA7"
  },
  {
    face_id: "f22",
    job: "\u9053\u7956\u795E"
  },
  {
    face_id: "f23",
    job: "\u96F2\u6C34"
  },
  {
    face_id: "f24",
    job: "\u8840\u5438\u8338"
  },
  {
    face_id: "f25",
    job: "\u508D\u89B3"
  },
  {
    face_id: "f26",
    job: "\u98E2\u5962\u9AD1\u9ACF"
  },
  {
    face_id: "f27",
    job: "\u6B4C\u821E\u4F0E\u5EA7"
  },
  {
    face_id: "f28",
    job: "\u8FA3\u91A4\u91B8\u9020"
  },
  {
    face_id: "f29",
    job: "\u743A\u746F\u5EA7"
  },
  {
    face_id: "f30",
    job: "\u306C\u3063\u307A\u3063\u307D\u3046"
  },
  {
    face_id: "f31",
    job: "\u7011\u5E03\u6607\u7ADC\u9053"
  },
  {
    face_id: "f32",
    job: "\u5F69\u9784\u5EA7"
  },
  {
    face_id: "f33",
    job: "\u7DB2\u9271\u5EA7",
    comment: "\u30A6\u30A7\u30D6\u3068\u9271\u5E8A\u3092\u6DF7\u305C\u305F\u9020\u8A9E\u3002\u30C1\u30A7\u30A4\u30F3\u30E1\u30A4\u30EB\u4F5C\u308B\u306E\u5F97\u610F\u306A\u30C9\u30EF\u30FC\u30D5\u3066\u304D\u306A"
  },
  {
    face_id: "f34",
    job: "\u6D6E\u7A74\u6CAB\u5A9B",
    comment: "\u6D2A\u6C34\u578B\u5144\u59B9\u59CB\u7956\u795E\u8A71\u3068\u571F\u8718\u86DB\uFF08\u671D\u5EF7\u306B\u5F93\u308F\u306A\u3044\u6C11\uFF09\u304B\u3089"
  },
  {
    face_id: "f35",
    job: "\u8CEA\u8349\u5EA7",
    comment: "\u30DE\u30EC\u30FC\u8A9E\u306E\u30D1\u30B8\u30E3\u30AF\u30AC\u30C0\u30A4\u304C\u8CEA\u5C4B"
  },
  {
    face_id: "f36",
    job: "\u30E9\u30F3\u30BF\u30F3"
  },
  {
    face_id: "fw01",
    job: "\u5C38\u89E3\u4ED9\u9053"
  },
  {
    face_id: "fw02",
    job: "\u594F\u697D\u795E"
  },
  {
    face_id: "fw03",
    job: "\u8B77\u6CD5\u5584\u968A"
  },
  {
    face_id: "fw04",
    job: "\u5FA1\u514D\u682A"
  },
  {
    face_id: "fw05",
    job: "\u7FBD\u5316\u6607\u5929\u9053"
  },
  {
    face_id: "fw06",
    job: "\u7D4C\u51DB\u3005"
  },
  {
    face_id: "fw07",
    job: "\u6069\u8CDC\u795E"
  },
  {
    face_id: "fw08",
    job: "\u5F8C\u795E",
    comment: "\u5F8C\u308D\u9AEA\u3092\u3072\u304D\u3001\u6050\u6016\u5FC3\u3084\u5FC3\u6B8B\u308A\u3092\u8A98\u3046\u81C6\u75C5\u795E"
  }
];
var cs_fable_default = {
  chr_set: chr_set5,
  chr_npc: chr_npc5,
  chr_job: chr_job5
};

// src/lib/game/json/cs_mad.json
var chr_set6 = {
  _id: "mad",
  admin: "\u95C7\u306E\u545F\u304D",
  maker: "\u5929\u4E0A\u306E\u8ABF\u3079",
  label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u72C2\u9A12\u8B70\u4E8B\u300D"
};
var chr_npc6 = [
  {
    label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u72C2\u9A12\u8B70\u4E8B\u300D",
    csid: "mad",
    face_id: "c83",
    say_0: "\u3069\u3046\u305B\u3001\u6BBA\u3055\u308C\u308B\u308F\u307F\u3093\u306A\u3002\u2026\u307F\u3093\u306A\n\n\n<del>\u6B7B\u306D\u3070\u3044\u3044\u306E\u306B</del>",
    say_1: "\uFF11\u4EBA\u306B\u306A\u308B\u306E\u308E\u79C1\u3070\u3063\u304B\u3002\u3069\u3063\u3061\u306E\u9053\u3049\u9078\u3093\u3067\u3082\u3001\n\u79C1\u308E\u5341\u5206\u3067\u3059\u3002\u660E\u65E5\u3082\u5F85\u3063\u3066\u3066\u306D\u3002\u304A\u9858\u3044\u3060\u304B\u3089\u3001\n\u96E2\u308C\u3066\u884C\u304B\u306A\u3044\u3067\uFF1F\n\u3044\u3064\u307E\u3067\u3082\u3001\n\u306A\u3093\u3067\u79C1\u3070\u3063\u304B\n\n<strong>\u65E5\u8A18\u306F\u305D\u3053\u3067\u9014\u5207\u308C\u3001\u767A\u898B\u3055\u308C\u308B\u307E\u3067\u6253\u3061\u6368\u3066\u3089\u308C\u3066\u3044\u305F\u3002</strong>"
  },
  {
    label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u72C2\u9A12\u8B70\u4E8B\u300D\uFF08\u30E4\u30D8\u30A4\uFF09",
    csid: "mad_mad05",
    face_id: "mad05",
    say_0: "\u2026\u3046\u3093\u3002\u3082\u3046\u306A\u3001\u3060\u3044\u3076\u307E\u3048\u3060\u3002\n\u501F\u5BB6\u4F4F\u307E\u3044\u3067\u3055\u3001\u5929\u4E95\u677F\u304C\u305A\u308C\u3066\u3001\u958B\u3044\u3066\u3044\u308B\u304B\u3089\u5165\u308A\u8FBC\u3093\u3067\u307F\u305F\u3093\u3060\u3002\n\n\u7D50\u69CB\u5E83\u304F\u3066\u3055\u3002\u5965\u3078\u3001\u5965\u3078\u3001\u9019\u3044\u9032\u3093\u3067\u305F\u3089\u660E\u304B\u308A\u304C\u5207\u308C\u3066\u3055\u3002\n\u3082\u3046\u53F3\u3082\u5DE6\u3082\u308F\u304B\u3089\u306A\u304F\u3063\u3066\u3055\u3042\u2026\u3002\n\n\u5FC5\u6B7B\u306B\u66B4\u308C\u305F\u3089\u3001\u660E\u308B\u3044\u3068\u3053\u306B\u51FA\u305F\u3002\n\u77E5\u3089\u306A\u3044\u8857\u3060\u3063\u305F\u3002",
    say_1: "\u2026\u3046\u3093\u3002\u305D\u3046\u3060\u3088\u3002\n\u307E\u3060\u3001\u305D\u306E\u8857\u304B\u3089\u51FA\u3089\u308C\u306A\u3044\u3093\u3060\u3002\u304A\u307E\u3048\u3060\u3063\u3066\u3001\u305D\u3046\u306A\u3093\u3060\u308D\u3046\uFF1F\n\n\u3042\u30FC\u3001\u3042\u3063\u3061\u3002\u3044\u3084\u3001\u3053\u3063\u3061\u304B\u3082\uFF1F\n\u305D\u3063\u3061\u306E\u5148\u306F\u307E\u3060\u624B\u7E70\u3063\u3066\u306A\u3044\u304B\u3082\u3057\u308C\u306D\u3048\u3088\uFF1F\n\u30A6\u30B1\u30C3\u3001\u30A6\u30B1\u30C3\u3001\u30A6\u30B1\u30B3\u30C3\u3001\u30A6\u30B3\u30B1\u3001\u30A6\u30B3\u30B1\u3001\u30A6\u30D2\u30E3\u30DB\u3001\u30B3\u30B1\u30B3\u30B1\u30B3\u30B1\uFF01"
  }
];
var chr_job6 = [
  {
    face_id: "c103",
    job: "\u53AD\u4E16\u5BB6"
  },
  {
    face_id: "c83",
    job: "\u8679\u8FFD\u3044"
  },
  {
    face_id: "mad01",
    job: "\u9752\u3044\u9CE5"
  },
  {
    face_id: "mad02",
    job: "\u87FB\u585A\u5D29\u3057"
  },
  {
    face_id: "mad03",
    job: "\u9732\u5E97\u5DE1\u308A"
  },
  {
    face_id: "mad04",
    job: "\u9178\u5473\u63A2\u3057"
  },
  {
    face_id: "mad05",
    job: "\u5929\u4E95\u624B\u7E70\u308A"
  },
  {
    face_id: "mad06",
    job: "\u96A0\u308C\u3093\u574A"
  },
  {
    face_id: "mad07",
    job: "\u65E9\u53E3\u8A00\u8449"
  },
  {
    face_id: "mad08",
    job: "\u5984\u57F7\u306E\u8A93\u3044"
  },
  {
    face_id: "mad09",
    job: "\u96A3\u5E2D\u5EA7\u308A"
  },
  {
    face_id: "mad10",
    job: "\u8FFD\u61B6\u63A2\u308A"
  },
  {
    face_id: "mad11",
    job: "\u4E71\u75F4\u6C17"
  },
  {
    face_id: "mad12",
    job: "\u81EA\u7531\u6ED1\u843D"
  }
];
var cs_mad_default = {
  chr_set: chr_set6,
  chr_npc: chr_npc6,
  chr_job: chr_job6
};

// src/lib/game/json/cs_ger.json
var chr_set7 = {
  _id: "ger",
  admin: "\u95C7\u306E\u545F\u304D",
  maker: "\u99AC\u982D\u7434\u306E\u8ABF",
  label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u5927\u9678\u8B70\u4E8B\u300D"
};
var chr_npc7 = [
  {
    label: "\u30A8\u30AF\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8\u300C\u5927\u9678\u8B70\u4E8B\u300D",
    csid: "ger",
    face_id: "g03",
    say_0: "\u307E\u3055\u304B\u2026\u2026\u3053\u308C\u306F\u2026\u2026\uFF1F\n\n\u771F\u76F8\u304C\u5206\u304B\u3063\u305F\u308F\uFF01\n\u65E5\u304C\u51FA\u305F\u3089\u3059\u3050\u3001\u9E93\u306E\u7686\u306B\u77E5\u3089\u305B\u306A\u3044\u3068\uFF01",
    say_1: "\u98DB\u8ECA\u304C\u2026\u58CA\u308C\u3066\u308B\u2026\u2026\n\u845B\u6A4B\u304C\u2026\u713C\u3051\u3066\u308B\u2026\u2026\n\n\uFF01\u3000\u306A\u3093\u3060\u3001\u732B\u304B\u2026\u2026\u3002\u304A\u3069\u304B\u3055\u306A\u3044\u3067\u3088\u3002\n\u3093\uFF1F"
  }
];
var chr_job7 = [
  {
    face_id: "g01",
    job: "\u4E09\u5143\u9053\u58EB"
  },
  {
    face_id: "g02",
    job: "\u767D\u9DB4\u62F3"
  },
  {
    face_id: "g03",
    job: "\u5439\u725B\u65B9\u58EB"
  },
  {
    face_id: "gc61",
    job: "\u91E3\u308A\u5E2B"
  },
  {
    face_id: "g04",
    job: "\u5FC3\u610F\u516D\u5408\u62F3"
  },
  {
    face_id: "g05",
    job: "\u672C\u8349\u65B9\u58EB"
  },
  {
    face_id: "g06",
    job: "\u5B9D\u98FE\u4EA4\u6613"
  },
  {
    face_id: "g07",
    job: "\u304A\u91DD\u5B50"
  },
  {
    face_id: "g08",
    job: "\u99AC\u9E7F"
  },
  {
    face_id: "g09",
    job: "\u7089\u306E\u756A",
    comment: "\u672B\u3063\u5B50\u306A\u306E\u3067\u3059\u3002\u30E2\u30F3\u30B4\u30EB\u306E\u672B\u5B50\u76F8\u7D9A\u5236\u5EA6\u3067\u306F\u3001\u30AA\u30C3\u30C1\u30AE\u30F3\uFF08\u706B\u306E\u738B\u5B50\u3001\u7089\u306E\u756A\u4EBA\uFF09\u3068\u547C\u3070\u308C\u308B\u3002"
  }
];
var cs_ger_default = {
  chr_set: chr_set7,
  chr_npc: chr_npc7,
  chr_job: chr_job7
};

// src/lib/game/json/cs_changed.json
var chr_set8 = {
  _id: "changed",
  admin: "\u95C7\u306E\u545F\u304D",
  maker: "\u5E83\u5834\u306E\u304A\u544A\u3052",
  label: "\u306F\u304A\u3046\u306E\u5E83\u5834"
};
var chr_npc8 = [
  {
    label: "\u3068\u306E\u3055\u307E\u5E83\u5834",
    csid: "changed",
    face_id: "m08",
    say_0: "\u3058\u3093\u308D\u3046\uFF1F\n\u305D\u3093\u306A\u306A\u307E\u3048\u306E\u3053\u3001\u3044\u305F\u304B\u3057\u3089\u2026\u2026",
    say_1: "\u3055\u3042\u3001\u307C\u3046\u3084\u305F\u3061\u3044\u3089\u3063\u3057\u3083\u3044\u3002\u3054\u306F\u3093\u306E\u3058\u304B\u3093\u3088\u3002"
  },
  {
    _id: "m05",
    label: "\u306F\u304A\u3046\u306E\u5E83\u5834",
    csid: "changed_m05",
    face_id: "m05",
    say_0: "\u30DE\u30DE\uFF1F\u3000\u30DE\u30DE\u306A\u306E\uFF1F\n\u2026\u3082\u3046\u5927\u4E08\u592B\u306A\u306E\uFF1F\u3000\u3053\u3053\u306B\u306F\u4EBA\u72FC\u306A\u3093\u3066\u3044\u306A\u3044\u306E\u304B\u3044\uFF1F\n\n\u2026\u305D\u3063\u304B\u3042\u2026\n\n\n\u4EBA\u72FC\u3060\u3063\u3066\uFF1F\uFF01",
    say_1: "\u8AB0\u306B\u3082\u3001\u8170\u629C\u3051\u306A\u3093\u3066\u2026\u8A00\u308F\u305B\u306A\u3044\u305E\u3063"
  }
];
var chr_job8 = [
  {
    face_id: "b44",
    job: "\u3053\u3042\u304F\u3068\u3046"
  },
  {
    face_id: "b49",
    job: "\u3044\u3057\u304F"
  },
  {
    face_id: "m01",
    job: "\u3088\u3046\u305B\u3044"
  },
  {
    face_id: "m02",
    job: "\u3088\u3046\u305B\u3044"
  },
  {
    face_id: "m03",
    job: "\u3057\u3087\u3046\u3050\u3093"
  },
  {
    face_id: "m04",
    job: "\u3059\u304F\u307F\u305A"
  },
  {
    face_id: "m05",
    job: "\u306F\u304A\u3046"
  },
  {
    face_id: "m06",
    job: "\u304D\u3085\u3046\u3066\u3044\u304C\u304B"
  },
  {
    face_id: "m07",
    job: "\u3053\u3072\u3064\u3058"
  },
  {
    face_id: "m08",
    job: "\u304A\u3075\u304F\u308D\u306E\u3042\u3058"
  },
  {
    face_id: "m09",
    job: "\u3057\u30FC\u3055\u30FC"
  },
  {
    face_id: "m10",
    job: "\u3053\u308D\u307D\u3063\u304F\u308B"
  },
  {
    face_id: "m11",
    job: "\u795E\u8056\u9A0E\u58EB"
  },
  {
    face_id: "m12",
    job: "\u6697\u9ED2\u9A0E\u58EB"
  },
  {
    face_id: "m13",
    job: "\u8ABF\u5F8B\u5E2B"
  },
  {
    face_id: "m14",
    job: "\u5947\u8DE1\u306E\u5B50"
  },
  {
    face_id: "m15",
    job: "\u3073\u3058\u3093"
  },
  {
    face_id: "m16",
    job: "\u308A\u3085\u3046\u304D\u3078\u3044"
  },
  {
    face_id: "m18",
    job: "\u8A18\u53F7\u306E\u5996\u7CBE"
  },
  {
    face_id: "m19",
    job: "\u304A\u3072\u3081\u3055\u307E"
  },
  {
    face_id: "m20",
    job: "\u3052\u307C\u304F"
  },
  {
    face_id: "m99",
    job: "\u304B\u307F\u3055\u307E"
  },
  {
    face_id: "r30",
    job: "\u3072\u3068\u3065\u304B\u3044"
  },
  {
    face_id: "m21",
    job: "\u4E09\u7B49\u5175"
  },
  {
    face_id: "f1-1",
    job: "\u5019\u88DC"
  },
  {
    face_id: "f1-2",
    job: "\u5019\u88DC"
  },
  {
    face_id: "f1-3",
    job: "\u5019\u88DC"
  },
  {
    face_id: "f2-1",
    job: "\u5019\u88DC"
  },
  {
    face_id: "f2-2",
    job: "\u5019\u88DC"
  },
  {
    face_id: "f3-1",
    job: "\u5019\u88DC"
  },
  {
    face_id: "f3-2",
    job: "\u5019\u88DC"
  },
  {
    face_id: "f4-1",
    job: "\u5019\u88DC"
  },
  {
    face_id: "f4-2",
    job: "\u5019\u88DC"
  },
  {
    face_id: "f5-1",
    job: "\u5019\u88DC"
  },
  {
    face_id: "f5-2",
    job: "\u5019\u88DC"
  }
];
var cs_changed_default = {
  chr_set: chr_set8,
  chr_npc: chr_npc8,
  chr_job: chr_job8
};

// src/lib/game/json/cs_animal.json
var chr_set9 = {
  _id: "animal",
  admin: "\u5927\u5730\u306E\u9707\u52D5",
  maker: "\u8349\u539F\u306E\u3056\u308F\u3081\u304D",
  label: "\u3046\u304D\u3046\u304D\u30B5\u30D0\u30F3\u30CA"
};
var chr_npc9 = [
  {
    label: "\u3046\u304D\u3046\u304D\u30B5\u30D0\u30F3\u30CA",
    csid: "animal",
    face_id: "c99",
    say_0: "\u55DA\u547C\u3001\u805E\u3053\u3048\u308B\u3002\u3084\u3064\u306E\u8DB3\u97F3\u304C\u805E\u3053\u3048\u308B\u2026\u2026\u3002",
    say_1: "\u9003\u3052\u308D\u3002\u9003\u3052\u308D\uFF01\u304A\u307E\u3048\u3089\u3060\u3051\u3067\u3082\u9003\u3052\u308D\u3002"
  }
];
var chr_job9 = [
  {
    face_id: "c01",
    job: "\u3053\u3058\u304B"
  },
  {
    face_id: "c02",
    job: "\u3088\u30FC\u304F\u3057\u3083\u30FC\u3066\u308A\u3042"
  },
  {
    face_id: "c03",
    job: "\u304B\u3082\u3059\u305E"
  },
  {
    face_id: "c04",
    job: "\u304F\u308D\u3072\u3087\u3046"
  },
  {
    face_id: "c05",
    job: "\u3044\u3068\u307E\u304D\u3048\u3044"
  },
  {
    face_id: "c06",
    job: "\u3078\u3073"
  },
  {
    face_id: "c07",
    job: "\u3066\u306E\u308A\u3076\u3093\u3061\u3087\u3046"
  },
  {
    face_id: "c08",
    job: "\u305F\u306C\u304D"
  },
  {
    face_id: "c09",
    job: "\u306B\u307B\u3093\u304A\u304A\u304B\u307F"
  },
  {
    face_id: "c10",
    job: "\u305D\u307E\u308A"
  },
  {
    face_id: "c11",
    job: "\u307F\u3051"
  },
  {
    face_id: "r12",
    job: "\u3046\u3048\u304D\u3070\u3061"
  },
  {
    face_id: "c13",
    job: "\u304B\u305F\u3064\u3080\u308A"
  },
  {
    face_id: "c14",
    job: "\u304F\u3089\u3052"
  },
  {
    face_id: "c15",
    job: "\u3057\u3083\u3061"
  },
  {
    face_id: "c16",
    job: "\u3042\u3075\u308A\u304B\u305E\u3046"
  },
  {
    face_id: "c17",
    job: "\u304A\u3089\u3046\u30FC\u305F\u3093"
  },
  {
    face_id: "c18",
    job: "\u304B\u307E\u304D\u308A"
  },
  {
    face_id: "c19",
    job: "\u3042\u3052\u306F\u3061\u3087\u3046"
  },
  {
    face_id: "c20",
    job: "\u3068\u3089"
  },
  {
    face_id: "c21",
    job: "\u304A\u304A\u305F\u3053"
  },
  {
    face_id: "c22",
    job: "\u3046\u3061\u3085\u3046\u305B\u3093"
  },
  {
    face_id: "c23",
    job: "\u3071\u3093\u3060"
  },
  {
    face_id: "c24",
    job: "\u3076\u308B\u3069\u3063\u3050"
  },
  {
    face_id: "c25",
    job: "\u3046\u3057"
  },
  {
    face_id: "c26",
    job: "\u3048\u308A\u307E\u304D\u3068\u304B\u3052"
  },
  {
    face_id: "c27",
    job: "\u3072\u3064\u3058"
  },
  {
    face_id: "c28",
    job: "\u3046\u3055\u304E"
  },
  {
    face_id: "c29",
    job: "\u3057\u307E\u3046\u307E"
  },
  {
    face_id: "c30",
    job: "\u304A\u3046\u3080"
  },
  {
    face_id: "c31",
    job: "\u304B\u3048\u308B"
  },
  {
    face_id: "c32",
    job: "\u304D\u3093\u304E\u3087"
  },
  {
    face_id: "c33",
    job: "\u306D\u3063\u305F\u3044\u304E\u3087"
  },
  {
    face_id: "c34",
    job: "\u3059\u306A\u306D\u305A\u307F"
  },
  {
    face_id: "c35",
    job: "\u3054\u308A\u3089"
  },
  {
    face_id: "c36",
    job: "\u3055\u3089\u3076\u308C\u3063\u3069"
  },
  {
    face_id: "c37",
    job: "\u307A\u308B\u3057\u3083"
  },
  {
    face_id: "c38",
    job: "\u3060\u3044\u304A\u3046\u3044\u304B"
  },
  {
    face_id: "c39",
    job: "\u3082\u307F\u306E\u304D"
  },
  {
    face_id: "c40",
    job: "\u3089\u3044\u304A\u3093"
  },
  {
    face_id: "c41",
    job: "\u308D\u3076\u3059\u305F\u30FC"
  },
  {
    face_id: "c42",
    job: "\u307F\u3064\u308A\u3087\u3046\u3057\u3083"
  },
  {
    face_id: "c43",
    job: "\u304F\u307E\u30FC"
  },
  {
    face_id: "c44",
    job: "\u3044\u308F\u3068\u3073\u307A\u3093\u304E\u3093"
  },
  {
    face_id: "c45",
    job: "\u306F\u3044\u3048\u306A"
  },
  {
    face_id: "c46",
    job: "\u3042\u3089\u3044\u3050\u307E"
  },
  {
    face_id: "c47",
    job: "\u3057\u308D\u307E\u3069\u3046\u3057"
  },
  {
    face_id: "c48",
    job: "\u304F\u3058\u3083\u304F"
  },
  {
    face_id: "c49",
    job: "\u306B\u307B\u3093\u3056\u308B"
  },
  {
    face_id: "c50",
    job: "\u304D\u3064\u306D"
  },
  {
    face_id: "c51",
    job: "\u304B\u3052\u308D\u3046"
  },
  {
    face_id: "c52",
    job: "\u3042\u308A\u3058\u3054\u304F"
  },
  {
    face_id: "c53",
    job: "\u3084\u307F\u3075\u304F\u308D\u3046"
  },
  {
    face_id: "c54",
    job: "\u3055\u3081"
  },
  {
    face_id: "c55",
    job: "\u3082\u308B\u3075\u3049\u3061\u3087\u3046"
  },
  {
    face_id: "c56",
    job: "\u3076\u305F"
  },
  {
    face_id: "c57",
    job: "\u3089\u304F\u3060"
  },
  {
    face_id: "c58",
    job: "\u3086\u306B\u3053\u30FC\u3093"
  },
  {
    face_id: "c59",
    job: "\u308C\u3068\u308A\u3070\u30FC"
  },
  {
    face_id: "c60",
    job: "\u306F\u3080\u3059\u305F\u30FC"
  },
  {
    face_id: "c61",
    job: "\u3059\u3063\u307D\u3093"
  },
  {
    face_id: "c62",
    job: "\u304D\u3064\u306D\u308A\u3059"
  },
  {
    face_id: "c63",
    job: "\u304A\u3053\u3058\u3087"
  },
  {
    face_id: "c64",
    job: "\u3084\u307E\u3042\u3089\u3057"
  },
  {
    face_id: "c65",
    job: "\u3061\u3059\u3044\u3053\u3046\u3082\u308A"
  },
  {
    face_id: "c66",
    job: "\u3070\u3044\u306B\u3093"
  },
  {
    face_id: "c67",
    job: "\u308A\u3059"
  },
  {
    face_id: "c68",
    job: "\u306A\u307E\u3053"
  },
  {
    face_id: "c69",
    job: "\u3073\u30FC\u308B"
  },
  {
    face_id: "c70",
    job: "\u304B\u3093\u304C\u308B\u30FC"
  },
  {
    face_id: "c71",
    job: "\u306A\u307E\u3051\u3082\u306E"
  },
  {
    face_id: "c72",
    job: "\u307B\u305F\u308B"
  },
  {
    face_id: "c73",
    job: "\u304F\u308A\u304A\u306D"
  },
  {
    face_id: "c74",
    job: "\u306F\u3044\u3073\u3059\u304B\u3059"
  },
  {
    face_id: "c75",
    job: "\u3044\u3048\u3066\u3043"
  },
  {
    face_id: "c76",
    job: "\u3081\u304C\u306D\u3056\u308B"
  },
  {
    face_id: "c77",
    job: "\u306B\u3093\u3058\u3093"
  },
  {
    face_id: "c78",
    job: "\u304B\u3081\u308C\u304A\u3093"
  },
  {
    face_id: "c79",
    job: "\u308F\u304B\u3081"
  },
  {
    face_id: "c80",
    job: "\u308A\u304B\u304A\u3093"
  },
  {
    face_id: "c81",
    job: "\u3075\u3047\u306D\u3063\u304F"
  },
  {
    face_id: "c82",
    job: "\u3069\u3076\u306D\u305A\u307F"
  },
  {
    face_id: "c83",
    job: "\u3044\u305D\u304E\u3093\u3061\u3083\u304F"
  },
  {
    face_id: "c84",
    job: "\u3057\u308D\u3078\u3073"
  },
  {
    face_id: "c85",
    job: "\u304B\u307F\u3064\u304D\u304C\u3081"
  },
  {
    face_id: "c86",
    job: "\u304B\u3082"
  },
  {
    face_id: "c87",
    job: "\u308A\u3085\u3046"
  },
  {
    face_id: "c88",
    job: "\u3086\u3067\u305F\u307E\u3054"
  },
  {
    face_id: "c89",
    job: "\u304B\u3070"
  },
  {
    face_id: "c90",
    job: "\u3055\u3044"
  },
  {
    face_id: "c91",
    job: "\u3042\u308B\u3071\u304B"
  },
  {
    face_id: "c92",
    job: "\u3055\u3070"
  },
  {
    face_id: "c93",
    job: "\u308F\u3089\u3044\u304B\u308F\u305B\u307F"
  },
  {
    face_id: "c94",
    job: "\u3042\u304B\u307E\u3080\u3057"
  },
  {
    face_id: "c95",
    job: "\u3084\u3082\u308A"
  },
  {
    face_id: "c96",
    job: "\u305B\u3042\u304B\u3054\u3051\u3050\u3082"
  },
  {
    face_id: "c97",
    job: "\u3057\u3047\u3071\u30FC\u3069"
  },
  {
    face_id: "c98",
    job: "\u306F\u3057\u3073\u308D\u3053\u3046"
  },
  {
    face_id: "c99",
    job: "\u3057\u3093\u304B\u3044\u304E\u3087"
  },
  {
    face_id: "c100",
    job: "\u3073\u30FC\u3070\u30FC"
  },
  {
    face_id: "c101",
    job: "\u3059\u305A\u3089\u3093"
  },
  {
    face_id: "c102",
    job: "\u3055\u3093\u305F"
  },
  {
    face_id: "c103",
    job: "\u304A\u3046\u3080\u304C\u3044"
  },
  {
    face_id: "c104",
    job: "\u307F\u3044\u3089"
  },
  {
    face_id: "c105",
    job: "\u3046\u307F\u306D\u3053"
  },
  {
    face_id: "c106",
    job: "\u307E\u3093\u307C\u3046"
  },
  {
    face_id: "c107",
    job: "\u3044\u307C\u3044\u306E\u3057\u3057"
  },
  {
    face_id: "c108",
    job: "\u3076\u308D\u3063\u3053\u308A\u30FC"
  },
  {
    face_id: "c109",
    job: "\u3057\u308D\u3061\u3083\u3068\u3089"
  }
];
var cs_animal_default = {
  chr_set: chr_set9,
  chr_npc: chr_npc9,
  chr_job: chr_job9
};

// src/lib/game/json/cs_school.json
var chr_set10 = {
  _id: "school",
  admin: "\u6821\u5185\u653E\u9001",
  maker: "\u6821\u5185\u653E\u9001",
  label: "\u79C1\u7ACB\u4E03\u8EE2\u5B66\u5712"
};
var chr_npc10 = [
  {
    label: "\u79C1\u7ACB\u4E03\u8EE2\u5B66\u5712",
    csid: "school",
    face_id: "c99",
    say_0: "\u55DA\u547C\u3001\u805E\u3053\u3048\u308B\u3002\u3084\u3064\u306E\u8DB3\u97F3\u304C\u805E\u3053\u3048\u308B\u2026\u2026\u3002",
    say_1: "\u9003\u3052\u308D\u3002\u9003\u3052\u308D\uFF01\u304A\u307E\u3048\u3089\u3060\u3051\u3067\u3082\u9003\u3052\u308D\u3002"
  }
];
var chr_job10 = [
  {
    face_id: "c01",
    job: "\u83EF\u9053\u90E8"
  },
  {
    face_id: "c02",
    job: "\u6821\u9577"
  },
  {
    face_id: "c03",
    job: "\u5316\u5B66\u6559\u5E2B"
  },
  {
    face_id: "c04",
    job: "\uFF33\uFF2F\uFF33\u56E3"
  },
  {
    face_id: "c05",
    job: "\u7559\u5E74\u751F"
  },
  {
    face_id: "c06",
    job: "\u4FDD\u5065\u4F53\u80B2\u6559\u5E2B"
  },
  {
    face_id: "c07",
    job: "\u6B74\u53F2\u6559\u5E2B"
  },
  {
    face_id: "c08",
    job: "\u56F3\u66F8\u59D4\u54E1"
  },
  {
    face_id: "c09",
    job: "\u52D5\u304F\u9285\u50CF"
  },
  {
    face_id: "c10",
    job: "\u30DF\u30FC\u30CF\u30FC"
  },
  {
    face_id: "c11",
    job: "\u512A\u7B49\u751F"
  },
  {
    face_id: "c12",
    job: "\u7528\u52D9\u54E1"
  },
  {
    face_id: "c13",
    job: "\u751F\u7269\u6559\u5E2B"
  },
  {
    face_id: "c14",
    job: "\u30B3\u30FC\u30E9\u30B9\u90E8"
  },
  {
    face_id: "c15",
    job: "\u5730\u7406\u6559\u5E2B"
  },
  {
    face_id: "c16",
    job: "\u98DF\u5802\u306E\u304A\u306D\u3044\u3055\u3093"
  },
  {
    face_id: "c17",
    job: "\u6F14\u5287\u90E8\u9867\u554F"
  },
  {
    face_id: "c18",
    job: "\u6570\u5B66\u6559\u5E2B"
  },
  {
    face_id: "c19",
    job: "\u30C1\u30A2\u30EA\u30FC\u30C0\u30FC"
  },
  {
    face_id: "c20",
    job: "\u7406\u4E8B\u9577\u306E\u5B6B"
  },
  {
    face_id: "c21",
    job: "\u7403\u90E8\u9867\u554F"
  },
  {
    face_id: "c22",
    job: "\u8FB2\u696D\u79D1"
  },
  {
    face_id: "c23",
    job: "\u73FE\u56FD\u6559\u5E2B"
  },
  {
    face_id: "c24",
    job: "\u7406\u4E8B\u9577"
  },
  {
    face_id: "c25",
    job: "\u6821\u9577\u306E\u5B6B"
  },
  {
    face_id: "c26",
    job: "\u5439\u594F\u697D\u90E8"
  },
  {
    face_id: "c27",
    job: "\u624B\u82B8\u90E8"
  },
  {
    face_id: "c28",
    job: "\u6587\u82B8\u90E8"
  },
  {
    face_id: "c29",
    job: "\u65B0\u805E\u90E8"
  },
  {
    face_id: "c30",
    job: "\u98FC\u80B2\u59D4\u54E1"
  },
  {
    face_id: "c31",
    job: "\u6F2B\u753B\u7814\u7A76\u90E8"
  },
  {
    face_id: "c32",
    job: "\u6F14\u5287\u90E8"
  },
  {
    face_id: "c33",
    job: "\u6F14\u5287\u90E8"
  },
  {
    face_id: "c34",
    job: "\u7403\u5150"
  },
  {
    face_id: "c35",
    job: "\u4F53\u80B2\u6559\u5E2B"
  },
  {
    face_id: "c36",
    job: "\u7F8E\u8853\u90E8"
  },
  {
    face_id: "c37",
    job: "\u97F3\u697D\u6559\u5E2B"
  },
  {
    face_id: "c38",
    job: "\u8EFD\u97F3\u697D\u90E8"
  },
  {
    face_id: "c39",
    job: "\u5BB6\u653F\u79D1\u6559\u5E2B"
  },
  {
    face_id: "c40",
    job: "\u6559\u982D\u5148\u751F"
  },
  {
    face_id: "c41",
    job: "\u767B\u5C71\u90E8"
  },
  {
    face_id: "c42",
    job: "\u751F\u5F92\u4F1A\u57F7\u884C\u90E8"
  },
  {
    face_id: "c43",
    job: "\u756A\u9577"
  },
  {
    face_id: "c44",
    job: "\u554F\u984C\u5150"
  },
  {
    face_id: "c45",
    job: "\u30B9\u30B1\u30D0\u30F3"
  },
  {
    face_id: "c46",
    job: "\u4FDD\u967A\u533B"
  },
  {
    face_id: "c47",
    job: "\u8EE2\u6821\u751F"
  },
  {
    face_id: "c48",
    job: "\u7F8E\u8853\u6559\u5E2B"
  },
  {
    face_id: "c49",
    job: "\u6280\u8853\u6559\u5E2B"
  },
  {
    face_id: "c50",
    job: "\u98A8\u7D00\u59D4\u54E1"
  },
  {
    face_id: "c51",
    job: "\u5E7D\u970A\u90E8\u54E1"
  },
  {
    face_id: "c52",
    job: "\u6620\u753B\u7814\u7A76\u4F1A"
  },
  {
    face_id: "c53",
    job: "\u5BEE\u7BA1\u7406\u4EBA"
  },
  {
    face_id: "c54",
    job: "\u91CE\u7403\u90E8"
  },
  {
    face_id: "c55",
    job: "\u8096\u50CF\u753B"
  },
  {
    face_id: "c56",
    job: "\u4E16\u754C\u53F2\u6559\u5E2B"
  },
  {
    face_id: "c57",
    job: "\u4FEE\u58EB"
  },
  {
    face_id: "c58",
    job: "\u540D\u8A89\u6559\u6388"
  },
  {
    face_id: "c59",
    job: "\u4FEE\u58EB"
  },
  {
    face_id: "c60",
    job: "\u30E9\u30AF\u30ED\u30B9\u90E8"
  },
  {
    face_id: "c61",
    job: "\u9B5A\u62D3\u90E8"
  },
  {
    face_id: "c62",
    job: "\u5B88\u885B"
  },
  {
    face_id: "c63",
    job: "\u30DE\u30CD\u30FC\u30B8\u30E3\u30FC"
  },
  {
    face_id: "c64",
    job: "\u683C\u95D8\u6280\u540C\u597D\u4F1A"
  },
  {
    face_id: "c65",
    job: "\u6559\u80B2\u5B9F\u7FD2"
  },
  {
    face_id: "c66",
    job: "\u8336\u9053\u90E8\u9867\u554F"
  },
  {
    face_id: "c67",
    job: "\u8CFC\u8CB7\u90E8"
  },
  {
    face_id: "c68",
    job: "\u5F8C\u63F4\u8005"
  },
  {
    face_id: "c69",
    job: "\u9676\u82B8\u90E8"
  },
  {
    face_id: "c70",
    job: "\u5148\u8F29"
  },
  {
    face_id: "c71",
    job: "\u5E30\u5B85\u90E8"
  },
  {
    face_id: "c72",
    job: "\u30F4\u30A3\u30B8\u30E5\u30A2\u30EB\u7CFB\u30D0\u30F3\u30C9\u90E8"
  },
  {
    face_id: "c73",
    job: "\u30C1\u30A2\u30AC\u30FC\u30EB"
  },
  {
    face_id: "c74",
    job: "\u793E\u4EA4\u30C0\u30F3\u30B9\u90E8"
  },
  {
    face_id: "c75",
    job: "\u6F14\u594F\u8B1B\u5E2B"
  },
  {
    face_id: "c76",
    job: "\u59D4\u54E1\u9577"
  },
  {
    face_id: "c77",
    job: "\u3044\u304D\u3082\u306E\u4FC2"
  },
  {
    face_id: "c78",
    job: "\u6F14\u5287\u90E8"
  },
  {
    face_id: "c79",
    job: "\u6C34\u6CF3\u90E8"
  },
  {
    face_id: "c80",
    job: "\u9678\u4E0A\u90E8"
  },
  {
    face_id: "c81",
    job: "\u79D1\u5B66\u90E8"
  },
  {
    face_id: "c82",
    job: "\u30AC\u30EA\u52C9"
  },
  {
    face_id: "c83",
    job: "\u653E\u9001\u90E8"
  },
  {
    face_id: "c84",
    job: "\u8B1B\u5E2B"
  },
  {
    face_id: "c85",
    job: "\u304A\u3066\u3093\u3070"
  },
  {
    face_id: "c86",
    job: "\u67D4\u9053\u90E8"
  },
  {
    face_id: "c87",
    job: "\u5929\u6587\u90E8"
  },
  {
    face_id: "c88",
    job: "\u6804\u990A\u58EB"
  },
  {
    face_id: "c89",
    job: "\u65B0\u4EFB\u6559\u5E2B"
  },
  {
    face_id: "c90",
    job: "\u30E9\u30B0\u30D3\u30FC\u90E8"
  },
  {
    face_id: "c91",
    job: "\u7DD1\u306E\u304A\u3070\u3055\u3093"
  },
  {
    face_id: "c92",
    job: "\u30C6\u30CB\u30B9\u90E8"
  },
  {
    face_id: "c93",
    job: "\u66F8\u9053\u90E8"
  },
  {
    face_id: "c94",
    job: "PTA\u4F1A\u9577"
  },
  {
    face_id: "c95",
    job: "\u4EBA\u4F53\u6A21\u578B"
  },
  {
    face_id: "c96",
    job: "\u52A9\u6559\u6388"
  },
  {
    face_id: "c97",
    job: "\u99D0\u5728\u3055\u3093"
  },
  {
    face_id: "c98",
    job: "\u6559\u6388"
  },
  {
    face_id: "c99",
    job: "\u4E0D\u767B\u6821\u5150"
  },
  {
    face_id: "c100",
    job: "\u30B5\u30C3\u30AB\u30FC\u90E8"
  },
  {
    face_id: "c101",
    job: "\u5712\u82B8\u90E8"
  },
  {
    face_id: "c102",
    job: "\u524D\u6821\u9577"
  },
  {
    face_id: "c103",
    job: "\u30AA\u30AB\u30EB\u30C8\u540C\u597D\u4F1A"
  },
  {
    face_id: "c104",
    job: "\u5263\u9053\u90E8"
  },
  {
    face_id: "c105",
    job: "\u5F13\u9053\u90E8"
  },
  {
    face_id: "c106",
    job: "\u6C34\u6CF3\u90E8\u9867\u554F"
  },
  {
    face_id: "c107",
    job: "\u524D\u7406\u4E8B\u9577"
  },
  {
    face_id: "c108",
    job: "\u7121\u7DDA\u90E8"
  },
  {
    face_id: "c109",
    job: "\u5360\u3044\u7814\u7A76\u4F1A"
  }
];
var cs_school_default = {
  chr_set: chr_set10,
  chr_npc: chr_npc10,
  chr_job: chr_job10
};

// src/lib/game/json/cs_all.json
var chr_set11 = {
  _id: "all",
  admin: "\u95C7\u306E\u545F\u304D",
  maker: "\u5929\u306E\u304A\u544A\u3052",
  label: "\u4EBA\u72FC\u8B70\u4E8B \u3061\u3083\u3093\u3077\u308B"
};
var chr_npc11 = [
  {
    label: "\u4EBA\u72FC\u8B70\u4E8B \u3061\u3083\u3093\u3077\u308B",
    csid: "all",
    face_id: "all",
    say_0: "\u3061\u3083\u3093\u3068\u3054\u6CE8\u6587\u901A\u308A\u3001\u3055\u307E\u3056\u307E\u306A\u4EBA\u305F\u3061\u3092\u304A\u547C\u3073\u3057\u307E\u3057\u305F\u3088\u3002\n\u3044\u305F\u308B\u3068\u3053\u308D\u304B\u3089\u2026\u305D\u3046\u3001\u5730\u5E73\u306E\u679C\u3066\u3084\u3001\u5B87\u5B99\u306E\u5F7C\u65B9\u304B\u3089\u3082\u3002\n\n\u4E2D\u306B\u306F\u3001\u4E3B\u69D8\u3092\u6D88\u3057\u3066\u304F\u3060\u3055\u308B\u3088\u3046\u306A\u65B9\u3082\u3044\u3089\u3063\u3057\u3083\u308B\u304B\u3082\u3057\u308C\u307E\u305B\u3093\u3002",
    say_1: "\u7686\u3055\u307E\u304A\u96C6\u307E\u308A\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059\u3002\u3048\u30FC\u3001\u3054\u307B\u3093\u3002\n\u3053\u306E\u50AC\u3057\u7269\u3001\u3057\u3063\u304B\u308A\u3068\u697D\u3057\u3093\u3067\u304F\u3060\u3055\u3044\u307E\u305B\u3002\n\n\u2026\u4F55\u304C\u3042\u3063\u3066\u3082\u3001\u6587\u53E5\u306F\u8A00\u3044\u307E\u305B\u3093\u3088\u3046\u3001\u3054\u4E86\u627F\u304F\u3060\u3055\u3044\u307E\u305B\u3002"
  }
];
var chr_job11 = [
  {
    face_id: "all",
    job: "\u304B\u307F\u3055\u307E"
  }
];
var cs_all_default = {
  chr_set: chr_set11,
  chr_npc: chr_npc11,
  chr_job: chr_job11
};

// src/lib/pubsub/chr_set/map-reduce.ts
var cs = { ririnra: cs_ririnra_default, wa: cs_wa_default, time: cs_time_default, sf: cs_sf_default, fable: cs_fable_default, mad: cs_mad_default, ger: cs_ger_default, changed: cs_changed_default, animal: cs_animal_default, school: cs_school_default, all: cs_all_default };
var CHR_SET_IDS = [
  "ririnra",
  "wa",
  "time",
  "sf",
  "fable",
  "mad",
  "ger",
  "changed",
  "animal",
  "school",
  "all"
];
var ChrSets = MapReduce({
  format: () => ({
    list: [],
    by_label: []
  }),
  reduce: (data, doc) => {
    const is_expantion_set = /^エクスパンション・セット/.test(doc.label);
    if (doc._id !== "all")
      dic(data.by_label, is_expantion_set ? 1 : 0, []).push(doc);
  },
  order: (data, { sort: sort3 }) => {
  }
});
var ChrNpcs = MapReduce({
  format: () => ({
    list: [],
    chr_set: {}
  }),
  reduce: (data, doc) => {
    dic(data.chr_set, doc.chr_set_id, {}, "list", []).push(doc);
  },
  order: (data, cmd) => {
  }
});
var ChrJobs = MapReduce({
  format: () => ({
    list: [],
    face: {}
  }),
  reduce: (data, doc) => {
    dic(data.face, doc.face_id, []).push(doc);
  },
  order: (data, { sort: sort3 }) => {
    for (const face_id in data.face) {
      sort3(data.face[face_id]).asc((o) => o.chr_set_at);
    }
  }
});
CHR_SET_IDS.forEach((key, idx) => {
  const o = cs[key];
  const chr_set_id = o.chr_set._id;
  const chr_set_at2 = CHR_SET_IDS.indexOf(chr_set_id);
  const npcs = o.chr_npc.map((doc) => {
    const chr_job_id = `${chr_set_id}_${doc.face_id}`;
    const intro = [doc.say_0, doc.say_1].map((text) => text.split("\n").join("<BR/>"));
    if (doc.say_2)
      intro.push(doc.say_2);
    return __spreadProps(__spreadValues({ _id: chr_job_id }, doc), { chr_set_id, chr_set_at: chr_set_at2, intro });
  });
  const jobs = o.chr_job.map((doc) => {
    return __spreadProps(__spreadValues({}, doc), { _id: `${chr_set_id}_${doc.face_id}`, chr_set_id, chr_set_at: chr_set_at2 });
  });
  ChrSets.add([o.chr_set]);
  ChrNpcs.add(npcs);
  ChrJobs.add(jobs);
});
var chr_set_at = CHR_SET_IDS.length - 1;
ChrJobs.add(Faces.data.list.map((face) => {
  var _a2;
  const job = (_a2 = ChrJobs.data.face[face._id][0]) == null ? void 0 : _a2.job;
  return {
    _id: `all_${face._id}`,
    job,
    face_id: face._id,
    chr_set_id: "all",
    chr_set_at,
    search_words: ""
  };
}).filter((o) => !ChrJobs.find(o._id)));

// src/lib/game/json/chr_tag.json
var giji = {
  label: "\u4EBA\u72FC\u8B70\u4E8B",
  long: "\u300C\u4EBA\u72FC\u8B70\u4E8B\u300D\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC",
  head: "\u4EBA\u72FC\u8B70\u4E8B",
  tag_id: "all",
  chr_set_id: "ririnra",
  face_sort: ["face.order", "asc"],
  order: 1e3
};
var G_a_k = {
  label: "\u3042\u301C\u3053",
  long: "\u300C\u4EBA\u72FC\u8B70\u4E8B\u300D\u306E\u540D\u524D\u304C \u3042\u3001\u304B \u884C\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u540D\u7C3F",
  head: "\u4EBA\u72FC\u8B70\u4E8B",
  tag_id: "giji",
  chr_set_id: "ririnra",
  face_sort: ["face.q.head", "asc"],
  order: 1001
};
var G_s_t = {
  label: "\u3055\u301C\u3068",
  long: "\u300C\u4EBA\u72FC\u8B70\u4E8B\u300D\u306E\u540D\u524D\u304C \u3055\u3001\u305F \u884C\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u540D\u7C3F",
  head: "\u4EBA\u72FC\u8B70\u4E8B",
  tag_id: "giji",
  chr_set_id: "ririnra",
  face_sort: ["face.q.head", "asc"],
  order: 1002
};
var G_n_h = {
  label: "\u306A\u301C\u307B",
  long: "\u300C\u4EBA\u72FC\u8B70\u4E8B\u300D\u306E\u540D\u524D\u304C \u306A\u3001\u306F \u884C\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u540D\u7C3F",
  head: "\u4EBA\u72FC\u8B70\u4E8B",
  tag_id: "giji",
  chr_set_id: "ririnra",
  face_sort: ["face.q.head", "asc"],
  order: 1003
};
var G_m_w = {
  label: "\u307E\u301C\u3092",
  long: "\u300C\u4EBA\u72FC\u8B70\u4E8B\u300D\u306E\u540D\u524D\u304C \u307E\u3001\u3084\u3001\u3089\u3001\u308F \u884C\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u540D\u7C3F",
  head: "\u4EBA\u72FC\u8B70\u4E8B",
  tag_id: "giji",
  chr_set_id: "ririnra",
  face_sort: ["face.q.head", "asc"],
  order: 1004
};
var travel = {
  label: "\u5E30\u9084\u8005\u8B70\u4E8B",
  long: "\u300C\u5E30\u9084\u8005\u8B70\u4E8B\u300D\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC",
  head: "\u5E30\u9084\u8005\u8B70\u4E8B",
  tag_id: "all",
  chr_set_id: "time",
  face_sort: ["face.order", "asc"],
  order: 2e3
};
var T_a_k = {
  label: "\u3042\u301C\u3053",
  long: "\u300C\u5E30\u9084\u8005\u8B70\u4E8B\u300D\u306E\u540D\u524D\u304C \u3042\u3001\u304B \u884C\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u540D\u7C3F",
  head: "\u5E30\u9084\u8005\u8B70\u4E8B",
  tag_id: "travel",
  chr_set_id: "time",
  face_sort: ["face.q.head", "asc"],
  order: 2001
};
var T_s_n = {
  label: "\u3055\u301C\u306E",
  long: "\u300C\u5E30\u9084\u8005\u8B70\u4E8B\u300D\u306E\u540D\u524D\u304C \u3055\u3001\u305F\u3001\u306A \u884C\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u540D\u7C3F",
  head: "\u5E30\u9084\u8005\u8B70\u4E8B",
  tag_id: "travel",
  chr_set_id: "time",
  face_sort: ["face.q.head", "asc"],
  order: 2002
};
var T_h_w = {
  label: "\u306F\u301C\u3092",
  long: "\u300C\u5E30\u9084\u8005\u8B70\u4E8B\u300D\u306E\u540D\u524D\u304C \u306F\u3001\u307E\u3001\u3084\u3001\u3089\u3001\u308F \u884C\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u540D\u7C3F",
  head: "\u5E30\u9084\u8005\u8B70\u4E8B",
  tag_id: "travel",
  chr_set_id: "time",
  face_sort: ["face.q.head", "asc"],
  order: 2003
};
var all2 = {
  label: "\u3059\u3079\u3066",
  long: "\u300C\u4EBA\u72FC\u8B70\u4E8B \u3061\u3083\u3093\u3077\u308B\u300D\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC",
  chr_set_id: "all",
  face_sort: ["face.order", "asc"],
  order: 0
};
var animal = {
  label: "\u3046\u304D\u3046\u304D\u30B5\u30D0\u30F3\u30CA",
  long: "\u300C\u3046\u304D\u3046\u304D\u30B5\u30D0\u30F3\u30CA\u300D\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC",
  head: "\u30A8\u30AD\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8",
  tag_id: "all",
  chr_set_id: "animal",
  face_sort: ["face.order", "asc"],
  order: 4001
};
var school = {
  label: "\u79C1\u7ACB\u4E03\u8EE2\u5B66\u5712",
  long: "\u300C\u79C1\u7ACB\u4E03\u8EE2\u5B66\u5712\u300D\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC",
  head: "\u30A8\u30AD\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8",
  tag_id: "all",
  chr_set_id: "school",
  face_sort: ["face.order", "asc"],
  order: 4002
};
var shoji = {
  label: "\u3066\u3084\u3093\u3067\u3048",
  long: "\u300C\u548C\u306E\u56FD\u3066\u3084\u3093\u3067\u3048\u300D\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC",
  head: "\u30A8\u30AD\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8",
  tag_id: "all",
  chr_set_id: "wa",
  face_sort: ["face.order", "asc"],
  order: 3001
};
var stratos = {
  label: "\u660E\u5F8C\u65E5\u3078\u306E\u9053\u6A19",
  long: "\u300C\u660E\u5F8C\u65E5\u3078\u306E\u9053\u6A19\u300D\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC",
  head: "\u30A8\u30AD\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8",
  tag_id: "all",
  chr_set_id: "sf",
  face_sort: ["face.order", "asc"],
  order: 3002
};
var fable = {
  label: "\u5E7B\u65E5\u4E16\u754C",
  long: "\u300C\u5E7B\u65E5\u4E16\u754C\u300D\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC",
  head: "\u30A8\u30AD\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8",
  tag_id: "all",
  chr_set_id: "fable",
  face_sort: ["face.order", "asc"],
  order: 3003
};
var myth = {
  label: "\u306F\u304A\u3046\u306E\u3072\u308D\u3070",
  long: "\u300C\u306F\u304A\u3046\u306E\u3072\u308D\u3070\u300D\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC",
  head: "\u30A8\u30AD\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8",
  tag_id: "all",
  chr_set_id: "changed",
  face_sort: ["face.order", "asc"],
  order: 3004
};
var marchen = {
  label: "\u72C2\u9A12\u8B70\u4E8B",
  long: "\u300C\u72C2\u9A12\u8B70\u4E8B\u300D\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC",
  head: "\u30A8\u30AD\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8",
  tag_id: "all",
  chr_set_id: "mad",
  face_sort: ["face.order", "asc"],
  order: 3005
};
var asia = {
  label: "\u5927\u9678\u8B70\u4E8B",
  long: "\u300C\u5927\u9678\u8B70\u4E8B\u300D\u306E\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC",
  head: "\u30A8\u30AD\u30B9\u30D1\u30F3\u30B7\u30E7\u30F3\u30FB\u30BB\u30C3\u30C8",
  tag_id: "all",
  chr_set_id: "ger",
  face_sort: ["face.order", "asc"],
  order: 3006
};
var chr_tag_default = {
  giji,
  G_a_k,
  G_s_t,
  G_n_h,
  G_m_w,
  travel,
  T_a_k,
  T_s_n,
  T_h_w,
  all: all2,
  animal,
  school,
  shoji,
  stratos,
  fable,
  myth,
  marchen,
  asia
};

// src/lib/pubsub/chr_tag/map-reduce.ts
var Tags = MapReduce({
  format: () => ({
    list: [],
    base: {},
    group: {}
  }),
  reduce: (data, doc) => {
    const group = Math.floor(doc.order / 1e3);
    dic(data.base, doc.head, {}, group.toString(), {}, "list", []).push(doc);
  },
  order: (data, { sort: sort3, group_sort: group_sort2 }) => {
    data.group = group_sort2(data.base, (d) => sort3(d).asc((o) => o[0].list[0].order), (d) => sort3(d).asc((o) => o.list[0].order), (d) => ({ list: sort3(d.list).asc((o) => o.order) }));
  }
});
Tags.deploy(chr_tag_default);

// src/lib/game/json/set_ables.json
var editvilform = {
  group: "GM",
  at: "around",
  cmd: "editvilform",
  btn: "\u6751\u3092\u7DE8\u96C6\u3059\u308B",
  change: "\u6751\u306E\u7DE8\u96C6\u30D5\u30A9\u30FC\u30E0\u3092\u78BA\u8A8D\u3001\u4FEE\u6B63\u3057\u307E\u3059\u3002",
  help: ""
};
var muster = {
  group: "GM",
  at: "prologue",
  cmd: "muster",
  btn: "\u70B9\u547C\uFF01",
  change: "\u5168\u54E1\u3092\u672A\u767A\u8A00\u72B6\u614B\u306B\u3057\u307E\u3059\u3002\u672A\u767A\u8A00\u8005\u306F\uFF11\u65E5\u305D\u306E\u307E\u307E\u767A\u8A00\u304C\u306A\u3044\u3068\u3001\u81EA\u52D5\u9000\u51FA\u3057\u307E\u3059\u3002",
  help: ""
};
var update = {
  group: "GM",
  at: "all",
  cmd: "update",
  btn: "\u66F4\u65B0\uFF01",
  change: "\u305F\u3060\u3061\u306B\u66F4\u65B0\u3057\u3001\u6B21\u306E\u65E5\u3092\u8FCE\u3048\u307E\u3059\u3002\u304A\u899A\u609F\u306F\u3088\u308D\u3057\u3044\u3067\u3059\u304B\uFF1F",
  help: ""
};
var scrapvil = {
  group: "GM",
  at: "all",
  cmd: "scrapvil",
  btn: "\u5EC3\u6751\uFF01",
  change: "\u305F\u3060\u3061\u306B\u6751\u3092\u5EC3\u6751\u306B\u3057\u307E\u3059\u3002\u5EC3\u6751\u306B\u306A\u3063\u305F\u6751\u306F\u30A8\u30D4\u30ED\u30FC\u30B0\u306B\u306A\u308A\u307E\u3059\u3002\u304A\u899A\u609F\u306F\u3088\u308D\u3057\u3044\u3067\u3059\u304B\uFF1F",
  help: ""
};
var exit2 = {
  group: "POTOF",
  at: "prologue",
  cmd: "exit",
  btn: "\u9000\u51FA\u2026",
  change: "\u6751\u3092\u7ACB\u3061\u53BB\u308A\u307E\u3059\u3002",
  help: ""
};
var commit = {
  group: "POTOF",
  at: "progress",
  cmd: "commit",
  sw: "\u6642\u9593\u3092\u9032\u3081\u308B",
  pass: "\uFF08\u6642\u9593\u3092\u9032\u3081\u306A\u3044\uFF09",
  change: "\u6642\u9593\u3092\u9032\u3081\u308B\u304B\u3069\u3046\u304B\u3001\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u5168\u54E1\u304C\u300C\u6642\u9593\u3092\u9032\u3081\u308B\u300D\u3092\u9078\u3076\u3068\u524D\u5012\u3057\u3067\u66F4\u65B0\u3055\u308C\u307E\u3059\u3002\n\u6700\u4F4E\u4E00\u767A\u8A00\u3057\u3066\u78BA\u5B9A\u3057\u306A\u3044\u3068\u3001\u6642\u9593\u3092\u9032\u3081\u308B\u4E8B\u304C\u3067\u304D\u307E\u305B\u3093\u3002"
};
var night = {
  at: "main",
  sw: "\u591C\u904A\u3073\u3059\u308B",
  pass: "\uFF08\u591C\u904A\u3073\u3057\u306A\u3044\uFF09",
  change: "\u591C\u904A\u3073\u3092\u3057\u3066\u3001\u6DF1\u591C\u306E\u56C1\u304D\u3092\u805E\u3044\u3066\u3057\u307E\u3046\u304B\u3069\u3046\u304B\u3001\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u3042\u306A\u305F\u306F\u4E8C\u65E5\u76EE\u4EE5\u964D\u3001\u591C\u306B\u51FA\u6B69\u304F\u3053\u3068\u304C\u3067\u304D\u307E\u3059\u3002\n\u4EBA\u72FC\u306E\u56C1\u304D\u3001\u6C11\u306E\u5FF5\u8A71\u3001\u5171\u9CF4\u8005\u306E\u5171\u9CF4\u3092\u8AB0\u306E\u3082\u306E\u3068\u3082\u5224\u5225\u305B\u305A\u805E\u3044\u3061\u3083\u3046\u306E\u3067\u3001\u671D\u306B\u306A\u3063\u3066\u6628\u65E5\u3092\u632F\u308A\u8FD4\u308B\u3068\u601D\u3044\u51FA\u305B\u308B\u3053\u3068\u3067\u3057\u3087\u3046\u3002\n\u9854\u3084\u540D\u524D\u306F\u308F\u304B\u308A\u307E\u305B\u3093\u304C\u3002\n\u305F\u3060\u3057\u3053\u306E\u3068\u304D\u3001\u3082\u3057\u3042\u306A\u305F\u304C\u4EBA\u72FC\u306E\u3001\u8AB0\u304B\u3072\u3068\u308A\u306B\u3067\u3082\u8972\u6483\u3055\u308C\u308B\u77DB\u5148\u306B\u542B\u307E\u308C\u3066\u3044\u308B\u3068\u3001\u6050\u6016\u306E\u3042\u307E\u308A\u3001\u5B9F\u969B\u306B\u8972\u308F\u308C\u308B\u72A0\u7272\u8005\u3068\u306F\u5225\u306B\u6B7B\u3093\u3067\u3057\u307E\u3044\u307E\u3059\u3002\n\u3053\u306E\u6B7B\u4EA1\u3092\u8B77\u885B\u3059\u308B\u65B9\u6CD5\u306F\u3042\u308A\u307E\u305B\u3093\u3002\u307E\u305F\u3001\u606F\u3092\u5F15\u304D\u53D6\u308B\u3042\u306A\u305F\u3092\u5C3B\u76EE\u306B\u3001\u72FC\u9054\u306F\u5225\u306E\u4EBA\u7269\u3092\u8972\u6483\u3059\u308B\u3067\u3057\u3087\u3046\u3002"
};
var dish = {
  at: "progress",
  sw: "\u8DF3\u306D\u308B",
  pass: "\uFF08\u8DF3\u306D\u306A\u3044\uFF09",
  change: "\u8DF3\u306D\u308B\u30A2\u30D4\u30FC\u30EB\u3092\u3059\u308B\u304B\u3069\u3046\u304B\u3001\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u7F8E\u5473\u3057\u304F\u98DF\u3079\u3066\u8CB0\u3046\u3053\u3068\u3092\u60A6\u3073\u3068\u3057\u3001\u6D3B\u304D\u6D3B\u304D\u3068\u8DF3\u306D\u308B\u3053\u3068\u304C\u3067\u304D\u307E\u3059\u3002\u308F\u305F\u3057\u3092\u305F\u3079\u3066\u3001\u308F\u305F\u3057\u3092\u305F\u3079\u3066\u3001\u3068\u30A2\u30D4\u30FC\u30EB\u3057\u307E\u3057\u3087\u3046\u3002"
};
var cling = {
  at: "main",
  sw: "\u98F2\u85AC\u3059\u308B",
  pass: "\uFF08\u98F2\u85AC\u3057\u306A\u3044\uFF09",
  change: "\u3042\u306A\u305F\u304C\u6BBA\u5BB3\u3055\u308C\u305F\u3068\u3057\u305F\u3089\u3001\u72AF\u4EBA\u3092\u9053\u9023\u308C\u306B\u3059\u308B\u304B\u3069\u3046\u304B\u3001\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u85AC\u3092\u670D\u7528\u3057\u305F\u591C\u3001\u3082\u3057\u51E6\u5211\u4EE5\u5916\u306E\u8981\u56E0\u3067\u547D\u3092\u843D\u3068\u3057\u305F\u5834\u5408\u3001\u305D\u306E\u72AF\u4EBA\u3092\u9053\u9023\u308C\u306B\u3057\u307E\u3059\u3002\u4EBA\u72FC\u306E\u8972\u6483\u306E\u5834\u5408\u3001\u8972\u6483\u5B9F\u884C\u8005\u304C\u5BFE\u8C61\u3068\u306A\u308A\u307E\u3059\u3002"
};
var guru = {
  for: "live",
  at: "progress",
  targets: "\u8A98\u3046",
  pass: "\uFF08\u30D1\u30B9\uFF09",
  change: "\u8A98\u3044\u8FBC\u3080\u72A0\u7272\u8005\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u6BCE\u6669\u3075\u305F\u308A\u305A\u3064\u3001\u597D\u304D\u306A\u4EBA\u7269\u3092\u3072\u305D\u304B\u306B\u8A98\u3044\u8FBC\u3080\u3053\u3068\u304C\u3067\u304D\u307E\u3059\u3002\u81EA\u5206\u81EA\u8EAB\u3092\u8A98\u3046\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093\u3002\n\u8A98\u3044\u8FBC\u307E\u308C\u305F\u5F53\u4EBA\u305F\u3061\u306F\u591C\u306A\u591C\u306A\u8E0A\u308A\u660E\u304B\u3057\u3001\u305D\u306E\u3053\u3068\u3092\u899A\u3048\u3066\u3044\u307E\u3059\u3002\u3057\u304B\u3057\u3001\u5F7C\u3089\u306E\u80FD\u529B\u3084\u6240\u5C5E\u9663\u55B6\u306A\u3069\u306B\u5909\u5316\u306F\u3042\u308A\u307E\u305B\u3093\u3002"
};
var bitch = {
  for: "live",
  at: "start",
  targets: "\u904A\u3076",
  change: "\u7D46\u3092\u7D50\u3076\u76F8\u624B\u3068\u3001\u5F04\u3076\u904A\u3073\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u4E00\u65E5\u76EE\u3001\u4E00\u4EBA\u76EE\u306B\u9078\u629E\u3057\u305F\u4EBA\u7269\u3092\u672C\u547D\u306E\u604B\u4EBA\u3068\u3057\u3066\u201C\u904B\u547D\u306E\u7D46\u201D\u3092\u7D50\u3073\u3064\u3051\u3001\u4E8C\u4EBA\u76EE\u306F\u7D46\u3092\u7D50\u3076\u3075\u308A\u3092\u3057\u3066\u624B\u7389\u306B\u3068\u308A\u307E\u3059\u3002\n\u201C\u904B\u547D\u306E\u7D46\u201D\u3092\u7D50\u3093\u3060\u4E8C\u4EBA\u306F\u3001\u7247\u65B9\u304C\u6B7B\u4EA1\u3059\u308B\u3068\u5F8C\u3092\u8FFD\u3063\u3066\u6B7B\u4EA1\u3057\u307E\u3059\u3002\u3082\u3046\u4E00\u4EBA\u306F\u3069\u3046\u3067\u3082\u3088\u3044\u306E\u3067\u3059\u304C\u3001\u305D\u3046\u601D\u308F\u305B\u306A\u3044\u3053\u307E\u3081\u306A\u30B1\u30A2\u304C\u5927\u5207\u3067\u3059\u3002"
};
var bonds = {
  for: "live",
  at: "start",
  targets: "\u7D50\u3076",
  change: "\u7D46\u3067\u7D50\u3076\u4E8C\u4EBA\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u4E00\u65E5\u76EE\u3001\u597D\u304D\u306A\u4E8C\u4EBA\u306B\u201C\u904B\u547D\u306E\u7D46\u201D\u3092\u7D50\u3073\u3064\u3051\u308B\u4E8B\u304C\u3067\u304D\u307E\u3059\u3002\u201C\u904B\u547D\u306E\u7D46\u201D\u3092\u7D50\u3093\u3060\u4E8C\u4EBA\u306F\u3001\u7247\u65B9\u304C\u6B7B\u4EA1\u3059\u308B\u3068\u5F8C\u3092\u8FFD\u3063\u3066\u6B7B\u4EA1\u3057\u307E\u3059\u3002"
};
var bond = {
  for: "live",
  at: "start",
  target: "\u7D50\u3076",
  change: "\u3042\u306A\u305F\u3068\u306E\u7D46\u3092\u7D50\u3076\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u4E00\u65E5\u76EE\u3001\u3042\u306A\u305F\u304B\u3089\u597D\u304D\u306A\u4EBA\u306B\u201C\u904B\u547D\u306E\u7D46\u201D\u3092\u7D50\u3073\u3064\u3051\u308B\u4E8B\u304C\u3067\u304D\u307E\u3059\u3002\u201C\u904B\u547D\u306E\u7D46\u201D\u3092\u7D50\u3093\u3060\u76F8\u624B\u304C\u6B7B\u4EA1\u3059\u308B\u3068\u3001\u3042\u306A\u305F\u306F\u5F8C\u3092\u8FFD\u3063\u3066\u6B7B\u4EA1\u3057\u307E\u3059\u3002"
};
var guard = {
  for: "live",
  at: "main",
  target: "\u5B88\u308B",
  pass: "\uFF08\u30D1\u30B9\uFF09",
  change: "\u5B88\u8B77\u3059\u308B\u5BFE\u8C61\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u4E00\u4EBA\u3092\u72FC\u306E\u8972\u6483\u3001\u3082\u3057\u304F\u306F\u4ED8\u3051\u72D9\u3046\u8CDE\u91D1\u7A3C\u306E\u624B\u304B\u3089\u5B88\u308B\u3053\u3068\u304C\u51FA\u6765\u307E\u3059\u3002\n\u81EA\u5206\u81EA\u8EAB\u3092\u5B88\u308B\u3053\u3068\u306F\u51FA\u6765\u307E\u305B\u3093\u3002"
};
var see = {
  for: "live",
  at: "progress",
  target: "\u5360\u3046",
  pass: "\uFF08\u30D1\u30B9\uFF09",
  change: "\u6B63\u4F53\u3092\u77E5\u308A\u305F\u3044\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u3072\u3068\u308A\u3092\u5360\u3044\u5BFE\u8C61\u306B\u6307\u5B9A\u3057\u307E\u3059\u3002"
};
var sneak = {
  for: "live",
  at: "progress",
  target: "\u72D9\u3046",
  pass: "\uFF08\u30D1\u30B9\uFF09",
  change: "\u4ED8\u3051\u72D9\u3046\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u6BBA\u5BB3\u3057\u307E\u3059\u3002\n\u305F\u3060\u3057\u3001\u5BFE\u8C61\u304C\u8B77\u885B\u3055\u308C\u3066\u3044\u308B\u304B\u3001\u5149\u306E\u8F2A\u3092\u6E21\u3055\u308C\u3066\u3044\u308B\u304B\u3001\u5996\u7CBE\u3001\u3082\u3057\u304F\u306F\u4E00\u5339\u72FC\u3067\u3042\u308C\u3070\u3001\u52B9\u529B\u306F\u767A\u63EE\u3057\u307E\u305B\u3093\u3002\n\u307E\u305F\u3001\u5BFE\u8C61\u304C\u534A\u72FC\u3067\u3042\u308C\u3070\u5F7C\u306F\u4EBA\u72FC\u306B\u306A\u308A\u3001\u4EBA\u72AC\u3001\u3082\u3057\u304F\u306F\u7121\u50B7\u306E\u9577\u8001\u306E\u5834\u5408\u306F\u3001\u5373\u6B7B\u306F\u3057\u307E\u305B\u3093\u304C\u50B7\u3092\u8CA0\u308F\u305B\u308B\u3053\u3068\u304C\u3067\u304D\u307E\u3059\u3002"
};
var hunt = {
  for: "live",
  at: "progress",
  target: "\u8972\u3046",
  pass: "\uFF08\u30D1\u30B9\uFF09",
  change: "\u6BBA\u5BB3\u3059\u308B\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u4EBA\u72FC\u5168\u54E1\u3067\u591A\u6570\u6C7A\u3092\u3057\u3001\u4E00\u4EBA\u3060\u3051\u6BBA\u5BB3\u3057\u307E\u3059\u3002\n\u305F\u3060\u3057\u3001\u5BFE\u8C61\u304C\u8B77\u885B\u3055\u308C\u3066\u3044\u308B\u304B\u3001\u5149\u306E\u8F2A\u3092\u6E21\u3055\u308C\u3066\u3044\u308B\u304B\u3001\u5996\u7CBE\u3001\u3082\u3057\u304F\u306F\u4E00\u5339\u72FC\u3067\u3042\u308C\u3070\u3001\u52B9\u529B\u306F\u767A\u63EE\u3057\u307E\u305B\u3093\u3002\n\u307E\u305F\u3001\u5BFE\u8C61\u304C\u534A\u72FC\u3067\u3042\u308C\u3070\u5F7C\u306F\u4EBA\u72FC\u306B\u306A\u308A\u3001\u4EBA\u72AC\u3001\u3082\u3057\u304F\u306F\u7121\u50B7\u306E\u9577\u8001\u306E\u5834\u5408\u306F\u3001\u5373\u6B7B\u306F\u3057\u307E\u305B\u3093\u304C\u50B7\u3092\u8CA0\u308F\u305B\u308B\u3053\u3068\u304C\u3067\u304D\u307E\u3059\u3002"
};
var kill = {
  for: "live",
  at: "progress",
  target: "\u8972\u3046",
  pass: "\uFF08\u30D1\u30B9\uFF09",
  change: "\u6BBA\u5BB3\u3059\u308B\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u6BBA\u5BB3\u3057\u307E\u3059\u3002\n\u305F\u3060\u3057\u3001\u5BFE\u8C61\u304C\u8B77\u885B\u3055\u308C\u3066\u3044\u308B\u304B\u3001\u5149\u306E\u8F2A\u3092\u6E21\u3055\u308C\u3066\u3044\u308B\u304B\u3001\u5996\u7CBE\u3001\u3082\u3057\u304F\u306F\u4E00\u5339\u72FC\u3067\u3042\u308C\u3070\u3001\u52B9\u529B\u306F\u767A\u63EE\u3057\u307E\u305B\u3093\u3002\n\u307E\u305F\u3001\u5BFE\u8C61\u304C\u534A\u72FC\u3067\u3042\u308C\u3070\u5F7C\u306F\u4EBA\u72FC\u306B\u306A\u308A\u3001\u4EBA\u72AC\u3001\u3082\u3057\u304F\u306F\u7121\u50B7\u306E\u9577\u8001\u306E\u5834\u5408\u306F\u3001\u5373\u6B7B\u306F\u3057\u307E\u305B\u3093\u304C\u50B7\u3092\u8CA0\u308F\u305B\u308B\u3053\u3068\u304C\u3067\u304D\u307E\u3059\u3002"
};
var cure = {
  for: "live",
  at: "main",
  target: "\u8A3A\u5BDF",
  pass: "\uFF08\u30D1\u30B9\uFF09",
  change: "\u8A3A\u5BDF\u3059\u308B\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u3072\u3068\u308A\u3092\u8A3A\u5BDF\u3057\u3001\u4EBA\u72FC\u306E\u7259\u306B\u611F\u67D3\u3057\u3066\u3044\u308B\u304B\u3092\u78BA\u8A8D\u3057\u307E\u3059\u3002\u305D\u306E\u5834\u5408\u306F\u6CBB\u7642\u3057\u307E\u3059\u3002\u6CBB\u7642\u3057\u305F\u4EBA\u306F\u751F\u5B58\u8005\u3068\u3057\u3066\u6570\u3048\u307E\u3059\u304C\u3001\u80FD\u529B\u306F\u53D6\u308A\u623B\u3057\u307E\u305B\u3093\u3002"
};
var tangle = {
  for: "dead",
  at: "progress",
  target: "\u6191\u4F9D",
  pass: "\uFF08\u30D1\u30B9\uFF09",
  change: "\u4ED8\u3051\u72D9\u3046\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u6B7B\u8005\u306E\u57CB\u846C\u5730\u3092\u3046\u308D\u3064\u304D\u307E\u308F\u3063\u3066\u3044\u307E\u3059\u3002\n\u6307\u5B9A\u3057\u305F\u6545\u4EBA\u306E\u5F79\u8077\u3068\u52DD\u5229\u6761\u4EF6\u3092\u5199\u3057\u3068\u308A\u3001\u5BFE\u8C61\u3092\u8607\u751F\u3055\u305B\u307E\u3059\u3002\n\u3053\u306E\u305F\u3081\u3001\u3042\u306A\u305F\u306F\u6B7B\u4EA1\u3057\u306A\u304F\u3066\u306F\u3001\u52DD\u5229\u304C\u3042\u308A\u307E\u305B\u3093\u3002"
};
var analeptic = {
  for: "dead",
  at: "progress",
  require: "role1",
  target: "\u6295\u85AC",
  pass: "\uFF08\u30D1\u30B9\uFF09",
  change: "\u85AC\u3092\u6295\u4E0E\u3059\u308B\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u6B7B\u8005\u306B\u6295\u85AC\u3057\u3066\u8607\u751F\u3055\u305B\u307E\u3059\u3002\n\u8607\u751F\u306F\u4E00\u5EA6\u3060\u3051\u304A\u3053\u306A\u3046\u3053\u3068\u304C\u3067\u304D\u3001\u305D\u308C\u3063\u304D\u308A\u85AC\u306F\u5931\u308F\u308C\u307E\u3059\u3002"
};
var poison = {
  for: "live",
  at: "progress",
  require: "role2",
  target: "\u6295\u85AC",
  pass: "\uFF08\u30D1\u30B9\uFF09",
  change: "\u85AC\u3092\u6295\u4E0E\u3059\u308B\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u751F\u304D\u3066\u3044\u308B\u8005\u306B\u6295\u85AC\u3057\u3066\u6BD2\u6BBA\u3057\u307E\u3059\u3002\n\u6BD2\u6BBA\u306F\u4E00\u5EA6\u305A\u3064\u3060\u3051\u304A\u3053\u306A\u3046\u3053\u3068\u304C\u3067\u304D\u3001\u305D\u308C\u3063\u304D\u308A\u85AC\u306F\u5931\u308F\u308C\u307E\u3059\u3002"
};
var scapegoat = {
  for: "live",
  at: "main",
  target: "\u7591\u3046",
  pass: "\uFF08\u30D1\u30B9\uFF09",
  change: "\u3042\u306A\u305F\u304C\u6700\u5F8C\u306B\u306A\u3063\u305F\u3068\u3057\u305F\u3089\u3001\u6307\u5DEE\u3059\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u3082\u3057\u6295\u7968\u6570\u304C\u540C\u6570\u306B\u306A\u308A\u51E6\u5211\u3059\u308B\u76F8\u624B\u304C\u5B9A\u307E\u3089\u306A\u3044\u3068\u3001\u6DF7\u4E71\u3057\u305F\u6751\u4EBA\u9054\u306B\u51E6\u5211\u3055\u308C\u3066\u3057\u307E\u3044\u307E\u3059\u3002\n\u3042\u306A\u305F\u304C\u6700\u5F8C\u306B\u6307\u5DEE\u3057\u305F\u4EBA\u306F\u3001\u5F8C\u6094\u3059\u308B\u6751\u4EBA\u9054\u306B\u7FCC\u65E5\u3001\u51E6\u5211\u3055\u308C\u308B\u3067\u3057\u3087\u3046\u3002\u7686\u3001\u305D\u3046\u3059\u308B\u3088\u308A\u4ED6\u306B\u306A\u3044\u306E\u3067\u3059\u3002"
};
var hike = {
  for: "cast",
  at: "progress",
  target: "\u5916\u51FA\u3059\u308B",
  pass: "\uFF08\u30D1\u30B9\uFF09",
  change: "\u4F1A\u3044\u306B\u884C\u304F\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u7279\u6B8A\u306A\u80FD\u529B\u304C\u3042\u308B\u304B\u3069\u3046\u304B\u81EA\u899A\u3057\u3066\u3044\u307E\u305B\u3093\u3002\u591C\u306F\u7A4D\u6975\u7684\u306B\u5916\u51FA\u3057\u3066\u3001\u69D8\u5B50\u3092\u3055\u3050\u308A\u307E\u3057\u3087\u3046\u3002"
};
var vote = {
  group: "POTOF",
  for: "live",
  at: "main",
  cmd: "vote",
  target: "\u6295\u7968",
  pass: "\uFF08\u59D4\u4EFB\u3059\u308B\uFF09",
  change: "\u51E6\u5211\u3059\u308B\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u5168\u54E1\u3067\u591A\u6570\u6C7A\u3092\u3057\u3001\u4E00\u4EBA\u3060\u3051\u51E6\u5211\u3057\u307E\u3059\u3002"
};
var vote_role = {
  for: "live",
  at: "main",
  target: "\u6295\u7968",
  pass: "\uFF08\u30D1\u30B9\uFF09",
  change: "\u51E6\u5211\u3059\u308B\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: ""
};
var entrust = {
  group: "POTOF",
  for: "live",
  at: "main",
  cmd: "vote",
  target: "\u59D4\u4EFB",
  pass: "\uFF08\u6295\u7968\u3059\u308B\uFF09",
  change: "\u51E6\u5211\u3092\u68C4\u6A29\u3057\u3001\u4E00\u7968\u3092\u59D4\u306D\u308B\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u6295\u7968\u306F\u68C4\u6A29\u3057\u3001\u4ED6\u4EBA\u306E\u6295\u7968\u3068\u540C\u3058\u3068\u3059\u308B\u3053\u3068\u304C\u3067\u304D\u307E\u3059\u3002"
};
var jammer = {
  for: "live",
  at: "progress",
  target: "\u90AA\u9B54",
  pass: "\uFF08\u30D1\u30B9\uFF09",
  change: "\u5360\u3044\u304B\u3089\u4FDD\u8B77\u3059\u308B\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u6BCE\u591C\u3001\u4E00\u4EBA\u3092\u3042\u3089\u3086\u308B\u5360\u3044\u304B\u3089\u5305\u307F\u96A0\u3059\u3053\u3068\u304C\u3067\u304D\u307E\u3059\u3002\n\u81EA\u5206\u81EA\u8EAB\u3092\u96A0\u3059\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093\u3002"
};
var snatch = {
  for: "live",
  at: "progress",
  target: "\u63DB\u308F\u308B",
  pass: "\uFF08\u30D1\u30B9\uFF09",
  change: "\u9854\u3068\u540D\u524D\u3092\u7C12\u596A\u3059\u308B\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: "\u597D\u304D\u306A\u4EBA\u7269\u306E\u9854\u3068\u540D\u524D\u3092\u596A\u3044\u3001\u81EA\u8EAB\u306E\u305D\u308C\u3068\u5165\u308C\u66FF\u3048\u308B\u3053\u3068\u304C\u3067\u304D\u307E\u3059\u3002\u3053\u306E\u80FD\u529B\u306F\u975E\u5E38\u306B\u9732\u9855\u3057\u3084\u3059\u3044\u306E\u3067\u3001\u884C\u4F7F\u306B\u306F\u6CE8\u610F\u304C\u5FC5\u8981\u3067\u3059\u3002\n\u3082\u3057\u3082\u591C\u306E\u9593\u306B\u5C4D\u4F53\u306B\u306A\u3063\u305F\u4EBA\u3092\u5BFE\u8C61\u306B\u9078\u3093\u3060\u306A\u3089\u3001\u65E7\u3044\u3042\u306A\u305F\u306F\u547D\u3092\u843D\u3068\u3057\u3001\u3042\u306A\u305F\u3068\u306A\u3063\u305F\u305D\u306E\u5C4D\u4F53\u306F\u606F\u3092\u5439\u304D\u8FD4\u3059\u3067\u3057\u3087\u3046\u3002\n\u307E\u305F\u3001\u7D50\u3070\u308C\u305F\u7D46\u3084\u3001\u7B1B\u5439\u304D\u306B\u8A98\u308F\u308C\u305F\u3053\u3068\u306F\u59FF\u3068\u3068\u3082\u306B\u3042\u308A\u3001\u59FF\u3092\u79FB\u3057\u66FF\u3048\u305F\u3068\u304D\u306B\u5F15\u304D\u7D99\u3050\u3053\u3068\u304C\u3042\u308A\u307E\u3059\u3002\n\u4E00\u5EA6\u79FB\u3057\u66FF\u3048\u305F\u59FF\u306F\u3001\u6C38\u9060\u306B\u3042\u306A\u305F\u306E\u3082\u306E\u3067\u3059\u3002\u4E8C\u5EA6\u3068\u5143\u306B\u306F\u623B\u308A\u307E\u305B\u3093\u3002"
};
var gm_droop = {
  group: "GM",
  for: "gm_live",
  at: "all",
  cmd: "gamemaster",
  target: "\u3059\u3050\u306B\u5893\u4E0B\u3078",
  pass: "\u2015\u2015\u2015",
  change: "\u53C2\u52A0\u8005\u3068\u3057\u3066\u6B7B\u306A\u305B\u308B\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: ""
};
var gm_live = {
  group: "GM",
  for: "gm_dead",
  at: "all",
  cmd: "gamemaster",
  target: "\u3059\u3050\u306B\u8868\u821E\u53F0\u3078",
  pass: "\u2015\u2015\u2015",
  change: "\u53C2\u52A0\u8005\u3068\u3057\u3066\u8607\u751F\u3055\u305B\u308B\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: ""
};
var gm_disable_vote = {
  group: "GM",
  for: "live",
  at: "all",
  cmd: "gamemaster",
  target: "\u6295\u7968\u304B\u3089\u4FDD\u8B77\u3059\u308B",
  pass: "\u2015\u2015\u2015",
  change: "\u6295\u7968\u5BFE\u8C61\u306B\u9078\u3076\u3053\u3068\u3092\u8A8D\u3081\u306A\u3044\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: ""
};
var gm_enable_vote = {
  group: "GM",
  for: "live",
  at: "all",
  cmd: "gamemaster",
  target: "\u6295\u7968\u3092\u8A8D\u53EF\u3059\u308B",
  pass: "\u2015\u2015\u2015",
  change: "\u6295\u7968\u5BFE\u8C61\u306B\u9078\u3076\u3053\u3068\u8A31\u53EF\u3059\u308B\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: ""
};
var maker = {
  group: "GM",
  for: "all",
  at: "all",
  cmd: "maker",
  target: "\u6751\u3092\u4EFB\u305B\u308B",
  pass: "\u2015\u2015\u2015",
  change: "\u6751\u306E\u7BA1\u7406\u3092\u4EFB\u305B\u308B\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: ""
};
var kick = {
  group: "GM",
  for: "all",
  at: "prologue",
  cmd: "kick",
  target: "\u9000\u53BB\uFF01",
  pass: "\u2015\u2015\u2015",
  change: "\u9000\u53BB\u3044\u305F\u3060\u3053\u3046\u3001\u304B\u306A\u2026\u3001\u3068\u601D\u3063\u305F\u76F8\u624B\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  help: ""
};
var blind = {
  label: "\u672C\u4EBA\u306B\u79D8\u5BC6",
  help: "\uFF08\u30B5\u30FC\u30D0\u30FC\u306F\u3001\u3053\u306E\u5F79\u8077\u3092\u4FDD\u6709\u3057\u3066\u3044\u308B\u3053\u3068\u3092\u672C\u4EBA\u306B\u901A\u77E5\u3057\u307E\u305B\u3093\u3002\uFF09"
};
var wolf = {
  help: "\u3042\u306A\u305F\u306F\u4EBA\u72FC\u3068\u5224\u5B9A\u3055\u308C\u307E\u3059\u3002"
};
var pixi = {
  help: "\u5360\u3044\u306E\u5BFE\u8C61\u3068\u306A\u308B\u3068\u6B7B\u4EA1\u3057\u307E\u3059\u3002\u52DD\u5229\u5224\u5B9A\u3067\u306F\u4EBA\u9593\u306B\u3082\u4EBA\u72FC\u306B\u3082\u6570\u3048\u3089\u308C\u307E\u305B\u3093\u3002"
};
var human = {
  help: "\u52DD\u5229\u5224\u5B9A\u3067\u306F\u4EBA\u9593\u3068\u3057\u3066\u6570\u3048\u3089\u308C\u307E\u3059\u3002"
};
var evil = {
  help: "\u4EBA\u9593\u3067\u3042\u308A\u306A\u304C\u3089\u3001\u4EBA\u5916\u306B\u5354\u529B\u3059\u308B\u88CF\u5207\u308A\u8005\u3067\u3059\u3002\u5834\u5408\u306B\u3088\u3063\u3066\u306F\u6562\u3048\u3066\u6B7B\u306C\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\u3002"
};
var circular = {
  help: "\u3053\u306E\u8D08\u308A\u7269\u306F\u3001\u6B21\u306B\u6E21\u3059\u76F8\u624B\u3092\u9078\u3073\u6E21\u3059\u3053\u3068\u306B\u306A\u3063\u3066\u3044\u307E\u3059\u3002\n\u5C06\u6765\u3082\u3057\u3075\u305F\u305F\u3073\u3042\u306A\u305F\u306E\u624B\u306B\u6E21\u3063\u305F\u3089\u3001\u8D08\u308A\u7269\u306F\u6D88\u3048\u53BB\u3063\u3066\u3057\u307E\u3044\u307E\u3059\u3002"
};
var friend = {
  help: "\u4EF2\u9593\u306B\u5411\u3051\u3066\u306F\u80FD\u529B\u3092\u4F7F\u3044\u307E\u305B\u3093\u3002"
};
var once = {
  help: "\u80FD\u529B\u3092\u6301\u3061\u307E\u3059\u304C\u3001\u305D\u306E\u80FD\u529B\u306F\u305F\u3063\u305F\u4E00\u5EA6\u3057\u304B\u4F7F\u3046\u3053\u3068\u304C\u3067\u304D\u307E\u305B\u3093\u3002"
};
var hate = {
  help: "\u7D46\u306E\u904B\u547D\u306F\u60B2\u3057\u3044\u6BBA\u3057\u5408\u3044\u3092\u5F37\u3044\u308B\u3067\u3057\u3087\u3046\u3002\u5F7C\u3089\u306F\u672C\u6765\u306E\u52DD\u5229\u6761\u4EF6\u3067\u306F\u306A\u304F\u3001\u305F\u3060\u4E00\u4EBA\u751F\u304D\u6B8B\u308B\u3053\u3068\u304C\u52DD\u5229\u6761\u4EF6\u3068\u306A\u308A\u307E\u3059\u3002"
};
var love = {
  help: "\u7D46\u306E\u904B\u547D\u306F\u5F7C\u3089\u3092\u3001\u611B\u3067\u56FA\u304F\u7D50\u3076\u3067\u3057\u3087\u3046\u3002\u5F7C\u3089\u306F\u672C\u6765\u306E\u52DD\u5229\u6761\u4EF6\u3067\u306F\u306A\u304F\u3001\u5171\u5B58\u304C\u52DD\u5229\u6761\u4EF6\u3068\u306A\u308A\u307E\u3059\u3002"
};
var droop = {
  help: "\u3042\u306A\u305F\u306F\u3001\u751F\u304D\u305F\u4EBA\u72FC\u306E\u4EBA\u6570\u306E\u4E8C\u65E5\u5F8C\u306B\u3001\u547D\u3092\u843D\u3068\u3057\u307E\u3059\u3002"
};
var curse = {
  help: "\u3042\u306A\u305F\u3092\u5360\u3063\u3066\u3057\u307E\u3063\u305F\u5360\u3044\u5E2B\u306F\u6B7B\u4EA1\u3057\u307E\u3059\u3002"
};
var aura = {
  help: "\u3042\u306A\u305F\u306F\u30AA\u30FC\u30E9\u3092\u6301\u3061\u307E\u3059\u3002"
};
var rob = {
  help: "\u8AB0\u3082\u306A\u3089\u306A\u304B\u3063\u305F\u6B8B\u308A\u5F79\u8077\u3092\u3059\u3079\u3066\u77E5\u308A\u307E\u3059\u3002\n\u6B21\u306E\u591C\u3001\u305D\u306E\u4E2D\u304B\u3089\u904B\u547D\u306E\u5C0E\u304F\u307E\u307E\u3072\u3068\u3064\u306E\u5F79\u8077\u3092\u9078\u3073\u3001\u4EEE\u9762\u306E\u5F79\u8077\u306B\u6210\u308A\u4EE3\u308F\u308B\u3067\u3057\u3087\u3046\u3002\n\u904B\u547D\u306F\u3001\u3042\u306A\u305F\u306B\u306A\u306B\u3092\u8AB2\u3059\u3067\u3057\u3087\u3046\u304B\uFF1F"
};
var grave = {
  help: "\u547D\u3092\u843D\u3068\u3059\u3068\u3001\u80FD\u529B\u3092\u767A\u63EE\u3059\u308B\u3053\u3068\u304C\u3067\u304D\u307E\u3059\u3002"
};
var armor = {
  help: "\u72FC\u306E\u8972\u6483\u3084\u8CDE\u91D1\u7A3C\u306E\u624B\u306B\u3088\u308A\u6BBA\u3055\u308C\u308B\u3053\u3068\u306F\u3042\u308A\u307E\u305B\u3093\u3002"
};
var medium = {
  help: "\u51E6\u5211\u3084\u7A81\u7136\u6B7B\u3067\u6B7B\u3093\u3060\u5168\u54E1\u3092\u5BFE\u8C61\u306B\u3057\u307E\u3059\u3002\n\u7121\u60E8\u306A\u6B7B\u4F53\u306B\u3064\u3044\u3066\u5224\u65AD\u3059\u308B\u3053\u3068\u306F\u51FA\u6765\u307E\u305B\u3093\u3002"
};
var spy_role = {
  help: "\u305D\u306E\u4EBA\u304C\u6301\u3064\u5F79\u8077\u304C\u308F\u304B\u308A\u307E\u3059\u3002\u6069\u6075\u306F\u3001\u5F79\u8077\u3068\u306F\u5225\u500B\u306E\u3082\u306E\u3067\u3059\u3002\u3053\u306E\u305F\u3081\u534A\u7AEF\u8005\u3001\u60AA\u9B3C\u3001\u5996\u7CBE\u306E\u5B50\u3092\u76F4\u63A5\u898B\u5206\u3051\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093\u3002\n\u307E\u305F\u3001\u5996\u7CBE\u3092\u5360\u3046\u3068\u546A\u6BBA\u3057\u307E\u3059\u3002\u305F\u3060\u3057\u3001\u546A\u4EBA\u3001\u546A\u72FC\u3092\u5360\u3063\u3066\u3057\u307E\u3046\u3068\u3001\u546A\u6BBA\u3055\u308C\u3066\u3057\u307E\u3044\u307E\u3059\u3002\n\u90AA\u9B54\u4E4B\u6C11\u306B\u5305\u307F\u96A0\u3055\u308C\u305F\u76F8\u624B\u3092\u5360\u3046\u3068\u3001\u5360\u3044\u3092\u5B9F\u65BD\u3057\u306A\u304B\u3063\u305F\u3053\u3068\u306B\u306A\u308A\u3001\u7D50\u679C\u3092\u5F97\u305F\u308A\u3001\u546A\u6BBA\u3057\u305F\u308A\u3068\u3044\u3063\u305F\u52B9\u80FD\u304C\u5F97\u3089\u308C\u307E\u305B\u3093\u3002"
};
var spy_win = {
  help: "\u305D\u306E\u4EBA\u304C\u6301\u3064\u9663\u55B6\uFF08\u52DD\u5229\u6761\u4EF6\uFF09\u304C\u308F\u304B\u308A\u307E\u3059\u3002\u591A\u304F\u306F\u5F79\u8077\u3092\u601D\u308F\u305B\u308B\u3082\u306E\u3067\u3059\u3002\n\u307E\u305F\u3001\u5996\u7CBE\u3092\u5360\u3046\u3068\u546A\u6BBA\u3057\u307E\u3059\u3002\u305F\u3060\u3057\u3001\u546A\u4EBA\u3001\u546A\u72FC\u3092\u5360\u3063\u3066\u3057\u307E\u3046\u3068\u3001\u546A\u6BBA\u3055\u308C\u3066\u3057\u307E\u3044\u307E\u3059\u3002\n\u90AA\u9B54\u4E4B\u6C11\u306B\u5305\u307F\u96A0\u3055\u308C\u305F\u76F8\u624B\u3092\u5360\u3046\u3068\u3001\u5360\u3044\u3092\u5B9F\u65BD\u3057\u306A\u304B\u3063\u305F\u3053\u3068\u306B\u306A\u308A\u3001\u7D50\u679C\u3092\u5F97\u305F\u308A\u3001\u546A\u6BBA\u3057\u305F\u308A\u3068\u3044\u3063\u305F\u52B9\u80FD\u304C\u5F97\u3089\u308C\u307E\u305B\u3093\u3002"
};
var spy_aura = {
  help: "\u305D\u306E\u4EBA\u304C\u80FD\u529B\u3092\u6301\u3064\u304B\u5224\u5225\u51FA\u6765\u307E\u3059\u3002\u3042\u306A\u305F\u306B\u3068\u3063\u3066\u3001\u6751\u4EBA\u3001\u4EBA\u72FC\u3001\u767D\u72FC\u306F\u80FD\u529B\u306E\u30AA\u30FC\u30E9\u3092\u6301\u3061\u307E\u305B\u3093\u304C\u3001\u305D\u3046\u3067\u306A\u3044\u4EBA\u7269\u306F\u80FD\u529B\u306E\u30AA\u30FC\u30E9\u3092\u7E8F\u3063\u3066\u3044\u308B\u3068\u611F\u3058\u3089\u308C\u307E\u3059\u3002"
};
var spy_wolf = {
  help: "\u305D\u306E\u4EBA\u304C\u4EBA\u9593\u304B\u4EBA\u72FC\u304B\u5224\u5225\u3067\u304D\u307E\u3059\u3002\u305F\u3060\u3057\u72FC\u8840\u65CF\u306F\u4EBA\u72FC\u3068\u8AA4\u8A8D\u3057\u3001\u767D\u72FC\u306F\u4EBA\u9593\u3068\u8AA4\u8A8D\u3057\u3066\u3057\u307E\u3044\u307E\u3059\u3002\n\u307E\u305F\u3001\u5996\u7CBE\u3092\u5360\u3046\u3068\u546A\u6BBA\u3057\u307E\u3059\u3002\u305F\u3060\u3057\u3001\u546A\u4EBA\u3001\u546A\u72FC\u3092\u5360\u3063\u3066\u3057\u307E\u3046\u3068\u3001\u546A\u6BBA\u3055\u308C\u3066\u3057\u307E\u3044\u307E\u3059\u3002\n\u90AA\u9B54\u4E4B\u6C11\u306B\u5305\u307F\u96A0\u3055\u308C\u305F\u76F8\u624B\u3092\u5360\u3046\u3068\u3001\u5360\u3044\u3092\u5B9F\u65BD\u3057\u306A\u304B\u3063\u305F\u3053\u3068\u306B\u306A\u308A\u3001\u7D50\u679C\u3092\u5F97\u305F\u308A\u3001\u546A\u6BBA\u3057\u305F\u308A\u3068\u3044\u3063\u305F\u52B9\u80FD\u304C\u5F97\u3089\u308C\u307E\u305B\u3093\u3002"
};
var stigma = {
  help: "\u72EC\u7279\u306E\u5370\u3092\u6301\u3064\u305F\u3081\u3001\u3042\u306A\u305F\u306E\u6B63\u4F53\u306F\u6BD4\u8F03\u7684\u4FE1\u7528\u3055\u308C\u3084\u3059\u3044\u3067\u3057\u3087\u3046\u3002"
};
var fm = {
  help: "\u7D50\u793E\u54E1\u30FB\u5171\u9CF4\u8005\u304C\u8AB0\u306A\u306E\u304B\u77E5\u3063\u3066\u3044\u307E\u3059\u3002"
};
var fanatic = {
  help: "\u4EBA\u72FC\u306B\u306F\u3042\u306A\u305F\u306E\u6B63\u4F53\u306F\u308F\u304B\u308A\u307E\u305B\u3093\u304C\u3001\u3042\u306A\u305F\u306F\u4EBA\u72FC\u304C\u8AB0\u304B\u77E5\u3063\u3066\u3044\u307E\u3059\u3002\u307E\u305F\u3001\u65B0\u305F\u306B\u4EBA\u72FC\u3068\u306A\u3063\u305F\u3082\u306E\u3092\u77E5\u308B\u3053\u3068\u3082\u3067\u304D\u307E\u3059\u3002\n\u3067\u3059\u304C\u3001\u3042\u306A\u305F\u306F\u72FC\u8840\u65CF\u3084\u64EC\u72FC\u5996\u7CBE\u3082\u4EBA\u72FC\u3067\u3042\u308B\u3068\u8AA4\u8A8D\u3057\u3066\u3057\u307E\u3044\u307E\u3059\u3057\u3001\u4E00\u5339\u72FC\u306E\u6B63\u4F53\u3092\u77E5\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093\u3002"
};
var tafness = {
  help: "\u3042\u306A\u305F\u306F\u72FC\u306E\u8972\u6483\u3092\u53D7\u3051\u308B\u3001\u3082\u3057\u304F\u306F\u8CDE\u91D1\u7A3C\u306B\u9053\u9023\u308C\u306B\u3055\u308C\u308B\u3068\u50B7\u3092\u8CA0\u3046\u3082\u306E\u306E\u3001\u4E00\u65E5\u3060\u3051\u751F\u304D\u9577\u3089\u3048\u307E\u3059\u3002"
};
var hurt = {
  group: "STATUS",
  label: "\u8CA0\u50B7",
  help: ""
};
var sheep = {
  group: "STATUS",
  help: "\u8E0A\u308A\u72C2\u3063\u305F\u304A\u307C\u308D\u3052\u306A\u8A18\u61B6\u304C\u3042\u308B\u3002"
};
var infected = {
  group: "STATUS",
  label: "\u611F\u67D3",
  help: ""
};
var hide_for_vote = {
  group: "STATUS",
  hide: ["vote"],
  label: "\u6295\u7968\u5BFE\u8C61\u5916",
  help: ""
};
var hide_for_role = {
  group: "STATUS",
  hide: ["role"],
  label: "\u80FD\u529B\u5BFE\u8C61\u5916",
  help: ""
};
var hide_for_gift = {
  group: "STATUS",
  hide: ["gift"],
  label: "\u6069\u6075\u5BFE\u8C61\u5916",
  help: ""
};
var disable_vote = {
  group: "STATUS",
  disable: ["vote"],
  label: "<s>\u6295\u7968</s>",
  help: ""
};
var disable_special = {
  group: "STATUS",
  disable: ["gift", "role"],
  label: "<s>\u5168\u80FD\u529B</s>",
  help: "\u3042\u306A\u305F\u306F\u3082\u3046\u7279\u6B8A\u80FD\u529B\u3092\u4F7F\u3046\u3053\u3068\u304C\u3067\u304D\u307E\u305B\u3093\u3002"
};
var disable_gift = {
  group: "STATUS",
  disable: ["gift"],
  label: "<s>\u6069\u6075</s>",
  help: "\u3042\u306A\u305F\u306F\u3082\u3046\u6069\u6075\u80FD\u529B\u3092\u4F7F\u3046\u3053\u3068\u304C\u3067\u304D\u307E\u305B\u3093\u3002"
};
var disable_role = {
  group: "STATUS",
  disable: ["role"],
  label: "<s>\u80FD\u529B</s>",
  help: "\u3042\u306A\u305F\u306F\u3082\u3046\u5F79\u8077\u80FD\u529B\u3092\u4F7F\u3046\u3053\u3068\u304C\u3067\u304D\u307E\u305B\u3093\u3002"
};
var disable_poison = {
  group: "STATUS",
  disable: ["poison"],
  label: "<s>\u6BD2\u85AC</s>",
  help: "\u3042\u306A\u305F\u306F\u3082\u3046\u6BD2\u85AC\u3092\u4F7F\u3046\u3053\u3068\u304C\u3067\u304D\u307E\u305B\u3093\u3002"
};
var disable_analeptic = {
  group: "STATUS",
  disable: ["analeptic"],
  label: "<s>\u8607\u751F\u85AC</s>",
  help: "\u3042\u306A\u305F\u306F\u3082\u3046\u8607\u751F\u85AC\u3092\u4F7F\u3046\u3053\u3068\u304C\u3067\u304D\u307E\u305B\u3093\u3002"
};
var twolife = {
  help: "\u3042\u306A\u305F\u306F\u72FC\u306E\u8972\u6483\u3092\u53D7\u3051\u308B\u3001\u3082\u3057\u304F\u306F\u8CDE\u91D1\u7A3C\u306B\u9053\u9023\u308C\u306B\u3055\u308C\u3066\u3082\u3001\u4E00\u5EA6\u3060\u3051\u306F\u547D\u304C\u52A9\u304B\u308A\u307E\u3059\u3002"
};
var august = {
  help: "\u3042\u306A\u305F\u304C\u51E6\u5211\u3055\u308C\u308B\u3053\u3068\u306B\u6C7A\u307E\u308B\u3068\u4E00\u5EA6\u3060\u3051\u306F\u3001\u305D\u306E\u51E6\u5211\u306F\u3068\u308A\u3084\u3081\u306B\u306A\u308A\u307E\u3059\u3002"
};
var revenge = {
  help: "\u3069\u3093\u306A\u7406\u7531\u3067\u3042\u308C\u3001\u3042\u306A\u305F\u304C\u547D\u3092\u843D\u3068\u3059\u3068\u3001\u305D\u306E\u591C\u306E\u3046\u3061\u306B\u80FD\u529B\u3092\u767A\u63EE\u3057\u307E\u3059\u3002"
};
var seal = {
  help: "\u3072\u3068\u308A\u306E\u72AF\u4EBA\u304C\u7279\u5B9A\u3067\u304D\u308B\u306E\u3067\u3042\u308C\u3070\u3001\u72AF\u4EBA\u306F\u3044\u3063\u3055\u3044\u306E\u80FD\u529B\u3092\u884C\u4F7F\u3067\u304D\u306A\u304F\u306A\u308A\u307E\u3059\u3002"
};
var grudge = {
  help: "\u3042\u306A\u305F\u304C\u547D\u3092\u843D\u3068\u3057\u305F\u7FCC\u65E5\u3001\u4EBA\u72FC\u306F\u4E8C\u3064\u306E\u8972\u6483\u3092\u304A\u3053\u306A\u3044\u3001\u4E8C\u4EBA\u3092\u4E00\u5EA6\u306B\u6BBA\u5BB3\u3057\u307E\u3059\u3002"
};
var riot = {
  help: "\u3042\u306A\u305F\u304C\u6B7B\u4EA1\u3057\u305F\u7FCC\u65E5\u306F\u3001\u6751\u4EBA\u9054\u304C\u66B4\u529B\u7684\u306B\u4E8C\u3064\u306E\u6295\u7968\u3092\u304A\u3053\u306A\u3044\u3001\u4E8C\u4EBA\u3092\u4E00\u5EA6\u306B\u51E6\u5211\u3057\u307E\u3059\u3002"
};
var wolfify = {
  help: "\u3042\u306A\u305F\u306F\u72FC\u306E\u8972\u6483\u3092\u53D7\u3051\u308B\u3001\u3082\u3057\u304F\u306F\u8CDE\u91D1\u7A3C\u306B\u9053\u9023\u308C\u306B\u3055\u308C\u308B\u3068\u3001\u3042\u306A\u305F\u306F\u4EBA\u72FC\u306B\u306A\u308A\u307E\u3059\u3002"
};
var chkGSAY = {
  help: "\u9854\u3084\u540D\u524D\u306F\u308F\u304B\u308A\u307E\u305B\u3093\u304C\u3001\u3042\u306A\u305F\u306E\u8033\u306B\u306F\u6B7B\u8005\u306E\u58F0\u304C\u5C4A\u3044\u3061\u3083\u3046\u3053\u3068\u3067\u3057\u3087\u3046\u3002"
};
var ENTRY = {
  group: "POTOF",
  cmd: "entry",
  text: ["talk"],
  label: "\u5C0E\u5165",
  help: "\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u3092\u9078\u629E\u3057\u3001\u30A8\u30F3\u30C8\u30EA\u30FC\u3057\u307E\u3057\u3087\u3046\u3002"
};
var MAKER = {
  group: "GM",
  cmd: "write",
  text: ["talk", "memo", "act"],
  label: "\u6751\u7ACB\u3066\u8A71",
  help: "\u3042\u306A\u305F\u306F\u6751\u7ACB\u3066\u4EBA\u3067\u3059\u3002"
};
var ADMIN = {
  group: "GM",
  cmd: "write",
  text: ["talk", "memo", "act"],
  label: "\u7BA1\u7406\u8005\u8A71",
  help: "\u3042\u306A\u305F\u306F\u7BA1\u7406\u4EBA\u3067\u3059\u3002"
};
var PSAY = {
  cmd: "write",
  text: ["talk", "memo"],
  label: "\u5171\u9CF4",
  help: "\u3042\u306A\u305F\u306F\u3001\u5171\u9CF4\u8005\u540C\u58EB\u306B\u3057\u304B\u805E\u3053\u3048\u306A\u3044\u4F1A\u8A71\u304C\u53EF\u80FD\u3067\u3059\u3002"
};
var WSAY = {
  cmd: "write",
  text: ["talk", "memo"],
  label: "\u56C1\u304D",
  help: "\u3042\u306A\u305F\u306F\u3001\u4EBA\u72FC\uFF08\u3068\u56C1\u304D\u72C2\u4EBA\u3001\u64EC\u72FC\u5996\u7CBE\uFF09\u540C\u58EB\u306B\u3057\u304B\u805E\u3053\u3048\u306A\u3044\u4F1A\u8A71\u304C\u53EF\u80FD\u3067\u3059\u3002"
};
var XSAY = {
  cmd: "write",
  text: ["talk", "memo"],
  label: "\u5FF5\u8A71",
  help: "\u3042\u306A\u305F\u306F\u3001\u5FF5\u6CE2\u661F\u3067\u3057\u304B\u805E\u3053\u3048\u306A\u3044\u4F1A\u8A71\u304C\u53EF\u80FD\u3067\u3059\u3002"
};
var GSAY = {
  group: "POTOF",
  cmd: "write",
  text: ["talk", "memo", "act"],
  label: "\u4F1A\u8A71",
  help: "\u3042\u306A\u305F\u306F\u3001\u6B7B\u8005\u306B\u3057\u304B\u805E\u3053\u3048\u306A\u3044\u4F1A\u8A71\u304C\u53EF\u80FD\u3067\u3059\u3002"
};
var MSAY = {
  cmd: "write",
  text: ["talk", "memo"],
  label: "\u53E3\u501F\u308A",
  help: "\u3042\u306A\u305F\u306F<b>_NPC_</b>\u306E\u53E3\u3092\u501F\u308A\u3001\u597D\u304D\u306A\u8A00\u8449\u3092\u4F1D\u3048\u308B\u3053\u3068\u304C\u3067\u304D\u307E\u3059\u3002"
};
var AIM = {
  group: "POTOF",
  for: "near",
  cmd: "write",
  text: ["talk", "memo"],
  label: "\u5185\u7DD2\u8A71",
  help: null
};
var TSAY = {
  group: "POTOF",
  cmd: "write",
  text: ["talk", "memo"],
  label: "\u72EC\u308A\u8A00",
  help: null
};
var SSAY = {
  group: "POTOF",
  cmd: "write",
  text: ["talk", "memo", "act"],
  label: "\u4F1A\u8A71",
  help: null
};
var VSAY = {
  group: "POTOF",
  cmd: "write",
  text: ["talk", "memo", "act"],
  label: "\u4F1A\u8A71",
  help: null
};
var VGSAY = {
  group: "POTOF",
  cmd: "write",
  text: ["talk", "memo", "act"],
  label: "\u4F1A\u8A71",
  help: null
};
var set_ables_default = {
  editvilform,
  muster,
  update,
  scrapvil,
  exit: exit2,
  commit,
  night,
  dish,
  cling,
  guru,
  bitch,
  bonds,
  bond,
  guard,
  see,
  sneak,
  hunt,
  kill,
  cure,
  tangle,
  analeptic,
  poison,
  scapegoat,
  hike,
  vote,
  vote_role,
  entrust,
  jammer,
  snatch,
  gm_droop,
  gm_live,
  gm_disable_vote,
  gm_enable_vote,
  maker,
  kick,
  blind,
  wolf,
  pixi,
  human,
  evil,
  circular,
  friend,
  once,
  hate,
  love,
  droop,
  curse,
  aura,
  rob,
  grave,
  armor,
  medium,
  spy_role,
  spy_win,
  spy_aura,
  spy_wolf,
  stigma,
  fm,
  fanatic,
  tafness,
  hurt,
  sheep,
  infected,
  hide_for_vote,
  hide_for_role,
  hide_for_gift,
  disable_vote,
  disable_special,
  disable_gift,
  disable_role,
  disable_poison,
  disable_analeptic,
  twolife,
  august,
  revenge,
  seal,
  grudge,
  riot,
  wolfify,
  chkGSAY,
  ENTRY,
  MAKER,
  ADMIN,
  PSAY,
  WSAY,
  XSAY,
  GSAY,
  MSAY,
  AIM,
  TSAY,
  SSAY,
  VSAY,
  VGSAY
};

// src/lib/pubsub/set_able/map-reduce.ts
var ABLE_IDS = Object.keys(set_ables_default);
var Ables = MapReduce({
  format: () => {
    return {
      list: [],
      hide: new Set(),
      group: {}
    };
  },
  reduce: (o, doc) => {
    if (doc.hide)
      o.hide.add(doc.hide);
    dic(o.group, doc.group, {}, "list", []).push(doc);
  },
  order: (o, { sort: sort3 }) => {
  }
});
Ables.deploy(set_ables_default);

// src/lib/game/json/set_locale.json
var regend = {
  sow_locale_id: "regend",
  label: "\u8B70\u4E8B\u2606\u4F1D\u627F"
};
var village = {
  sow_locale_id: "all",
  label: "\u30AA\u30FC\u30EB\u2606\u30B9\u30BF\u30FC",
  help: "\u3059\u3079\u3066\u306E\u5F79\u8077\u3001\u6069\u6075\u3001\u4E8B\u4EF6\u3092\u697D\u3057\u3080\u3053\u3068\u304C\u3067\u304D\u308B\u3001\u300C\u5168\u90E8\u5165\u308A\u300D\u306E\u30BB\u30C3\u30C8\u3067\u3059\u3002",
  intro: [
    "\u3053\u306E\u6751\u306B\u3082\u6050\u308B\u3079\u304D<strong>\u4EBA\u72FC</strong>\u306E\u5642\u304C\u6D41\u308C\u3066\u304D\u305F\u3002\u3072\u305D\u304B\u306B\u4EBA\u9593\u3068\u5165\u308C\u66FF\u308F\u308A\u3001\u591C\u306B\u306A\u308B\u3068\u4EBA\u9593\u3092\u8972\u3046\u3068\u3044\u3046\u9B54\u7269\u3002\u4E0D\u5B89\u306B\u99C6\u3089\u308C\u305F\u6751\u4EBA\u305F\u3061\u306F\u3001\u96C6\u4F1A\u6240\u3078\u3068\u96C6\u307E\u308B\u306E\u3060\u3063\u305F\u2026\u2026\u3002",
    "\u304D\u307F\u306F\u81EA\u3089\u306E\u6B63\u4F53\u3092\u77E5\u3063\u305F\u3002\u3055\u3042\u3001\u6751\u4EBA\u306A\u3089\u6575\u3067\u3042\u308B\u4EBA\u72FC\u3092\u9000\u6CBB\u3057\u3088\u3046\u3002\u4EBA\u72FC\u306A\u3089\u2026\u2026\u72E1\u733E\u306B\u632F\u308B\u821E\u3063\u3066\u4EBA\u9593\u305F\u3061\u3092\u78BA\u5B9F\u306B\u4ED5\u7559\u3081\u3066\u3044\u304F\u306E\u3060\u3002",
    "\u5642\u306F\u73FE\u5B9F\u3060\u3063\u305F\u3002\u8840\u5857\u3089\u308C\u305F\u5B9A\u3081\u306B\u5F93\u3046\u9B54\u7269<strong>\u4EBA\u72FC</strong>\u306F\u3001\u78BA\u304B\u306B\u3053\u306E\u4E2D\u306B\u3044\u308B\u306E\u3060\u3002\n\n\u975E\u529B\u306A\u4EBA\u9593\u304C\u4EBA\u72FC\u306B\u5BFE\u6297\u3059\u308B\u305F\u3081\u3001\u6751\u4EBA\u305F\u3061\u306F\u4E00\u3064\u306E\u30EB\u30FC\u30EB\u3092\u5B9A\u3081\u305F\u3002\u6295\u7968\u306B\u3088\u308A\u602A\u3057\u3044\u8005\u3092\u51E6\u5211\u3057\u3066\u3044\u3053\u3046\u3068\u3002\u7F6A\u306E\u306A\u3044\u8005\u3092\u51E6\u5211\u3057\u3066\u3057\u307E\u3046\u4E8B\u3082\u3042\u308B\u3060\u308D\u3046\u304C\u3001\u305D\u308C\u3082\u6751\u306E\u305F\u3081\u306B\u306F\u3084\u3080\u3092\u5F97\u306A\u3044\u3068\u2026\u2026\u3002"
  ]
};
var heavy = {
  sow_locale_id: "heavy",
  label: "\u7D76\u671B\u2620\u8B70\u4E8B",
  help: "\u3059\u3079\u3066\u306E\u5F79\u8077\u3001\u6069\u6075\u3001\u4E8B\u4EF6\u3092\u697D\u3057\u3080\u3053\u3068\u304C\u3067\u304D\u308B\u3001\u300C\u5168\u90E8\u5165\u308A\u300D\u306E\u30BB\u30C3\u30C8\u3067\u3059\u3002",
  intro: [
    "\u72E9\u4EBA\u3082\u7ACB\u3061\u5165\u3089\u306A\u3044\u6DF1\u3044\u68EE\u306E\u5965\u304B\u3089\u3084\u3063\u3066\u304F\u308B\u3001<strong>\u4EBA\u72FC</strong>\u306F\u3001\u3072\u305D\u304B\u306B\u4EBA\u9593\u3068\u5165\u308C\u66FF\u308F\u308A\u591C\u306B\u306A\u308B\u3068\u4EBA\u9593\u3092\u8972\u3046\u3068\u3044\u3046\u3002\u96A3\u56FD\u306E\u51FA\u8EAB\u3067\u3042\u308A\u306A\u304C\u3089\u6226\u529F\u540D\u9AD8\u304F\u3001Sir\u306E\u79F0\u53F7\u3092\u8CDC\u3063\u305F\u82E5\u304D\u82F1\u96C4\u3001Cointoss\u3068\u914D\u4E0B\u306E\u8056\u8CA8\u9A0E\u58EB\u56E3\u306F\u3001\u3053\u306E\u9B54\u7269\u306E\u5642\u3092\u91CD\u304F\u898B\u3066\u3044\u305F\u3002\n\n\u6052\u4F8B\u306B\u306A\u308A\u3064\u3064\u3042\u3063\u305F\u81E8\u6642\u5FB4\u7A0E\u3092\u53CE\u3081\u305F\u6751\u4EBA\u305F\u3061\u306F\u3001\u6C34\u8ECA\u5C0F\u5C4B\u3067\u62DB\u96C6\u306E\u547D\u4EE4\u3092\u53D7\u3051\u3001\u4E0D\u5B89\u3092\u899A\u3048\u3064\u3064\u3082\u96C6\u4F1A\u6240\u3078\u3068\u96C6\u307E\u308B\u306E\u3060\u3063\u305F\u2026\u2026\u3002",
    "\u6559\u4F1A\u306E\u9418\u304C\u9CF4\u3089\u3055\u308C\u3001\u8056\u8CA8\u9A0E\u58EB\u56E3\u304C\u5230\u7740\u3057\u305F\u3002\u6751\u306E\u540D\u58EB\u304C\u5FDC\u5BFE\u3059\u308B\u4E2D\u3001\u96C6\u307E\u3063\u305F\u4EBA\u3005\u306F\u308F\u3051\u3082\u77E5\u3089\u3055\u308C\u305A\u3001\u8A00\u3044\u77E5\u308C\u306C\u4E0D\u5B89\u3092\u611F\u3058\u3066\u3044\u305F\u2026\u2026\u3002\n\u304D\u307F\u306F\u81EA\u3089\u306E\u6B63\u4F53\u3092\u77E5\u3063\u305F\u3002\u3055\u3042\u3001\u6751\u4EBA\u306A\u3089\u6575\u3067\u3042\u308B\u4EBA\u72FC\u3092\u9000\u6CBB\u3057\u3088\u3046\u3002\u4EBA\u72FC\u306A\u3089\u2026\u2026\u72E1\u733E\u306B\u632F\u308B\u821E\u3063\u3066\u4EBA\u9593\u305F\u3061\u3092\u78BA\u5B9F\u306B\u4ED5\u7559\u3081\u3066\u3044\u304F\u306E\u3060\u3002",
    "\u5642\u306F\u73FE\u5B9F\u3060\u3063\u305F\u3002\u8840\u5857\u3089\u308C\u305F\u5B9A\u3081\u306B\u5F93\u3046\u9B54\u7269\u201C\u4EBA\u72FC\u201D\u306F\u3001\u78BA\u304B\u306B\u3053\u306E\u4E2D\u306B\u3044\u308B\u306E\u3060\u3002\n\u6226\u6144\u306E\u8D70\u308B\u306A\u304B\u6559\u4F1A\u306E\u9418\u304C\u9CF4\u308A\u3001\u65B0\u3057\u3044\u6CD5\u5F8B\u304C\u767A\u884C\u3055\u308C\u305F\u3002\u4ECA\u591C\u3088\u308A\u89E3\u6C7A\u306E\u3068\u304D\u307E\u3067\u3072\u3068\u308A\u305A\u3064\u3001\u4EBA\u72FC\u304C\u6210\u308A\u4EE3\u308F\u3063\u305F\u6751\u4EBA\u3092\u51E6\u65AD\u3059\u308B\u7FA9\u52D9\u3092\u8CA0\u3046\u3068\u3044\u3046\u3002\n\n\u8056\u8CA8\u9A0E\u58EB\u56E3\u306E\u7269\u3005\u3057\u3044\u59FF\u306B\u8FFD\u3044\u3064\u3081\u3089\u308C\u3001\u96C6\u3081\u3089\u308C\u305F\u300C\u5BB9\u7591\u8005\u300D\u305F\u3061\u306F\u30EB\u30FC\u30EB\u3092\u5B9A\u3081\u305F\u3002\u6295\u7968\u306B\u3088\u308A\u602A\u3057\u3044\u8005\u3092\u6C7A\u5B9A\u3059\u308B\u3068\u3002\u7F6A\u306E\u306A\u3044\u8005\u3092\u51E6\u5211\u3057\u3066\u3057\u307E\u3046\u4E8B\u3082\u3042\u308B\u3060\u308D\u3046\u3002\u305D\u308C\u3082\u6751\u306E\u305F\u3081\u306B\u306F\u3084\u3080\u3092\u5F97\u306A\u3044\u306E\u3060\u2026\u2026\u3002"
  ]
};
var secret = {
  label: "\u9670\u8B00\u306B\u96C6\u3046\u80E1\u8776",
  help: "\u3059\u3079\u3066\u306E\u5F79\u8077\u3001\u6069\u6075\u3001\u4E8B\u4EF6\u3092\u697D\u3057\u3080\u3053\u3068\u304C\u3067\u304D\u307E\u3059\u3002\u305C\u3072\u898B\u7269\u4EBA\u3092\u9ED2\u5E55\u306B\u3057\u3001\u7FFB\u5F04\u3055\u308C\u308B\u53C2\u52A0\u8005\u305F\u3061\u306E\u904B\u547D\u3092\u5473\u308F\u3044\u307E\u3057\u3087\u3046\u3002",
  intro: [
    "\u9589\u9396\u3055\u308C\u305F\u7A7A\u9593\u3002\n\u9589\u3058\u8FBC\u3081\u3089\u308C\u305F\u30D7\u30EC\u30A4\u30E4\u30FC\u305F\u3061\u3002\n\u30C8\u30E9\u30F3\u30D7\u3092\u6A21\u3057\u305F\u4ED5\u639B\u3051\u304C\u5916\u308C\u306A\u3044\u3002\n\u4E0E\u3048\u3089\u308C\u305F\u30B2\u30FC\u30E0\u306E\u6761\u4EF6\u3092\u30AF\u30EA\u30A2\u3057\u306A\u3051\u308C\u3070\u3001\u3053\u306E\u4ED5\u639B\u3051\u306F\u7206\u767A\u3059\u308B\u3068\u3044\u3046\u3002\u30D7\u30EC\u30A4\u30E4\u30FC\u305F\u3061\u306F\u7A81\u5982\u7A81\u304D\u3064\u3051\u3089\u308C\u305F\u6761\u4EF6\u306B\u534A\u4FE1\u534A\u7591\u306A\u304C\u3089\u3082\u3001\u4E92\u3044\u306B\u60C5\u5831\u3092\u4EA4\u63DB\u3059\u308B\u3079\u304F\u96C6\u3044\u59CB\u3081\u305F\u3002",
    "<strong>\u30B2\u30FC\u30E0\u306E\u958B\u59CB\u304C\u544A\u3052\u3089\u308C\u305F</strong>\u3002\n\u3053\u306E\u3088\u3046\u306A\u30B2\u30FC\u30E0\u304C\u73FE\u5B9F\u306A\u308F\u3051\u304C\u306A\u3044\u3002\u305D\u3046\u7406\u6027\u3092\u50CD\u304B\u305B\u306A\u304C\u3089\u3082\u3001\u30D7\u30EC\u30A4\u30E4\u30FC\u305F\u3061\u306F\u81EA\u3089\u306B\u4E0E\u3048\u3089\u308C\u305F\u52DD\u5229\u6761\u4EF6\u3092\u78BA\u8A8D\u3057\u305F\u3002\u5FC3\u306E\u7247\u9685\u304B\u3089\u6E67\u304D\u3042\u304C\u308B\u4E0D\u5B89\u306B\u7A81\u304D\u52D5\u304B\u3055\u308C\u3001\u751F\u304D\u6B8B\u308B\u305F\u3081\u306B\u884C\u52D5\u3092\u958B\u59CB\u3057\u305F\u306E\u3060\u3002",
    "\u76EE\u306E\u524D\u306B\u8EE2\u304C\u308B\u3001\u304B\u3064\u3066\u4EBA\u9593\u3060\u3063\u305F\u30E2\u30CE\u3002\n\u30B2\u30FC\u30E0\u306F\u73FE\u5B9F\u3060\u3063\u305F\u3002\u30D7\u30EC\u30A4\u30E4\u30FC\u306F\u5426\u5FDC\u306A\u304F\u3053\u306E\u72B6\u6CC1\u3092\u53D7\u3051\u5165\u308C\u308B\u3002\u305D\u308C\u306F\u4ED5\u639B\u3051\u306E\u89E3\u9664\u6761\u4EF6\u306F\u305D\u308C\u305E\u308C\u7570\u306A\u308A\u3001\u8AB0\u304C\u3069\u306E\u4ED5\u639B\u3051\u3092\u6301\u3063\u3066\u3044\u308B\u306E\u304B\u308F\u304B\u3089\u306A\u3044\u3068\u3044\u3046\u30B2\u30FC\u30E0\u3002\n\n^\u81EA\u5206\u306E\u6761\u4EF6\u306F\u96A0\u3055\u306A\u3051\u308C\u3070\u3002^ ~\u3057\u304B\u3057\u5358\u72EC\u884C\u52D5\u306F\u4E0D\u5229\u3002~ ^\u307B\u304B\u306E\u30D7\u30EC\u30A4\u30E4\u30FC\u3068\u5171\u95D8\u3059\u308B\u3079\u304D\u3060\u3002^ ~\u3042\u3048\u3066\u6761\u4EF6\u3092\u660E\u304B\u305D\u3046\u3002~\n^\u2026\u2026\u3044\u3084\u3001\u307E\u3066\u3002^ ~\u3042\u3044\u3064\u306F\u5618\u3092\u3064\u3044\u3066\u3044\u308B\u3093\u3058\u3083\u306A\u3044\u304B\uFF1F~\n\u300C\u306A\u3089\u3070\u3001\u6BBA\u3055\u308C\u308B\u524D\u306B\u3044\u3063\u305D\u2015\u300D\n\n\u7591\u5FC3\u6697\u9B3C\u3001\u305D\u3057\u3066\u6B7B\u3078\u306E\u6050\u6016\u304C\u3001\u4F55\u3088\u308A\u3082\u30D7\u30EC\u30A4\u30E4\u30FC\u305F\u3061\u306E\u9053\u5FB3\u3068\u7406\u6027\u3092\u8755\u3093\u3067\u3044\u304F\u3002"
  ]
};
var complex = {
  sow_locale_id: "complexx",
  label: "ParanoiA",
  help: "\u3059\u3079\u3066\u306E\u5F79\u8077\u3001\u6069\u6075\u3001\u4E8B\u4EF6\u3092\u697D\u3057\u3080\u3053\u3068\u304C\u3067\u304D\u308B\u3001\u300C\u5168\u90E8\u5165\u308A\u300D\u306E\u30BB\u30C3\u30C8\u3067\u3059\u3002",
  intro: [
    "*[\u5584\u826F]: \u304B\u3093\u307A\u304D\n*[IntSec]: \u3072\u307F\u3064\u3051\u3044\u3055\u3064\n*[Power]: \u3052\u3093\u3057\u308A\u3087\u304F\n_HOUR_\u6642\u306E\u30CB\u30E5\u30FC\u30B9\u3067\u3059\u3002\n\u975E\u8A8D\u53EF\u306E\u7D44\u7E54\u304C\u89AA\u611B\u306A\u308B\u30B3\u30F3\u30D4\u30E5\u30FC\u30BF\u30FC\u30FB_NPC_\u3092\u7834\u58CA\u3059\u308B\u305F\u304F\u3089\u307F\u3092\u6301\u3063\u3066\u3044\u308B\u3068\u3001\u3055\u304D\u307B\u3069IntSec\u304C\u660E\u3089\u304B\u306B\u3057\u307E\u3057\u305F\u3002\u5584\u826F\u306A\u5E02\u6C11\u306F\u3059\u307F\u3084\u304B\u306B\u6240\u5B9A\u306E\u7DCA\u6025\u907F\u96E3\u5834\u6240\u3078\u96C6\u307E\u308A\u307E\u3057\u3087\u3046\u3002\n\n\u5927\u5909\u306A\u4E8B\u614B\u3067\u3059\u306D\u3002\u79D8\u5BC6\u7D50\u793E\u3068\u3044\u3046\u3068\u3001\u5C4B\u5916\u3092\u6563\u6B69\u3057\u305F\u308A\u3001\u3092\u62D2\u5426\u3059\u308B\u3068\u3044\u3063\u305F\u5947\u884C\u304C\u77E5\u3089\u308C\u3066\u3044\u307E\u3059\u304C\u2026\u2026",
    "*[\u5584\u826F]: \u304B\u3093\u307A\u304D\n*[\u30B4\u30B7\u30B4\u30B7\u30DC\u30C3\u30C8]: squeeze bot\n*[R&D]: \u3051\u3093\u304D\u3085\u3046\u3058\u3087\n*[Power]: \u3052\u3093\u3057\u308A\u3087\u304F\n*[PLC]: \u306F\u3044\u304D\u3085\u3046\u3058\u3087\n*[\u30D5\u30A3\u30FC\u30EB\u30C9\u30C6\u30B9\u30C8\u3057]: \u305F\u3081\u3057\u306B\u3064\u304B\u3063\u3066\u307F\u3066\n_HOUR_\u6642\u306E\u30CB\u30E5\u30FC\u30B9\u3067\u3059\u3002\nR&D\u306F\u3001\u7D50\u793E\u5BFE\u6297\u63AA\u7F6E\u306E\u4E00\u74B0\u3068\u3057\u3066\u65B0\u88C5\u5099\u3092\u958B\u767A\u3057\u307E\u3057\u305F\u3002\n\u5584\u826F\u306A\u5E02\u6C11\u306FPLC\u304B\u3089\u88C5\u5099\u3092\u53D7\u9818\u3001\u30D5\u30A3\u30FC\u30EB\u30C9\u30C6\u30B9\u30C8\u3057\u3001\u7D50\u793E\u3092\u767A\u898B\u3057\u307E\u3057\u3087\u3046\u3002\n\n\u652F\u7D66\u54C1\u306E\u6A5F\u5BC6\u306F\u5584\u826F\u306B\u7BA1\u7406\u3055\u308C\u3066\u3044\u308B\u306E\u3067\u3001\u53E3\u3092\u6ED1\u3089\u305B\u306A\u3044\u3053\u3068\u3067\u3059\u306D\u3002\u6B21\u306E\u30CB\u30E5\u30FC\u30B9\u3002\u30B4\u30B7\u30B4\u30B7\u30DC\u30C3\u30C8\u91CF\u7523\u5DE5\u5834\u3067\u3001\u5927\u91CF\u306E\u30C1\u30E7\u30B3\u30EC\u30FC\u30C8\u304C\u2026\u2026",
    '_HOUR_\u6642\u306E\u30CB\u30E5\u30FC\u30B9\u3067\u3059\u3002\n\u6628\u591C\u672A\u660E\u3001<span data-ruby="\u307B\u3044\u304F\u3048\u3093">\u57F9\u990A\u69FD</span>\u304C\u8972\u6483\u3092\u53D7\u3051\u307E\u3057\u305F\u3002_NPC_\u304C\u7834\u58CA\u3055\u308C\u3001\u30AF\u30ED\u30FC\u30F3\u3068\u8A18\u61B6\u306E\u5099\u84C4\u306F\u5931\u308F\u308C\u307E\u3057\u305F\u3002\n\u6B21\u306E\u30AF\u30ED\u30FC\u30F3\u306F\u306A\u306B\u3072\u3068\u3064\u3046\u307E\u304F\u3084\u308B\u3053\u3068\u304C\u3067\u304D\u306A\u3044\u306E\u3067\u3001\u4ECA\u65E5\u304B\u3089\u306E\u25BCzap\u25BC\u306F~\u30D6\u30C4\u30F3~\n\uFF08\u3059\u3079\u3066\u306E\u30CB\u30E5\u30FC\u30B9\u30FB\u30C1\u30E3\u30F3\u30CD\u30EB\u306F\u6C88\u9ED9\u3057\u3001\u5929\u4E95\u306F\u771F\u3063\u6697\u306B\u6D88\u706F\u3057\u305F\u3002\uFF09\n\n\u305D\u3057\u3066\u9759\u5BC2\u306E\u4E2D\u3001\u8AB0\u304B\u304C\u8A00\u3044\u51FA\u3057\u307E\u3059\u3002\u4ECA\u65E5\u304B\u3089\u306F\u3001\u25BCzap\u25BC\u306F\u4E00\u65E5\u3072\u3068\u308A\u306B\u5236\u9650\u3057\u3088\u3046\u3002\u53B3\u3057\u3044\u5236\u9650\u3060\u304C\u3001\u6211\u6162\u3059\u308B\u3093\u3060\u3002'
  ]
};
var orbit = {
  sow_locale_id: "star",
  label: "Orbital\u2606Star",
  help: "\u5B87\u5B99\u6642\u4EE3\u306B\u7A81\u5165\u3057\u305F\u300C\u5168\u90E8\u5165\u308A\u300D\u306E\u30BB\u30C3\u30C8\u3067\u3059\u3002\u6751\u843D\u5171\u540C\u4F53\u306F\u6E13\u8C37\u3084\u9AD8\u539F\u3067\u306F\u306A\u304F\u3001\u5C0F\u60D1\u661F\u5E2F\u3084\u79FB\u6C11\u8239\u3001\u8ECC\u9053\u30A8\u30EC\u30D9\u30FC\u30BF\u30FC\u306E\u9014\u4E2D\u306B\u3042\u308B\u3067\u3057\u3087\u3046\u3002\u4E8B\u4EF6\u304C\u59CB\u307E\u308B\u307E\u3067\u306F\u3001\u3068\u3066\u3082\u5145\u5B9F\u3057\u305F\u8FD1\u4EE3\u7684\u306A\u30A4\u30F3\u30D5\u30E9\u304C\u6574\u3063\u3066\u3044\u305F\u306E\u3067\u3059\u304C\u2026\u2026",
  intro: [
    "\u591C\u66F4\u3051\u306B\u97FF\u3044\u305F\u7834\u6EC5\u306E\u97F3\u306B\u8D77\u3053\u3055\u308C\u3001\u4E0D\u5B89\u306B\u99C6\u3089\u308C\u305F\u4E57\u5BA2\u305F\u3061\u306F\u96C6\u4F1A\u6240\u3078\u3068\u96C6\u307E\u3063\u305F\u3002\u5358\u7D14\u306A\u76F4\u63A5\u901A\u4FE1\u306E\u6A5F\u80FD\u3057\u304B\u679C\u305F\u3055\u306A\u304F\u306A\u3063\u305F\u643A\u5E2F\u3092\u643A\u3048\u3066\u3002",
    "\u9001\u4FE1\u6A5F\u306F\u4F5C\u52D5\u3057\u306A\u3044\u3002\u6551\u52A9\u306B\u306F\u4F55\u65E5\u3082\u304B\u304B\u308B\u3002\u305D\u308C\u304C\u7D50\u8AD6\u3060\u3063\u305F\u3002\n\u5B9F\u308A\u306E\u306A\u3044\u52AA\u529B\u3092\u5C3D\u304F\u3057\u305F\u672B\u306B\u3001\u8AB0\u3082\u304C\u53B3\u3057\u3044\u72B6\u6CC1\u3092\u7406\u89E3\u3057\u3001\u304D\u307F\u306F\u81EA\u3089\u306E\u4F7F\u547D\u306B\u76EE\u899A\u3081\u305F\u3002\u3057\u304B\u3057\u3001\u672A\u77E5\u306E\u751F\u547D\u4F53<strong>\u4EBA\u72FC</strong>\u306F\u3001\u78BA\u304B\u306B\u3053\u306E\u4E2D\u306B\u3044\u308B\u306E\u3060\u3002\n\u3055\u3042\u3001\u4EBA\u9593\u306A\u3089\u6575\u3067\u3042\u308B\u4EBA\u72FC\u3092\u9000\u6CBB\u3057\u3088\u3046\u3002\u4EBA\u72FC\u306A\u3089\u2026\u2026\u72E1\u733E\u306B\u632F\u308B\u821E\u3063\u3066\u4EBA\u9593\u305F\u3061\u3092\u78BA\u5B9F\u306B\u4ED5\u7559\u3081\u3066\u3044\u304F\u306E\u3060\u3002",
    "\u7269\u8CC7\u3082\u30A8\u30CD\u30EB\u30AE\u30FC\u3082\u9650\u3089\u308C\u305F\u4E2D\u3001\u4EBA\u72FC\u306B\u5BFE\u6297\u3059\u308B\u305F\u3081\u306B\u4E57\u5BA2\u305F\u3061\u306F\u4E00\u3064\u306E\u30EB\u30FC\u30EB\u3092\u5B9A\u3081\u305F\u3002\u6295\u7968\u306B\u3088\u308A\u602A\u3057\u3044\u8005\u3092\u3053\u3053\u304B\u3089\u653E\u308A\u51FA\u305D\u3046\u3068\u3002\u5B87\u5B99\u670D\u3072\u3068\u3064\u3067\u306F\u547D\u306E\u4FDD\u8A3C\u304C\u306A\u3044\u304C\u3001\u305D\u308C\u3082\u3084\u3080\u3092\u5F97\u306A\u3044\u3068\u2026\u2026\u3002"
  ]
};
var alien = {
  label: "Alien\u2606Star",
  help: "\u5B87\u5B99\u6642\u4EE3\u306B\u7A81\u5165\u3057\u305F\u300C\u5168\u90E8\u5165\u308A\u300D\u306E\u30BB\u30C3\u30C8\u3067\u3059\u3002\u6751\u843D\u5171\u540C\u4F53\u306F\u6E13\u8C37\u3084\u9AD8\u539F\u3067\u306F\u306A\u304F\u3001\u5C0F\u60D1\u661F\u5E2F\u3084\u79FB\u6C11\u8239\u3001\u8ECC\u9053\u30A8\u30EC\u30D9\u30FC\u30BF\u30FC\u306E\u9014\u4E2D\u306B\u3042\u308B\u3067\u3057\u3087\u3046\u3002\u4E8B\u4EF6\u304C\u59CB\u307E\u308B\u307E\u3067\u306F\u3001\u3068\u3066\u3082\u5145\u5B9F\u3057\u305F\u8FD1\u4EE3\u7684\u306A\u30A4\u30F3\u30D5\u30E9\u304C\u6574\u3063\u3066\u3044\u305F\u306E\u3067\u3059\u304C\u2026\u2026",
  intro: [
    "\u3053\u306E\u6751\u843D\u5171\u540C\u4F53\u306B\u3082\u6050\u308B\u3079\u304D\u5642\u304C\u6D41\u308C\u3066\u304D\u305F\u3002\u30E9\u30A4\u30D5\u30E9\u30A4\u30F3\u3092\u5BF8\u65AD\u3057\u3001\u8ECC\u9053\u5909\u66F4\u306E\u63A8\u9032\u529B\u3092\u596A\u3046<strong>\u4EBA\u72FC</strong>\u306E\u8105\u5A01\u3002\u3072\u305D\u304B\u306B\u4EBA\u9593\u3068\u5165\u308C\u66FF\u308F\u308A\u3001\u591C\u306B\u306A\u308B\u3068\u4EBA\u9593\u3092\u8972\u3046\u672A\u77E5\u306E\u751F\u547D\u4F53\u3002\u306A\u305C\u304B\u5358\u7D14\u306A\u76F4\u63A5\u901A\u4FE1\u306E\u6A5F\u80FD\u3057\u304B\u679C\u305F\u3055\u306A\u304F\u306A\u3063\u305F\u643A\u5E2F\u3092\u643A\u3048\u3001\u4E0D\u5B89\u306B\u99C6\u3089\u308C\u305F\u6751\u4EBA\u305F\u3061\u306F\u96C6\u4F1A\u6240\u3078\u3068\u96C6\u307E\u3063\u305F\u3002",
    "\u304D\u307F\u306F\u81EA\u3089\u306E\u6B63\u4F53\u3092\u77E5\u3063\u305F\u3002\u3055\u3042\u3001\u6751\u4EBA\u306A\u3089\u6575\u3067\u3042\u308B\u4EBA\u72FC\u3092\u9000\u6CBB\u3057\u3088\u3046\u3002\u4EBA\u72FC\u306A\u3089\u2026\u2026\u72E1\u733E\u306B\u632F\u308B\u821E\u3063\u3066\u4EBA\u9593\u305F\u3061\u3092\u78BA\u5B9F\u306B\u4ED5\u7559\u3081\u3066\u3044\u304F\u306E\u3060\u3002",
    "\u5642\u306F\u73FE\u5B9F\u3060\u3063\u305F\u3002\u8840\u5857\u3089\u308C\u305F\u6D3B\u52D5\u3092\u958B\u59CB\u3057\u305F\u672A\u77E5\u306E\u751F\u547D\u4F53<strong>\u4EBA\u72FC</strong>\u306F\u3001\u78BA\u304B\u306B\u3053\u306E\u4E2D\u306B\u3044\u308B\u306E\u3060\u3002\n\n\u975E\u529B\u306A\u4EBA\u9593\u304C\u4EBA\u72FC\u306B\u5BFE\u6297\u3059\u308B\u305F\u3081\u3001\u6751\u4EBA\u305F\u3061\u306F\u4E00\u3064\u306E\u30EB\u30FC\u30EB\u3092\u5B9A\u3081\u305F\u3002\u6295\u7968\u306B\u3088\u308A\u602A\u3057\u3044\u8005\u3092\u51E6\u5211\u3057\u3066\u3044\u3053\u3046\u3068\u3002\u7F6A\u306E\u306A\u3044\u8005\u3092\u51E6\u5211\u3057\u3066\u3057\u307E\u3046\u4E8B\u3082\u3042\u308B\u3060\u308D\u3046\u304C\u3001\u305D\u308C\u3082\u5171\u540C\u4F53\u306E\u305F\u3081\u306B\u306F\u3084\u3080\u3092\u5F97\u306A\u3044\u3068\u2026\u2026\u3002"
  ]
};
var set_locale_default = {
  regend,
  village,
  heavy,
  secret,
  complex,
  orbit,
  alien
};

// src/lib/pubsub/set_locale/map-reduce.ts
var Locales = MapReduce({
  format: () => {
    return {
      list: []
    };
  },
  reduce: (o, doc) => {
  },
  order: (o, { sort: sort3 }) => {
  }
});
Locales.deploy(set_locale_default);

// src/lib/game/json/set_mark.json
var age_A = {
  label: "\u5168\u5E74\u9F62\u5BFE\u8C61",
  file: "CERO_age_A.svg"
};
var age_B = {
  label: "12\u624D\u4EE5\u4E0A",
  file: "CERO_age_B.svg"
};
var age_C = {
  label: "15\u624D\u4EE5\u4E0A",
  file: "CERO_age_C.svg"
};
var age_D = {
  label: "17\u624D\u4EE5\u4E0A",
  file: "CERO_age_D.svg"
};
var age_Z = {
  label: "18\u624D\u4EE5\u4E0A",
  file: "CERO_age_Z.svg"
};
var age_trial = {
  label: "\u4F53\u9A13\u7248",
  file: "CERO_age_trial.svg"
};
var age_education = {
  label: "\u6559\u80B2\u7528",
  file: "CERO_age_education.svg"
};
var age_reserve = {
  label: "\u4E88\u5B9A",
  file: "CERO_age_reserve.svg"
};
var crude = {
  enable: true,
  file: "CERO_crude.png"
};
var crime = {
  enable: true,
  file: "CERO_crime.svg"
};
var drug = {
  enable: true,
  file: "CERO_drug.svg"
};
var drunk = {
  enable: true,
  file: "CERO_drunk.png"
};
var fear = {
  enable: true,
  file: "CERO_fear.png"
};
var gamble = {
  enable: true,
  file: "CERO_gamble.png"
};
var love2 = {
  enable: true,
  file: "CERO_love.png"
};
var sexy = {
  enable: true,
  file: "CERO_sexy.png"
};
var violence = {
  enable: true,
  file: "CERO_violence.svg"
};
var biohazard = {
  enable: true,
  file: "mood_biohazard.svg"
};
var cat = {
  enable: true,
  file: "mood_cat.svg"
};
var music = {
  enable: true,
  file: "mood_music.svg"
};
var appare = {
  enable: false,
  file: "cd_appare.png"
};
var set_mark_default = {
  age_A,
  age_B,
  age_C,
  age_D,
  age_Z,
  age_trial,
  age_education,
  age_reserve,
  crude,
  crime,
  drug,
  drunk,
  fear,
  gamble,
  love: love2,
  sexy,
  violence,
  biohazard,
  cat,
  music,
  appare
};

// src/lib/pubsub/set_mark/map-reduce.ts
var Marks = MapReduce({
  format: () => {
    return {
      list: []
    };
  },
  reduce: (o, doc) => {
  },
  order: (o, { sort: sort3 }) => {
  }
});
Marks.deploy(set_mark_default);

// src/lib/game/json/set_option.json
var select_role = {
  label: "\u5F79\u8077\u5E0C\u671B",
  help: "\u5F79\u8077\u5E0C\u671B\u3092\u53D7\u3051\u4ED8\u3051\u308B"
};
var random_target = {
  label: "\u30E9\u30F3\u30C0\u30E0",
  help: "\u6295\u7968\u30FB\u80FD\u529B\u306E\u5BFE\u8C61\u306B\u300C\u30E9\u30F3\u30C0\u30E0\u300D\u3092\u542B\u3081\u308B"
};
var seq_event = {
  label: "\u6574\u5217\u4E8B\u4EF6",
  help: "\u4E8B\u4EF6\u304C\u9806\u5E8F\u3069\u304A\u308A\u306B\u767A\u751F\u3059\u308B"
};
var show_id = {
  label: "ID\u516C\u958B",
  help: "\u30E6\u30FC\u30B6\u30FCID\u3092\u516C\u958B\u3059\u308B"
};
var entrust2 = {
  label: "\u59D4\u4EFB\u6295\u7968",
  help: "\u59D4\u4EFB\u6295\u7968\u3092\u3059\u308B"
};
var undead_talk = {
  label: "\u6B7B\u5F8C\u306E\u4F1A\u8A71",
  help: "\u72FC\u30FB\u5996\u7CBE\u3068\u6B7B\u8005\u3068\u306E\u9593\u3067\u3001\u4F1A\u8A71\u304C\u3067\u304D\u308B"
};
var aiming_talk = {
  label: "\u5185\u7DD2\u8A71",
  help: "\u3075\u305F\u308A\u3060\u3051\u306E\u5185\u7DD2\u8A71\u3092\u3059\u308B\u3053\u3068\u304C\u3067\u304D\u308B"
};
var set_option_default = {
  "select-role": select_role,
  "random-target": random_target,
  "seq-event": seq_event,
  "show-id": show_id,
  entrust: entrust2,
  "undead-talk": undead_talk,
  "aiming-talk": aiming_talk
};

// src/lib/pubsub/set_option/map-reduce.ts
var Options = MapReduce({
  format: () => {
    return {
      list: []
    };
  },
  reduce: (o, doc) => {
  },
  order: (o, { sort: sort3 }) => {
  }
});
Options.deploy(set_option_default);

// src/lib/game/json/random.json
var tarot = {
  jester: {
    name: "Jester",
    label: "\u611A\u8005",
    hebrew: "\u05D0"
  },
  magus: {
    name: "Magus",
    label: "\u9B54\u8853\u5E2B",
    hebrew: "\u05D1"
  },
  popess: {
    name: "Popess",
    label: "\u5973\u6559\u7687",
    hebrew: "\u05D2"
  },
  empress: {
    name: "Empress",
    label: "\u5973\u5E1D",
    hebrew: "\u05D3"
  },
  emperor: {
    name: "Emperor",
    label: "\u7687\u5E1D",
    hebrew: "\u05E6"
  },
  pope: {
    name: "Pope",
    label: "\u6559\u7687",
    hebrew: "\u05D5"
  },
  lovers: {
    name: "Lovers",
    label: "\u604B\u4EBA",
    hebrew: "\u05D6"
  },
  chariot: {
    name: "Chariot",
    label: "\u6226\u8ECA",
    hebrew: "\u05D7"
  },
  justice: {
    name: "Justice",
    label: "\u6B63\u7FA9",
    hebrew: "\u05DC"
  },
  hermit: {
    name: "Hermit",
    label: "\u96A0\u8005",
    hebrew: "\u05D9"
  },
  wheel: {
    name: "Wheel of Fortune",
    label: "\u904B\u547D\u306E\u8F2A",
    hebrew: "\u05DB"
  },
  fortitude: {
    name: "Fortitude",
    label: "\u525B\u6BC5",
    hebrew: "\u05D8"
  },
  hanged: {
    name: "Hanged Man",
    label: "\u540A\u3089\u308C\u4EBA",
    hebrew: "\u05DE"
  },
  death: {
    name: "Death",
    label: "\u6B7B\u795E",
    hebrew: "\u05E0"
  },
  temperance: {
    name: "Temperance",
    label: "\u7BC0\u5236",
    hebrew: "\u05E1"
  },
  devil: {
    name: "Devil",
    label: "\u60AA\u9B54",
    hebrew: "\u05E2"
  },
  tower: {
    name: "Tower",
    label: "\u5854",
    hebrew: "\u05E4"
  },
  star: {
    name: "Star",
    label: "\u661F",
    hebrew: "\u05D4"
  },
  moon: {
    name: "Moon",
    label: "\u6708",
    hebrew: "\u05E7"
  },
  sun: {
    name: "Sun",
    label: "\u592A\u967D",
    hebrew: "\u05E8"
  },
  judgement: {
    name: "Judgement",
    label: "\u5BE9\u5224",
    hebrew: "\u05E9"
  },
  world: {
    name: "World",
    label: "\u4E16\u754C",
    hebrew: "\u05EA"
  }
};
var zodiac = {
  Aries: {
    types: ["IAU"],
    symbol: "\u2648",
    label: "\u767D\u7F8A\u5BAE",
    hebrew: "\u05E4",
    ratio: 441.395
  },
  Taurus: {
    types: ["IAU"],
    symbol: "\u2649",
    label: "\u91D1\u725B\u5BAE",
    hebrew: "\u05D0",
    ratio: 797.249
  },
  Gemini: {
    types: ["IAU"],
    symbol: "\u264A\uFE0F",
    label: "\u53CC\u5150\u5BAE",
    hebrew: "\u05D1",
    ratio: 513.761
  },
  Cancer: {
    types: ["IAU"],
    name: "Cancer",
    symbol: "\u264B\uFE0F",
    label: "\u5DE8\u87F9\u5BAE",
    hebrew: "\u05D2",
    ratio: 505.872
  },
  Leo: {
    types: ["IAU"],
    symbol: "\u264C",
    label: "\u7345\u5B50\u5BAE",
    hebrew: "\u05D3",
    ratio: 946.964
  },
  Virgo: {
    types: ["IAU"],
    symbol: "\uFE0F\u264D\uFE0F",
    label: "\u51E6\u5973\u5BAE",
    hebrew: "\u05D4",
    ratio: 1294.428
  },
  Libra: {
    types: ["IAU"],
    symbol: "\u264E\uFE0F",
    label: "\u5929\u79E4\u5BAE",
    hebrew: "\u05D5",
    ratio: 538.052
  },
  Scorpius: {
    types: ["IAU"],
    symbol: "\u264F\uFE0F",
    label: "\u5929\u874E\u5BAE",
    hebrew: "\u05D9"
  },
  Sagittarius: {
    types: ["IAU"],
    symbol: "\u2650\uFE0F",
    label: "\u4EBA\u99AC\u5BAE",
    hebrew: "\u05DB",
    ratio: 867.432
  },
  Capricorn: {
    types: ["IAU"],
    name: "Capricorn",
    symbol: "\u2651\uFE0F",
    label: "\u78E8\u7FAF\u5BAE",
    hebrew: "\u05DC",
    ratio: 497.783
  },
  Aquarius: {
    types: ["IAU"],
    symbol: "\u2652\uFE0F",
    label: "\u5B9D\u74F6\u5BAE",
    hebrew: "\u05DE",
    ratio: 979.854
  },
  Pisces: {
    types: ["IAU"],
    symbol: "\u2653\uFE0F",
    label: "\u53CC\u9B5A\u5BAE",
    hebrew: "\u05E1",
    ratio: 889.417
  },
  Ophiuchus: {
    types: ["IAU"],
    symbol: "\u26CE",
    label: "\u86C7\u9063\u5EA7",
    hebrew: "",
    ratio: 948.34
  }
};
var Ptolemaic = {
  Andromeda: {
    types: ["IAU"],
    label: "\u30A2\u30F3\u30C9\u30ED\u30E1\u30C0\u5EA7",
    ratio: 722.278
  },
  Aquila: {
    types: ["IAU"],
    label: "\u9DF2\u5EA7",
    ratio: 652.473
  },
  Ara: {
    types: ["IAU"],
    label: "\u796D\u58C7\u5EA7",
    ratio: 237.057
  },
  Auriga: {
    types: ["IAU"],
    label: "\u5FA1\u8005\u5EA7",
    ratio: 657.438
  },
  Bootes: {
    types: ["IAU"],
    label: "\u725B\u98FC\u5EA7",
    ratio: 906.831
  },
  "Canis Major": {
    types: ["IAU"],
    label: "\u5927\u72AC\u5EA7",
    ratio: 380.118
  },
  "Canis Minor": {
    types: ["IAU"],
    label: "\u5C0F\u72AC\u5EA7",
    ratio: 183.367
  },
  Cassiopeia: {
    types: ["IAU"],
    label: "\u30AB\u30B7\u30AA\u30DA\u30E4\u5EA7",
    ratio: 598.407
  },
  Centaurus: {
    types: ["IAU"],
    label: "\u30B1\u30F3\u30BF\u30A6\u30EB\u30B9\u5EA7",
    ratio: 1060.422
  },
  Cepheus: {
    types: ["IAU"],
    label: "\u30B1\u30D5\u30A7\u30A6\u30B9\u5EA7",
    ratio: 587.787
  },
  Cetus: {
    types: ["IAU"],
    label: "\u9BE8\u5EA7",
    ratio: 1231.411
  },
  "Corona Australis": {
    types: ["IAU"],
    label: "\u5357\u306E\u51A0\u5EA7",
    ratio: 127.696
  },
  "Corona Borealis": {
    types: ["IAU"],
    label: "\u51A0\u5EA7",
    ratio: 178.71
  },
  Corvus: {
    types: ["IAU"],
    label: "\u70CF\u5EA7",
    ratio: 183.801
  },
  Crater: {
    types: ["IAU"],
    label: "\u676F\u5EA7",
    ratio: 282.398
  },
  Cygnus: {
    types: ["IAU"],
    label: "\u767D\u9CE5\u5EA7",
    ratio: 803.983
  },
  Delphinus: {
    types: ["IAU"],
    label: "\u30A4\u30EB\u30AB\u5EA7",
    ratio: 188.549
  },
  Draco: {
    types: ["IAU"],
    label: "\u7ADC\u5EA7",
    ratio: 1082.952
  },
  Equuleus: {
    types: ["IAU"],
    label: "\u4ED4\u99AC\u5EA7",
    ratio: 71.641
  },
  Eridanus: {
    types: ["IAU"],
    label: "\u30A8\u30EA\u30C0\u30CC\u30B9\u5EA7",
    ratio: 1137.919
  },
  Hercules: {
    types: ["IAU"],
    label: "\u30D8\u30E9\u30AF\u30EC\u30B9\u5EA7",
    ratio: 1225.148
  },
  Hydra: {
    types: ["IAU"],
    label: "\u6D77\u86C7\u5EA7",
    ratio: 1302.844
  },
  Lepus: {
    types: ["IAU"],
    label: "\u514E\u5EA7",
    ratio: 290.291
  },
  Lupus: {
    types: ["IAU"],
    label: "\u72FC\u5EA7",
    ratio: 333.683
  },
  Lyra: {
    types: ["IAU"],
    label: "\u7434\u5EA7",
    ratio: 286.476
  },
  Orion: {
    types: ["IAU"],
    label: "\u30AA\u30EA\u30AA\u30F3\u5EA7",
    ratio: 594.997
  },
  Pegasus: {
    types: ["IAU"],
    label: "\u30DA\u30AC\u30B9\u30B9\u5EA7",
    ratio: 1120.794
  },
  Perseus: {
    types: ["IAU"],
    label: "\u30DA\u30EB\u30BB\u30A6\u30B9\u5EA7",
    ratio: 614.997
  },
  "Piscis Austrinus": {
    types: ["IAU"],
    label: "\u5357\u306E\u9B5A\u5EA7",
    ratio: 245.375
  },
  Sagitta: {
    types: ["IAU"],
    label: "\u77E2\u5EA7",
    ratio: 79.932
  },
  Serpens: {
    types: ["IAU"],
    label: "\u86C7\u5EA7",
    ratio: 636.928
  },
  Triangulum: {
    types: ["IAU"],
    label: "\u4E09\u89D2\u5EA7",
    ratio: 131.847
  },
  "Ursa Major": {
    types: ["IAU"],
    label: "\u5927\u718A\u5EA7",
    ratio: 1279.66
  },
  "Ursa Minor": {
    types: ["IAU"],
    label: "\u5C0F\u718A\u5EA7",
    ratio: 255.864
  }
};
var Lacaille = {
  Antlia: {
    types: ["IAU"],
    label: "\u30DD\u30F3\u30D7\u5EA7",
    ratio: 238.901
  },
  Caelum: {
    types: ["IAU"],
    label: "\u5F6B\u523B\u5177\u5EA7",
    ratio: 124.865
  },
  Carina: {
    types: ["IAU"],
    label: "\u7ADC\u9AA8\u5EA7",
    ratio: 494.184
  },
  Circinus: {
    types: ["IAU"],
    label: "\u30B3\u30F3\u30D1\u30B9\u5EA7",
    ratio: 93.353
  },
  Fornax: {
    types: ["IAU"],
    label: "\u7089\u5EA7",
    ratio: 397.502
  },
  Horologium: {
    types: ["IAU"],
    label: "\u6642\u8A08\u5EA7",
    ratio: 248.885
  },
  Mensa: {
    types: ["IAU"],
    label: "\u30C6\u30FC\u30D6\u30EB\u5C71\u5EA7",
    ratio: 153.484
  },
  Microscopium: {
    types: ["IAU"],
    label: "\u9855\u5FAE\u93E1\u5EA7",
    ratio: 209.513
  },
  Norma: {
    types: ["IAU"],
    label: "\u5B9A\u898F\u5EA7",
    ratio: 165.29
  },
  Octans: {
    types: ["IAU"],
    label: "\u516B\u5206\u5100\u5EA7",
    ratio: 291.045
  },
  Pictor: {
    types: ["IAU"],
    label: "\u753B\u67B6\u5EA7",
    ratio: 246.739
  },
  Puppis: {
    types: ["IAU"],
    label: "\u826B\u5EA7",
    ratio: 673.434
  },
  Pyxis: {
    types: ["IAU"],
    label: "\u7F85\u91DD\u76E4\u5EA7",
    ratio: 220.833
  },
  Reticulum: {
    types: ["IAU"],
    label: "\u30EC\u30C1\u30AF\u30EB\u5EA7",
    ratio: 113.936
  },
  Sculptor: {
    types: ["IAU"],
    label: "\u5F6B\u523B\u5BA4\u5EA7",
    ratio: 474.764
  },
  Telescopium: {
    types: ["IAU"],
    label: "\u671B\u9060\u93E1\u5EA7",
    ratio: 251.512
  },
  Vela: {
    types: ["IAU"],
    label: "\u5E06\u5EA7",
    ratio: 499.649
  }
};
var Bayer = {
  Apus: {
    types: ["IAU"],
    label: "\u98A8\u9CE5\u5EA7",
    ratio: 206.327
  },
  Chamaeleon: {
    types: ["IAU"],
    label: "\u30AB\u30E1\u30EC\u30AA\u30F3\u5EA7",
    ratio: 131.592
  },
  "Coma Berenices": {
    types: ["IAU"],
    label: "\u9AEA\u306E\u6BDB\u5EA7",
    ratio: 386.475
  },
  Dorado: {
    types: ["IAU"],
    label: "\u65D7\u9B5A\u5EA7",
    ratio: 179.173
  },
  Grus: {
    types: ["IAU"],
    label: "\u9DB4\u5EA7",
    ratio: 365.513
  },
  Hydrus: {
    types: ["IAU"],
    label: "\u6C34\u86C7\u5EA7",
    ratio: 243.035
  },
  Indus: {
    types: ["IAU"],
    label: "\u30A4\u30F3\u30C7\u30A3\u30A2\u30F3\u5EA7",
    ratio: 294.006
  },
  Musca: {
    types: ["IAU"],
    label: "\u877F\u5EA7",
    ratio: 138.355
  },
  Pavo: {
    types: ["IAU"],
    label: "\u5B54\u96C0\u5EA7",
    ratio: 377.666
  },
  Phoenix: {
    types: ["IAU"],
    label: "\u9CF3\u51F0\u5EA7",
    ratio: 469.319
  },
  "Triangulum Australe": {
    types: ["IAU"],
    label: "\u5357\u306E\u4E09\u89D2\u5EA7",
    ratio: 109.978
  },
  Tucana: {
    types: ["IAU"],
    label: "\u5DE8\u5634\u9CE5\u5EA7",
    ratio: 294.557
  },
  Volans: {
    types: ["IAU"],
    label: "\u98DB\u9B5A\u5EA7",
    ratio: 141.354
  }
};
var Plancius = {
  Camelopardalis: {
    types: ["IAU"],
    label: "\u9577\u9838\u9E7F\u5EA7",
    ratio: 756.828
  },
  Columba: {
    types: ["IAU"],
    label: "\u9CE9\u5EA7",
    ratio: 270.184
  },
  Crux: {
    types: ["IAU"],
    label: "\u5357\u5341\u5B57\u5EA7",
    ratio: 68.447
  },
  Monoceros: {
    types: ["IAU"],
    label: "\u4E00\u89D2\u7363\u5EA7",
    ratio: 481.569
  }
};
var Hevelius = {
  "Canes Venatici": {
    types: ["IAU"],
    label: "\u731F\u72AC\u5EA7",
    ratio: 465.194
  },
  Lacerta: {
    types: ["IAU"],
    label: "\u8725\u8734\u5EA7",
    ratio: 200.688
  },
  "Leo Minor": {
    types: ["IAU"],
    label: "\u5C0F\u7345\u5B50\u5EA7",
    ratio: 231.956
  },
  Lynx: {
    types: ["IAU"],
    label: "\u5C71\u732B\u5EA7",
    ratio: 545.386
  },
  Scutum: {
    types: ["IAU"],
    label: "\u76FE\u5EA7",
    ratio: 109.114
  },
  Sextans: {
    types: ["IAU"],
    label: "\u516D\u5206\u5100\u5EA7",
    ratio: 313.515
  },
  Vulpecula: {
    types: ["IAU"],
    label: "\u5C0F\u72D0\u5EA7",
    ratio: 268.165
  }
};
var planet = {
  sun: {
    symbol: "\u2609",
    label: "\u592A\u967D"
  },
  mercury: {
    symbol: "\u263F",
    label: "\u6C34\u661F"
  },
  venus: {
    symbol: "\u2640",
    label: "\u91D1\u661F"
  },
  earth: {
    symbol: "\u{1F728}",
    label: "\u5730\u7403"
  },
  moon: {
    symbol: "\u263E",
    label: "\u6708"
  },
  mars: {
    symbol: "\u2642",
    label: "\u706B\u661F"
  },
  jupiter: {
    symbol: "\u2643",
    label: "\u6728\u661F"
  },
  saturn: {
    symbol: "\u2644",
    label: "\u571F\u661F"
  },
  uranus: {
    symbol: "\u26E2",
    label: "\u5929\u738B\u661F"
  },
  neptune: {
    symbol: "\u2646",
    label: "\u6D77\u738B\u661F"
  },
  pluto: {
    symbol: "\u2647",
    label: "\u51A5\u738B\u661F"
  },
  ceres: {
    symbol: "\u26B3",
    label: "\u30B1\u30EC\u30B9"
  },
  pallas: {
    symbol: "\u26B4",
    label: "\u30D1\u30E9\u30B9"
  },
  juno: {
    symbol: "\u26B5",
    label: "\u30B8\u30E5\u30CE\u30FC"
  },
  vesta: {
    symbol: "\u26B6",
    label: "\u30F4\u30A7\u30B9\u30BF"
  },
  chiron: {
    symbol: "\u26B7",
    label: "\u30AD\u30ED\u30F3"
  },
  lilith: {
    symbol: "\u26B8",
    label: "\u30EA\u30EA\u30B9"
  },
  dragonhead: {
    symbol: "\u260A",
    label: "\u7F85\u777A"
  },
  dragontail: {
    symbol: "\u260B",
    label: "\u8A08\u90FD"
  },
  comet: {
    symbol: "\u2604",
    label: "\u5F57\u661F"
  }
};
var chess = {
  "White King": {
    ratio: 1,
    symbol: "\u2654",
    label: "\u767D\u738B"
  },
  "White Queen": {
    ratio: 1,
    symbol: "\u2655",
    label: "\u767D\u5983"
  },
  "White Rook": {
    ratio: 2,
    symbol: "\u2656",
    label: "\u767D\u5854"
  },
  "White Bishop": {
    ratio: 2,
    symbol: "\u2657",
    label: "\u767D\u50E7"
  },
  "White Knight": {
    ratio: 2,
    symbol: "\u2658",
    label: "\u767D\u9A0E"
  },
  "White Pawn": {
    ratio: 8,
    symbol: "\u2659",
    label: "\u767D\u5175"
  },
  "Black King": {
    ratio: 1,
    symbol: "\u265A",
    label: "\u9ED2\u738B"
  },
  "Black Queen": {
    ratio: 1,
    symbol: "\u265B",
    label: "\u9ED2\u5983"
  },
  "Black Rook": {
    ratio: 2,
    symbol: "\u265C",
    label: "\u9ED2\u5854"
  },
  "Black Bishop": {
    ratio: 2,
    symbol: "\u265D",
    label: "\u9ED2\u50E7"
  },
  "Black Knight": {
    ratio: 2,
    symbol: "\u265E",
    label: "\u9ED2\u9A0E"
  },
  "Black Pawn": {
    ratio: 8,
    symbol: "\u265F",
    label: "\u9ED2\u5175"
  }
};
var weather = {
  fine: {
    ratio: 8,
    symbol: "\u2600",
    label: "\u6674\u5929"
  },
  partly: {
    ratio: 8,
    symbol: "\u{1F324}\uFE0F",
    label: "\u66C7\u6674"
  },
  cloudy: {
    ratio: 8,
    symbol: "\u2601",
    label: "\u66C7\u5929"
  },
  fog: {
    ratio: 1,
    symbol: "\u{1F301}",
    label: "\u9727\u4E2D"
  },
  rainy: {
    ratio: 8,
    symbol: "\u2602",
    label: "\u964D\u96E8"
  },
  outrain: {
    ratio: 8,
    symbol: "\u{1F302}",
    label: "\u96E8\u5F8C"
  },
  shower: {
    ratio: 8,
    symbol: "\u2614",
    label: "\u4FC4\u96E8"
  },
  thunder: {
    ratio: 1,
    symbol: "\u26A1",
    label: "\u843D\u96F7"
  },
  twister: {
    ratio: 1,
    symbol: "\u{1F32A}",
    label: "\u7ADC\u5DFB"
  },
  thunderstorm: {
    ratio: 1,
    symbol: "\u26C8\uFE0F",
    label: "\u96F7\u96E8"
  },
  rainbow: {
    ratio: 2,
    symbol: "\u{1F308}",
    label: "\u8679\u5929"
  }
};
var coin = {
  front: {
    ratio: 500,
    label: "\u8868"
  },
  back: {
    ratio: 500,
    label: "\u88CF"
  },
  stand: {
    ratio: 1,
    label: "\u7ACB\u3063\u305F"
  }
};
var eto10 = {
  \u7532: {
    name: "\u304D\u306E\u3048"
  },
  \u4E59: {
    name: "\u304D\u306E\u3068"
  },
  \u4E19: {
    name: "\u3072\u306E\u3048"
  },
  \u4E01: {
    name: "\u3072\u306E\u3068"
  },
  \u620A: {
    name: "\u3064\u3061\u306E\u3048"
  },
  \u5DF1: {
    name: "\u3064\u3061\u306E\u3068"
  },
  \u5E9A: {
    name: "\u304B\u306E\u3048"
  },
  \u8F9B: {
    name: "\u304B\u306E\u3068"
  },
  \u58EC: {
    name: "\u307F\u305A\u306E\u3048"
  },
  \u7678: {
    name: "\u307F\u305A\u306E\u3068"
  }
};
var eto12 = {
  \u5B50: {
    name: "\u306D"
  },
  \u4E11: {
    name: "\u3046\u3057"
  },
  \u5BC5: {
    name: "\u3068\u3089"
  },
  \u536F: {
    name: "\u3046"
  },
  \u8FB0: {
    name: "\u305F\u3064"
  },
  \u5DF3: {
    name: "\u307F"
  },
  \u5348: {
    name: "\u3046\u307E"
  },
  \u672A: {
    name: "\u3072\u3064\u3058"
  },
  \u7533: {
    name: "\u3055\u308B"
  },
  \u9149: {
    name: "\u3068\u308A"
  },
  \u620C: {
    name: "\u3044\u306C"
  },
  \u4EA5: {
    name: "\u3044"
  }
};
var random_default = {
  tarot,
  zodiac,
  Ptolemaic,
  Lacaille,
  Bayer,
  Plancius,
  Hevelius,
  planet,
  chess,
  weather,
  coin,
  eto10,
  eto12
};

// src/lib/pubsub/set_random/map-reduce.ts
var SUITES = ["", "\u2662", "\u2661", "\u2663", "\u2660"];
var RANKS = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var ROMANS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
  "XV",
  "XVI",
  "XVII",
  "XVIII",
  "XIX",
  "XX",
  "XXI"
];
var Randoms = MapReduce({
  format: () => ({
    list: [],
    count: 0,
    all: 0,
    type: {}
  }),
  reduce: (data, doc) => {
    emit2(data);
    for (const type of doc.types) {
      const o = dic(data.type, type, {});
      emit2(o);
      o.list.push(doc);
    }
    function emit2(o) {
      if (!o.list) {
        o.list = [];
        o.count = 0;
        o.all = 0;
      }
      o.count += 1;
      o.all += doc.ratio;
    }
  },
  order: (data, { sort: sort3 }) => {
  }
});
for (const type in random_default) {
  const o = random_default[type];
  let order = 0;
  for (const key in o) {
    const oo = o[key];
    order++;
    oo.order = order;
    oo.name ??= key;
    oo.label ??= key;
    oo.ratio ??= 1;
    oo.types ??= [];
    if (!oo.types.includes(type))
      oo.types.push(type);
    oo._id = (oo.name || oo.label || key).replace(/ /g, "");
    if (["eto10", "eto12"].includes(type))
      oo._id = key;
    if (["zodiac", "tarot"].includes(type))
      oo.roman = ROMANS[order];
    Randoms.add([oo]);
  }
}
(function() {
  const ratio = 1;
  const types = ["eto"];
  const now_year = new Date().getFullYear();
  for (let idx = 0; idx < 60; ++idx) {
    const eto102 = "\u7532\u4E59\u4E19\u4E01\u620A\u5DF1\u5E9A\u8F9B\u58EC\u7678"[idx % 10];
    const eto122 = "\u5B50\u4E11\u5BC5\u536F\u8FB0\u5DF3\u5348\u672A\u7533\u9149\u620C\u4EA5"[idx % 12];
    const a = Randoms.find(eto102);
    const b = Randoms.find(eto122);
    const name = `${a.name.replace(/と$/, "\u3068\u306E")}${b.name}`;
    const year = idx + 1984;
    const order = idx + 1;
    const label = `${eto102}${eto122}`;
    const _id = label;
    Randoms.add([{ _id, order, types, ratio, label, name, year }]);
  }
})();
(function() {
  const ratio = 1;
  const suites = SUITES.slice(1);
  const ranks = RANKS;
  suites.forEach((suite, idx1) => {
    ranks.forEach((rank, idx2) => {
      const label = `${suite}${rank}`;
      const suite_code = idx1 + 1;
      const number = idx2 + 1;
      const order = 100 * suite_code + number;
      const _id = order;
      Randoms.add([{ _id, order, types: ["trump"], ratio, number, suite, rank, label }]);
    });
  });
})();
Randoms.add([
  {
    _id: 501,
    order: 501,
    types: ["trump"],
    ratio: 1,
    number: 0,
    suite: "",
    rank: "",
    label: "JOKER"
  },
  {
    _id: 502,
    order: 502,
    types: ["trump"],
    ratio: 1,
    number: 0,
    suite: "",
    rank: "",
    label: "joker"
  }
]);

// src/lib/game/json/set_role_gifts.json
var lost = {
  label: "\u55AA\u5931",
  win: null,
  group: "GIFT",
  able_ids: [],
  help: '\u3042\u306A\u305F\u306F\u8D08\u308A\u7269\u3092<A href="http://dais.kokage.cc/guide/?(Gift)GIFTID_LOST" TARGET="_blank">\u55AA\u5931</A>\u3057\u307E\u3057\u305F\u3002 \u3082\u3046\u4E8C\u5EA6\u3068\u624B\u306B\u3059\u308B\u3053\u3068\u306F\u306A\u3044\u3067\u3057\u3087\u3046\u3002\u3082\u3057\u307E\u305F\u3042\u306A\u305F\u306E\u624B\u306B\u8D08\u308A\u7269\u304C\u6E21\u3063\u3066\u3082\u3001\u6D88\u3048\u53BB\u3063\u3066\u3057\u307E\u3044\u307E\u3059\u3002\u305D\u3057\u3066\u3001\u3042\u306A\u305F\u304C\u305D\u308C\u306B\u6C17\u4ED8\u304F\u3053\u3068\u306F\u306A\u3044\u3067\u3057\u3087\u3046\u3002'
};
var shield = {
  label: "\u5149\u306E\u8F2A",
  win: null,
  group: "GIFT",
  able_ids: ["circular", "guard"],
  help: '\u3042\u306A\u305F\u3092<A href="http://dais.kokage.cc/guide/?(Gift)GIFTID_SHIELD" TARGET="_blank">\u5149\u306E\u8F2A</A>\u304C\u53D6\u308A\u5DFB\u304D\u307E\u3059\u3002 \u3042\u306A\u305F\u306F\u3082\u3057\u6628\u591C\u3001\u8972\u6483\u3055\u308C\u3066\u3044\u305F\u3068\u3057\u3066\u3082\u5B88\u3089\u308C\u307E\u3057\u305F\u3002 \u5149\u306E\u8F2A\u306F\u3072\u3068\u308A\u3092\u4E00\u5EA6\u3057\u304B\u5B88\u308A\u307E\u305B\u3093\u3002'
};
var glass = {
  label: "\u9B54\u93E1",
  win: null,
  group: "GIFT",
  able_ids: ["circular", "see"],
  help: '\u3042\u306A\u305F\u3092<A href="http://dais.kokage.cc/guide/?(Gift)GIFTID_GLASS" TARGET="_blank">\u9B54\u93E1</A>\u304C\u7167\u3089\u3057\u307E\u3059\u3002 \u3042\u306A\u305F\u306F\u3001\u9B54\u93E1\u3092\u6E21\u3059\u76F8\u624B\u3092\u5360\u3044\u307E\u3059\u3002 \u9B54\u93E1\u306F\u3072\u3068\u308A\u3092\u4E00\u5EA6\u3057\u304B\u7167\u3089\u3057\u307E\u305B\u3093\u3002'
};
var ogre = {
  label: "\u60AA\u9B3C",
  win: "WOLF",
  group: "GIFT",
  able_ids: ["wolf", "hunt", "friend", "WSAY"],
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Gift)GIFTID_OGRE" TARGET="_blank">\u60AA\u9B3C</A>\u3067\u3059\u3002 \u8868\u5411\u304D\u306F\u4ED6\u306E\u5F79\u76EE\u3092\u5E2F\u3073\u3066\u3044\u307E\u3059\u304C\u3001\u3042\u306A\u305F\u306F\u4EBA\u3092\u8972\u3046\u60AA\u3044\u9B3C\u306A\u306E\u3067\u3059\u3002'
};
var fairy = {
  label: "\u5996\u7CBE\u306E\u5B50",
  win: "PIXI",
  group: "GIFT",
  able_ids: ["pixi"],
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Gift)GIFTID_FAIRY" TARGET="_blank">\u5996\u7CBE\u304B\u3089\u751F\u307E\u308C\u305F\u5B50</A>\u3067\u3059\u3002 \u8868\u5411\u304D\u306F\u4ED6\u306E\u5F79\u76EE\u3092\u5E2F\u3073\u3066\u3044\u307E\u3059\u304C\u3001\u3042\u306A\u305F\u306F\u4EBA\u306A\u3089\u306C\u5B58\u5728\u306A\u306E\u3067\u3059\u3002 \u5360\u3044\u5E2B\u3001\u970A\u80FD\u8005\u306B\u3069\u3046\u5224\u5225\u3055\u308C\u308B\u304B\u306F\u3001\u3082\u3068\u3082\u3068\u306E\u5F79\u8077\u306B\u3088\u308A\u307E\u3059\u3002'
};
var fink = {
  label: "\u534A\u7AEF\u8005",
  win: "EVIL",
  group: "GIFT",
  able_ids: ["evil"],
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Gift)GIFTID_FINK" TARGET="_blank">\u534A\u7AEF\u8005</A>\u3067\u3059\u3002 \u8868\u5411\u304D\u306F\u4ED6\u306E\u5F79\u76EE\u3092\u5E2F\u3073\u3066\u3044\u307E\u3059\u304C\u3001\u3042\u306A\u305F\u306F\u4EBA\u3068\u3082\u3064\u304B\u306C\u3001\u4EBA\u72FC\u3068\u3082\u3064\u304B\u306C\u3001\u534A\u7AEF\u306A\u6B63\u4F53\u3092\u96A0\u3057\u3066\u3044\u307E\u3059\u3002'
};
var decide = {
  label: "\u6C7A\u5B9A\u8005",
  win: null,
  group: "GIFT",
  able: "\u6295\u7968",
  able_ids: ["vote_role"],
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Gift)GIFTID_DECIDE" TARGET="_blank">\u6C7A\u5B9A\u8005</A>\u3067\u3059\u3002 \u3042\u306A\u305F\u306F\u8FFD\u52A0\u7968\u3092\u6295\u3058\u308B\u6A29\u5229\u3092\u6301\u3061\u3064\u3065\u3051\u307E\u3059\u3002\u884C\u4F7F\u3059\u308B\u3053\u3068\u3067\u3001\u5065\u5728\u3092\u793A\u3059\u3053\u3068\u3082\u3067\u304D\u308B\u3067\u3057\u3087\u3046\u3002'
};
var seeronce = {
  label: "\u5922\u5360\u5E2B",
  win: null,
  group: "GIFT",
  able: "\u5360\u3046",
  able_ids: ["once", "see", "spy_wolf"],
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Gift)GIFTID_SEERONCE" TARGET="_blank">\u5922\u5360\u5E2B</A>\u3067\u3059\u3002'
};
var dipsy = {
  label: "\u9154\u6255\u3044",
  win: null,
  group: "GIFT",
  able_ids: [],
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Gift)GIFTID_DIPSY" TARGET="_blank">\u9154\u6255\u3044</A>\u3067\u3059\u3002 \u3042\u306A\u305F\u304C\u4EBA\u5916\u3082\u3057\u304F\u306F\u6751\u4EBA\u306B\u76F8\u5BFE\u3059\u308B\u3082\u306E\u3067\u3042\u308C\u3070\u3001\u81EA\u5206\u306E\u5F79\u5272\u3092\u898B\u5931\u3046\u3053\u3068\u306F\u3042\u308A\u307E\u305B\u3093\u3002 \u307E\u305F\u3001\u5149\u306E\u8F2A\u3084\u9B54\u93E1\u3068\u3044\u3063\u305F\u8D08\u308A\u7269\u3092\u53D7\u3051\u53D6\u3063\u305F\u5834\u5408\u3001\u9154\u3044\u304C\u9192\u3081\u308B\u3053\u3068\u3067\u3057\u3087\u3046\u3002'
};
var lover = {
  label: "\u5F1F\u5B50",
  win: null,
  group: "GIFT",
  able: "\u5165\u9580",
  able_ids: ["aura", "bond", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_LOVER" TARGET="_blank">\u5F1F\u5B50</A>\u3067\u3059\u3002 \u597D\u304D\u306A\u4EBA\u7269\u3092\u5E2B\u5320\u3068\u3057\u3066\u9078\u3073\u3001\u5F1F\u5B50\u5165\u308A\u3057\u307E\u3059\u3002\u6B21\u306E\u671D\u3001\u3042\u306A\u305F\u306F\u982D\u89D2\u3092\u3042\u3089\u308F\u3057\u3001\u7D46\u306E\u5E2B\u5320\u3068\u540C\u3058\u5F79\u8077\u306B\u306A\u3063\u3066\u3044\u307E\u3059\u3002'
};
var robber = {
  label: "\u76D7\u8CCA",
  win: null,
  group: "GIFT",
  able_ids: ["aura", "rob", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_ROBBER" TARGET="_blank">\u76D7\u8CCA</A>\u3067\u3059\u3002'
};
var set_role_gifts_default = {
  lost,
  shield,
  glass,
  ogre,
  fairy,
  fink,
  decide,
  seeronce,
  dipsy,
  lover,
  robber
};

// src/lib/game/json/set_role_lives.json
var leave2 = {
  label: "\u2015",
  win: null,
  group: null,
  able_ids: [],
  help: ""
};
var live = {
  label: "\u751F\u5B58\u8005",
  win: null,
  group: "LIVE",
  able_ids: ["SSAY", "TSAY", "AIM", "commit"],
  help: ""
};
var executed = {
  label: "\u51E6\u5211",
  win: null,
  group: "LIVE",
  able_ids: ["GSAY", "TSAY"],
  help: ""
};
var victim = {
  label: "\u8972\u6483",
  win: null,
  group: "LIVE",
  able_ids: ["GSAY", "TSAY"],
  help: ""
};
var cursed = {
  label: "\u546A\u8A5B",
  win: null,
  group: "LIVE",
  able_ids: ["GSAY", "TSAY"],
  help: ""
};
var droop2 = {
  label: "\u8870\u9000",
  win: null,
  group: "LIVE",
  able_ids: ["GSAY", "TSAY"],
  help: ""
};
var suicide = {
  label: "\u5F8C\u8FFD",
  win: null,
  group: "LIVE",
  able_ids: ["GSAY", "TSAY"],
  help: ""
};
var feared = {
  label: "\u6050\u6016",
  win: null,
  group: "LIVE",
  able_ids: ["GSAY", "TSAY"],
  help: ""
};
var suddendead = {
  label: "\u7A81\u7136\u6B7B",
  win: null,
  group: "LIVE",
  able_ids: ["GSAY", "TSAY"],
  help: ""
};
var set_role_lives_default = {
  leave: leave2,
  live,
  executed,
  victim,
  cursed,
  droop: droop2,
  suicide,
  feared,
  suddendead
};

// src/lib/game/json/set_role_mobs.json
var mob = {
  label: "\u898B\u7269\u4EBA",
  win: "MOB",
  group: null,
  able_ids: [],
  help: "\u898B\u7269\u4EBA\u5168\u822C\u306E\u305F\u3081\u306E\u4EEE\u60F3\u5F79\u8077\u3067\u3059\u3002"
};
var visiter = {
  label: "\u5BA2\u5E2D",
  win: "MOB",
  group: "MOB",
  able_ids: ["VSAY", "TSAY"],
  help: "\u9032\u884C\u4E2D\u4F1A\u8A71\u306F\u5BA2\u5E2D\u540C\u58EB\u306E\u307F"
};
var grave2 = {
  label: "\u88CF\u65B9",
  win: "MOB",
  group: "MOB",
  able_ids: ["VGSAY", "TSAY"],
  help: "\u9032\u884C\u4E2D\u4F1A\u8A71\u306F\u5893\u4E0B\u3068"
};
var alive = {
  label: "\u821E\u53F0",
  win: "MOB",
  group: "MOB",
  able_ids: ["VSAY", "TSAY"],
  help: "\u9032\u884C\u4E2D\u4F1A\u8A71\u306F\u5730\u4E0A\u3001\u5893\u4E0B\u3001\u4E21\u65B9\u3068"
};
var juror = {
  label: "\u966A\u5BE9",
  win: "HUMAN",
  group: "MOB",
  able_ids: ["VSAY", "TSAY", "vote", "entrust"],
  help: "\u9032\u884C\u4E2D\u4F1A\u8A71\u306F\u966A\u5BE9\u540C\u58EB\u306E\u307F\u3002\u966A\u5BE9\uFF08\uFF06\u6C7A\u5B9A\u8005\uFF09\u3060\u3051\u304C\u6295\u7968\u3059\u308B\u3002"
};
var gamemaster = {
  label: "\u9ED2\u5E55",
  win: "MOB",
  group: "MOB",
  able_ids: ["gm_droop", "gm_live", "gm_disable_vote", "gm_enable_vote", "VSAY", "TSAY"],
  help: "\u9032\u884C\u4E2D\u4F1A\u8A71\u306F\u5730\u4E0A\u3001\u5893\u4E0B\u3001\u4E21\u65B9\u3068\u3002\u5834\u3092\u652F\u914D\u3059\u308B\u7279\u6A29\u3092\u3082\u3064\u3002"
};
var set_role_mobs_default = {
  mob,
  visiter,
  grave: grave2,
  alive,
  juror,
  gamemaster
};

// src/lib/game/json/set_role_specials.json
var master = {
  label: "\u6751\u7ACB\u3066\u4EBA",
  win: null,
  group: "SPECIAL",
  able_ids: ["maker", "kick", "muster", "editvilform", "update", "MAKER"]
};
var admin = {
  label: "\u7BA1\u7406\u4EBA",
  win: null,
  group: "SPECIAL",
  able_ids: ["maker", "kick", "muster", "editvilform", "update", "scrapvil", "ADMIN"]
};
var set_role_specials_default = {
  master,
  admin
};

// src/lib/game/json/set_role_traps.json
var blank = {
  label: "\u666E\u901A\u306E\u65E5",
  help: ""
};
var nothing = {
  label: "\u666E\u901A\u306E\u65E5",
  win: null,
  group: "TRAP",
  able_ids: [],
  help: "\u4ECA\u65E5\u306F\u3001\u7279\u5225\u306A\u3053\u3068\u306E\u306A\u3044\u4E00\u65E5\u306E\u3088\u3046\u3060\u3002\u3055\u3042\u666E\u6BB5\u901A\u308A\u3001\u8AB0\u304B\u3092\u51E6\u5211\u53F0\u306B\u304B\u3051\u3088\u3046\u3002"
};
var aprilfool = {
  label: "\u56DB\u6708\u99AC\u9E7F",
  win: null,
  group: "TRAP",
  able_ids: [],
  help: '<h3><A href="http://dais.kokage.cc/guide/?(Event)EVENTID_APRIL_FOOL" TARGET="_blank">\u56DB\u6708\u99AC\u9E7F</A></h3>\n\u5927\u5909\u3001\u5927\u5909\u3001\u5927\u5909\u306A\u3053\u3068\u306B\u306A\u3063\u305F\u3002\u304D\u307F\u306E\u5F79\u8077\u306F\u5909\u5316\u3057\u3066\u3044\u308B\u304B\u3082\u3057\u308C\u306A\u3044\u3002\u3082\u3057\u3082\u8AB0\u304B\u3068\u7D46\u3092\u7D50\u3093\u3067\u3044\u308B\u306A\u3089\u3001\u6025\u306B\u76F8\u624B\u304C\u618E\u304F\u306A\u3063\u3066\u3057\u307E\u3044\u3001\u7D46\u306E\u76F8\u624B\u3060\u3051\u306B\u3057\u304B\u6295\u7968\u3067\u304D\u306A\u3044\u3002 \u305D\u3057\u3066\u609F\u3063\u3066\u3057\u307E\u3063\u305F\u3002\u4ECA\u591C\u3060\u3051\u306F\u3001\u76F8\u65B9\u306E\u5F8C\u3092\u8FFD\u3046\u3053\u3068\u306F\u306A\u3044\u3068\u2026\u2026\u3002\n<table> <tr> <th colspan=3>\u5F79\u8077\u306E\u5909\u8C8C <th rowspan=4>\u203B\u4E00\u65E5\u3067\u5143\u306B\u623B\u308B <tr> <td>\u8CE2\u8005 <td>\u2190\u2192 <td>\u9B54\u5973 <tr> <td>\u5B88\u8B77\u8005 <td>\u2190\u2192 <td>\u9577\u8001 <tr> <td>\u8CDE\u91D1\u7A3C <td>\u2190\u2192 <td>\u5C11\u5973 </table>'
};
var turnfink = {
  label: "\u4E8C\u91CD\u30B9\u30D1\u30A4",
  win: null,
  group: "TRAP",
  able_ids: [],
  help: '<h3><A href="http://dais.kokage.cc/guide/?(Event)EVENTID_TURN_FINK" TARGET="_blank">\u4E8C\u91CD\u30B9\u30D1\u30A4</A></h3>\n\u306A\u3093\u3068\u3044\u3046\u3053\u3068\u3060\u308D\u3046\uFF01\u4E00\u4EBA\u304C\u6751\u5074\u3092\u88CF\u5207\u308A\u3001\u72FC\u306B\u4E0E\u3059\u308B\u534A\u7AEF\u8005\u306B\u306A\u3063\u3066\u3057\u307E\u3063\u305F\u3002\u660E\u65E5\u4EE5\u964D\u3082\u3001\u5F7C\u306F\u6751\u4EBA\u3092\u88CF\u5207\u308A\u7D9A\u3051\u308B\u3060\u308D\u3046\u2026\u2026\u3002\n\u6C7A\u5B9A\u8005\u3084\u5149\u306E\u8F2A\u306E\u6301\u3061\u4E3B\u306A\u3089\u3001\u3053\u306E\u3068\u304D\u306B\u305D\u306E\u529B\u3092\u624B\u653E\u3057\u3066\u3057\u307E\u3046\u3002'
};
var turnfairy = {
  label: "\u5996\u7CBE\u306E\u8F2A",
  win: null,
  group: "TRAP",
  able_ids: [],
  help: '<h3><A href="http://dais.kokage.cc/guide/?(Event)EVENTID_TURN_FAIRY" TARGET="_blank">\u5996\u7CBE\u306E\u8F2A</A></h3>\n\u306A\u3093\u3068\u3044\u3046\u3053\u3068\u3060\u308D\u3046\uFF01\u4E00\u4EBA\u304C\u68EE\u306B\u7ACB\u3061\u5165\u308A\u3001\u5996\u7CBE\u306E\u990A\u5B50\u306B\u306A\u3063\u3066\u3057\u307E\u3063\u305F\u3002\u660E\u65E5\u4EE5\u964D\u3082\u3001\u5F7C\u306F\u6751\u4EBA\u3092\u88CF\u5207\u308A\u7D9A\u3051\u308B\u3060\u308D\u3046\u2026\u2026\u3002\n\u6C7A\u5B9A\u8005\u3084\u5149\u306E\u8F2A\u306E\u6301\u3061\u4E3B\u306A\u3089\u3001\u3053\u306E\u3068\u304D\u306B\u305D\u306E\u529B\u3092\u624B\u653E\u3057\u3066\u3057\u307E\u3046\u3002'
};
var eclipse = {
  label: "\u65E5\u8755",
  win: null,
  group: "TRAP",
  able_ids: [],
  help: '<h3><A href="http://dais.kokage.cc/guide/?(Event)EVENTID_ECLIPSE" TARGET="_blank">\u65E5\u8755</A></h3>\n\u6697\u3044\u65E5\u8755\u304C\u6751\u4E2D\u3092\u8986\u3044\u3001\u304A\u4E92\u3044\u9854\u3082\u540D\u524D\u3082\u89E3\u3089\u306A\u3044\u3002\u3053\u306E\u95C7\u591C\u306F\u4E38\u4E00\u65E5\u7D9A\u304F\u3060\u308D\u3046\u3002\u4ED6\u4EBA\u306B\u306A\u308A\u3059\u307E\u3057\u3001\u8B70\u8AD6\u3092\u6DF7\u4E71\u3055\u305B\u308B\u3053\u3068\u3082\u3067\u304D\u3066\u3057\u307E\u3046\u304B\u3082\u3057\u308C\u306A\u3044\u3002'
};
var cointoss = {
  label: "Sir Cointoss",
  win: null,
  group: "TRAP",
  able_ids: [],
  help: '<h3><A href="http://dais.kokage.cc/guide/?(Event)EVENTID_COINTOSS" TARGET="_blank">Sir Cointoss</A></h3>\n\u304A\u63A7\u3048\u306A\u3055\u3044\u3002\u304A\u63A7\u3048\u306A\u3055\u3044\u3002\u30B3\u30A4\u30F3\u30C8\u30B9\u537F\u306F\u3053\u306E\u6751\u306E\u6295\u7968\u7D50\u679C\u306B\u610F\u898B\u304C\u3042\u308B\u3088\u3046\u3067\u3054\u3056\u3044\u307E\u3059\u3002 \u537F\u306E\u5FA1\u610F\u5411\u306B\u3088\u3063\u3066\u306F\u3001\u6295\u7968\u7D50\u679C\u306B\u57FA\u3065\u3044\u305F\u51E6\u5211\u3092\u53D6\u308A\u6B62\u3081\u306B\u3059\u308B\u3053\u3068\u3082\u3042\u308A\u307E\u3059\u3002 \u4E94\u5206\u4E94\u5206\u304F\u3089\u3044\u304B\u306A\u3002'
};
var force = {
  label: "\u5F71\u97FF\u529B",
  win: null,
  group: "TRAP",
  able_ids: [],
  help: '<h3><A href="http://dais.kokage.cc/guide/?(Event)EVENTID_FORCE" TARGET="_blank">\u5F71\u97FF\u529B</A></h3>\n\u4ECA\u65E5\u306E\u6295\u7968\u7BB1\u306F\u7121\u8272\u900F\u660E\u3060\u3002\u3060\u308C\u304B\u304C\u6295\u7968\u3057\u305F\u77AC\u9593\u306B\u305D\u306E\u5185\u5BB9\u306F\u30CF\u30C3\u30AD\u30EA\u3068\u898B\u3048\u308B\u304B\u3089\u3001\u6295\u7968\u3092\u30BB\u30C3\u30C8\u3059\u308B\u3068\u304D\u306F\u6C17\u3092\u4ED8\u3051\u3066\uFF01'
};
var miracle = {
  label: "\u5947\u8DE1",
  win: null,
  group: "TRAP",
  able_ids: [],
  help: '<h3><A href="http://dais.kokage.cc/guide/?(Event)EVENTID_MIRACLE" TARGET="_blank">\u5947\u8DE1</A></h3>\n\u5E30\u3063\u3066\u304D\u305F\uFF01\u9EC4\u6CC9\u306E\u56FD\u304B\u3089\u3001\u4ECA\u65E5\u306E\u8972\u6483\u3067\u6B7B\u3093\u3060\u72A0\u7272\u8005\u304C\u304B\u3048\u3063\u3066\u304D\u305F\uFF01\u80FD\u529B\u3092\u5931\u3063\u305F\u304B\u3082\u3057\u308C\u306A\u3044\u3051\u308C\u3069\u3001\u305D\u308C\u306F\u4E9B\u7D30\u306A\u3053\u3068\u3060\u3088\uFF01\u306D\uFF01\n\u4EBA\u72FC\u3001\u4E00\u5339\u72FC\u3001\u8CDE\u91D1\u7A3C\u304E\u306A\u3069\u306B\u8972\u308F\u308C\u305F\u6B7B\u8005\u306F\u751F\u304D\u8FD4\u308B\u3002\u305F\u3060\u3057\u3001\u305D\u306E\u80FD\u529B\u306F\u5931\u308F\u308C\u308B\u3002'
};
var prophecy = {
  label: "\u8056\u8005\u306E\u304A\u544A\u3052",
  win: null,
  group: "TRAP",
  able_ids: [],
  help: '<h3><A href="http://dais.kokage.cc/guide/?(Event)EVENTID_PROPHECY" TARGET="_blank">\u8056\u8005\u306E\u304A\u544A\u3052</A></h3>\n\u8056\u8005\u306F\u6C11\u306E\u5922\u6795\u306B\u544A\u3052\u3089\u308C\u307E\u3057\u305F\u3002\u4ECA\u306E\u4EFB\u3088\u308A\u3001<h3>\u6C7A\u5B9A\u8005</h3>\u306B\u3075\u3055\u308F\u3057\u3044\u4EBA\u7269\u304C\u3044\u308B\u3068\u3002 \u65E7\u304D\u4EFB\u52D9\u306F\u89E3\u304B\u308C\u3001\u3042\u305F\u3089\u3057\u3044<h3>\u6C7A\u5B9A\u8005</h3>\u306F\u7686\u306B\u559D\u91C7\u3067\u8FCE\u3048\u5165\u308C\u3089\u308C\u308B\u3060\u308D\u3046\u3002'
};
var clamor = {
  label: "\u4E0D\u6E80",
  win: null,
  group: "TRAP",
  able_ids: [],
  help: '<h3><A href="http://dais.kokage.cc/guide/?(Event)EVENTID_CLAMOR" TARGET="_blank">\u4E0D\u6E80</A></h3>\n\u6751\u306B\u306F\u4E0D\u6E80\u304C\u9B31\u5C48\u3057\u3066\u3044\u308B\u3002\u4ECA\u591C\u306E\u6295\u7968\u3067\u307E\u305F\u4EBA\u9593\u3092\u51E6\u5211\u3057\u3066\u3057\u307E\u3063\u305F\u3089\u2026\u2026\u60AA\u5922\u304C\u59CB\u307E\u308B\u3002 \u306F\u3058\u3051\u305F\u4E0D\u6E80\u306B\u80CC\u4E2D\u3092\u62BC\u3055\u308C\u3001\u8A71\u3057\u5408\u3044\u3082\u306A\u3057\u306B\u3001\u3055\u3089\u306B\u4E00\u4EBA\u306E\u9996\u3092\u5FC5\u8981\u3068\u3059\u308B\u3060\u308D\u3046\u3002'
};
var fire = {
  label: "\u71B1\u610F",
  win: null,
  group: "TRAP",
  able_ids: [],
  help: '<h3><A href="http://dais.kokage.cc/guide/?(Event)EVENTID_FIRE" TARGET="_blank">\u71B1\u610F</A></h3>\n\u6751\u306B\u306F\u671F\u5F85\u306B\u6E80\u3061\u305F\u71B1\u610F\u304C\u6E26\u5DFB\u3044\u3066\u3044\u308B\u3002\u4ECA\u591C\u306E\u6295\u7968\u304C\u3072\u3068\u306A\u3089\u306C\u3082\u306E\u3092\u51E6\u5211\u3067\u304D\u305F\u306A\u3089\u2026\u2026\u60AA\u5922\u304C\u59CB\u307E\u308B\u306E\u3060\u3002 \u306F\u3058\u3051\u305F\u71B1\u610F\u306B\u80CC\u4E2D\u3092\u62BC\u3055\u308C\u3001\u8A71\u3057\u5408\u3044\u3082\u306A\u3057\u306B\u3001\u3055\u3089\u306B\u4E00\u4EBA\u306E\u9996\u3092\u5FC5\u8981\u3068\u3059\u308B\u3060\u308D\u3046\u3002'
};
var nightmare = {
  label: "\u60AA\u5922",
  win: null,
  group: "TRAP",
  able_ids: [],
  help: '<h3><A href="http://dais.kokage.cc/guide/?(Event)EVENTID_NIGHTMARE" TARGET="_blank">\u60AA\u5922</A></h3>\n\u6050\u308D\u3057\u3044\u4E00\u65E5\u304C\u59CB\u307E\u308B\u3002\u4ECA\u65E5\u306F\u6295\u7968\u3060\u3051\u304C\u3067\u304D\u308B\u3002\u767A\u8A00\u3082\u3001\u80FD\u529B\u3082\u4F7F\u3048\u306A\u3044\u3002\u305D\u3057\u3066\u3001\u7A81\u7136\u6B7B\u306F\u767A\u751F\u3057\u306A\u3044\u3002\n\u3055\u3042\u6295\u7968\u3057\u3066\u3001\u3053\u3093\u306A\u65E5\u304C\u65E9\u304F\u904E\u304E\u53BB\u3063\u3066\u3057\u307E\u3046\u3088\u3046\u3001\u3072\u3068\u308A\u7948\u308A\u3092\u6367\u3052\u3088\u3046\u3002'
};
var ghost = {
  label: "\u4EA1\u970A",
  win: null,
  group: "TRAP",
  able_ids: [],
  help: '<h3><A href="http://dais.kokage.cc/guide/?(Event)EVENTID_GHOST" TARGET="_blank">\u4EA1\u970A</A></h3>\n\u4ECA\u591C\u3001\u4EBA\u72FC\u306B\u6BBA\u3055\u308C\u305F\u4EBA\u306F\u4EBA\u72FC\u306B\u306A\u308B\u3002\u307E\u305F\u3001\u8972\u6483\u3092\u5B9F\u884C\u3057\u305F\u4EBA\u72FC\u306F\u547D\u3092\u843D\u3068\u3057\u3066\u3057\u307E\u3046\u3060\u308D\u3046\u3002\u4EBA\u72FC\u3068\u306A\u3063\u305F\u8005\u306F\u5831\u5FA9\u884C\u52D5\u3092\u884C\u308F\u306A\u3044\u3002\u305F\u3060\u3057\u3001\u547D\u62FE\u3044\u3092\u3057\u305F\u306A\u3089\u3070\u4EBA\u72FC\u306B\u306F\u306A\u3089\u306A\u3044\u3002\n\u4E00\u5339\u72FC\u306F\u4EA1\u970A\u3092\u4F5C\u3089\u306A\u3044\u3002'
};
var escape = {
  label: "\u9003\u4EA1",
  win: null,
  group: "TRAP",
  able_ids: [],
  help: "<h3>\u9003\u4EA1</h3>\n\u305B\u3081\u3066\u4E00\u4EBA\u3060\u3051\u3067\u3082\u3001\u306A\u3093\u3068\u304B\u3057\u3066\u9003\u304C\u305D\u3046\u3002\u4ECA\u591C\u306E\u6295\u7968\u3067\u9003\u4EA1\u8005\u3092\u4E00\u4EBA\u6C7A\u3081\u3001\u591C\u4E2D\u306E\u51E6\u5211\u306E\u304B\u308F\u308A\u306B\u5BC6\u304B\u306B\u9003\u304C\u3059\u306E\u3060\u3002\n\u3057\u304B\u3057\u9003\u4EA1\u8005\u306F\u4E00\u65E5\u306E\u3042\u3044\u3060\u9003\u4EA1\u751F\u6D3B\u3092\u7D9A\u3051\u3001\u3064\u3044\u306B\u6751\u3078\u3068\u5E30\u9084\u3057\u3066\u3057\u307E\u3046\u3002\u5E30\u9084\u8005\u306E\u7968\u306F\u901A\u5E38\u306E\u4E09\u500D\u5C0A\u91CD\u3055\u308C\u308B\u3060\u308D\u3046\u3002 \u5B9F\u88C5\u304C\u3081\u3093\u3069\u3046\u3060\u304B\u3089\u3001\u3053\u306E\u307E\u307E\u672A\u5B9A\u7FA9\u306B\u3057\u3066\u304A\u3053\u3046\u304B\u306A\u3002"
};
var seance = {
  label: "\u964D\u970A\u4F1A",
  win: null,
  group: "TRAP",
  able_ids: [],
  help: '<h3><A href="http://dais.kokage.cc/guide/?(Event)EVENTID_SEANSE" TARGET="_blank">\u964D\u970A\u4F1A</A></h3>\n\u3053\u3063\u304F\u308A\u3055\u3093\u3001\u3053\u3063\u304F\u308A\u3055\u3093\u2026\u2026 \u79D8\u5BC6\u306E\u5100\u5F0F\u3067\u3001\u5893\u5834\u306E\u970A\u9B42\u304C\u304B\u3048\u3063\u3066\u304D\u305F\u3002\u4ECA\u65E5\u306B\u9650\u308A\u3001\u751F\u8005\u3082\u59FF\u306E\u898B\u3048\u306C\u6B7B\u8005\u3082\u5C4B\u6839\u3092\u5171\u306B\u3057\u3001\u8B70\u8AD6\u3059\u308B\u3060\u308D\u3046\u3002'
};
var set_role_traps_default = {
  blank,
  nothing,
  aprilfool,
  turnfink,
  turnfairy,
  eclipse,
  cointoss,
  force,
  miracle,
  prophecy,
  clamor,
  fire,
  nightmare,
  ghost,
  escape,
  seance
};

// src/lib/game/json/set_role_turns.json
var entry = {
  label: "\u30A8\u30F3\u30C8\u30EA\u30FC",
  win: null,
  group: "TURN",
  able_ids: ["ENTRY"],
  help: ""
};
var start = {
  label: "\u521D\u65E5",
  win: null,
  group: "TURN",
  able_ids: [],
  help: ""
};
var main = {
  label: "\u4E8C\u65E5\u76EE\u4EE5\u964D",
  win: null,
  group: "TURN",
  able_ids: [],
  help: ""
};
var prologue = {
  label: "\u30D7\u30ED\u30ED\u30FC\u30B0",
  win: null,
  group: "TURN",
  able_ids: ["exit"],
  help: ""
};
var epilogue = {
  label: "\u30A8\u30D4\u30ED\u30FC\u30B0",
  win: null,
  group: "TURN",
  able_ids: [],
  help: ""
};
var set_role_turns_default = {
  entry,
  start,
  main,
  prologue,
  epilogue
};

// src/lib/game/json/set_roles.json
var dyingpossess = {
  label: "\u8870\u9000\u72C2\u4EBA",
  win: "EVIL",
  able_ids: ["aura", "human", "evil", "vote", "entrust"],
  help: ""
};
var aurawolf = {
  label: "\u6C17\u72FC",
  win: "WOLF",
  able_ids: ["aura", "wolf", "hunt", "friend", "spy_aura", "vote", "entrust", "WSAY"],
  help: ""
};
var bind = {
  label: "\u2015",
  win: null,
  group: null,
  able_ids: [],
  help: ""
};
var hide = {
  label: "\uFF1F\uFF1F\uFF1F",
  win: null,
  group: null,
  able_ids: ["hike", "vote", "entrust"],
  help: "\u3042\u306A\u305F\u306F\u6B63\u4F53\u4E0D\u660E\u3067\u3059\u3002"
};
var tangle2 = {
  label: "\u6028\u5FF5",
  win: null,
  able_ids: ["aura", "revenge", "tangle", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_TANGLE" TARGET="_blank">\u6028\u5FF5</A>\u3067\u3059\u3002'
};
var villager = {
  label: "\u6751\u4EBA",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_VILLAGER" TARGET="_blank">\u6751\u4EBA</A>\u3067\u3059\u3002 \u7279\u6B8A\u306A\u80FD\u529B\u306F\u3082\u3063\u3066\u3044\u307E\u305B\u3093\u3002'
};
var stigma2 = {
  label: "\u8056\u75D5\u8005",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "stigma", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_STIGMA" TARGET="_blank">\u8056\u75D5\u8005</A>\u3067\u3059\u3002'
};
var fm2 = {
  label: "\u7D50\u793E\u54E1",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "fm", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_FM" TARGET="_blank">\u7D50\u793E\u54E1</A>\u3067\u3059\u3002 \u72EC\u81EA\u306E\u4EBA\u8108\u3092\u6301\u3064\u79D8\u5BC6\u7D50\u793E\u306E\u4E00\u54E1\u3067\u3059\u3002'
};
var sympathy = {
  label: "\u5171\u9CF4\u8005",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "fm", "human", "vote", "entrust", "PSAY"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_SYMPATHY" TARGET="_blank">\u5171\u9CF4\u8005</A>\u3067\u3059\u3002'
};
var seer = {
  label: "\u5360\u3044\u5E2B",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "see", "spy_wolf", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_SEER" TARGET="_blank">\u5360\u3044\u5E2B</A>\u3067\u3059\u3002'
};
var seerwin = {
  label: "\u4FE1\u4EF0\u5360\u5E2B",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "see", "spy_win", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_SEERWIN" TARGET="_blank">\u4FE1\u4EF0\u5360\u5E2B</A>\u3067\u3059\u3002'
};
var aura2 = {
  label: "\u6C17\u5360\u5E2B",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "see", "spy_aura", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_AURA" TARGET="_blank">\u6C17\uFF08\u30AA\u30FC\u30E9\uFF09\u5360\u3044\u5E2B</A>\u3067\u3059\u3002'
};
var oura = {
  label: "\u6C17\u5360\u5E2B",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "see", "spy_aura", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_AURA" TARGET="_blank">\u6C17\uFF08\u30AA\u30FC\u30E9\uFF09\u5360\u3044\u5E2B</A>\u3067\u3059\u3002'
};
var seerrole = {
  label: "\u8CE2\u8005",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "see", "spy_role", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_SEERROLE" TARGET="_blank">\u8CE2\u8005</A>\u3067\u3059\u3002'
};
var guard2 = {
  label: "\u5B88\u8B77\u8005",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "guard", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_GUARD" TARGET="_blank">\u5B88\u8B77\u8005</A>\u3067\u3059\u3002'
};
var medium2 = {
  label: "\u970A\u80FD\u8005",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "medium", "spy_wolf", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_MEDIUM" TARGET="_blank">\u970A\u80FD\u8005</A>\u3067\u3059\u3002'
};
var mediumwin = {
  label: "\u4FE1\u4EF0\u970A\u80FD\u8005",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "medium", "spy_win", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_MEDIUMWIN" TARGET="_blank">\u4FE1\u4EF0\u970A\u80FD\u8005</A>\u3067\u3059\u3002'
};
var mediumrole = {
  label: "\u5C0E\u5E2B",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "medium", "spy_role", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_MEDIUMROLE" TARGET="_blank">\u5C0E\u5E2B</A>\u3067\u3059\u3002'
};
var necromancer = {
  label: "\u964D\u970A\u8005",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "chkGSAY", "medium", "spy_wolf", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_NECROMANCER" TARGET="_blank">\u964D\u970A\u8005</A>\u3067\u3059\u3002'
};
var follow = {
  label: "\u8FFD\u5F93\u8005",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "human", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_FOLLOW" TARGET="_blank">\u8FFD\u5F93\u8005</A>\u3067\u3059\u3002 \u3060\u308C\u304B\u3092\u4FE1\u3058\u3001\u59D4\u306D\u307E\u3057\u3087\u3046\u3002'
};
var fan = {
  label: "\u717D\u52D5\u8005",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "revenge", "riot", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_FAN" TARGET="_blank">\u717D\u52D5\u8005</A>\u3067\u3059\u3002'
};
var hunter = {
  label: "\u8CDE\u91D1\u7A3C",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "revenge", "sneak", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_HUNTER" TARGET="_blank">\u8CDE\u91D1\u7A3C</A>\u3067\u3059\u3002 \u6BCE\u591C\u3001\u4E00\u4EBA\u3092\u4ED8\u3051\u72D9\u3044\u307E\u3059\u3002'
};
var weredog = {
  label: "\u4EBA\u72AC",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "tafness", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_WEREDOG" TARGET="_blank">\u4EBA\u72AC</A>\u3067\u3059\u3002'
};
var prince = {
  label: "\u738B\u5B50\u69D8",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "august", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_PRINCE" TARGET="_blank">\u738B\u5B50\u69D8</A>\u3067\u3059\u3002'
};
var rightwolf = {
  label: "\u72FC\u8840\u65CF",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "blind", "wolf", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_VILLAGER" TARGET="_blank">\u6751\u4EBA</A>\u3067\u3059\u3002 \u7279\u6B8A\u306A\u80FD\u529B\u306F\u3082\u3063\u3066\u3044\u307E\u305B\u3093\u3002\n\u72FC\u8840\u65CF\u306E\u3042\u306A\u305F\u306F\u3001\u5360\u3044\u5E2B\u3001\u970A\u80FD\u8005\u306B\u4EBA\u72FC\u3068\u5224\u5B9A\u3055\u308C\u307E\u3059\u3002\u3067\u3059\u304C\u3001\u3042\u306A\u305F\u306F\u6751\u4EBA\u3067\u3001\u52DD\u5229\u6761\u4EF6\u3082\u5909\u308F\u308A\u307E\u305B\u3093\u3002 \u52DD\u5229\u3092\u76EE\u6307\u3057\u3066\u9811\u5F35\u308A\u307E\u3057\u3087\u3046\u3002\u5360\u308F\u308C\u308B\u3068\u3001\u6B63\u4F53\u3092\u81EA\u899A\u3057\u8868\u793A\u304C\u5897\u3048\u307E\u3059\u3002'
};
var doctor = {
  label: "\u533B\u5E2B",
  win: "HUMAN",
  group: "HUMAN",
  able: "\u8A3A\u5BDF",
  able_ids: ["aura", "cure", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_DOCTOR" TARGET="_blank">\u533B\u5E2B</A>\u3067\u3059\u3002'
};
var curse2 = {
  label: "\u546A\u4EBA",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "curse", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_CURSE" TARGET="_blank">\u546A\u4EBA</A>\u3067\u3059\u3002'
};
var dying = {
  label: "\u9810\u8A00\u8005",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "droop", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_DYING" TARGET="_blank">\u9810\u8A00\u8005</A>\u3067\u3059\u3002'
};
var invalid = {
  label: "\u75C5\u4EBA",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "revenge", "seal", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_INVALID" TARGET="_blank">\u75C5\u4EBA</A>\u3067\u3059\u3002 \u3042\u306A\u305F\u304C\u547D\u3092\u843D\u3068\u3057\u305F\u3068\u304D\u3001\u72AF\u4EBA\u306F\u75C5\u6C17\u306B\u611F\u67D3\u3057\u307E\u3059\u3002'
};
var alchemist = {
  label: "\u932C\u91D1\u8853\u5E2B",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "once", "revenge", "cling", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_ALCHEMIST" TARGET="_blank">\u932C\u91D1\u8853\u5E2B</A>\u3067\u3059\u3002 \u3042\u306A\u305F\u306F\u4E00\u5EA6\u3060\u3051\u3001\u85AC\u3092\u98F2\u3080\u3053\u3068\u304C\u51FA\u6765\u307E\u3059\u3002'
};
var witch = {
  label: "\u9B54\u5973",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "analeptic", "poison", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_WITCH" TARGET="_blank">\u9B54\u5973</A>\u3067\u3059\u3002 \u3042\u306A\u305F\u306F\u4E8C\u65E5\u76EE\u306B\u3001\u6BD2\u85AC\u3068\u8607\u751F\u85AC\u3092\u3072\u3068\u3064\u305A\u3064\u5B8C\u6210\u3055\u305B\u307E\u3059\u3002'
};
var girl = {
  label: "\u5C11\u5973",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "night", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_GIRL" TARGET="_blank">\u5C11\u5973</A>\u3067\u3059\u3002'
};
var scapegoat2 = {
  label: "\u751F\u8D04",
  win: "HUMAN",
  group: "HUMAN",
  able: "\u7591\u3046",
  able_ids: ["aura", "scapegoat", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_SCAPEGOAT" TARGET="_blank">\u751F\u8D04</A>\u3067\u3059\u3002'
};
var elder = {
  label: "\u9577\u8001",
  win: "HUMAN",
  group: "HUMAN",
  able_ids: ["aura", "revenge", "seal", "twolife", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_ELDER" TARGET="_blank">\u9577\u8001</A>\u3067\u3059\u3002 \u3082\u3057\u3082\u547D\u3092\u843D\u3068\u3057\u305F\u3089\u3001\u3042\u306A\u305F\u306E\u6068\u307F\u306F\u72AF\u4EBA\u3092\u8972\u3044\u307E\u3059\u3002'
};
var jammer2 = {
  label: "\u90AA\u9B54\u4E4B\u6C11",
  win: "EVIL",
  group: "EVIL",
  able: "\u96A0\u3059",
  able_ids: ["aura", "jammer", "human", "evil", "vote", "entrust", "XSAY"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_JAMMER" TARGET="_blank">\u90AA\u9B54\u4E4B\u6C11</A>\u3067\u3059\u3002'
};
var snatch2 = {
  label: "\u5BBF\u501F\u4E4B\u6C11",
  win: "EVIL",
  group: "EVIL",
  able_ids: ["aura", "snatch", "human", "evil", "vote", "entrust", "XSAY"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_SNATCH" TARGET="_blank">\u5BBF\u501F\u4E4B\u6C11</A>\u3067\u3059\u3002'
};
var bat = {
  label: "\u5FF5\u6CE2\u4E4B\u6C11",
  win: "EVIL",
  group: "EVIL",
  able_ids: ["aura", "human", "evil", "vote", "entrust", "XSAY"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_BAT" TARGET="_blank">\u5FF5\u6CE2\u4E4B\u6C11</A>\u3067\u3059\u3002'
};
var possess = {
  label: "\u72C2\u4EBA",
  win: "EVIL",
  group: "EVIL",
  able_ids: ["aura", "human", "evil", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_POSSESS" TARGET="_blank">\u72C2\u4EBA</A>\u3067\u3059\u3002'
};
var fanatic2 = {
  label: "\u72C2\u4FE1\u8005",
  win: "EVIL",
  group: "EVIL",
  able_ids: ["aura", "fanatic", "human", "evil", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_FANATIC" TARGET="_blank">\u72C2\u4FE1\u8005</A>\u3067\u3059\u3002'
};
var muppeting = {
  label: "\u4EBA\u5F62\u4F7F\u3044",
  win: "EVIL",
  group: "EVIL",
  able_ids: ["aura", "human", "evil", "vote", "entrust", "MSAY"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_MUPPETER" TARGET="_blank">\u4EBA\u5F62\u4F7F\u3044</A>\u3067\u3059\u3002'
};
var wisper = {
  label: "\u56C1\u304D\u72C2\u4EBA",
  win: "EVIL",
  group: "EVIL",
  able_ids: ["aura", "human", "evil", "vote", "entrust", "WSAY"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_WISPER" TARGET="_blank">\u56C1\u304D\u72C2\u4EBA</A>\u3067\u3059\u3002 \u5C11\u4EBA\u6570\u306B\u306A\u308B\u3068\u52DD\u6557\u304C\u78BA\u5B9A\u3059\u308B\u72B6\u6CC1\u3082\u3042\u308A\u307E\u3059\u3001\u3067\u3059\u304C\u3053\u306E\u5834\u5408\u3082\u81EA\u52D5\u3067\u7D42\u4E86\u3059\u308B\u3053\u3068\u306F\u3042\u308A\u307E\u305B\u3093\u3002'
};
var cpossess = {
  label: "\u56C1\u304D\u72C2\u4EBA",
  win: "EVIL",
  group: "EVIL",
  able_ids: ["aura", "human", "evil", "vote", "entrust", "WSAY"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_WISPER" TARGET="_blank">\u56C1\u304D\u72C2\u4EBA</A>\u3067\u3059\u3002 \u5C11\u4EBA\u6570\u306B\u306A\u308B\u3068\u52DD\u6557\u304C\u78BA\u5B9A\u3059\u308B\u72B6\u6CC1\u3082\u3042\u308A\u307E\u3059\u3001\u3067\u3059\u304C\u3053\u306E\u5834\u5408\u3082\u81EA\u52D5\u3067\u7D42\u4E86\u3059\u308B\u3053\u3068\u306F\u3042\u308A\u307E\u305B\u3093\u3002'
};
var semiwolf = {
  label: "\u534A\u72FC",
  win: "EVIL",
  group: "EVIL",
  able_ids: ["aura", "wolfify", "human", "evil", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_SEMIWOLF" TARGET="_blank">\u534A\u72FC</A>\u3067\u3059\u3002'
};
var oracle = {
  label: "\u9B54\u795E\u5B98",
  win: "EVIL",
  group: "EVIL",
  able_ids: ["aura", "medium", "spy_role", "human", "evil", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_ORACLE" TARGET="_blank">\u9B54\u795E\u5B98</A>\u3067\u3059\u3002'
};
var sorcerer = {
  label: "\u9B54\u8853\u5E2B",
  win: "EVIL",
  group: "EVIL",
  able_ids: ["aura", "see", "spy_role", "human", "evil", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_SORCERER" TARGET="_blank">\u9B54\u8853\u5E2B</A>\u3067\u3059\u3002'
};
var walpurgis = {
  label: "\u9B54\u6CD5\u5C11\u5E74",
  win: "EVIL",
  group: "EVIL",
  able_ids: ["aura", "grave", "analeptic", "poison", "human", "evil", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_WALPURGIS" TARGET="_blank">\u9B54\u6CD5\u5C11\u5E74</A>\u3067\u3059\u3002 \u3084\u304C\u3066\u547D\u3092\u843D\u3068\u3059\u3068\u9B54\u5973\u306B\u306A\u308B\u3068\u5BBF\u547D\u4ED8\u3051\u3089\u308C\u3066\u3044\u307E\u3059\u3002'
};
var headless = {
  label: "\u9996\u7121\u9A0E\u58EB",
  win: "WOLF",
  group: "WOLF",
  able_ids: ["aura", "wolf", "hunt", "vote", "entrust", "WSAY"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_HEADLESS" TARGET="_blank">\u9996\u306E\u306A\u3044\u9A0E\u58EB</A>\u3067\u3059\u3002 \u3042\u306A\u305F\u306F\u4EBA\u72FC\u4EF2\u9593\u3092\u65AC\u308A\u6368\u3066\u308B\u3053\u3068\u3082\u53AD\u3044\u307E\u305B\u3093\u3002'
};
var wolf2 = {
  label: "\u4EBA\u72FC",
  win: "WOLF",
  group: "WOLF",
  able_ids: ["aura", "wolf", "hunt", "friend", "vote", "entrust", "WSAY"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_WOLF" TARGET="_blank">\u4EBA\u72FC</A>\u3067\u3059\u3002'
};
var intwolf = {
  label: "\u667A\u72FC",
  win: "WOLF",
  group: "WOLF",
  able_ids: ["aura", "wolf", "hunt", "friend", "spy_role", "vote", "entrust", "WSAY"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_INTWOLF" TARGET="_blank">\u667A\u72FC</A>\u3067\u3059\u3002\u7279\u6B8A\u306A\u80FD\u529B\u3092\u6301\u3064\u4EBA\u72FC\u3067\u3059\u3002'
};
var cwolf = {
  label: "\u546A\u72FC",
  win: "WOLF",
  group: "WOLF",
  able_ids: ["aura", "wolf", "curse", "hunt", "friend", "vote", "entrust", "WSAY"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_CURSEWOLF" TARGET="_blank">\u546A\u72FC</A>\u3067\u3059\u3002\u7279\u6B8A\u306A\u80FD\u529B\u3092\u6301\u3064\u4EBA\u72FC\u3067\u3059\u3002'
};
var cursewolf = {
  label: "\u546A\u72FC",
  win: "WOLF",
  group: "WOLF",
  able_ids: ["aura", "wolf", "curse", "hunt", "friend", "vote", "entrust", "WSAY"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_CURSEWOLF" TARGET="_blank">\u546A\u72FC</A>\u3067\u3059\u3002\u7279\u6B8A\u306A\u80FD\u529B\u3092\u6301\u3064\u4EBA\u72FC\u3067\u3059\u3002'
};
var whitewolf = {
  label: "\u767D\u72FC",
  win: "WOLF",
  group: "WOLF",
  able: "\u8972\u3046",
  able_ids: ["hunt", "friend", "vote", "entrust", "WSAY"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_WHITEWOLF" TARGET="_blank">\u767D\u72FC</A>\u3067\u3059\u3002\u7279\u6B8A\u306A\u80FD\u529B\u3092\u6301\u3064\u4EBA\u72FC\u3067\u3059\u3002 \u3042\u306A\u305F\u3092\u5360\u3063\u305F\u5360\u3044\u5E2B\u306F\u3001\u3042\u306A\u305F\u3092\u4EBA\u9593\u3068\u307F\u306A\u3057\u307E\u3059\u3002\u3042\u306A\u305F\u306F\u80FD\u529B\u8005\u7279\u6709\u306E\u30AA\u30FC\u30E9\u3092\u767A\u3057\u307E\u305B\u3093\u3002'
};
var childwolf = {
  label: "\u4ED4\u72FC",
  win: "WOLF",
  group: "WOLF",
  able_ids: ["aura", "wolf", "revenge", "grudge", "hunt", "friend", "vote", "entrust", "WSAY"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_CHILDWOLF" TARGET="_blank">\u4ED4\u72FC</A>\u3067\u3059\u3002\u7279\u6B8A\u306A\u80FD\u529B\u3092\u6301\u3064\u4EBA\u72FC\u3067\u3059\u3002'
};
var dyingwolf = {
  label: "\u8870\u72FC",
  win: "WOLF",
  group: "WOLF",
  able_ids: ["aura", "wolf", "droop", "hunt", "vote", "entrust", "WSAY"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_DYINGWOLF" TARGET="_blank">\u8870\u72FC</A>\u3067\u3059\u3002\u7279\u6B8A\u306A\u80FD\u529B\u3092\u6301\u3064\u4EBA\u72FC\u3067\u3059\u3002'
};
var silentwolf = {
  label: "\u9ED9\u72FC",
  win: "WOLF",
  group: "WOLF",
  able_ids: ["aura", "wolf", "hunt", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_SILENTWOLF" TARGET="_blank">\u9ED9\u72FC</A>\u3067\u3059\u3002 \u4EBA\u72FC\u306E\u8972\u6483\u5BFE\u8C61\u3068\u306A\u308B\u3053\u3068\u306F\u3042\u308A\u307E\u305B\u3093\u304C\u3001\u4EBA\u72FC\uFF08\u3068\u56C1\u304D\u72C2\u4EBA\u3001\u64EC\u72FC\u5996\u7CBE\uFF09\u540C\u58EB\u306B\u3057\u304B\u805E\u3053\u3048\u306A\u3044\u4F1A\u8A71\u306F\u3001\u3042\u306A\u305F\u306B\u306F\u805E\u3053\u3048\u307E\u305B\u3093\u3002'
};
var hamster = {
  label: "\u6817\u9F20\u5996\u7CBE",
  win: "PIXI",
  group: "PIXI",
  able_ids: ["aura", "pixi", "armor", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_PIXI" TARGET="_blank">\u6817\u9F20\u5996\u7CBE</A>\u3067\u3059\u3002'
};
var werebat = {
  label: "\u8759\u8760\u5996\u7CBE",
  win: "PIXI",
  group: "PIXI",
  able_ids: ["aura", "pixi", "armor", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_BAT" TARGET="_blank">\u8759\u8760\u5996\u7CBE</A>\u3067\u3059\u3002 \u3042\u306A\u305F\u306F\u4ED6\u306E\u5996\u7CBE\u304C\u8AB0\u3067\u3042\u308B\u304B\u77E5\u3063\u3066\u3044\u307E\u3059\u3057\u3001\u65B0\u305F\u306B\u751F\u307E\u308C\u305F\u5996\u7CBE\u3092\u77E5\u308B\u3053\u3068\u3082\u3067\u304D\u307E\u3059\u3002\u305F\u3060\u3057\u3001\u59FF\u3092\u63DB\u3048\u3066\u3057\u307E\u3063\u305F\u5BBF\u501F\u5996\u7CBE\u306E\u884C\u65B9\u306F\u308F\u304B\u308A\u307E\u305B\u3093\u3002 \u307E\u305F\u3001\u8759\u8760\u5996\u7CBE\u540C\u58EB\u306B\u3057\u304B\u805E\u3053\u3048\u306A\u3044\u4F1A\u8A71\u304C\u53EF\u80FD\u3067\u3059\u3002'
};
var mimicry = {
  label: "\u64EC\u72FC\u5996\u7CBE",
  win: "PIXI",
  group: "PIXI",
  able_ids: ["aura", "pixi", "armor", "vote", "entrust", "WSAY"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_MIMICRY" TARGET="_blank">\u64EC\u72FC\u5996\u7CBE</A>\u3067\u3059\u3002'
};
var dyingpixi = {
  label: "\u98A8\u82B1\u5996\u7CBE",
  win: "PIXI",
  group: "PIXI",
  able_ids: ["aura", "pixi", "armor", "droop", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_DYINGPIXI" TARGET="_blank">\u98A8\u82B1\u5996\u7CBE</A>\u3067\u3059\u3002'
};
var trickster = {
  label: "\u60AA\u622F\u5996\u7CBE",
  win: "PIXI",
  group: "PIXI",
  able_ids: ["aura", "pixi", "armor", "bonds", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_TRICKSTER" TARGET="_blank">\u60AA\u622F\u5996\u7CBE</A>\u3067\u3059\u3002 \u7D50\u3070\u308C\u305F\u4EBA\u305F\u3061\u306B\u3068\u3063\u3066\u306F\u3001\u5358\u306A\u308B\u306F\u305F\u8FF7\u60D1\u306A\u60AA\u622F\u306B\u3059\u304E\u307E\u305B\u3093\u3002'
};
var hatedevil = {
  label: "\u90AA\u6C17\u60AA\u9B54",
  win: "HATER",
  group: "OTHER",
  able_ids: ["aura", "bonds", "hate", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_HATEDEVIL" TARGET="_blank">\u90AA\u6C17\u60AA\u9B54</A>\u3067\u3059\u3002 \u7D50\u3073\u3064\u3051\u305F\u4E8C\u4EBA\u306E\u3046\u3061\u3001\u3069\u3061\u3089\u304B\u7247\u65B9\u3060\u3051\u304C\u751F\u304D\u5EF6\u3073\u308C\u3070\u3001\u3042\u306A\u305F\u306E\u52DD\u5229\u3068\u306A\u308A\u307E\u3059\u3002\u3042\u306A\u305F\u306B\u305D\u306E\u7D46\u304C\u7D50\u3070\u308C\u3066\u3044\u306A\u3044\u9650\u308A\u3001\u3042\u306A\u305F\u81EA\u8EAB\u306E\u6B7B\u306F\u52DD\u6557\u306B\u306F\u76F4\u63A5\u95A2\u4FC2\u3057\u307E\u305B\u3093\u3002'
};
var hate2 = {
  label: "\u5BBF\u6575",
  win: "HATER",
  group: "BIND",
  able_ids: ["aura", "bonds", "hate", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306B\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_HATEDEVIL" TARGET="_blank">\u5BBF\u6575</A>\u304C\u3044\u307E\u3059\u3002'
};
var love3 = {
  label: "\u604B\u4EBA",
  win: "LOVER",
  group: "BIND",
  able_ids: ["aura", "bonds", "love", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306B\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_LOVEANGEL" TARGET="_blank">\u604B\u4EBA</A>\u304C\u3044\u307E\u3059\u3002'
};
var loveangel = {
  label: "\u604B\u611B\u5929\u4F7F",
  win: "LOVER",
  group: "OTHER",
  able_ids: ["aura", "bonds", "love", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_LOVEANGEL" TARGET="_blank">\u604B\u611B\u5929\u4F7F</A>\u3067\u3059\u3002 \u7D50\u3073\u3064\u3051\u305F\u4E8C\u4EBA\u304C\u751F\u304D\u5EF6\u3073\u308C\u3070\u3001\u3042\u306A\u305F\u306E\u52DD\u5229\u3068\u306A\u308A\u307E\u3059\u3002\u3042\u306A\u305F\u306B\u305D\u306E\u7D46\u304C\u7D50\u3070\u308C\u3066\u3044\u306A\u3044\u9650\u308A\u3001\u3042\u306A\u305F\u81EA\u8EAB\u306E\u6B7B\u306F\u52DD\u6557\u306B\u306F\u76F4\u63A5\u95A2\u4FC2\u3057\u307E\u305B\u3093\u3002'
};
var passion = {
  label: "\u7247\u601D\u3044",
  win: "LOVER",
  group: "OTHER",
  able_ids: ["aura", "bond", "love", "human", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_PASSION" TARGET="_blank">\u7247\u60F3\u3044</A>\u3067\u3059\u3002 \u9078\u3093\u3060\u4EBA\u304C\u751F\u304D\u5EF6\u3073\u3001\u3042\u306A\u305F\u304C\u751F\u304D\u5EF6\u3073\u308C\u3070\u3001\u3042\u306A\u305F\u306E\u52DD\u5229\u3068\u306A\u308A\u307E\u3059\u3002'
};
var lonewolf = {
  label: "\u4E00\u5339\u72FC",
  win: "LONEWOLF",
  group: "WOLF",
  able_ids: ["aura", "wolf", "armor", "kill", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_LONEWOLF" TARGET="_blank">\u4E00\u5339\u72FC</A>\u3067\u3059\u3002 \u8972\u6483\u5148\u306F\u3042\u306A\u305F\u4EE5\u5916\u3067\u3042\u308C\u3070\u8AB0\u3067\u3082\u304B\u307E\u3044\u307E\u305B\u3093\u3002'
};
var guru2 = {
  label: "\u7B1B\u5439\u304D",
  win: "GURU",
  group: "OTHER",
  able_ids: ["aura", "human", "guru", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_GURU" TARGET="_blank">\u7B1B\u5439\u304D</A>\u3067\u3059\u3002'
};
var dish2 = {
  label: "\u9C57\u9B5A\u4EBA",
  win: "DISH",
  group: "OTHER",
  able_ids: ["aura", "human", "dish", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_DISH" TARGET="_blank">\u9C57\u9B5A\u4EBA</A>\u3067\u3059\u3002\u65B0\u9BAE\u306A\u3075\u3043\u30FC\u3063\u3057\u3085\u3002\u3067\u3059\u3002'
};
var bitch2 = {
  label: "\u904A\u3073\u4EBA",
  win: "LOVER",
  group: "OTHER",
  able_ids: ["aura", "human", "bitch", "vote", "entrust"],
  cmd: "role",
  help: '\u3042\u306A\u305F\u306F<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_BITCH" TARGET="_blank">\u904A\u3073\u4EBA</A>\u3067\u3059\u3002 \u672C\u547D\u3068\u3042\u306A\u305F\u304C\u751F\u304D\u5EF6\u3073\u308C\u3070\u3001\u3042\u306A\u305F\u306E\u52DD\u5229\u3067\u3059\u3002'
};
var set_roles_default = {
  dyingpossess,
  aurawolf,
  bind,
  hide,
  tangle: tangle2,
  villager,
  stigma: stigma2,
  fm: fm2,
  sympathy,
  seer,
  seerwin,
  aura: aura2,
  oura,
  seerrole,
  guard: guard2,
  medium: medium2,
  mediumwin,
  mediumrole,
  necromancer,
  follow,
  fan,
  hunter,
  weredog,
  prince,
  rightwolf,
  doctor,
  curse: curse2,
  dying,
  invalid,
  alchemist,
  witch,
  girl,
  scapegoat: scapegoat2,
  elder,
  jammer: jammer2,
  snatch: snatch2,
  bat,
  possess,
  fanatic: fanatic2,
  muppeting,
  wisper,
  cpossess,
  semiwolf,
  oracle,
  sorcerer,
  walpurgis,
  headless,
  wolf: wolf2,
  intwolf,
  cwolf,
  cursewolf,
  whitewolf,
  childwolf,
  dyingwolf,
  silentwolf,
  hamster,
  werebat,
  mimicry,
  dyingpixi,
  trickster,
  hatedevil,
  hate: hate2,
  love: love3,
  loveangel,
  passion,
  lonewolf,
  guru: guru2,
  dish: dish2,
  bitch: bitch2
};

// src/lib/pubsub/set_role/map-reduce.ts
var Roles = MapReduce({
  format: () => {
    return {
      list: [],
      group: {}
    };
  },
  reduce: (o, doc) => {
    dic(o.group, doc.group, {}, "list", []).push(doc);
  },
  order: (o, { sort: sort3 }) => {
  }
});
Roles.deploy(set_role_gifts_default);
Roles.deploy(set_role_lives_default);
Roles.deploy(set_role_mobs_default);
Roles.deploy(set_role_specials_default);
Roles.deploy(set_role_traps_default);
Roles.deploy(set_role_turns_default);
Roles.deploy(set_roles_default);

// src/lib/game/json/set_says.json
var say5 = {
  label: "\u5BE1\u9ED9\u3078\u306E\u6311\u6226",
  help: "5\u56DEx200\u5B57 \uFF0824h\u56DE\u5FA9\uFF09",
  count: {
    SSAY: 5,
    TSAY: 5,
    VSAY: 5,
    PSAY: 5,
    WSAY: 10,
    XSAY: 10,
    GSAY: 10,
    VGSAY: 10
  },
  max: {
    size: 200,
    word: 50,
    line: 10
  },
  recovery: "24h"
};
var wbbs = {
  label: "\u4EBA\u72FCBBS",
  help: "20\u56DEx200\u5B57",
  count: {
    SSAY: 20,
    TSAY: 5,
    VSAY: 20,
    PSAY: 20,
    WSAY: 40,
    XSAY: 40,
    GSAY: 20,
    VGSAY: 20
  },
  max: {
    size: 200,
    word: 30,
    line: 5
  }
};
var euro = {
  label: "\u6B27\u5DDE",
  help: "30\u56DEx800\u5B57 \uFF0824h\u56DE\u5FA9\uFF09",
  count: {
    SSAY: 30,
    VSAY: 30
  },
  max: {
    size: 800,
    word: 120,
    line: 20
  },
  recovery: "24h"
};
var weak = {
  label: "\u3080\u308A\u305B\u305A",
  help: "\u8A085555\u5B57 \uFF0824h\u56DE\u5FA9\uFF09",
  all: {
    SSAY: 5555,
    TSAY: 5555,
    VSAY: 5555,
    PSAY: 5555,
    WSAY: 7777,
    XSAY: 7777,
    GSAY: 7777,
    VGSAY: 7777
  },
  max: {
    size: 600,
    word: 77,
    line: 15
  },
  recovery: "24h"
};
var juna = {
  label: "\u3057\u3093\u3082\u3093",
  help: "\u8A088400\u5B57 \uFF0824h\u56DE\u5FA9\uFF09",
  all: {
    SSAY: 8400,
    TSAY: 5e3,
    VSAY: 8400,
    PSAY: 5e3,
    WSAY: 2e4,
    XSAY: 15e3,
    GSAY: 15e3,
    VGSAY: 15e3
  },
  max: {
    size: 1e3,
    word: 150,
    line: 20
  },
  recovery: "24h"
};
var infinity = {
  label: "\u3080\u3052\u3093",
  help: "\u221Ept",
  max: {
    size: 1e3,
    word: 150,
    line: 20
  }
};
var sow = {
  label: "\u4EBA\u72FC\u8B70\u4E8B",
  disabled: true
};
var lobby = {
  label: "\u30ED\u30D3\u30FC",
  disabled: true
};
var say1 = {
  label: "\u9759\u5BC2\u3078\u306E\u6311\u6226",
  disabled: true
};
var say5x200 = {
  label: "\u5BE1\u9ED9\u3078\u306E\u6311\u6226",
  disabled: true
};
var say5x300 = {
  label: "\u5C0F\u8AD6\u6587\u3078\u306E\u6311\u6226",
  disabled: true
};
var saving = {
  label: "\u7BC0\u7D04",
  disabled: true
};
var tiny = {
  label: "\u305F\u308A\u306A\u3044",
  disabled: true
};
var vulcan = {
  label: "\u3044\u3063\u3071\u3044",
  disabled: true
};
var weak_braid = {
  label: "\u3080\u308A\u305B\u305A",
  disabled: true
};
var juna_braid = {
  label: "\u3057\u3093\u3082\u3093",
  disabled: true
};
var vulcan_braid = {
  label: "\u3044\u3063\u3071\u3044",
  disabled: true
};
var infinity_braid = {
  label: "\u3080\u3052\u3093",
  disabled: true
};
var set_says_default = {
  say5,
  wbbs,
  euro,
  weak,
  juna,
  infinity,
  sow,
  lobby,
  say1,
  say5x200,
  say5x300,
  saving,
  tiny,
  vulcan,
  weak_braid,
  juna_braid,
  vulcan_braid,
  infinity_braid
};

// src/lib/pubsub/set_say/map-reduce.ts
var SayLimits = MapReduce({
  format: () => {
    return {
      list: []
    };
  },
  reduce: (o, doc) => {
  },
  order: (o, { sort: sort3 }) => {
  }
});
SayLimits.deploy(set_says_default);

// src/lib/game/json/set_winner.json
var HUMAN = {
  label: "\u6751\u4EBA\u9663\u55B6",
  group: "\u6751\u4EBA\u9663\u55B6",
  order: 1,
  help: '<b><A href="http://dais.kokage.cc/guide/?(Text)WIN_HUMAN" TARGET="_blank">\u6751\u4EBA\u9663\u55B6</A></b>\n<br>\n\u4EBA\u9593(\u5996\u7CBE\u3084\u4EBA\u5916\u306E\u8005\u3092\u9664\u304F)\u306E\u6570\u304C\u4EBA\u72FC\u4EE5\u4E0B\u306B\u306A\u308B\u307E\u3067\u306B\u4EBA\u72FC\u3068\u5996\u7CBE\u304C\u5168\u6EC5\u3059\u308C\u3070\u52DD\u5229\u3067\u3059\u3002\n<br>\n\u305F\u3060\u3057\u3001\u72FC\u3092\u5168\u6EC5\u3055\u305B\u305F\u6642\u70B9\u3067\u5996\u7CBE\u3001\u3082\u3057\u304F\u306F\u604B\u4EBA\u304C\u751F\u304D\u6B8B\u3063\u3066\u3044\u308B\u3068\u6557\u5317\u306B\u306A\u308A\u3001\u4ED6\u306B\u3082\u6A2A\u304B\u3089\u52DD\u5229\u3092\u63BB\u3063\u652B\u3046\u3082\u306E\u9054\u304C\u5B58\u5728\u3057\u307E\u3059\u3002'
};
var EVIL = {
  label: "\u88CF\u5207\u308A\u306E\u9663\u55B6",
  group: "\u6575\u5074\u306E\u4EBA\u9593",
  label_human: "\u6575\u5074\u306E\u4EBA\u9593",
  order: 2,
  help: '<b><A href="http://dais.kokage.cc/guide/?(Text)WIN_EVIL" TARGET="_blank">\u88CF\u5207\u308A\u306E\u9663\u55B6</A></b>\n<br>\n\u6751\u4EBA\u30FB\u604B\u4EBA\u304C\u6557\u5317\u3059\u308C\u3070\u52DD\u5229\u8005\u306E\u4E00\u54E1\u306B\u52A0\u308F\u308A\u307E\u3059\u3002\n<br>\n\u3042\u306A\u305F\u306F\u7834\u6EC5\u3092\u671B\u3093\u3067\u3044\u308B\u306E\u3067\u3059\u3002\u4EBA\u72FC\u3084\u5996\u7CBE\u3084\u305D\u308C\u4EE5\u5916\u306E\u52DD\u5229\u3001\u307E\u305F\u306F\u3001\u8AB0\u3082\u3044\u306A\u304F\u306A\u308B\u3053\u3068\u3092\u76EE\u6307\u3057\u307E\u3057\u3087\u3046\u3002'
};
var WOLF2 = {
  label: "\u4EBA\u72FC\u9663\u55B6",
  group: "\u4EBA\u72FC\u9663\u55B6",
  label_human: "\u4EBA\u72FC\u9663\u55B6\u306E\u4EBA\u9593",
  order: 3,
  help: '<b><A href="http://dais.kokage.cc/guide/?(Text)WIN_WOLF" TARGET="_blank">\u4EBA\u72FC\u9663\u55B6</A></b>\n<br>\n\u30EB\u30FC\u30EB\u300C\u30BF\u30D6\u30E9\u306E\u4EBA\u72FC\u300D\u300C\u6B7B\u3093\u3060\u3089\u8CA0\u3051\u300D\u300CTrouble\u2606Aliens\u300D\u3067\u306F\u4EBA\u9593(\u5996\u7CBE\u3084\u4EBA\u5916\u306E\u8005\u3092\u9664\u304F)\u306E\u6570\u3092\u4EBA\u72FC\u3068\u540C\u6570\u4EE5\u4E0B\u307E\u3067\u6E1B\u3089\u305B\u3070\u3001\u30EB\u30FC\u30EB\u300C\u30DF\u30E9\u30FC\u30BA\u30DB\u30ED\u30A6\u300D\u300C\u6DF1\u3044\u9727\u306E\u591C\u300D\u3067\u306F\u5F79\u8077\u300C\u6751\u4EBA\u300D\u3092\u5168\u6EC5\u3055\u305B\u308C\u3070\u52DD\u5229\u3067\u3059\u3002\n<br>\n\u305F\u3060\u3057\u3001\u6700\u5F8C\u307E\u3067\u5996\u7CBE\u3001\u3082\u3057\u304F\u306F\u604B\u4EBA\u304C\u751F\u304D\u6B8B\u3063\u3066\u3044\u308B\u3068\u6557\u5317\u306B\u306A\u308A\u3001\u4ED6\u306B\u3082\u6A2A\u304B\u3089\u52DD\u5229\u3092\u63BB\u3063\u652B\u3046\u3082\u306E\u9054\u304C\u5B58\u5728\u3057\u307E\u3059\u3002'
};
var LONEWOLF = {
  label: "\u4E00\u5339\u72FC",
  group: "\u305D\u306E\u4ED6",
  order: 4,
  help: '<b><A href="http://dais.kokage.cc/guide/?(Text)WIN_LONEWOLF" TARGET="_blank">\u4E00\u5339\u72FC\u9663\u55B6</A></b>\n<br>\n\u30EB\u30FC\u30EB\u300C\u30BF\u30D6\u30E9\u306E\u4EBA\u72FC\u300D\u300C\u6B7B\u3093\u3060\u3089\u8CA0\u3051\u300D\u300CTrouble\u2606Aliens\u300D\u3067\u306F\u4EBA\u9593(\u5996\u7CBE\u3084\u4EBA\u5916\u306E\u8005\u3092\u9664\u304F)\u306E\u6570\u3092\u4E00\u5339\u72FC\u3068\u540C\u6570\u4EE5\u4E0B\u307E\u3067\u6E1B\u3089\u305B\u3070\u3001\u30EB\u30FC\u30EB\u300C\u30DF\u30E9\u30FC\u30BA\u30DB\u30ED\u30A6\u300D\u300C\u6DF1\u3044\u9727\u306E\u591C\u300D\u3067\u306F\u5F79\u8077\u300C\u6751\u4EBA\u300D\u3092\u5168\u6EC5\u3055\u305B\u3001\u304B\u3064\u3001\u4EBA\u72FC\u9663\u55B6\u306E\u72FC\u304C\u751F\u304D\u3066\u3044\u306A\u3051\u308C\u3070\u52DD\u5229\u3067\u3059\u3002\n<br>\n\u305F\u3060\u3057\u3001\u6700\u5F8C\u307E\u3067\u5996\u7CBE\u3001\u3082\u3057\u304F\u306F\u604B\u4EBA\u304C\u751F\u304D\u6B8B\u3063\u3066\u3044\u308B\u3068\u6557\u5317\u306B\u306A\u308A\u3001\u4ED6\u306B\u3082\u52DD\u5229\u3092\u63BB\u3063\u652B\u3046\u3082\u306E\u9054\u304C\u5B58\u5728\u3057\u307E\u3059\u3002'
};
var PIXI = {
  label: "\u5996\u7CBE",
  group: "\u5996\u7CBE",
  order: 5,
  help: '<b><A href="http://dais.kokage.cc/guide/?(Text)WIN_PIXI" TARGET="_blank">\u5996\u7CBE\u9663\u55B6</A></b>\n<br>\n\u4EBA\u72FC\u304C\u5168\u6EC5\u3059\u308B\u304B\u3001\u4EBA\u9593(\u5996\u7CBE\u3084\u4EBA\u5916\u306E\u8005\u3092\u9664\u304F)\u306E\u6570\u304C\u4EBA\u72FC\u3068\u540C\u6570\u4EE5\u4E0B\u307E\u3067\u6E1B\u308B\u307E\u3067\u300C\u751F\u304D\u6B8B\u308C\u3070\u300D\u52DD\u5229\u3067\u3059\u3002\n<br>\n\u305F\u3060\u3057\u3001\u604B\u4EBA\u304C\u751F\u304D\u6B8B\u3063\u3066\u3044\u308B\u3068\u6557\u5317\u306B\u306A\u308A\u3001\u4ED6\u306B\u3082\u6A2A\u304B\u3089\u52DD\u5229\u3092\u63BB\u3063\u652B\u3046\u3082\u306E\u9054\u304C\u5B58\u5728\u3057\u307E\u3059\u3002'
};
var OTHER = {
  label: "\u305D\u306E\u4ED6",
  group: "\u305D\u306E\u4ED6",
  order: 6
};
var GURU = {
  label: "\u7B1B\u5439\u304D",
  group: "\u305D\u306E\u4ED6",
  order: 7,
  help: '<b><A href="http://dais.kokage.cc/guide/?(Text)WIN_GURU" TARGET="_blank">\u7B1B\u5439\u304D</A></b>\n<br>\n\u7B1B\u5439\u304D\u4EE5\u5916\u306E\u751F\u5B58\u8005\u304C\u52E7\u8A98\u3055\u308C\u305F\u8005\u3060\u3051\u306B\u306A\u308C\u3070\u52DD\u5229\u3068\u306A\u308A\u307E\u3059\u3002\u7B1B\u5439\u304D\u81EA\u8EAB\u306F\u3001\u6700\u7D42\u7684\u306B\u751F\u304D\u6B8B\u3063\u3066\u3044\u306A\u304F\u3068\u3082\u69CB\u3044\u307E\u305B\u3093\u3002\n<br>\n\u305F\u3060\u3057\u3001\u6A2A\u304B\u3089\u52DD\u5229\u3092\u63BB\u3063\u652B\u3046\u3082\u306E\u9054\u304C\u5B58\u5728\u3057\u307E\u3059\u3002'
};
var LOVER = {
  label: "\u604B\u4EBA\u9663\u55B6",
  group: "\u305D\u306E\u4ED6",
  order: 8,
  help: '<b><A href="http://dais.kokage.cc/guide/?(Text)WIN_LOVER" TARGET="_blank">\u604B\u4EBA\u9663\u55B6</A></b>\n<br>\n\u604B\u4EBA\u9054\u3060\u3051\u304C\u751F\u304D\u6B8B\u308B\u3001\u3082\u3057\u304F\u306F\u3044\u305A\u3053\u304B\u306E\u9663\u55B6\u304C\u52DD\u5229\u3092\u624B\u306B\u3057\u305F\u3068\u304D\u3001\u7D46\u306E\u604B\u4EBA\u9054\u304C\u751F\u5B58\u3057\u3066\u3044\u308C\u3070\u52DD\u5229\u3067\u3059\u3002\n<br>\n\u305F\u3060\u3057\u3001\u3072\u3068\u308A\u3060\u3051\u8607\u751F\u3057\u305F\u306A\u3069\u306E\u4E0D\u5E78\u3067\u3001\u604B\u3092\u6210\u5C31\u3067\u304D\u306A\u3044\u604B\u4EBA\u306F\u3001\u52DD\u5229\u3057\u307E\u305B\u3093\u3002'
};
var HATER = {
  label: "\u90AA\u6C17\u9663\u55B6",
  group: "\u305D\u306E\u4ED6",
  order: 9,
  help: '<b><A href="http://dais.kokage.cc/guide/?(Text)WIN_HATER" TARGET="_blank">\u90AA\u6C17\u9663\u55B6</A></b>\n<br>\n\u3044\u305A\u3053\u304B\u306E\u9663\u55B6\u304C\u52DD\u5229\u3092\u624B\u306B\u3057\u305F\u3068\u304D\u3001\u904B\u547D\u306B\u6C7A\u7740\u3092\u3064\u3051\u3066\u3044\u308C\u3070\u52DD\u5229\u3057\u307E\u3059\u3002\u6C7A\u7740\u3068\u306F\u3001\u7D46\u306E\u5929\u6575\u3092\u3059\u3079\u3066\u5012\u3057\u3001\u4E00\u4EBA\u3060\u3051\u304C\u751F\u304D\u6B8B\u3063\u3066\u3044\u308B\u3053\u3068\u3067\u3059\u3002\n\u6BBA\u3057\u5408\u3044\u306E\u7D46\u3092\u65AD\u3061\u5207\u308A\u307E\u3057\u3087\u3046\u3002\u7D46\u306E\u76F8\u624B\u304C\u6B7B\u3093\u3067\u3082\u3001\u5F8C\u3092\u8FFD\u3046\u3053\u3068\u306F\u3042\u308A\u307E\u305B\u3093\u3002\n<br>\n\u7D46\u306E\u5929\u6575\u3068\u306F\u3001\u305F\u3068\u3048\u3042\u306A\u305F\u81EA\u8EAB\u306B\u306F\u95A2\u4FC2\u306E\u306A\u304F\u3068\u3082\u3001\u3042\u3089\u3086\u308B\u7D46\u3092\u7D50\u3093\u3067\u3044\u308B\u3082\u306E\u5168\u3066\u3092\u6307\u3057\u307E\u3059\u3002'
};
var DISH = {
  label: "\u636E\u3048\u81B3",
  group: "\u305D\u306E\u4ED6",
  order: 10,
  help: '<b><A href="http://dais.kokage.cc/guide/?(Text)WIN_DISH" TARGET="_blank">\u636E\u3048\u81B3</A></b>\n<br>\n\u3059\u3079\u3066\u306B\u6C7A\u7740\u304C\u3064\u3044\u305F\u3068\u304D\u3001\u3042\u306A\u305F\u304C\u72FC\u306E\u8972\u6483\u3001\u3082\u3057\u304F\u306F\u8CDE\u91D1\u7A3C\u306E\u9053\u9023\u308C\u306B\u3088\u308A\u6B7B\u4EA1\u3057\u3066\u3044\u308C\u3070\u3001\u52DD\u5229\u8005\u306E\u4E00\u54E1\u306B\u52A0\u308F\u308A\u307E\u3059\u3002'
};
var NONE = {
  label: "\u2015",
  group: "\u305D\u306E\u4ED6",
  order: 98,
  help: "\u3042\u306A\u305F\u306F\u52DD\u8CA0\u3092\u773A\u3081\u3066\u3044\u307E\u3059\u3002\u52DD\u5229\u3057\u305F\u308A\u3001\u6557\u5317\u3057\u305F\u308A\u3068\u3044\u3063\u305F\u3053\u3068\u306F\u3042\u308A\u307E\u305B\u3093\u3002"
};
var MOB = {
  label: "\u898B\u7269\u4EBA",
  group: "\u305D\u306E\u4ED6",
  order: 99,
  help: '\u3042\u306A\u305F\u306F<b>_ROLE_\u306E<A href="http://dais.kokage.cc/guide/?(Role)ROLEID_MOB" TARGET="_blank">\u898B\u7269\u4EBA</A></b>\u3067\u3059\u3002\u3044\u304B\u306A\u308B\u9663\u55B6\u306E\u4EBA\u6570\u306B\u3082\u542B\u307E\u308C\u307E\u305B\u3093\u3002'
};
var LEAVE = {
  label: "\u2015",
  group: "\u305D\u306E\u4ED6",
  order: 100,
  help: "\u3042\u306A\u305F\u306F\u6751\u3092\u53BB\u308A\u307E\u3057\u305F\u3002\u52DD\u5229\u3057\u305F\u308A\u3001\u6557\u5317\u3057\u305F\u308A\u3068\u3044\u3063\u305F\u3053\u3068\u306F\u3001\u3082\u3046\u3042\u308A\u307E\u305B\u3093\u3002"
};
var set_winner_default = {
  HUMAN,
  EVIL,
  WOLF: WOLF2,
  LONEWOLF,
  PIXI,
  OTHER,
  GURU,
  LOVER,
  HATER,
  DISH,
  NONE,
  MOB,
  LEAVE
};

// src/lib/pubsub/set_winner/map-reduce.ts
var Winners = MapReduce({
  format: () => {
    return {
      list: []
    };
  },
  reduce: (o, doc) => {
  },
  order: (o, { sort: sort3 }) => {
  }
});
Winners.deploy(set_winner_default);

// src/lib/game/json/sow_game.json
var TABULA = {
  label: "\u30BF\u30D6\u30E9\u306E\u4EBA\u72FC",
  help: "<li>\u540C\u6570\u7968\u306E\u51E6\u5211\u5019\u88DC\u304C\u8907\u6570\u3044\u305F\u5834\u5408\u3001\u30E9\u30F3\u30C0\u30E0\u306B\u51E6\u5211\u3059\u308B\u3002\n<li>\u72FC\u3092\u5168\u6EC5\u3055\u305B\u308B\u3068\u3001\u6751\u52DD\u5229\u3002\n<li>\u4EBA\u2266\u72FC\u3001\u3064\u307E\u308A\u4EBA\u9593\u3068\u4EBA\u72FC\u3092\uFF11\u5BFE\uFF11\u306B\u3057\u305F\u3068\u304D\u3001\u4EBA\u9593\u304C\u4F59\u8A08\u306B\u3044\u306A\u304F\u306A\u3063\u305F\u3089\u3001\u72FC\u52DD\u5229\u3002\n"
};
var MILLERHOLLOW = {
  label: "\u30DF\u30E9\u30FC\u30BA\u30DB\u30ED\u30A6",
  help: "<li>\u540C\u6570\u7968\u306E\u51E6\u5211\u5019\u88DC\u304C\u8907\u6570\u3044\u305F\u5834\u5408\u3001\u51E6\u5211\u3092\u3068\u308A\u3084\u3081\u308B\u3002\n<li>\u3059\u3079\u3066\u306E\u6B7B\u8005\u306F\u5F79\u8077\u304C\u516C\u958B\u3055\u308C\u308B\u3002\n<li>\u72FC\u3092\u5168\u6EC5\u3055\u305B\u308B\u3068\u3001\u6751\u52DD\u5229\u3002\n<li>\u300C\u6751\u4EBA\u300D\u3092\u5168\u6EC5\u3055\u305B\u308B\u3068\u3001\u72FC\u52DD\u5229\u3002<br>\u5F79\u8077\u3092\u6301\u3064\u6751\u5074\u306E\u751F\u304D\u6B8B\u308A\u306F\u3001\u52DD\u5229\u306B\u76F4\u63A5\u306F\u5BC4\u4E0E\u3057\u306A\u3044\u3002\n"
};
var LIVE_TABULA = {
  label: "\u30BF\u30D6\u30E9\u306E\u4EBA\u72FC\uFF08\u6B7B\u3093\u3060\u3089\u8CA0\u3051\uFF09",
  help: "<li>\u540C\u6570\u7968\u306E\u51E6\u5211\u5019\u88DC\u304C\u8907\u6570\u3044\u305F\u5834\u5408\u3001\u30E9\u30F3\u30C0\u30E0\u306B\u51E6\u5211\u3059\u308B\u3002\n<li>\u72FC\u3092\u5168\u6EC5\u3055\u305B\u308B\u3068\u3001\u6751\u5074\u306E\u751F\u5B58\u8005\u304C\u52DD\u5229\u3002\n<li>\u4EBA\u2266\u72FC\u3001\u3064\u307E\u308A\u4EBA\u9593\u3068\u4EBA\u72FC\u3092\uFF11\u5BFE\uFF11\u306B\u3057\u305F\u3068\u304D\u3001\u4EBA\u9593\u304C\u4F59\u8A08\u306B\u3044\u306A\u304F\u306A\u3063\u305F\u3089\u3001\u72FC\u52DD\u5229\u3002\n<li>\u305F\u3060\u3057\u3001\u4EF2\u9593\u304C\u52DD\u5229\u3057\u3066\u3044\u3066\u3082\u3001\u6B7B\u3093\u3067\u3057\u307E\u3063\u305F\u8005\u306F\u6557\u5317\u3067\u3042\u308B\u3002\n"
};
var LIVE_MILLERHOLLOW = {
  label: "\u30DF\u30E9\u30FC\u30BA\u30DB\u30ED\u30A6\uFF08\u6B7B\u3093\u3060\u3089\u8CA0\u3051\uFF09",
  help: "<li>\u540C\u6570\u7968\u306E\u51E6\u5211\u5019\u88DC\u304C\u8907\u6570\u3044\u305F\u5834\u5408\u3001\u51E6\u5211\u3092\u3068\u308A\u3084\u3081\u308B\u3002\n<li>\u72FC\u3092\u5168\u6EC5\u3055\u305B\u308B\u3068\u3001\u6751\u5074\u306E\u751F\u5B58\u8005\u304C\u52DD\u5229\u3002\n<li>\u300C\u6751\u4EBA\u300D\u3092\u5168\u6EC5\u3055\u305B\u308B\u3068\u3001\u72FC\u52DD\u5229\u3002\u5F79\u8077\u3092\u6301\u3064\u6751\u5074\u306E\u751F\u304D\u6B8B\u308A\u306F\u3001\u52DD\u5229\u306B\u76F4\u63A5\u306F\u5BC4\u4E0E\u3057\u306A\u3044\u3002\n<li>\u305F\u3060\u3057\u3001\u4EF2\u9593\u304C\u52DD\u5229\u3057\u3066\u3044\u3066\u3082\u3001\u6B7B\u3093\u3067\u3057\u307E\u3063\u305F\u8005\u306F\u6557\u5317\u3067\u3042\u308B\u3002\n"
};
var TROUBLE = {
  label: "Trouble\u2606Aliens",
  help: "<li>\u540C\u6570\u7968\u306E\u51E6\u5211\u5019\u88DC\u304C\u8907\u6570\u3044\u305F\u5834\u5408\u3001\u30E9\u30F3\u30C0\u30E0\u306B\u51E6\u5211\u3059\u308B\u3002\n<li>\u4EBA\u72FC\u306F\u4F1A\u8A71\u3067\u304D\u306A\u3044\u3002\u8972\u6483\u5019\u88DC\u30EA\u30B9\u30C8\u3067\u5224\u65AD\u3067\u304D\u306A\u3044\u3002\n<li>\u8972\u6483\u5148\u306F\u7FCC\u65E5\u3001\u72A0\u7272\u5019\u88DC\u3068\u4EBA\u72FC\u306B\u958B\u793A\u3055\u308C\u308B\u3002\n<li>\u5B88\u8B77\u8005\u306F\u3001\u3088\u308A\u5927\u4EBA\u6570\u306E\u4EBA\u72FC\u304B\u3089\u306F\u5B88\u308A\u304D\u308B\u3053\u3068\u304C\u3067\u304D\u305A\u3001\u8EAB\u4EE3\u308F\u308A\u306B\u611F\u67D3\u3059\u308B\u3002\n<li>\uFF11\u4EBA\u306E\u4EBA\u72FC\u304C\u8972\u6483\u3059\u308B\u3068\u611F\u67D3\u3001\u8907\u6570\u306E\u4EBA\u72FC\u3084\u4E00\u5339\u72FC\u3001\u8CDE\u91D1\u7A3C\u304E\u304C\u8972\u6483\u3059\u308B\u3068\u6B7B\u4EA1\u3059\u308B\u3002\n<li>\u72FC\u3092\u5168\u6EC5\u3055\u305B\u308B\u3068\u3001\u6751\u5074\u306E\u751F\u5B58\u8005\u304C\u52DD\u5229\uFF08\u6751\u5074\u306F\u6B7B\u3093\u3060\u3089\u8CA0\u3051\u308B\uFF09\u3002\n<li>\u4EBA\u2266\u72FC\u3001\u3064\u307E\u308A\u4EBA\u9593\u3068\u4EBA\u72FC\u3092\uFF11\u5BFE\uFF11\u306B\u3057\u305F\u3068\u304D\u3001\u4EBA\u9593\u304C\u4F59\u8A08\u306B\u3044\u306A\u304F\u306A\u3063\u305F\u3089\u3001\u72FC\u3068\u611F\u67D3\u8005\u306E\u52DD\u5229\u3002\n"
};
var MISTERY = {
  label: "\u6DF1\u3044\u9727\u306E\u591C",
  help: "<li>\u540C\u6570\u7968\u306E\u51E6\u5211\u5019\u88DC\u304C\u8907\u6570\u3044\u305F\u5834\u5408\u3001\u30E9\u30F3\u30C0\u30E0\u306B\u51E6\u5211\u3059\u308B\u3002\n<li>\u6751\u5074\u306F\u81EA\u5206\u306E\u5F79\u8077\u3092\u81EA\u899A\u3057\u306A\u3044\u3002\n<li>\u6751\u5074\u306F\u3001\u80FD\u529B\u306E\u7D50\u679C\u4E0D\u5BE9\u8005\u3092\u898B\u304B\u3051\u308B\u3053\u3068\u304C\u3042\u308B\u3002\n<li>\u4EBA\u72FC\u306E\u884C\u52D5\u5BFE\u8C61\u306B\u9078\u3070\u308C\u308B\u3068\u3001\u4E0D\u5BE9\u8005\u3092\u898B\u304B\u3051\u308B\u3002\n<li>\u72FC\u3092\u5168\u6EC5\u3055\u305B\u308B\u3068\u3001\u6751\u52DD\u5229\u3002\n<li>\u5F79\u8077\u300C\u6751\u4EBA\u300D\u3092\u5168\u6EC5\u3055\u305B\u308B\u3068\u3001\u72FC\u52DD\u5229\u3002<br>\u5F79\u8077\u3092\u6301\u3064\u6751\u5074\u306E\u751F\u304D\u6B8B\u308A\u306F\u3001\u52DD\u5229\u306B\u76F4\u63A5\u306F\u5BC4\u4E0E\u3057\u306A\u3044\u3002\n"
};
var VOV = {
  disabled: true,
  label: "\u72C2\u72AC\u75C5\u306E\u8C37",
  help: "<li>\u540C\u6570\u7968\u306E\u51E6\u5211\u5019\u88DC\u304C\u8907\u6570\u3044\u305F\u5834\u5408\u3001\u30E9\u30F3\u30C0\u30E0\u306B\u51E6\u5211\u3059\u308B\u3002\n<li>\uFF11\u4EBA\u306E\u4EBA\u72FC\u304C\u8972\u6483\u3059\u308B\u3068\u611F\u67D3\u3001\u8907\u6570\u306E\u4EBA\u72FC\u3084\u4E00\u5339\u72FC\u3001\u8CDE\u91D1\u7A3C\u304E\u304C\u8972\u6483\u3059\u308B\u3068\u6B7B\u4EA1\u3059\u308B\u3002\n<li>\u72FC\u3092\u5168\u6EC5\u3055\u305B\u308B\u3068\u3001\u6751\u52DD\u5229\u3002\n<li>\u4EBA\u2266\u72FC\u3001\u3064\u307E\u308A\u4EBA\u9593\u3068\u4EBA\u72FC\u3092\uFF11\u5BFE\uFF11\u306B\u3057\u305F\u3068\u304D\u3001\u4EBA\u9593\u304C\u4F59\u8A08\u306B\u3044\u306A\u304F\u306A\u3063\u305F\u3089\u3001\u72FC\u52DD\u5229\u3002\n"
};
var SECRET = {
  label: "\u9670\u8B00\u306B\u96C6\u3046\u80E1\u8776",
  help: "<li>\u540C\u6570\u7968\u306E\u51E6\u5211\u5019\u88DC\u304C\u8907\u6570\u3044\u305F\u5834\u5408\u3001\u30E9\u30F3\u30C0\u30E0\u306B\u51E6\u5211\u3059\u308B\u3002\n<li>\u4EBA\u72FC\u306F\u4F1A\u8A71\u3067\u304D\u306A\u3044\u3002\u8972\u6483\u5019\u88DC\u30EA\u30B9\u30C8\u3067\u5224\u65AD\u3067\u304D\u306A\u3044\u3002\n<li>\u8972\u6483\u5148\u306F\u7FCC\u65E5\u3001\u72A0\u7272\u5019\u88DC\u3068\u4EBA\u72FC\u306B\u958B\u793A\u3055\u308C\u308B\u3002\n<li>\u72FC\u3092\u5168\u6EC5\u3055\u305B\u308B\u3068\u3001\u6751\u5074\u306E\u751F\u5B58\u8005\u304C\u52DD\u5229\u3002\n<li>\u4EBA\u2266\u72FC\u3001\u3064\u307E\u308A\u4EBA\u9593\u3068\u4EBA\u72FC\u3092\uFF11\u5BFE\uFF11\u306B\u3057\u305F\u3068\u304D\u3001\u4EBA\u9593\u304C\u4F59\u8A08\u306B\u3044\u306A\u304F\u306A\u3063\u305F\u3089\u3001\u72FC\u306E\u751F\u5B58\u8005\u304C\u52DD\u5229\u3002\n<li>\u3044\u304B\u306A\u308B\u5834\u5408\u3082\u3001\u6B7B\u3093\u3067\u3057\u307E\u3063\u305F\u3082\u306E\u306F\u6557\u5317\u3067\u3042\u308B\u3002\n"
};
var GAMEMASTER = {
  label: "\u624B\u52D5\u9032\u884C",
  help: "<li>\u9ED2\u5E55\u306E\u624B\u3067\u9032\u884C\u3059\u308B\u3002\n"
};
var sow_game_default = {
  TABULA,
  MILLERHOLLOW,
  LIVE_TABULA,
  LIVE_MILLERHOLLOW,
  TROUBLE,
  MISTERY,
  VOV,
  SECRET,
  GAMEMASTER
};

// src/lib/pubsub/sow_game/map-reduce.ts
var Games = MapReduce({
  format: () => {
    return {
      list: []
    };
  },
  reduce: (o, doc) => {
  },
  order: (o, { sort: sort3 }) => {
  }
});
Games.deploy(sow_game_default);

// src/lib/game/json/sow_roletables.json
var secret2 = {
  label: "\u8A73\u7D30\u306F\u9ED2\u5E55\u3060\u3051\u304C\u77E5\u3063\u3066\u3044\u307E\u3059\u3002",
  disabled: true,
  role_ids_list: []
};
var ultimate = {
  label: "\u30A2\u30EB\u30C6\u30A3\u30E1\u30C3\u30C8",
  disabled: true,
  role_ids_list: []
};
var lover2 = {
  label: "\u604B\u611B\u5929\u4F7F",
  disabled: true,
  role_ids_list: []
};
var hamster2 = {
  label: "\u30CF\u30E0\u30B9\u30BF\u30FC",
  disabled: true,
  role_ids_list: []
};
var random = {
  label: "\u30E9\u30F3\u30C0\u30E0",
  disabled: true,
  role_ids_list: []
};
var custom = {
  label: "\u81EA\u7531\u8A2D\u5B9A",
  role_ids_list: []
};
var default2 = {
  label: "\u6A19\u6E96",
  role_ids_list: [
    null,
    null,
    null,
    null,
    ["villager", "villager", "seer", "wolf"],
    ["villager", "villager", "seer", "wolf", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager", "decide", "wolf", "guard"],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "decide",
      "wolf",
      "guard",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "decide",
      "wolf",
      "guard",
      "possess",
      "medium"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "decide",
      "wolf",
      "guard",
      "possess",
      "medium",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "decide",
      "wolf",
      "guard",
      "fanatic",
      "medium",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "decide",
      "wolf",
      "guard",
      "possess",
      "medium",
      "villager",
      "possess",
      "stigma"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "decide",
      "wolf",
      "guard",
      "possess",
      "medium",
      "villager",
      "possess",
      "stigma",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "decide",
      "wolf",
      "guard",
      "wisper",
      "medium",
      "villager",
      "villager",
      "villager",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "decide",
      "wolf",
      "guard",
      "possess",
      "medium",
      "villager",
      "possess",
      "fm",
      "fm",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "decide",
      "wolf",
      "guard",
      "possess",
      "medium",
      "villager",
      "possess",
      "fm",
      "fm",
      "villager",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "decide",
      "wolf",
      "guard",
      "possess",
      "medium",
      "villager",
      "possess",
      "fm",
      "fm",
      "villager",
      "villager",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "decide",
      "wolf",
      "guard",
      "possess",
      "medium",
      "villager",
      "possess",
      "fm",
      "fm",
      "villager",
      "villager",
      "villager",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "decide",
      "wolf",
      "guard",
      "possess",
      "medium",
      "villager",
      "possess",
      "fm",
      "fm",
      "villager",
      "villager",
      "villager",
      "villager",
      "villager",
      "villager"
    ]
  ]
};
var mistery = {
  label: "\u6DF1\u3044\u9727\u306E\u591C",
  role_ids_list: [
    null,
    null,
    null,
    null,
    ["villager", "villager", "seer", "lonewolf"],
    ["villager", "villager", "seer", "lonewolf", "alchemist"],
    ["villager", "villager", "guard", "lonewolf", "alchemist", "possess"],
    ["villager", "villager", "guard", "lonewolf", "alchemist", "decide", "possess", "fan"],
    ["villager", "villager", "guard", "wolf", "wolf", "alchemist", "decide", "aura", "doctor"],
    [
      "villager",
      "villager",
      "guard",
      "wolf",
      "wolf",
      "alchemist",
      "decide",
      "aura",
      "doctor",
      "villager"
    ],
    [
      "villager",
      "villager",
      "guard",
      "wolf",
      "childwolf",
      "alchemist",
      "decide",
      "aura",
      "doctor",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "guard",
      "wolf",
      "childwolf",
      "alchemist",
      "decide",
      "aura",
      "doctor",
      "villager",
      "seer",
      "villager"
    ],
    [
      "villager",
      "villager",
      "guard",
      "wolf",
      "childwolf",
      "alchemist",
      "decide",
      "aura",
      "doctor",
      "villager",
      "seer",
      "hunter",
      "villager"
    ],
    [
      "villager",
      "villager",
      "guard",
      "wolf",
      "childwolf",
      "alchemist",
      "decide",
      "aura",
      "doctor",
      "villager",
      "seer",
      "hunter",
      "medium",
      "jammer"
    ],
    [
      "villager",
      "villager",
      "guard",
      "wolf",
      "childwolf",
      "alchemist",
      "decide",
      "aura",
      "doctor",
      "villager",
      "seer",
      "hunter",
      "medium",
      "jammer",
      "alchemist"
    ],
    [
      "villager",
      "villager",
      "guard",
      "wolf",
      "childwolf",
      "alchemist",
      "decide",
      "aura",
      "doctor",
      "villager",
      "seer",
      "hunter",
      "medium",
      "jammer",
      "curse",
      "witch"
    ],
    [
      "villager",
      "villager",
      "guard",
      "wolf",
      "childwolf",
      "alchemist",
      "decide",
      "aura",
      "doctor",
      "villager",
      "seer",
      "hunter",
      "medium",
      "jammer",
      "curse",
      "witch",
      "wolf"
    ],
    [
      "villager",
      "villager",
      "guard",
      "wolf",
      "childwolf",
      "alchemist",
      "decide",
      "aura",
      "doctor",
      "villager",
      "seer",
      "hunter",
      "medium",
      "jammer",
      "curse",
      "witch",
      "wolf",
      "girl"
    ],
    [
      "villager",
      "villager",
      "guard",
      "wolf",
      "childwolf",
      "alchemist",
      "decide",
      "aura",
      "doctor",
      "villager",
      "seer",
      "hunter",
      "medium",
      "jammer",
      "curse",
      "witch",
      "wolf",
      "girl",
      "fan"
    ],
    [
      "villager",
      "villager",
      "guard",
      "wolf",
      "childwolf",
      "alchemist",
      "decide",
      "aura",
      "doctor",
      "villager",
      "seer",
      "hunter",
      "medium",
      "jammer",
      "curse",
      "witch",
      "wolf",
      "girl",
      "fan",
      "guru"
    ],
    [
      "villager",
      "villager",
      "guard",
      "wolf",
      "childwolf",
      "alchemist",
      "decide",
      "aura",
      "doctor",
      "villager",
      "seer",
      "hunter",
      "medium",
      "jammer",
      "curse",
      "witch",
      "wolf",
      "girl",
      "fan",
      "guru",
      "alchemist"
    ]
  ]
};
var test1st = {
  label: "\u4EBA\u72FC\u5BE9\u554F\u8A66\u9A13\u58F1\u578B",
  role_ids_list: [
    null,
    null,
    null,
    null,
    ["villager", "villager", "seer", "wolf"],
    ["villager", "villager", "seer", "wolf", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager", "villager", "wolf"],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "stigma",
      "possess"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "stigma",
      "possess",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "stigma",
      "villager",
      "wolf",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "stigma",
      "villager",
      "wolf",
      "villager",
      "stigma"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "stigma",
      "villager",
      "wolf",
      "villager",
      "stigma",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "stigma",
      "villager",
      "wolf",
      "villager",
      "stigma",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "stigma",
      "villager",
      "wolf",
      "villager",
      "villager",
      "fm",
      "fm",
      "possess"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "stigma",
      "villager",
      "wolf",
      "villager",
      "villager",
      "fm",
      "fm",
      "possess",
      "villager"
    ]
  ]
};
var test2nd = {
  label: "\u4EBA\u72FC\u5BE9\u554F\u8A66\u9A13\u5F10\u578B",
  role_ids_list: [
    null,
    null,
    null,
    null,
    ["villager", "villager", "seer", "wolf"],
    ["villager", "villager", "seer", "wolf", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager", "villager", "wolf"],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "fanatic"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "fanatic",
      "guard"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "fanatic",
      "guard",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "fanatic",
      "guard",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "fanatic",
      "guard",
      "villager",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "fanatic",
      "guard",
      "villager",
      "villager",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "fanatic",
      "guard",
      "villager",
      "villager",
      "wolf",
      "fm",
      "fm"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "fanatic",
      "guard",
      "villager",
      "villager",
      "wolf",
      "fm",
      "fm",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "fanatic",
      "guard",
      "villager",
      "villager",
      "wolf",
      "fm",
      "fm",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "fanatic",
      "guard",
      "villager",
      "villager",
      "wolf",
      "fm",
      "fm",
      "villager",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "fanatic",
      "guard",
      "villager",
      "villager",
      "wolf",
      "fm",
      "fm",
      "villager",
      "villager",
      "villager",
      "villager"
    ]
  ]
};
var wbbs_c = {
  label: "\u4EBA\u72FCBBS-C\u56FD",
  role_ids_list: [
    null,
    null,
    null,
    null,
    ["villager", "villager", "seer", "wolf"],
    ["villager", "villager", "seer", "wolf", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager", "villager", "wolf"],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "wisper"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "wisper",
      "guard"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "wisper",
      "guard",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "wisper",
      "guard",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "wisper",
      "guard",
      "villager",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "wisper",
      "guard",
      "villager",
      "villager",
      "wolf",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "wisper",
      "guard",
      "villager",
      "villager",
      "wolf",
      "fm",
      "fm"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "wisper",
      "guard",
      "villager",
      "villager",
      "wolf",
      "fm",
      "fm",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "wisper",
      "guard",
      "villager",
      "villager",
      "wolf",
      "fm",
      "fm",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "wisper",
      "guard",
      "villager",
      "villager",
      "wolf",
      "fm",
      "fm",
      "villager",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "wisper",
      "guard",
      "villager",
      "villager",
      "wolf",
      "fm",
      "fm",
      "villager",
      "villager",
      "villager",
      "villager"
    ]
  ]
};
var wbbs_f = {
  label: "\u4EBA\u72FCBBS-F\u56FD",
  role_ids_list: [
    null,
    null,
    null,
    null,
    ["villager", "villager", "seer", "wolf"],
    ["villager", "villager", "seer", "wolf", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager", "villager", "wolf"],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager",
      "villager",
      "wolf",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager",
      "villager",
      "wolf",
      "fm",
      "fm"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager",
      "villager",
      "wolf",
      "fm",
      "fm",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager",
      "villager",
      "wolf",
      "fm",
      "fm",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager",
      "villager",
      "wolf",
      "fm",
      "fm",
      "villager",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager",
      "villager",
      "wolf",
      "fm",
      "fm",
      "villager",
      "villager",
      "villager",
      "villager"
    ]
  ]
};
var wbbs_g = {
  label: "\u4EBA\u72FCBBS-G\u56FD",
  role_ids_list: [
    null,
    null,
    null,
    null,
    ["villager", "villager", "seer", "wolf"],
    ["villager", "villager", "seer", "wolf", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager", "villager"],
    ["villager", "villager", "seer", "wolf", "villager", "villager", "villager", "wolf"],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager",
      "wolf"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager",
      "wolf",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager",
      "wolf",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager",
      "wolf",
      "villager",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager",
      "wolf",
      "villager",
      "villager",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager",
      "wolf",
      "villager",
      "villager",
      "villager",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager",
      "wolf",
      "villager",
      "villager",
      "villager",
      "villager",
      "villager",
      "villager"
    ],
    [
      "villager",
      "villager",
      "seer",
      "wolf",
      "villager",
      "villager",
      "villager",
      "wolf",
      "medium",
      "possess",
      "guard",
      "villager",
      "wolf",
      "villager",
      "villager",
      "villager",
      "villager",
      "villager",
      "villager",
      "villager"
    ]
  ]
};
var sow_roletables_default = {
  secret: secret2,
  ultimate,
  lover: lover2,
  hamster: hamster2,
  random,
  custom,
  default: default2,
  mistery,
  test1st,
  test2nd,
  wbbs_c,
  wbbs_f,
  wbbs_g
};

// src/lib/pubsub/sow_role_table/map-reduce.ts
var RoleTables = MapReduce({
  format: () => {
    return {
      list: []
    };
  },
  reduce: (o, doc) => {
  },
  order: (o, { sort: sort3 }) => {
  }
});
RoleTables.deploy(sow_roletables_default);

// src/lib/pubsub/book_story/client.ts
var by_id = (o) => o._id;
var by_this = (o) => o;
var by_count = (o) => o.count;
var by_write_at = (o) => o.write_at;
function digit(n, size = 2) {
  return n.toString().padStart(size, "0");
}
function emit(o) {
  o.count ||= 0;
  o.count++;
}
function emit_count(dic4, item) {
  if (!item)
    return;
  const o = dic4[item._id] ||= __spreadProps(__spreadValues({}, item), { count: 0 });
  o.count++;
}
function emit_sum(dic4, item) {
  if (!item)
    return;
  const o = dic4[item._id] ||= __spreadProps(__spreadValues({}, item), { count: 0 });
  o.count += item.count;
}
function default_story_query() {
  return {
    idx: "",
    mode: "full",
    hide: []
  };
}
function default_stories_query() {
  return {
    search: "",
    order: "write_at",
    folder_id: [],
    monthry: [],
    upd_range: [],
    upd_at: [],
    sow_auth_id: [],
    mark: [],
    size: [],
    say_limit: [],
    game: [],
    option: [],
    trap: [],
    discard: [],
    config: []
  };
}
var stories = model2({
  qid: (ids) => ids.toString(),
  format: () => ({
    list: [],
    oldlog: {},
    base: {
      in_month: {},
      yeary: {},
      monthry: {},
      folder_id: {},
      upd_range: {},
      upd_at: {},
      sow_auth_id: {},
      mark: {},
      size: {},
      say_limit: {},
      game: {},
      option: {},
      mob_role: {},
      trap: {},
      config: {},
      discard: {}
    },
    group: {
      in_month: [],
      yeary: [],
      monthry: [],
      folder_id: [],
      upd_range: [],
      upd_at: [],
      sow_auth_id: [],
      mark: [],
      size: [],
      say_limit: {},
      game: [],
      option: [],
      mob_role: [],
      trap: [],
      config: [],
      discard: []
    }
  }),
  initialize: (doc) => {
    var _a2;
    const write_at = new Date(doc.timer.updateddt);
    doc.in_month = format(write_at, "MM\u6708", { locale });
    doc.yeary = format(write_at, "yyyy\u5E74", { locale });
    doc.monthry = doc.yeary + doc.in_month;
    if ((_a2 = doc.folder) == null ? void 0 : _a2.toLowerCase) {
      doc.folder_id = doc.folder.toLowerCase();
      doc.folder = Folders.find(doc.folder_id);
    }
    doc.game_id = doc.type.game;
    doc.game = Games.find(doc.game_id);
    doc.role_table = RoleTables.find(doc.type.roletable);
    doc.mob_role = Roles.find(doc.type.mob);
    doc.say_limit_id = doc.type.say;
    doc.say_limit = SayLimits.find(doc.say_limit_id);
    doc.trap_ids = doc.card.event;
    doc.discard_ids = doc.card.discard;
    doc.traps = Roles.reduce(doc.trap_ids, emit).desc(by_count);
    doc.discards = Roles.reduce(doc.discard_ids, emit).desc(by_count);
    doc.config_ids = doc.card.config;
    if (doc.role_table._id !== "custom") {
      const table_role_ids = doc.role_table.role_ids_list[doc.vpl[0]] || [];
      doc.config_ids = [...doc.config_ids.filter((o) => o === "mob"), ...table_role_ids];
    }
    doc.configs = Roles.reduce(doc.config_ids, emit).desc(by_count);
    const option_ids = doc.options;
    doc.options = option_ids.map(Options.find).filter(by_this);
    doc.option_ids = doc.options.map(by_id);
    if (["R15", "r15", "r18"].includes(doc.rating))
      doc.rating = "alert";
    if (["gro"].includes(doc.rating))
      doc.rating = "violence";
    doc.marks = [Marks.find(doc.rating)].filter(by_this);
    doc.mark_ids = doc.marks.map(by_id);
    doc.upd_range = `${doc.upd.interval * 24}h`;
    doc.upd_at = `${digit(doc.upd.hour)}:${digit(doc.upd.minute)}`;
    doc.size = `x${doc.vpl[0]}`;
    doc.write_at = write_at;
  },
  reduce: (data, doc) => {
    dic(data.oldlog, doc.folder_id, []).push(doc);
    emit(dic(data.base.in_month, doc.in_month, {}));
    emit(dic(data.base.yeary, doc.yeary, {}));
    emit(dic(data.base.monthry, doc.monthry, {}));
    emit(dic(data.base.folder_id, doc.folder_id, {}));
    emit(dic(data.base.upd_range, doc.upd_range, {}));
    emit(dic(data.base.upd_at, doc.upd_at, {}));
    emit(dic(data.base.size, doc.size, {}));
    emit(dic(data.base.sow_auth_id, doc.sow_auth_id, {}));
    for (const mark of doc.marks) {
      emit_count(data.base.mark, mark);
    }
    emit_count(data.base.say_limit, doc.say_limit);
    emit_count(data.base.game, doc.game);
    for (const opt of doc.options) {
      emit_count(data.base.option, opt);
    }
    emit_count(data.base.mob_role, doc.mob_role);
    for (const o of doc.traps) {
      emit_sum(data.base.trap, o);
    }
    for (const o of doc.configs) {
      emit_sum(data.base.config, o);
    }
    for (const o of doc.discards) {
      emit_sum(data.base.discard, o);
    }
  },
  order: (data, { sort: sort3 }, order) => {
    sort3(data.list).desc(by_write_at);
    for (const key in data.oldlog) {
      const list = data.oldlog[key];
      sort3(list).desc(by_write_at);
    }
    data.group.yeary = sort3(data.base.yeary).desc(by_id);
    data.group.monthry = sort3(data.base.monthry).asc(by_id);
    data.group.in_month = sort3(data.base.in_month).asc(by_id);
    data.group.upd_at = sort3(data.base.upd_at).asc(by_id);
    for (const upd_at of data.group.upd_at) {
      upd_at.at = Math.floor(Number(upd_at._id.slice(0, 2)) / 4);
    }
    data.group.size = sort3(data.base.size).asc(({ _id }) => Number(_id.slice(1)));
    data.group.folder_id = sort3(data.base.folder_id).desc(by_count);
    data.group.upd_range = sort3(data.base.upd_range).desc(by_count);
    data.group.sow_auth_id = sort3(data.base.sow_auth_id).desc(by_count);
    data.group.mark = sort3(data.base.mark).desc(by_count);
    data.group.say_limit = sort3(data.base.say_limit).desc(by_count);
    data.group.game = sort3(data.base.game).desc(by_count);
    data.group.option = sort3(data.base.option).desc(by_count);
    data.group.mob_role = sort3(data.base.mob_role).desc(by_count);
    data.group.trap = sort3(data.base.trap).desc(by_count);
    data.group.config = sort3(data.base.config).desc(by_count);
    data.group.discard = sort3(data.base.discard).desc(by_count);
  }
});
var story_summary = model2({
  qid: (is_old) => is_old.toString(),
  format: () => ({
    list: [],
    folder: {}
  }),
  reduce(data, doc) {
    doc.folder_id = doc.folder.toLowerCase();
    doc.folder = Folders.find(doc.folder_id);
    dic(data.folder, doc.folder_id, {}, "list", []).push(doc);
  },
  order(data, { sort: sort3 }) {
    sort3(data.list).desc((o) => o.timer.nextcommitdt);
  }
});

// src/lib/pubsub/book_event/client.ts
var events = model2({
  qid: (ids) => ids.toString(),
  format: () => ({
    list: []
  }),
  reduce(data, doc) {
    doc.write_at = new Date(doc.updated_at);
  },
  order(data, { sort: sort3 }) {
    sort3(data.list).asc([(o) => o.story_id, (o) => o.turn]);
  }
});

// src/lib/pubsub/book_message/client.ts
var messages = model2({
  qid: (ids) => ids.toString(),
  format: () => ({
    list: [],
    event: {}
  }),
  initialize(doc) {
  },
  reduce(data, doc) {
    dic(data.event, doc.event_id, []).push(doc);
  },
  order(data, { sort: sort3 }) {
    sort3(data.list).asc((o) => o.write_at);
    for (const event_id in data.event) {
      sort3(data.event[event_id]).asc((o) => o.write_at);
    }
  }
});

// src/lib/pubsub/book_potof/client.ts
var potofs = model2({
  qid: (ids) => ids.toString(),
  format: () => ({
    list: []
  }),
  reduce(data, doc) {
  },
  order(data, { sort: sort3 }, is_asc, order) {
    if (is_asc) {
      sort3(data.list).asc(order);
    } else {
      sort3(data.list).desc(order);
    }
  }
});

// src/lib/pubsub/book_card/client.ts
var cards = model2({
  qid: (ids) => ids.toString(),
  format: () => ({
    list: []
  }),
  reduce(data, doc) {
    doc.role = Roles.find(doc.role_id);
  },
  order(data, { sort: sort3 }) {
    sort3(data.list).asc((o) => o._id);
  }
});

// src/lib/pubsub/book_stat/client.ts
var stats = model2({
  qid: (ids) => ids.toString(),
  format: () => ({
    list: []
  }),
  reduce(data, doc) {
  },
  order(data, { sort: sort3 }) {
    sort3(data.list).asc((o) => o._id);
  }
});

// src/lib/pubsub/chr_face/client.ts
var potof_for_face = model2({
  qid: (o) => [o.face_id].toString(),
  format: () => ({
    list: [],
    by_face: {}
  }),
  reduce: (data, doc) => {
    dic(data.by_face, doc._id.face_id, doc);
  },
  order: (data, { sort: sort3 }) => {
  }
});
var potof_for_face_role = model2({
  qid: (o) => [o.face_id, o.role_id].toString(),
  format: () => ({
    list: []
  }),
  reduce: (data, doc) => {
  },
  order: (data, { sort: sort3 }) => {
  }
});
var potof_for_face_live = model2({
  qid: (o) => [o.face_id, o.live].toString(),
  format: () => ({
    list: []
  }),
  reduce: (data, doc) => {
  },
  order: (data, { sort: sort3 }) => {
  }
});
var potof_for_face_sow_auth_max = model2({
  qid: (o) => [o.face_id, o.sow_auth_id].toString(),
  format: () => ({
    list: [],
    by_face: {}
  }),
  reduce: (data, doc) => {
    dic(data.by_face, doc._id.face_id, doc);
  },
  order: (data, { sort: sort3 }) => {
  }
});
var message_for_face = model2({
  qid: (o) => [o.face_id].toString(),
  format: () => ({
    list: [],
    by_face: {}
  }),
  reduce(data, doc) {
    dic(data.by_face, doc._id.face_id, doc);
  },
  order(data, { sort: sort3 }) {
  }
});
var message_for_face_mestype = model2({
  qid: (o) => [o.face_id, o.mestype].toString(),
  format: () => ({
    list: []
  }),
  reduce(data, doc) {
  },
  order(data, { sort: sort3 }) {
  }
});
var message_for_face_sow_auth = model2({
  qid: (o) => [o.face_id, o.sow_auth_id].toString(),
  format: () => ({
    list: []
  }),
  reduce(data, doc) {
  },
  order(data, { sort: sort3 }) {
  }
});
var message_for_face_by_face = model2({
  qid: (o) => [o.face_id].toString(),
  format: () => ({
    list: []
  }),
  reduce(data, doc) {
  },
  order(data, { sort: sort3 }) {
  }
});

// src/lib/pubsub/plan/client.ts
var new_plans = model2({
  qid: () => "",
  format: () => ({
    list: [],
    count: 0
  }),
  reduce(data, doc) {
    data.count++;
  },
  order(data, { sort: sort3 }) {
    sort3(data.list).desc((o) => o.write_at);
  }
});

// src/lib/pubsub/set_random/client.ts
var randoms = model2({
  qid: (types) => types.toString(),
  format: () => ({
    list: [],
    sum: 0
  }),
  reduce(data, doc) {
    if (doc.number) {
      data.sum += doc.number;
    }
  },
  order(data, { sort: sort3 }) {
  }
});

// src/lib/pubsub/model-server.ts
var model_server_exports = {};
__export(model_server_exports, {
  card_oldlog: () => card_oldlog,
  cards: () => cards2,
  events: () => events2,
  message_for_face: () => message_for_face2,
  message_for_face_mestype: () => message_for_face_mestype2,
  message_for_face_sow_auth: () => message_for_face_sow_auth2,
  message_oldlog: () => message_oldlog,
  messages: () => messages2,
  new_plans: () => new_plans2,
  potof_for_face: () => potof_for_face2,
  potof_for_face_live: () => potof_for_face_live2,
  potof_for_face_role: () => potof_for_face_role2,
  potof_for_face_sow_auth_max: () => potof_for_face_sow_auth_max2,
  potof_oldlog: () => potof_oldlog,
  potofs: () => potofs2,
  randoms: () => randoms2,
  sow_village_plans: () => sow_village_plans,
  stat_oldlog: () => stat_oldlog,
  stats: () => stats2,
  stories: () => stories2,
  story_summary: () => story_summary2
});

// src/lib/pubsub/book_story/server.ts
var stories2 = modelAsMongoDB("stories", {
  comment: 0,
  password: 0,
  sow_auth_id: 0
});
var story_summary2 = model(__spreadProps(__spreadValues({}, stories2), {
  $match: (is_old) => ({
    is_epilogue: is_old,
    is_finish: is_old
  }),
  isLive: async () => true
}));

// src/lib/pubsub/book_event/server.ts
var events2 = modelAsMongoDB("events");

// src/lib/pubsub/book_message/server.ts
var messages2 = modelAsMongoDB("messages");
var message_oldlog = __spreadProps(__spreadValues({}, messages2), {
  $match: (story_id) => ({
    story_id
  })
});

// src/lib/pubsub/book_potof/server.ts
var potofs2 = modelAsMongoDB("potofs");
var potof_oldlog = __spreadProps(__spreadValues({}, potofs2), {
  $match: (story_id) => ({
    story_id
  })
});

// src/lib/pubsub/book_card/server.ts
var cards2 = modelAsMongoDB("cards");
var card_oldlog = __spreadProps(__spreadValues({}, cards2), {
  $match: (story_id) => ({
    story_id
  })
});

// src/lib/pubsub/book_stat/server.ts
var stats2 = modelAsMongoDB("stats");
var stat_oldlog = __spreadProps(__spreadValues({}, stats2), {
  $match: (story_id) => ({
    story_id
  })
});

// src/lib/pubsub/chr_face/server.ts
function modelAsAggregate(collection) {
  const { isLive, live: live2, query: query2 } = modelAsMongoDB(collection);
  return {
    isLive,
    live: live2,
    query: query2,
    $match(o) {
      const ret = {};
      for (const key in o) {
        if (o[key].length)
          ret[`_id.${key}`] = { $in: o[key] };
      }
      return ret;
    }
  };
}
var potof_for_face2 = modelAsAggregate("potof_for_face");
var potof_for_face_role2 = modelAsAggregate("potof_for_face_role");
var potof_for_face_live2 = modelAsAggregate("potof_for_face_live");
var potof_for_face_sow_auth_max2 = modelAsAggregate("potof_for_face_sow_auth_max");
var message_for_face2 = modelAsAggregate("message_for_face");
var message_for_face_mestype2 = modelAsAggregate("message_for_face");
var message_for_face_sow_auth2 = modelAsAggregate("message_for_face");

// src/lib/pubsub/plan/server.ts
var range = 1e3 * 3600 * 24 * 50;
var sow_village_plans = modelAsMongoDB("sow_village_plans");
var new_plans2 = __spreadProps(__spreadValues({}, sow_village_plans), {
  $match: () => ({
    state: { $in: [null, /議事/] },
    write_at: { $gte: new Date(Date.now() - range) }
  })
});

// src/lib/pubsub/set_random/server.ts
var randoms2 = model({
  $match: (types) => types,
  query: async ($match) => Promise.resolve($match.map(choice))
});
function choice(type) {
  const { list, all: all3 } = Randoms.data.type[type];
  let at = Math.random() * all3;
  for (const o of list) {
    at -= o.ratio;
    if (at < 0) {
      console.log("choice", full_label(o));
      return __spreadValues({ choice: full_label(o) }, o);
    }
  }
}
function random_in(head, tail) {
  return Math.floor(Math.random() * (tail - head) + head);
}
function full_label(o, side = random_in(0, 1)) {
  switch (o.types[1] || o.types[0]) {
    case "tarot":
      return `${["\u6B63", "\u9006"][side]} ${o.roman}.${o.label}`;
    case "zodiac":
      return `${o.symbol} ${o.roman}.${o.label}`;
    case "planet":
    case "weather":
    case "chess":
      return `${o.symbol} ${o.label}`;
    default:
      return `${o.label}`;
  }
}

// src/lib/pubsub/server.ts
var mode = argv.pop();
var bootstrap = { dev: dev2, prod: prod2 };
bootstrap[mode]();
function dev2() {
  const conf = live_server_default.dev;
  dbBoot(conf.mongodb);
  const io3 = new Server({
    parser: parser2,
    serveClient: false,
    cors: {
      origin: conf.io.origin,
      methods: ["GET", "POST"]
    }
  });
  listen(io3, model_server_exports, model_client_exports);
  io3.listen(conf.http.port);
}
function prod2() {
  const conf = live_server_default.prod;
  const key = readFileSync(conf.https.privkey);
  const cert = readFileSync(conf.https.cert);
  dbBoot(conf.mongodb);
  const listener = createServer({ key, cert });
  const io3 = new Server(listener, {
    parser: parser2,
    serveClient: false,
    cors: {
      origin: conf.io.origin,
      methods: ["GET", "POST"]
    }
  });
  listen(io3, model_server_exports, model_client_exports);
  listener.listen(conf.https.port);
}
