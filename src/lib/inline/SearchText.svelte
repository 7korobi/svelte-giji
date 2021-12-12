<script lang="ts">
import { Search } from '$lib/icon'
import { uid } from './common'

const escape_target = new RegExp(
  `(${Array.from('$?*^+.|(){}[]')
    .map((c) => `\\${c}`)
    .join('|')})`,
  'g'
)
const form_id = uid()
const log_id = uid()

export let value: string = ''
export let data: string[] = []
export let regexp: RegExp = null
export let delay = 1000
export let bind_value = value

$: calc(value)
$: bind_value = value
$: debounce(bind_value)

let timeout: NodeJS.Timeout
function debounce(newValue: string) {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(run, delay)
  function run() {
    value = bind_value
    timeout = null
  }
}

function calc(str: string) {
  const words = str
    .replace(escape_target, escape)
    .split(/ +/g)
    .filter((str) => !!str)
  if (words.length) {
    regexp = new RegExp(`(${words.join('|')})`, 'ig')
  } else {
    regexp = null
  }
}

function escape(chr: string) {
  switch (chr) {
    case '*':
      return `.+`
    case '?':
      return `.`
    default:
      return `\\${chr}`
  }
}
</script>

<label for={form_id}>
  <Search />
  <input id={form_id} bind:value={bind_value} size="30" list={log_id} />
  &nbsp;
</label>
<datalist id={log_id}>
  {#each data as word}
    <option value={word} />
  {/each}
</datalist>

<style lang="scss">
label {
  display: flex;
  align-items: center;
}
input {
  flex-grow: 1;
}
</style>
