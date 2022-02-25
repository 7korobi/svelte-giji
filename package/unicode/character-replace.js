import { allKana } from './util';
const replaceChrEscape = (c) => `\\${c}`;
const replaceChrChk = new RegExp([...`\\[](){}-+.*|`].map(replaceChrEscape).join('|'));
function replaceChrFactory(table, key, postfix = '') {
  const item = key.map((c) => c.replace(replaceChrChk, (cc) => replaceChrEscape(cc)));
  const regexp = new RegExp(`(${item.join('|')})${postfix}`, 'g');
  return (str) => str.replace(regexp, (_, chr) => table[chr] ?? chr);
}
function charRange(headStr, tailStr) {
  const head = headStr.charCodeAt(0);
  const tail = tailStr.charCodeAt(0) + 1;
  const ret = [];
  for (let idx = head; idx < tail; idx++) {
    ret.push(String.fromCharCode(idx));
  }
  return ret.join('');
}
function sortAt(cb, ...lists) {
  const { length } = lists[0];
  for (const list of lists) {
    if (length !== list.length) {
      console.error(list);
      throw new Error(`invalid ${length} === ${list.length}`);
    }
  }
  let idxs = [...Array(length)].map((_, i) => i);
  const values = [...Array(length)].map((_, i) => cb(i));
  idxs.sort((a, b) => values[b] - values[a]);
  const ret = [];
  for (const list of lists) {
    const tgt = [...Array(length)].map((_, idx) => list[idxs[idx]]);
    ret.push(tgt);
  }
  return ret;
}
function table(srcStr, tgtStr) {
  const srcList = srcStr.split(/ +/);
  const tgtList = tgtStr.split(/ +/);
  const srcChrs = [...srcList.pop()];
  const tgtChrs = [...tgtList.pop()];
  const srcBy = [...srcList, ...srcChrs];
  const [src, tgt] = sortAt((idx) => srcBy[idx].length, srcBy, [...tgtList, ...tgtChrs]);
  const length = src.length;
  const ret = {};
  for (let idx = 0; idx < length; idx++) {
    ret[src[idx]] = tgt[idx];
  }
  return [ret, src, tgt];
}
export const hiraganaHead = charRange('あ', 'ん');
export const katakanaHead = charRange('ア', 'ン');
const voiceRegExp = /([\u3099\u309a])/gu;
const hira2kataRegExp = /([\u3041-\u3096\u309d\u30fe\u309f])/gu;
const kata2hiraRegExp = /([\u30a1-\u30f6\u30fd\u30fe\u30ff])/gu;
const swapKanaRegExp = /([\u3041-\u3096\u309d\u30fe\u309f])|([\u30a1-\u30f6\u30fd\u30fe\u30ff])/gu;
const [semiVoiceTable, semiVoiceSrc, semiVoiceTgt] = table('はひふへほハヒフヘホ', 'ぱぴぷぺぽパピプペポ');
const semiVoiceDic = replaceChrFactory(semiVoiceTable, semiVoiceSrc, `[\\u309a]`);
const [fullVoiceTable, fullVoiceSrc, fullVoiceTgt] = table(
  'かきくけこさしすせそたちつてとはひふへほうゝカキクケコサシスセソタチツテトハヒフヘホウワヰヱヲヽ',
  'がぎぐげござじずぜぞだぢづでどばびぶべぼゔゞガギグゲゴザジズゼゾダヂヅデドバビブベボヴヷヸヹヺヾ'
);
const fullVoiceDic = replaceChrFactory(fullVoiceTable, fullVoiceSrc, `[\\u3099]`);
const [devoiceTable, devoiceSrc, devoiceTgt] = table(
  [...fullVoiceTgt, ...semiVoiceTgt].join(''),
  [...fullVoiceSrc, ...semiVoiceSrc].join('')
);
const devoiceDic = replaceChrFactory(devoiceTable, devoiceSrc);
// 保留ひらがな https://ja.wikipedia.org/wiki/%E5%B0%8F%E6%9B%B8%E3%81%8D%E4%BB%AE%E5%90%8D%E6%8B%A1%E5%BC%B5
const [smallTable, smallSrc, smallTgt] = table(
  'あいうえおつやゆよわかけアイウエオツヤユヨワカケクシストヌハヒフヘホムラリルレロ',
  'ぁぃぅぇぉっゃゅょゎゕゖァィゥェォッャュョヮヵヶㇰㇱㇲㇳㇴㇵㇶㇷㇸㇹㇺㇻㇼㇽㇾㇿ'
);
const [subTable, subSrc, subTgt] = table('0123456789+-=()aehijklmnoprstuvx<>⊂⊃⊆⊇', '₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓ˱˲꜀꜆꜁꜇');
const [midTable, midSrc, midTgt] = table('ABCDEFGHIJKLMNOPQRSTUVWYZ', 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘꞯʀꜱᴛᴜᴠᴡʏᴢ');
const [supTable, supSrc, supTgt] = table(
  '0123456789+-=()ABDEGHIJKLMNOPRTUVWabcdefghijklmnoprstuvwxyz!<>⊂⊃⊆⊇',
  '⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ᴬᴮᴰᴱᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾᴿᵀᵁⱽᵂᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻꜝ˂˃꜂꜄꜃꜅'
);
const [runeTable, runeSrc, runeTgt] = table(
  'ac ae cp th ng kk ea eo eh is sh st oo oh oe on os oe eth ・:+ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  'ᛷᛸᛢᚦᛝᛤᛠᛇᛶᛵᛲᛥᚬᚭᚯᚰᛴᛟᚧ᛫᛬᛭ᚫᛒᚳᛞᛖᚠᚸᚻᛁᛄᛣᛚᛗᚾᚩᛈᚴᚱᛋᛏᚢᚡᚥᛪᚤᛎᚪᛉᛍᛑᛂᛓᚵᚺᚽᛃᚲᛛᛘᚿᚮᛕᛩᛅᛊᛐᛳᛦᚹᛡᚣᛜ'
);
const [bbbTable, bbbSrc, bbbTgt] = table(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'
);
const [cursiveTable, cursiveSrc, cursiveTgt] = table(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  '𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏'
);
const [cursiveBoldTable, cursiveBoldSrc, cursiveBoldTgt] = table(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃'
);
const [frakturTable, frakturSrc, frakturTgt] = table(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷'
);
const [regionTable, regionSrc, regionTgt] = table('ABCDEFGHIJKLMNOPQRSTUVWXYZ', '🇦🇧🇨🇩🇪🇫🇬🇭🇮🇯🇰🇱🇲🇳🇴🇵🇶🇷🇸🇹🇺🇻🇼🇽🇾🇿');
const [circleBlackTable, circleBlackSrc, circleBlackTgt] = table(
  '10 11 12 13 14 15 16 17 18 19 20 ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  '❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩⓿❶❷❸❹❺❻❼❽❾'
);
const [circledTable, circledSrc, circledTgt] = table(
  '10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 一二三四五六七八九十月火水木金土日株有社名特財祝労秘男女適優印注項休写正上中下左右医宗学監企資協夜得可アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲ+-*/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  '⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟㊱㊲㊳㊴㊵㊶㊷㊸㊹㊺㊻㊼㊽㊾㊿㊀㊁㊂㊃㊄㊅㊆㊇㊈㊉㊊㊋㊌㊍㊎㊏㊐㊑㊒㊓㊔㊕㊖㊗㊘㊙㊚㊛㊜㊝㊞㊟㊠㊡㊢㊣㊤㊥㊦㊧㊨㊩㊪㊫㊬㊭㊮㊯㊰🉐🉑㋐㋑㋒㋓㋔㋕㋖㋗㋘㋙㋚㋛㋜㋝㋞㋟㋠㋡㋢㋣㋤㋥㋦㋧㋨㋩㋪㋫㋬㋭㋮㋯㋰㋱㋲㋳㋴㋵㋶㋷㋸㋹㋺㋻㋼㋽㋾⊕⊖⊗⊘ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨'
);
const [squareTable, squareSrc, squareTgt] = table(
  'アパート アルファ アンペア アール イニング インチ ウォン エスクード エーカー オンス オーム カイリ カラット カロリー ガロン ガンマ ギガ ギニー キュリー ギルダー キロ キログラム キロメートル キロワット グラム グラムトン クルゼイロ クローネ ケース コルナ コーポ サイクル サンチーム シリング センチ セント ダース デシ ドル トン ナノ ノット ハイツ パーセント パーツ バーレル ピアストル ピクル ピコ ビル ファラッド フィート ブッシェル フラン ヘクタール ペソ ペニヒ ヘルツ ペンス ページ ベータ ポイント ボルト ホン ポンド ホール ホーン マイクロ マイル マッハ マルク マンション ミクロン ミリ ミリバール メガ メガトン メートル ヤード ヤール ユアン リットル リラ ルピー ルーブル レム レントゲン ワット dm2 平成 昭和 大正 明治 株式会社 pA nA uA mA kA KB MB GB cal kcal pF nF uF ug mg kg Hz kHz MHz GHz THz ul ml dl kl fm nm um mm cm km mm2 cm2 m2 km2 mm3 cm3 m3 km3 m/s m/s2 Pa kPa MPa GPa rad rad/s rad/s2 ps ns us ms pV nV uV mV kV MV pW nW uW mW kW MW kΩ MΩ am Bq cc cd C/kg Co dB Gy ha HP in KK KM kt lm ln log lx mb mil mol pH pm PPM PR sr Sv Wb ',
  '㌀ ㌁㌂㌃㌄㌅㌆㌇㌈㌉㌊㌋㌌㌍㌎㌏㌐㌑㌒㌓㌔㌕㌖㌗㌘㌙㌚㌛㌜㌝㌞㌟㌠㌡㌢㌣㌤㌥㌦㌧㌨㌩㌪㌫㌬㌭㌮㌯㌰㌱㌲㌳㌴㌵㌶㌷㌸㌹㌺㌻㌼㌽㌾㌿㍀㍁㍂㍃㍄㍅㍆㍇㍈㍉㍊㍋㍌㍍㍎㍏㍐㍑㍒㍓㍔㍕㍖㍗㍸㍻㍼㍽㍾㍿㎀㎁㎂㎃㎄㎅㎆㎇㎈㎉㎊㎋㎌㎍㎎㎏㎐㎑㎒㎓㎔㎕㎖㎗㎘㎙㎚㎛㎜㎝㎞㎟㎠㎡㎢㎣㎤㎥㎦㎧㎨㎩㎪㎫㎬㎭㎮㎯㎰㎱㎲㎳㎴㎵㎶㎷㎸㎹㎺㎻㎼㎽㎾㎿㏀㏁㏂㏃㏄㏅㏆㏇㏈㏉㏊㏋㏌㏍㏎㏏㏐㏑㏒㏓㏔㏕㏖㏗㏘㏙㏚㏛㏜㏝'
);
const [squaredTable, squaredSrc, squaredTgt] = table(
  'ココ 2ndScr 120P 60P 22.2 FREE COOL 5.1 7.1 HDR HI-RES LOSSRESS SHV UHD VOD PPV NEW SOS HC HV MV SD SS WC CL ID NG OK UP VS 3D 2K 4K 8K サデ多解天交映無料前後再新初終生販声吹演投捕一二三遊左中右指走打禁空合満有月申割営配手字双ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  '🈁🆜🆤🆣🆢🆓🆒🆠🆡🆧🆨🆩🆪🆫🆬🅎🆕🆘🆦🅊🅋🅌🅍🅏🆑🆔🆖🆗🆙🆚🆛🆝🆞🆟🈂🈓🈕🈖🈗🈘🈙🈚🈛🈜🈝🈞🈟🈠🈡🈢🈣🈤🈥🈦🈧🈨🈩🈔🈪🈫🈬🈭🈮🈯🈰🈱🈲🈳🈴🈵🈶🈷🈸🈹🈺🈻🈐🈑🈒🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉'
);
const [squareBlackTable, squareBlackSrc, squareBlackTgt] = table(
  'xP IC PA SA AB WC *ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  '🆊🆋🆌🆍🆎🆏❎🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉'
);
const [asciiTable, asciiSrc, asciiTgt] = table(
  [
    ...runeTgt,
    ...bbbTgt,
    ...cursiveTgt,
    ...cursiveBoldTgt,
    ...frakturTgt,
    ...regionTgt,
    ...squareTgt,
    ...squaredTgt,
    ...squareBlackTgt,
    ...circledTgt,
    ...circleBlackTgt,
    ...supTgt,
    ...midTgt,
    ...subTgt
  ].join(' '),
  [
    ...runeSrc,
    ...bbbSrc,
    ...cursiveSrc,
    ...cursiveBoldSrc,
    ...frakturSrc,
    ...regionSrc,
    ...squareSrc,
    ...squaredSrc,
    ...squareBlackSrc,
    ...circledSrc,
    ...circleBlackSrc,
    ...supSrc,
    ...midSrc,
    ...subSrc
  ].join(' ')
);
export const small = replaceChrFactory(smallTable, smallSrc);
export const sub = replaceChrFactory(subTable, subSrc);
export const smallcap = replaceChrFactory(midTable, midSrc);
export const sup = replaceChrFactory(supTable, supSrc);
export const rune = replaceChrFactory(runeTable, runeSrc);
export const bbb = replaceChrFactory(bbbTable, bbbSrc);
export const cursive = replaceChrFactory(cursiveTable, cursiveSrc);
export const cursiveBold = replaceChrFactory(cursiveBoldTable, cursiveBoldSrc);
export const fraktur = replaceChrFactory(frakturTable, frakturSrc);
export const region = replaceChrFactory(regionTable, regionSrc);
export const square = replaceChrFactory(squareTable, squareSrc);
export const squared = replaceChrFactory(squaredTable, squaredSrc);
export const squareBlack = replaceChrFactory(squareBlackTable, squareBlackSrc);
export const circled = replaceChrFactory(circledTable, circledSrc);
export const circleBlack = replaceChrFactory(circleBlackTable, circleBlackSrc);
export const ascii = replaceChrFactory(asciiTable, asciiSrc);
// ひらがなをカタカナにする
export function hira2kata(str) {
  return str.replace(hira2kataRegExp, (hira) => String.fromCharCode(hira.charCodeAt(0) + 0x60));
}
// カタカナをひらがなにする
export function kata2hira(str) {
  return str.replace(kata2hiraRegExp, (kata) => String.fromCharCode(kata.charCodeAt(0) - 0x60));
}
// ひらがなをカタカナに、カタカナをひらがなに
export function swapKana(str) {
  return str.replace(swapKanaRegExp, (_, hira, kata) => {
    if (hira) return String.fromCharCode(hira.charCodeAt(0) + 0x60);
    if (kata) return String.fromCharCode(kata.charCodeAt(0) - 0x60);
  });
}
// 濁点除去
export function devoice(str) {
  str = str.replace(voiceRegExp, () => '');
  str = devoiceDic(str);
  return str;
}
// 半濁点付与
export function semiVoice(str) {
  str = str.replace(allKana, (chr) => (devoice[chr] ?? chr) + '\u309a');
  str = semiVoiceDic(str);
  return str;
}
// 濁点付与
export function fullVoice(str) {
  str = str.replace(allKana, (chr) => (devoice[chr] ?? chr) + '\u3099');
  str = fullVoiceDic(str);
  return str;
}
