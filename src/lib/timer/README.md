```html
<script lang="ts">
  import { Time, tickSecondly, tickMinutely, tickHourly, tickDaily, tickWeekly, tickMonthly, tickQuarterly, tickYearly, tickDecadely, to_msec } from 'svelte-timer'

  $: { now_idx, deg, size, since, remain, timeout, last_at, center_at, moderate_at, next_at } = $tickSecondly
  $: { now_idx, deg, size, since, remain, timeout, last_at, center_at, moderate_at, next_at } = $tickMinutely
  $: { now_idx, deg, size, since, remain, timeout, last_at, center_at, moderate_at, next_at } = $tickHourly
  $: { now_idx, deg, size, since, remain, timeout, last_at, center_at, moderate_at, next_at } = $tickDaily
  $: { now_idx, deg, size, since, remain, timeout, last_at, center_at, moderate_at, next_at } = $tickWeekly
  $: { now_idx, deg, size, since, remain, timeout, last_at, center_at, moderate_at, next_at } = $tickMonthly
  $: { now_idx, deg, size, since, remain, timeout, last_at, center_at, moderate_at, next_at } = $tickQuarterly
  $: { now_idx, deg, size, since, remain, timeout, last_at, center_at, moderate_at, next_at } = $tickYearly
  $: { now_idx, deg, size, since, remain, timeout, last_at, center_at, moderate_at, next_at } = $tickDecadely

  console.log( to_msec("1d2h3m4s") )
  console.log( to_msec("3h10m") )
  console.log( to_msec("5分間") )
  console.log( to_msec("2分半") )
</script>
<time at="{$tickMinutely.next_at}" />
<time at="{$tickHourly.next_at}" />
<time at="{$tickDaily.next_at}" />
<time at="{$tickWeekly.next_at}" />
<time at="{$tickMonthly.next_at}" />
```
