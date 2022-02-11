const BITLIMIT = 31;
export class BitsData {
  constructor(value, field) {
    this.value = value;
    this.field = field;
    this.is = new Proxy(this, {
      get({ value, field }, label) {
        return Boolean(value & field.posi[label]);
      },
      set(data, label, set) {
        const { value, field } = data;
        const bits = set ? field.posi[label] : 0;
        data.value = (value & field.nega[label]) | bits;
        return true;
      },
      has({ field }, label) {
        return !!field.idx[label];
      }
    });
    this.has = new Proxy(this, {
      get({ value, field }, label) {
        return value & field.posi[label];
      },
      set(data, label, set) {
        const { value, field } = data;
        data.value = (value & field.nega[label]) | (set & field.posi[label]);
        return true;
      },
      has({ field }, label) {
        return !!field.idx[label];
      }
    });
  }
  posi(...labels) {
    let value = this.value;
    const posi = this.field.posi;
    for (const label of labels) {
      value |= posi[label];
    }
    return new BitsData(value, this.field);
  }
  nega(...labels) {
    let value = this.value;
    const nega = this.field.nega;
    for (const label of labels) {
      value &= nega[label];
    }
    return new BitsData(value, this.field);
  }
  toggle(...labels) {
    let value = this.value;
    const posi = this.field.posi;
    for (const label of labels) {
      value ^= posi[label];
    }
    return new BitsData(value, this.field);
  }
}
export class Bits {
  constructor(labels, options) {
    if (BITLIMIT < labels.length) {
      throw new Error('too much bits.');
    }
    this.labels = labels;
    this.mask = 2 ** labels.length - 1;
    this.posi = {};
    this.nega = {};
    this.idx = {};
    labels.forEach(format.bind(this));
    labels.forEach(calc.bind(this));
    format.call(this, 'all');
    labels.forEach((key, idx) => {
      calc.call(this, 'all', idx);
    });
    for (const label in options) {
      format.call(this, label);
      options[label].forEach((key) => {
        calc.call(this, label, this.idx[key]);
      });
      this.labels.push(label);
    }
    this.labels.push('all');
    function format(label) {
      this.posi[label] = this.idx[label] = 0;
      this.nega[label] = this.mask;
    }
    function calc(label, idx) {
      const posi = 2 ** idx;
      const nega = this.mask & ~posi;
      this.posi[label] |= posi;
      this.nega[label] &= nega;
      this.idx[label] || (this.idx[label] = idx);
    }
  }
  by(src) {
    if ('number' === typeof src) {
      const labels = [];
      this.labels.forEach((label) => {
        const x = this.posi[label];
        if ((src & x) === x) {
          labels.push(label);
        }
      });
      return labels;
    }
    if (src instanceof Array) {
      let n = 0;
      src.forEach((label) => {
        n |= this.posi[label] || 0;
      });
      return n;
    }
    throw new Error('invalid request type.');
  }
  data(n) {
    return new BitsData(n, this);
  }
  to_str(n) {
    if (n instanceof BitsData) {
      n = n.value;
    }
    return n.toString(36);
  }
  by_str(str) {
    return this.data(str ? parseInt(str, 36) : 0);
  }
  to_url(n) {
    if (n instanceof BitsData) {
      n = n.value;
    }
    return JSON.stringify(this.by(n));
  }
  static toggle(x, y) {
    if ((x & y) === y) {
      return x & ~y;
    } else {
      return x | y;
    }
  }
  static isSingle(x) {
    return 0 === (x & (x - 1));
  }
  static firstOff(x) {
    return x & (x - 1);
  }
  static firstOn(x) {
    return x | (x + 1);
  }
  static firstLinksOff(x) {
    return ((x | (x - 1)) + 1) & x;
  }
  static firstLinksOn(x) {
    return ((x & (x + 1)) - 1) | x;
  }
  static findBitOn(x) {
    return x & -x;
  }
  static findBitOff(x) {
    return ~x & (x + 1);
  }
  static fillHeadsToOn(x) {
    return x | (x - 1);
  }
  static fillHeadsToOff(x) {
    return x & (x + 1);
  }
  static headsBitOff(x) {
    return ~x & (x - 1);
  }
  static headsBitOn(x) {
    return ~(~x | (x + 1));
  }
  static headsBitOffAndNextOn(x) {
    return x ^ (x - 1);
  }
  static snoob(x) {
    const minbit = x & -x;
    const ripple = x + minbit;
    const ones = ((x ^ ripple) >>> 2) / minbit;
    return ripple | ones;
  }
  static humming(x, y) {
    return this.count(x ^ y);
  }
  static count(x) {
    x = x - ((x >>> 1) & 0x55555555);
    x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
    x = (x + (x >>> 4)) & 0x0f0f0f0f;
    x = x + (x >>> 8);
    x = x + (x >>> 16);
    return x & 0x3f; // + x >> 32n
  }
}
