const hexRegExp = /(0x)?([\+\-]?)([0-9a-f]+(\.[0-9a-f]+)?|\.[0-9a-f]+)(h)?/gi;
const digitRegExp = /([\+\-]?)([0-9]+(\.[0-9]+)?|\.[0-9]+)(e([\+\-]?[0-9]+))?/gi;
export function hex(str) {
  str = str.replace(hexRegExp, (hex, head, flag, float, sub, tail) => {
    let num;
    if (sub) {
      num = float.replace(new RegExp(`\\${sub}$`), '');
    } else {
      if ('.' === float[0]) {
        sub = float;
      } else {
        num = float;
      }
    }
    console.log(flag, num, sub, head || tail);
    return [flag, num, sub].join('');
  });
  return str;
}
export function digit(str) {
  str = str.replace(digitRegExp, (digit, flag, float, sub, _ext, ext) => {
    let num;
    if (sub) {
      num = float.replace(new RegExp(`\\${sub}$`), '');
    } else {
      if ('.' === float[0]) {
        sub = float;
      } else {
        num = float;
      }
    }
    num = comma3(num);
    return [flag, num, sub, ext].join('');
  });
  return str;
}
export function currency(num, precision = 0) {
  const size = 10 ** precision;
  const unit = 0.1 ** precision;
  return comma3(`${Math.ceil(num * size) * unit}`);
}
function comma3(num) {
  if (!num) return '';
  return num.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}
