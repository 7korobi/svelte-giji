<script lang="ts">
const Phases = {
  mS: [true, '#', 'MAKER', '村建', '村建て発言'],
  mA: [true, null, 'MAKER', '村建', '村建てACT'],
  aS: [true, '%', 'ADMIN', '管理', '管理発言'],
  aA: [true, null, 'ADMIN', '管理', '管理ACT'],
  II: [true, null, 'public', '活動', '活動状況'],
  SS: [true, '', 'SSAY', '会話', '通常の発言'],
  SA: [true, null, 'SSAY', '会話', '通常ACT'],
  VS: [true, '@', 'VSSAY', '見物', '見物人発言'],
  VA: [true, null, 'VSSAY', '見物', '見物人のACT'],
  TS: [true, null, 'TSAY', '内緒', '独り言/内緒話'],
  TA: [true, null, 'TSAY', '内緒', '栞'],
  GS: [true, '+', 'GSAY', '墓下', '墓下の発言'],
  GA: [true, null, 'GSAY', '墓下', '墓下のACT'],
  PS: [true, '=', 'PSAY', '共鳴', '共鳴の会話'],
  PA: [true, null, 'PSAY', '共鳴', '共鳴のACT'],
  WS: [true, '*', 'WSAY', '人狼', '人狼のささやき'],
  WA: [true, null, 'WSAY', '人狼', '人狼のACT'],
  XS: [true, '!', 'XSAY', '念波', '念話（念波の民）'],
  XA: [true, null, 'XSAY', '念波', '念act（念波の民）'],
  BS: [true, '!', 'XSAY', '念波', '念話（蝙蝠人間）'],
  BA: [true, null, 'XSAY', '念波', '念act（蝙蝠人間）']
} as const

export let id
export let base_id = id

let mention: string

$: [folder_idx, story_idx, event_idx, phase_idx, message_idx] = id.split('-')
$: [is_show, mark, handle, label, text] = Phases[phase_idx] || [true, null, 'private', '-', '-']
$: is_near = `${folder_idx}-${story_idx}-${event_idx}` === base_id.split('-').slice(0, 3).join('-')

$: if (null === mark) {
  mention = `${is_near ? '' : `${event_idx}-`}${phase_idx}-${message_idx}`
} else {
  mention = `${mark}${is_near ? '' : `${event_idx}:`}${message_idx}`
}
</script>

{#if is_show}
  <q cite="">{mention}</q>
{/if}
