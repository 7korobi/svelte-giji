<script>
import { __BROWSER__, instanceId } from 'svelte-petit-utils';
import { tick } from 'svelte';
import { style, url } from './store';
import './tracker';
const instance_id = instanceId();
const marker = {
  ' ': '',
  '<': `url(#svg-marker-${instance_id}-arrow-start)`,
  '>': `url(#svg-marker-${instance_id}-arrow-end)`,
  o: `url(#svg-marker-${instance_id}-circle)`,
  x: `url(#svg-marker-${instance_id}-cross)`
};
const border = {
  ' ': 'hide',
  '.': 'dotted',
  '-': 'solid',
  '=': 'wide'
};
const resizer = resizerFactory();
export let pin = undefined;
export let clusters = [];
export let icons = [];
export let lines = [];
export let min = { x: -300, y: -300, width: 600, height: 600 };
export let edit = false;
let dicRect = {};
let dicPath = {};
let dicImage = {};
let dicLabel = {};
let dicText = {};
let rects = [];
let paths = [];
let images = [];
let labels = [];
let texts = [];
let textEls = [];
let boxs = [];
let move = {
  key: '',
  x: 0,
  y: 0,
  px: 0,
  py: 0
};
let moved = {
  key: '',
  x: 0,
  y: 0,
  rx: 0,
  ry: 0,
  width: 0,
  height: 0
};
let zoom = 1.0;
let labelHeight = 1;
let rootWidth = 2000;
let root = {
  x: 0,
  y: 0,
  width: 1,
  height: 1
};
$: icon = icons.find((o) => keyIcon(o) === pin);
$: line = lines.find((o) => keyLine(o) === pin);
$: cluster = clusters.find((o) => keyCluster(o) === pin);
$: byIcon(icons, labelHeight);
$: byCluster(clusters, labelHeight, dicRect);
$: byLine(lines, labelHeight, dicRect);
$: byOrder(dicRect, dicPath, dicImage, dicText, dicLabel);
$: labelHeight = Math.ceil(Math.max(1, ...boxs.map((o) => o.height)));
$: textEls.forEach((o) => o.__resize());
$: {
  // console.log("root cover")
  root = cover([min, ...rects, ...boxs]);
  zoom = root.width / rootWidth;
}
function byOrder(...args) {
  const a = [];
  const b = [];
  const c = [];
  const d = [];
  const e = [];
  const z = {};
  const y = {};
  const x = {};
  const w = {};
  const v = {};
  const order = [...clusters.map(keyCluster), ...icons.map(keyIcon), ...lines.map(keyLine)];
  order.forEach((key) => {
    if (dicRect[key]) {
      a.push((z[key] = dicRect[key]));
    }
    if (dicPath[key]) {
      b.push((y[key] = dicPath[key]));
    }
    if (dicImage[key]) {
      c.push((x[key] = dicImage[key]));
    }
    if (dicText[key]) {
      if (dicText[key].label) {
        d.push((w[key] = dicText[key]));
        e.push((v[key] = dicLabel[key]));
      }
    }
  });
  rects = a;
  paths = b;
  images = c;
  texts = d;
  labels = e;
  dicRect = z;
  dicPath = y;
  dicImage = x;
  dicText = w;
  dicLabel = v;
}
async function byIcon(...args) {
  icons.forEach((o) => {
    const key = keyIcon(o);
    const { rx, ry, border_width } = $style;
    let { v, label, roll, x, y } = o;
    let { width, height } = $style.icon;
    const transform = `translate(${x - 0.5 * width} ${y - 0.5 * (label ? height + labelHeight : height)}) rotate(${roll}, ${0.5 * width}, ${
      0.5 * height
    })`;
    const href = `${$url.portrate}${v || 'undef'}.jpg`;
    dicImage[v] = {
      key,
      class: 'icon',
      href,
      transform,
      width,
      height,
      rx,
      ry
    };
    width += 2 * border_width;
    height += 2 * border_width;
    const is_horizontal = [90, 270].includes(roll);
    if (is_horizontal) {
      [width, height] = [height, width];
    }
    if (label) {
      height += labelHeight;
    }
    x -= 0.5 * width;
    y -= 0.5 * height;
    dicRect[key] = { key, class: 'box', width, height, rx, ry, x, y };
    if (label) {
      // x, y は中央下
      dicLabel[key] = { key, class: 'chr', rx, ry };
      dicText[key] = {
        key,
        class: 'chr',
        'text-anchor': 'middle',
        label,
        x: Math.floor(x + 0.5 * width),
        y: Math.floor(y + 1.0 * height - 3 * border_width)
      };
    }
  });
  dicImage = dicImage;
  dicRect = dicRect;
  dicLabel = dicLabel;
  dicText = dicText;
  await tick();
  textEls = textEls;
  rects = rects;
}
function byCluster(...args) {
  clusters.forEach((o) => {
    const key = keyCluster(o);
    const { vs, label } = o;
    const { x, y, width, height } = cover(vs.map((v) => dicRect[v]));
    const { rx, ry } = $style;
    dicRect[key] = { key, class: 'cluster', width, height, rx, ry, x, y };
    if (label) {
      // x, y は右上
      dicLabel[key] = { key, class: 'pen', rx, ry };
      dicText[key] = {
        key,
        class: 'pen',
        'text-anchor': 'end',
        label,
        x: Math.floor(x + 1.0 * width),
        y: Math.floor(y + 0.3 * labelHeight)
      };
    }
  });
  dicRect = dicRect;
  dicLabel = dicLabel;
  dicText = dicText;
}
function byLine(...args) {
  lines.forEach((o) => {
    const key = keyLine(o);
    const { v, w, line, vpos, wpos, label } = o;
    const { rx, ry } = $style;
    const path_style = pathStyle(line);
    const vo = dicRect[v] || dicRect[w];
    const wo = dicRect[w] || dicRect[v];
    const vp = pos(vo, vpos);
    const wp = pos(wo, wpos);
    slide(vp, wp);
    slide(wp, vp);
    let cvp = vp.c;
    let cwp = wp.c;
    const x = Math.floor(Math.min(vp.x, cvp.x, cwp.x, wp.x));
    const y = Math.floor(Math.min(vp.y, cvp.y, cwp.y, wp.y));
    const xMax = Math.floor(Math.max(vp.x, cvp.x, cwp.x, wp.x));
    const yMax = Math.floor(Math.max(vp.y, cvp.y, cwp.y, wp.y));
    const width = xMax - x;
    const height = yMax - y;
    // if (width * width + height * height < 16 * $style.gap_size * $style.gap_size) {
    //  cvp = vp
    //  cwp = wp
    // }
    const cp = {
      x: Math.floor(0.5 * (cvp.x + cwp.x)),
      y: Math.floor(0.5 * (cvp.y + cwp.y))
    };
    if (label) {
      // x, y は中点
      dicLabel[key] = { key, class: 'path', rx, ry };
      dicText[key] = {
        key,
        class: 'path',
        'text-anchor': 'middle',
        label,
        x: cp.x,
        y: Math.floor(cp.y + 0.3 * labelHeight)
      };
    }
    const d = `M${vp.x},${vp.y}Q${cvp.x},${cvp.y},${cp.x},${cp.y}Q${cwp.x},${cwp.y},${wp.x},${wp.y}`;
    // d = "M#{ cvp.x },#{ cvp.y }L#{ cwp.x },#{ cwp.y }"
    // o[vw + 'sub'] = { class: 'dotted', key: "path=#{vw}sub", d }
    dicPath[key] = { ...path_style, key, d };
  });
  dicPath = dicPath;
  dicLabel = dicLabel;
  dicText = dicText;
}
function cover(vos) {
  const { gap_size, icon } = $style;
  if (!vos.length) {
    let x, y;
    x = y = gap_size;
    vos.push({ ...icon, x, y });
  }
  const xmin = Math.min(...vos.map((o) => o.x));
  const xmax = Math.max(...vos.map((o) => o.x + (o.width || 0)));
  const ymin = Math.min(...vos.map((o) => o.y));
  const ymax = Math.max(...vos.map((o) => o.y + (o.height || 0)));
  const width = xmax - xmin + gap_size;
  const height = ymax - ymin + gap_size;
  const x = xmin - 0.5 * gap_size;
  const y = ymin - 0.5 * gap_size;
  return { x, y, width, height };
}
function pos({ x, y, width, height }, side) {
  const curve = Math.floor(0.5 * Math.min(width, height));
  let dx, dy, vx, vy;
  switch (side) {
    case 0:
      dx = 0.5 * width;
      dy = 0;
      vx = 0;
      vy = -curve;
      break;
    case 90:
      dx = 1.0 * width;
      dy = 0.5 * height;
      vx = curve;
      vy = 0;
      break;
    case 180:
      dx = 0.5 * width;
      dy = 1.0 * height;
      vx = 0;
      vy = curve;
      break;
    case 270:
      dx = 0;
      dy = 0.5 * height;
      vx = -curve;
      vy = 0;
      break;
  }
  x = Math.floor(x + dx);
  y = Math.floor(y + dy);
  const c = {
    x: x + vx,
    y: y + vy
  };
  return { x, y, vx, vy, c };
}
function sizeByPos(diff, max) {
  const size = Math.floor(0.1 * diff);
  const curve = Math.floor(0.3 * diff);
  if (max < size) return [max, size];
  if (size < -max) return [-max, size];
  return [size, size];
}
function slide(a, b) {
  if (a.vy) {
    const [size, curve] = sizeByPos(b.x - a.x, 0.5 * $style.icon.width);
    a.x += size;
    a.c.x += curve;
    if (a.vy < 0 && !(b.vy > 0) && b.c.y < a.c.y) a.c.y = b.c.y;
    if (a.vy > 0 && !(b.vy < 0) && b.c.y > a.c.y) a.c.y = b.c.y;
  }
  if (a.vx) {
    const [size, curve] = sizeByPos(b.y - a.y, 0.5 * $style.icon.height);
    a.y += size;
    a.c.y += curve;
    if (a.vx < 0 && !(b.vx > 0) && b.c.x < a.c.x) a.c.x = b.c.x;
    if (a.vx > 0 && !(b.vx < 0) && b.c.x > a.c.x) a.c.x = b.c.x;
  }
}
function moveXY(o, dx, dy) {
  const { x, y } = move;
  o.x = Math.floor(x + dx);
  o.y = Math.floor(y + dy);
  return o;
}
function do_move(e) {
  const [key, dx, dy] = parseMove(e);
  const o = icons.find(({ v }) => v === key);
  if (o) moved = moveXY(moved, dx, dy);
}
function do_up(e) {
  if (!move.key) pin = null;
  do_finish(e);
}
function do_finish(e) {
  const [key, dx, dy] = parseMove(e);
  if (key) {
    if (0 === dx && 0 === dy) {
      pin = key;
    } else {
      const o = icons.find(({ v }) => v === key);
      if (o && edit) {
        const rect = dicRect[key];
        moveXY(o, dx + 0.5 * rect.width, dy + 0.5 * rect.height);
        icons = icons;
      }
    }
    move.key = null;
  }
}
function do_start({ pageX, pageY }, key) {
  const { x, y, rx, ry, width, height } = dicRect[key];
  moved = { key, x, y, rx, ry, width, height };
  move = { key, x, y, px: pageX, py: pageY };
}
function parseMove({ pageX, pageY }) {
  const { px, py, key } = move;
  const dx = zoom * (pageX - px);
  const dy = zoom * (pageY - py);
  return [key, dx, dy];
}
function resizerFactory() {
  if (!__BROWSER__) return () => {};
  const observer = new ResizeObserver((e) => {
    e.forEach(({ target, contentRect }) => {
      target.__resize(contentRect);
    });
  });
  return (el, idx) => {
    textEls[idx] = el;
    Object.assign(el, {
      idx,
      __resize() {
        const { border_width } = $style;
        let { width, height, x, y } = this.getBBox();
        width = Math.floor(width + 4 * border_width);
        height = Math.floor(height + 2 * border_width);
        x = Math.floor(x - 2 * border_width);
        y = Math.floor(y - 1 * border_width);
        boxs[this.idx] = { x, y, width, height };
      }
    });
    observer.observe(el);
    return { destroy };
    function destroy() {
      observer.unobserve(el);
      textEls.splice(idx, 1);
    }
  };
}
function keyCluster({ vs }) {
  return `@${vs}`;
}
function keyIcon({ v }) {
  return v;
}
function keyLine({ v, w, vpos, wpos }) {
  return `${[v, w]}=${[vpos, wpos]}`;
}
function pathStyle([st, c, ed]) {
  return {
    class: `path ${border[c]}` || 'hide',
    'marker-start': marker[st],
    'marker-end': marker[ed]
  };
}
function parseTouch(e) {
  const { target } = e;
  const { pageX, pageY } = e.changedTouches[0];
  return { pageX, pageY, target };
}
</script>

<article
  class="fine"
  bind:offsetWidth={rootWidth}
  on:mouseup={do_up}
  on:mousemove={do_move}
  on:mouseleave={do_finish}
  on:touchend={(e) => do_up(parseTouch(e))}
  on:touchmove={(e) => do_move(parseTouch(e))}
>
  <svg style="font-size: {0.75 * zoom}rem;" viewBox="{root.x} {root.y} {root.width} {root.height}">
    <marker
      class="edgePath"
      id={`svg-marker-${instance_id}-circle`}
      viewBox="0 0 10 10"
      markerUnits="userSpaceOnUse"
      markerWidth="20"
      markerHeight="20"
      refX="5"
      refY="5"
      orient="auto"
    >
      <circle cx="5" cy="5" r="4" />
    </marker>
    <marker
      class="edgePath"
      id={`svg-marker-${instance_id}-arrow-start`}
      viewBox="0 0 10 10"
      markerUnits="userSpaceOnUse"
      markerWidth="20"
      markerHeight="20"
      refX="3"
      refY="5"
      orient="auto"
    >
      <path class="fill" d="M10,0 L0,5 L10,10 z" />
    </marker>
    <marker
      class="edgePath"
      id={`svg-marker-${instance_id}-arrow-end`}
      viewBox="0 0 10 10"
      markerUnits="userSpaceOnUse"
      markerWidth="20"
      markerHeight="20"
      refX="7"
      refY="5"
      orient="auto"
    >
      <path class="fill" d="M0,0 L10,5 L0,10 z" />
    </marker>
    <marker
      class="edgePath"
      id={`svg-marker-${instance_id}-cross`}
      viewBox="0 0 10 10"
      markerUnits="userSpaceOnUse"
      markerWidth="20"
      markerHeight="20"
      refX="5"
      refY="5"
      orient="0"
    >
      <path class="path" d="M0,0 L10,10 M0,10 L10,0 z" />
    </marker>
    <g>
      <slot />
    </g>
    <g>
      {#each rects as o (o.key)}
        <rect {...o} on:touchstart={(e) => do_start(parseTouch(e), o.key)} on:mousedown={(e) => do_start(e, o.key)} />
      {/each}
      {#each images as o (o.key)}
        <image {...o} on:touchstart={(e) => do_start(parseTouch(e), o.key)} on:mousedown={(e) => do_start(e, o.key)} />
      {/each}
    </g>
    <g class="edgePath">
      {#each paths as o (o.key)}
        <path fill="none" {...o} />
      {/each}
      {#each labels as o, idx (o.key)}
        <rect {...o} {...boxs[idx]} />
      {/each}
      {#each texts as o, idx (o.key)}
        <text {...o} use:resizer={idx} on:click={() => (pin = o.key)}>
          {o.label}
        </text>
      {/each}
    </g>
    {#if move.key}
      <rect class="move" {...moved} />
    {/if}
  </svg>
</article>

{#if edit}
  <article class="form">
    {#if icon}
      <p>
        <input type="text" class="v" bind:value={icon.v} />
        <input type="text" class="label" bind:value={icon.label} />
      </p>
    {/if}
    {#if line}
      <p>
        <input type="text" class="label" bind:value={line.label} />
      </p>
    {/if}
    {#if cluster}
      <p>
        <input type="text" class="label" bind:value={cluster.label} />
      </p>
    {/if}
  </article>
{/if}

<style>
.v {
  width: 5ex;
}

.label {
  width: 10em;
}
</style>
