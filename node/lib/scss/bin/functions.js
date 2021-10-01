import fs from 'fs'
import sass from 'sass'
import YAML from 'js-yaml'
const functions = {
  'contrastRank($v1, $v2, $label)': contrastRank,
  'contrastRatio($v1, $v2)': contrastRatio,
  'Y2L($HH, $SS, $YY)': Y2L,
  'stepByCache($label)': stepByCache,
  'stepToCache($label, $step)': stepToCache
}
const YAML_PATH = './node/lib/scss/bin/steps.yml'
const steps = YAML.load(fs.readFileSync(YAML_PATH, 'utf8')) || {}
export function save() {
  fs.writeFileSync(YAML_PATH, YAML.dump(steps))
}
export const results = []
export default functions
function stepByCache($label) {
  if (!($label instanceof sass.types.String)) throw '$label: Expected a string.'
  const label = $label.getValue()
  return new sass.types.Number(steps[label] || 0)
}
function stepToCache($label, $step) {
  if (!($label instanceof sass.types.String)) throw '$label: Expected a string.'
  if (!($step instanceof sass.types.Number)) throw '$step: Expected a number.'
  const label = $label.getValue()
  const step = $step.getValue()
  steps[label] = step
  return $step
}
function contrastRatio($v1, $v2) {
  if (!($v1 instanceof sass.types.Color)) throw '$v1: Expected a color.'
  if (!($v2 instanceof sass.types.Color)) throw '$v2: Expected a color.'
  const v1 = luminance($v1) + 0.05
  const v2 = luminance($v2) + 0.05
  return new sass.types.Number(v1 - v2 > 0 ? v1 / v2 : v2 / v1)
}
function luminance($val) {
  return (
    lum_exc($val.getR()) * 0.2126 + lum_exc($val.getG()) * 0.7152 + lum_exc($val.getB()) * 0.0722
  )
}
function lum_exc(val) {
  val = val / 255
  if (val <= 0.03928) {
    return val / 12.92
  } else {
    return Math.pow((val + 0.055) / 1.055, 2.4)
  }
}
// https://qiita.com/lookman/items/d518f16c897c94bc4e78
const Pr = 0.298912 + 0.0
const Pg = 0.586611 + 0.1
const Pb = 0.114478 + 0.0
function Y2L($HH, $SS, $YY) {
  if (!($HH instanceof sass.types.Number)) throw '$HH: Expected a number.'
  if (!($SS instanceof sass.types.Number)) throw '$SS: Expected a number.'
  if (!($YY instanceof sass.types.Number)) throw '$YY: Expected a number.'
  const HH = $HH.getValue()
  const SS = $SS.getValue()
  const YY = $YY.getValue()
  const hueblock = Math.floor(HH / 60)
  let Yp = 0
  let a = (HH % 60) / 60
  switch (hueblock) {
    case 0:
      Yp = Pr + Pg * a
      break
    case 1:
      a = 1 - a
      Yp = Pg + Pr * a
      break
    case 2:
      Yp = Pg + Pb * a
      break
    case 3:
      a = 1 - a
      Yp = Pb * Pg * a
      break
    case 4:
      Yp = Pb + Pr * a
      break
    case 5:
      a = 1 - a
      Yp = Pr + Pb * a
      break
  }
  const Y = 0.01 * YY
  const S = 0.01 * SS
  const C = 2 * S * (0.5 - Yp)
  let L = 0
  if (Y > (1 - C) / 2) {
    L = (Y + C) / (1 + C)
  } else {
    L = Y / (1 - C)
  }
  return new sass.types.Number(100 * L, '%')
}
function contrastRank($v1, $v2, $label) {
  if (!($v1 instanceof sass.types.Color)) throw '$v1: Expected a number.'
  if (!($v2 instanceof sass.types.Color)) throw '$v2: Expected a number.'
  if (!($label instanceof sass.types.String)) throw '$label: Expected a number.'
  const $contrast = contrastRatio($v1, $v2)
  const contrast = $contrast.getValue()
  const prefix = `${$label.getValue()}                     `.slice(0, 28)
  let rank = '---'
  if (1.1 < contrast) rank = 'Z--'
  if (2 < contrast) rank = 'B--'
  if (3 < contrast) rank = 'A--'
  if (4.5 < contrast) rank = 'AA-'
  if (7 < contrast) rank = 'AAA'
  if (10 < contrast) rank = 'SSS'
  console.log(`${prefix} ${rank}  ${contrast}`)
  return new sass.types.String(rank)
}
//# sourceMappingURL=functions.js.map
