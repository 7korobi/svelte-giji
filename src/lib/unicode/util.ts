const hiraganaPattern = '\u3041-\u3096\u309d\u30fe\u309f'
const katakanaPattern = '\u30a1-\u30fa\u30fd\u30fe\u30ff'
const allKanaPattern = hiraganaPattern + katakanaPattern
const kanjiPattern = '\u2E80-\u2FDF々〇〻\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\u{20000}-\u{2FFFF}'
const DevanagariPattern = '\u0900～\u097F'

export const hiragana = new RegExp(`[${hiraganaPattern}]`, 'ug')
export const katakana = new RegExp(`[${katakanaPattern}]`, 'ug')
export const allKana = new RegExp(`[${allKanaPattern}]`, 'ug')
export const kanji = new RegExp(`[${kanjiPattern}]`, 'ug')
export const Devanagari = new RegExp(`[${DevanagariPattern}]`, 'ug')

export const hiraganas = new RegExp(`[${hiraganaPattern}]+`, 'ug')
export const katakanas = new RegExp(`[${katakanaPattern}]+`, 'ug')
export const allKanas = new RegExp(`[${allKanaPattern}]+`, 'ug')
export const kanjis = new RegExp(`[${kanjiPattern}]+`, 'ug')
export const Devanagaris = new RegExp(`[${DevanagariPattern}]+`, 'ug')
