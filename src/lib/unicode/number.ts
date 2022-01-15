import { Devanagari, hiragana, kanji } from './util'

const VERBOSE = false

export const 漢字 = numTable(
  {
    stringify(byScale, _byBig, str, tail) {
      str = (() => {
        switch (byScale) {
          case 20:
            return '廿'
          case 30:
            return '丗'
          case 40:
            return '卌'
          default:
            return str
        }
      })()
      return `${str}${tail}`
    },
    zero: '余',
    unit: ['打 対 番 足 双 割', [12, 2, 2, 2, 2, 0.1]]
  },
  '〇 一 二 三 四 五 六 七 八 九',
  '清浄 虚空 六徳 刹那 弾指 瞬息 須臾 逡巡 模糊 漠 渺 埃 塵 沙 繊 微 忽 糸 毛 厘 分 一 十 百 千',
  '万 億 兆 京 垓 𥝱 穣 溝 澗 正 載 極 恒河沙 阿僧祇 那由他 不可思議 無量大数'
)

export const 大字 = numTable(
  {
    unit: ['打 対 番 足 双 割', [12, 2, 2, 2, 2, 0.1]]
  },
  '零 壱 弐 参 肆 伍 陸 漆 捌 玖',
  '清浄 虚空 六徳 刹那 弾指 瞬息 須臾 逡巡 模糊 漠 渺 埃 塵 沙 繊 微 忽 糸 毛 厘 分 壱 拾 佰 阡',
  '萬 億 兆 京 垓 𥝱 穣 溝 澗 正 載 極 恒河沙 阿僧祇 那由他 不可思議 無量大数'
)

export const よみ = numTable(
  {
    stringify(byScale, _byBig, str, tail) {
      if ('こ' === tail) {
        switch (byScale) {
          case 1:
            return 'いっこ'
        }
      }
      switch (byScale) {
        case 300:
          return `さんびゃく${tail}`
        case 600:
          return `ろっぴゃく${tail}`
        case 800:
          return `はっぴゃく${tail}`
        case 3000:
          return `さんぜん${tail}`
        case 8000:
          return `はっせん${tail}`
        default:
          return `${str}${tail}`
      }
    },
    unit: ['だーす つい つがい そく そう わり', [12, 2, 2, 2, 2, 0.1]]
  },
  'れい いち に さん よん ご ろく なな はち きゅう',
  'せいじょう こくう りっとく せつな だんし しゅんそく しゅゆ しゅんじゅん もこ ばく びょう あい じん しゃ せん び こつ し もう りん ぶ いち じゅう ひゃく せん',
  'まん おく ちょう けい がい じょ じょう こう かん せい さい ごく ごうがしゃ あそうぎ なゆた ふかしぎ むりょうたいすう'
)

export const こてん = numTable(
  {
    stringify(byScale, byBig, str, tail) {
      if (!str) return ''
      if (byScale < 1) return str
      if (100 < byScale) return str

      if ('か' === tail) {
        switch (byScale) {
          case 1:
            return 'ついたち'
          case 2:
            return 'ふつか'
          case 3:
            return 'みっか'
          case 4:
            return 'よっか'
          case 6:
            return 'むいか'
          case 7:
            return 'なのか'
          case 8:
            return 'ようか'
        }
      }
      switch (byBig) {
        case 99:
          return 'つくも'
      }
      switch (byScale) {
        case 10:
          switch (tail) {
            case 'つ':
              return 'とを'
            case 'たり':
              return 'とたり'
            default:
              return `とを${tail}`
          }
        case 20:
          switch (tail) {
            case 'つ':
              return 'はたち'
            case 'か':
              return 'はつか'
            default:
              return `はた${tail}`
          }
        case 30:
        case 40:
        case 50:
        case 60:
        case 70:
        case 80:
        case 90:
          if ('つ' === tail) tail = 'ぢ'
          return `${str}${tail}`
        case 100:
          return 'もも'
      }
      return `${str}${tail}`
    },
    join: 'まり',
    unit: ['だーす つい つがい そく そう わり', [12, 2, 2, 2, 2, 0.1]]
  },
  'れい ひと ふた み よ いつ む なな や ここの',
  'せいじょう こくう りっとく せつな だんし しゅんそく しゅゆ しゅんじゅん もこ ばく びょう あい じん しゃ せん び こつ し もう りん ぶ ひと そ ほ ち',
  'よろづ おく ちょう けい がい じょ じょう こう かん せい さい ごく ごうがしゃ あそうぎ なゆた ふかしぎ むりょうたいすう'
)

export const एक = numTable(
  {
    stringify(byScale, byBig, str, tail) {
      return `${str}${tail}`
    },
    big: [1.5, 1],
    unit: ['', []]
  },
  'सिफ़र एक दो तीन चार पाँच छह सात आठ नौ दस ग्यारह बारह तेरह चौदह पंद्रह सोलह सत्रह अठारह उन्नीस बीस इक्कीस बाईस तेईस चौबीस पच्चीस छब्बीस सत्ताईस अट्ठाईस उनतीस तीस इकतीस बत्तीस तैंतीस चौंतीस पैंतीस छत्तीस सैंतीस अड़तीस उनतालीस चालीस इकतालीस बयालीस तैंतालीस चवालीस पैंतालीस छियालीस सैंतालीस अड़तालीस उनचास पचास इक्यावन बावन तिरपन चौवन पचपन छप्पन सत्तावन अट्ठावन उनसठ साठ इकसठ बासठ तिरसठ चौंसठ पैंसठ छियासठ सड़सठ अड़सठ उनहत्तर सत्तर इकहत्तर बहत्तर तिरहत्तर चौहत्तर पचहत्तर छिहत्तर सतहत्तर अठहत्तर उनासी अस्सी इक्यासी बयासी तिरासी चौरासी पचासी छियासी सतासी अठासी नवासी नब्बे इक्यानवे बानवे तिरानवे चौरानवे पचानवे छियानवे सत्तानवे अट्ठानवे निन्यानवे',
  'एक सौ',
  'सहस्त्र लाख करोड़ अरब खरब नील पद्म शंख महाशंख'
)

export const ヒンディーtest = numTable(
  {
    stringify(byScale, byBig, str, tail) {
      return `${str}${tail}`
    },
    big: [1.5, 1]
  },
  [...Array(100)].map((_, i) => i).join(' '),
  '1 (e2)',
  '(e3) (e5) (e7) (e9) (e11) (e13) (e15) (e17) (e19)'
)

const _0__59 = [...Array(60)].map((_, i) => i).join(' ')
export const angle = numTable({}, _0__59, '⁗ ‴ ″ ′ ° 1   ', '')

function numTable(
  option: {
    join?: string
    zero?: string
    big?: [number, number]
    unit?: [string, number[]]
    stringify?(byScale: number, byBig: number, str: string, appendix?: string): string
  },
  itemStr: string,
  scaleStr: string,
  bigStr: string
) {
  option.unit ??= ['', []]

  const toString = option.stringify ?? ((_byScale, _byBig, str, tail) => `${str}${tail}`)
  const [units, items, scales, bigs] = [option.unit[0], itemStr, scaleStr, bigStr].map((str) =>
    str.split(' ')
  )
  const unitSizes = option.unit[1]

  const oneIdx = scales.indexOf(items[1])
  const subBigs = scales.slice(oneIdx)

  option.big ??= [subBigs.length, subBigs.length]
  const [bigHeadLog, bigSizeLog] = option.big
  const bigBaseLog = bigHeadLog - bigSizeLog
  const scaleBaseSize = items.length
  const bigHead = scaleBaseSize ** bigHeadLog
  const bigSize = scaleBaseSize ** bigSizeLog

  scales[oneIdx] = subBigs[0] = ''

  const parseRegExp = makeParser()
  const parseSubRegExp = makeParserSub()

  return { stringify, parse }

  function toRegExp(byScale: string, byBig: string, items: string[]) {}

  function makeNumeralCapture() {
    const numerals = [...new Set([...items, ...scales, ...bigs, ''])].sort().slice(1)
    return `(?:${numerals.join('|')})`
  }

  function makeParser() {
    const scanner = [] as string[]
    scanner.push(`)?(?!${scales.slice(0, oneIdx).join('|')})`)
    build(scanner, subBigs)
    scanner.push(`(?:`)
    bigs.forEach((big) => {
      scanner.push(`${big})?`)
      build(scanner, subBigs)
      scanner.push(`(?:`)
    })

    scanner.reverse()
    return new RegExp(scanner.join(''), 'ug')
  }

  function makeParserSub() {
    const scanner = [] as string[]
    build(scanner, scales.slice(0, oneIdx), true)

    scanner.reverse()
    return new RegExp(scanner.join(''), 'ug')
  }

  function build(scanner: string[], scales: string[], isStrict = false) {
    scales.forEach((scale, idx) => {
      const mode = isStrict || !scale ? '' : '?'
      const values = items.slice(1)
      scanner.push(`(?:(${values.join('|')})${mode}(${scale}))?`)
    })
  }

  function parse(str: string) {
    const result = [] as [number, string][]

    for (const match of str.matchAll(parseSubRegExp)) {
      capture(match, -1)
    }
    for (const match of str.matchAll(parseRegExp)) {
      const size = match.length / 2
      capture(match, size - 1.5)
    }
    return result

    function capture(match: string[], zero: number) {
      const target = match.shift()
      if (!target) return

      let value = 0
      const size = match.length / 2
      for (let idx = 0; idx < size; idx++) {
        const item = match[2 * idx]
        const scale = match[2 * idx + 1]
        const base = 10 ** (zero - idx)

        let num = item ? items.indexOf(item) : scale ? 1 : 0

        if (num) {
          if (VERBOSE) console.log(item, scale, num * base)
          value += num * base
        }
      }
      result.push([value, target])
    }
  }

  function calcScaleGap(scaleAt: number) {
    let scaleGap = bigHeadLog - scaleAt
    if (scaleGap <= 0 || 1 < scaleGap) scaleGap = 1
    return scaleGap
  }

  function stringify(num: number, appendix: string) {
    let scaleAt = 0
    let scale = 1
    while (num * scale !== Math.floor(num * scale)) {
      scaleAt--
      scale *= scaleBaseSize
    }
    while ((num * scale) % scaleBaseSize === 0) {
      const scaleGap = calcScaleGap(scaleAt)
      const scaleSize = scaleBaseSize ** scaleGap
      scaleAt += scaleGap
      scale /= scaleSize
    }
    return calc(Math.floor(num * scale), scaleAt, appendix, 0 <= scaleAt)
  }

  function calc(num: number, scaleAt: number, appendix: string, isTail = 0 === scaleAt) {
    let { join = '' } = option
    let leftStr: string

    const scaleGap = calcScaleGap(scaleAt)
    const scaleSize = scaleBaseSize ** scaleGap
    const next_num = Math.floor(num / scaleSize)

    if (next_num) {
      leftStr = calc(next_num, scaleAt + scaleGap, appendix)
    } else {
      join = ''
      leftStr = ''
    }

    const mScale = num % scaleSize
    const mBig = num % bigSize
    let itemStr = items[mScale]

    const scaleIdx = -1 < scaleAt ? ((scaleAt - bigBaseLog) % bigSizeLog) + bigBaseLog : scaleAt
    const bigIdx = 1 <= scaleIdx || !mBig ? -1 : (scaleAt - bigHeadLog) / bigSizeLog
    const bigStr = bigs[bigIdx] || ''

    let scaleStr = scales[oneIdx + scaleIdx] ?? ''
    switch (mScale) {
      case 0:
        if (leftStr) itemStr = ''
        join = ''
        scaleStr = ''
        break
      case 1:
        if (0 < scaleIdx) itemStr = ''
        break
    }

    const toStringed = toString(
      scaleBaseSize ** scaleIdx * mScale,
      mBig,
      `${itemStr}${scaleStr}`,
      isTail ? `${bigStr}${appendix}` : `${bigStr}`
    )
    if (VERBOSE) console.log({ scaleAt, idx: [scaleIdx, bigIdx], str: [itemStr, scaleStr, bigStr] })
    return `${leftStr}${join}${toStringed}`
  }
}
